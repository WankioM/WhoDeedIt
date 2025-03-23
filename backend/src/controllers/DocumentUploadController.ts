import { Request, Response } from 'express';
import { Storage } from '@google-cloud/storage';
import path from 'path';
import fs from 'fs';

// Bucket name would come from environment variables in production
const BUCKET_NAME = process.env.BUCKET_NAME || 'whodeedit-docs';
// Maximum allowed expiration is 7 days
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
// Folder for property documents
const PROPERTY_DOCS_FOLDER = 'property-documents';

export class DocumentUploadController {
  private storage: Storage;
  private bucket: any;

  constructor() {
    try {
      // Set up the key path
      const keyFilePath = path.join(process.cwd(), 'config', 'gcs-key.json');
      
      // Check if the key file exists
      if (!fs.existsSync(keyFilePath)) {
        console.error('GCS key file not found at:', keyFilePath);
        throw new Error('Google Cloud Storage credentials not found');
      }

      // Load and validate the key file
      try {
        const keyContent = fs.readFileSync(keyFilePath, 'utf8');
        const keyData = JSON.parse(keyContent);
        
        // Check for required fields in the service account key
        const requiredFields = ['type', 'project_id', 'private_key', 'client_email'];
        const missingFields = requiredFields.filter(field => !keyData[field]);
        
        if (missingFields.length > 0) {
          console.error(`Service account key is missing required fields: ${missingFields.join(', ')}`);
        } else {
          console.log(`Service account credentials loaded successfully for: ${keyData.client_email}`);
        }
      } catch (parseError) {
        console.error('Failed to parse service account key file:', parseError);
        throw new Error('Invalid service account key format');
      }

      // Initialize Storage with explicit project ID and credentials
      // In production, this would use values from environment variables
      this.storage = new Storage({
        keyFilename: keyFilePath,
        projectId: process.env.GCP_PROJECT_ID || 'whodeedit-dev'
      });

      this.bucket = this.storage.bucket(BUCKET_NAME);
      
      // Verify bucket exists
      this.bucket.exists()
        .then(([exists]: [boolean]) => {
          if (exists) {
            console.log(`Successfully connected to bucket: ${BUCKET_NAME}`);
          } else {
            console.error(`Bucket ${BUCKET_NAME} does not exist`);
          }
        })
        .catch((err: Error) => {
          console.error('Error checking bucket existence:', err);
        });
    } catch (error) {
      console.error('Failed to initialize DocumentUploadController:', error);
      throw error;
    }
  }

  /**
   * Get a signed URL for uploading property documents
   * @param req Express request
   * @param res Express response
   */
  async getDocumentUploadUrl(req: Request, res: Response): Promise<void> {
    try {
      console.log('getDocumentUploadUrl called with body:', req.body);
      const { fileName, fileType, propertyId, documentType } = req.body;
  
      if (!fileName || !fileType || !propertyId || !documentType) {
        res.status(400).json({
          status: 'error',
          message: 'fileName, fileType, propertyId, and documentType are required'
        });
        return;
      }
  
      // Create clean filename with proper path handling
      const timestamp = Date.now();
      const cleanFileName = path.basename(fileName).replace(/[^a-zA-Z0-9.-]/g, '-');
      
      // Create folder structure: property-documents/[property-id]/[document-type]/
      const folder = `${PROPERTY_DOCS_FOLDER}/${propertyId}/${documentType}`;
      const finalFileName = `${folder}/${timestamp}-${cleanFileName}`;
      
      console.log(`Generating signed URL for file: ${finalFileName}`);
  
      // Create file reference
      let file;
      try {
        file = this.bucket.file(finalFileName);
      } catch (fileError: any) {
        console.error('Error creating file reference:', fileError);
        res.status(500).json({
          status: 'error',
          message: 'Failed to create file reference',
          details: fileError.message || 'Unknown error'
        });
        return;
      }
  
      // Generate upload URL
      let uploadUrl;
      try {
        [uploadUrl] = await file.getSignedUrl({
          version: 'v4',
          action: 'write',
          expires: Date.now() + (15 * 60 * 1000), // 15 minutes
          contentType: fileType,
        });
      } catch (uploadUrlError: any) {
        console.error('Error generating upload URL:', uploadUrlError);
        res.status(500).json({
          status: 'error',
          message: 'Failed to generate upload URL',
          details: uploadUrlError.message || 'Unknown error'
        });
        return;
      }
      
      // Generate read URL
      let readUrl;
      try {
        [readUrl] = await file.getSignedUrl({
          version: 'v4',
          action: 'read',
          expires: Date.now() + SEVEN_DAYS_MS, // 7 days (maximum allowed)
        });
      } catch (readUrlError: any) {
        console.error('Error generating read URL:', readUrlError);
        // Fallback to constructed public URL
        readUrl = `https://storage.googleapis.com/${BUCKET_NAME}/${finalFileName}?t=${timestamp}`;
      }

      // Send response
      res.json({
        status: 'success',
        data: {
          signedUrl: uploadUrl,
          fileUrl: readUrl,
          fileName: finalFileName,
          documentType,
          propertyId
        }
      });
    } catch (error) {
      console.error('Unhandled error in getDocumentUploadUrl:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to generate upload URL',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Mark an uploaded document as verified (admin only)
   * @param req Express request
   * @param res Express response
   */
  async verifyDocument(req: Request, res: Response): Promise<void> {
    try {
      const { documentId, propertyId } = req.params;
      
      if (!documentId || !propertyId) {
        res.status(400).json({
          status: 'error',
          message: 'documentId and propertyId are required'
        });
        return;
      }
      
      // This is where you would update the document status in your database
      // For now, we'll just return a success response
      
      res.status(200).json({
        status: 'success',
        message: 'Document verified successfully',
        data: {
          documentId,
          propertyId,
          verifiedAt: new Date()
        }
      });
    } catch (error) {
      console.error('Error verifying document:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to verify document',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

// Create a singleton instance
const documentUploadController = new DocumentUploadController();

// Export bound methods for use in routes
export const getDocumentUploadUrl = documentUploadController.getDocumentUploadUrl.bind(documentUploadController);
export const verifyDocument = documentUploadController.verifyDocument.bind(documentUploadController);