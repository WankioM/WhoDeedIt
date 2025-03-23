// src/hooks/useDocuments.ts

import { useState, useCallback } from 'react';
import userService, { 
  UploadUrlRequest, 
  PropertyDocument,
  VerificationStatus 
} from '../services/UserService';

interface UseDocumentsReturn {
  loading: boolean;
  error: string | null;
  verificationStatus: VerificationStatus | null;
  uploadDocument: (file: File, propertyId: string, documentName: string) => Promise<string | null>;
  getVerificationStatus: (propertyId: string) => Promise<VerificationStatus | null>;
  submitToDaobitat: (propertyId: string) => Promise<boolean>;
}

/**
 * Hook for managing property documents
 */
const useDocuments = (): UseDocumentsReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus | null>(null);

  /**
   * Upload a document for a property
   * @param file The file to upload
   * @param propertyId The ID of the property
   * @param documentName The name of the document
   * @returns The URL of the uploaded document, or null on failure
   */
  const uploadDocument = useCallback(async (
    file: File, 
    propertyId: string, 
    documentName: string
  ): Promise<string | null> => {
    setLoading(true);
    setError(null);
    
    try {
      // 1. Get a secure upload URL
      const uploadUrlRequest: UploadUrlRequest = {
        fileName: file.name,
        contentType: file.type,
        propertyId
      };
      
      const uploadUrlResponse = await userService.getDocumentUploadUrl(uploadUrlRequest);
      
      // 2. Upload the file to the provided URL
      await userService.uploadFile(
        uploadUrlResponse.data.uploadUrl,
        file,
        file.type
      );
      
      // 3. Add the document to the property
      const document: PropertyDocument = {
        name: documentName,
        url: uploadUrlResponse.data.fileUrl
      };
      
      await userService.addDocumentToProperty(propertyId, document);
      
      // 4. Return the file URL
      return uploadUrlResponse.data.fileUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload document');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get the verification status of a property
   * @param propertyId The ID of the property
   */
  const getVerificationStatus = useCallback(async (
    propertyId: string
  ): Promise<VerificationStatus | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const status = await userService.getPropertyVerificationStatus(propertyId);
      setVerificationStatus(status);
      return status;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get verification status');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Submit a property to Daobitat
   * @param propertyId The ID of the property
   * @returns True if submission was successful, false otherwise
   */
  const submitToDaobitat = useCallback(async (propertyId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      await userService.submitPropertyToDaobitat(propertyId);
      // Refresh verification status after submission
      await getVerificationStatus(propertyId);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit to Daobitat');
      return false;
    } finally {
      setLoading(false);
    }
  }, [getVerificationStatus]);

  return {
    loading,
    error,
    verificationStatus,
    uploadDocument,
    getVerificationStatus,
    submitToDaobitat
  };
};

export default useDocuments;