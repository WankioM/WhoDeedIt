import { Request, Response } from 'express';
import { Property } from '../../models/property';
import { User } from '../../models/user';
import mongoose from 'mongoose';

export class VerificationController {
  /**
   * Get all properties pending verification
   * @param req Express request
   * @param res Express response
   */
  async getPendingVerifications(req: Request, res: Response) {
    try {
      // Ensure the user is an admin
      if (!req.user?.role || !['admin', 'superadmin'].includes(req.user.role)) {
        return res.status(403).json({
          status: 'error',
          message: 'Admin access required'
        });
      }
      
      // Get properties awaiting verification
      const pendingProperties = await Property.find({ verificationStatus: 'pending' })
        .populate('owner', 'name walletAddress worldIdVerified')
        .sort({ createdAt: 1 }); // Oldest first
      
      res.status(200).json({
        status: 'success',
        data: pendingProperties
      });
    } catch (error) {
      console.error('Error in getPendingVerifications:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      res.status(500).json({
        status: 'error',
        message: errorMessage
      });
    }
  }
  
  /**
   * Verify or reject a property
   * @param req Express request
   * @param res Express response
   */
  async verifyProperty(req: Request, res: Response) {
    try {
      // Ensure the user is an admin
      if (!req.user?.role || !['admin', 'superadmin'].includes(req.user.role)) {
        return res.status(403).json({
          status: 'error',
          message: 'Admin access required'
        });
      }
      
      const { id } = req.params;
      const { action, notes, documentIds } = req.body;
      
      if (!action || !['verify', 'reject'].includes(action)) {
        return res.status(400).json({
          status: 'error',
          message: 'Action must be either "verify" or "reject"'
        });
      }
      
      // Find the property
      const property = await Property.findById(id);
      
      if (!property) {
        return res.status(404).json({
          status: 'error',
          message: 'Property not found'
        });
      }
      
      // Update verification status
      property.verificationStatus = action === 'verify' ? 'verified' : 'rejected';
      
      // Add notes if provided
      if (notes) {
        property.verificationNotes = notes;
      }
      
      // Update document verification status
      if (documentIds && documentIds.length > 0) {
        // Verify only specific documents
        // Verify only specific documents
            documentIds.forEach((docId: string) => {
                const document = property.documents.find(doc => 
                (doc as any)._id.toString() === docId  // Add (doc as any) type assertion
                );
                
                if (document) {
                document.verified = action === 'verify';
                if (action === 'verify') {
                    document.verifiedAt = new Date();
                }
                }
            });
        
        // If not all documents are verified, set property status to pending
        if (action === 'verify') {
          const allVerified = property.documents.every(doc => doc.verified);
          if (!allVerified) {
            property.verificationStatus = 'pending';
          }
        }
      } else {
        // Verify or reject all documents
        property.documents.forEach(doc => {
          doc.verified = action === 'verify';
          if (action === 'verify') {
            doc.verifiedAt = new Date();
          }
        });
      }
      
      // Save the property
      await property.save();
      
      // Add activity to property owner's log
      await User.findByIdAndUpdate(property.owner, {
        $push: {
          activityLog: {
            action: `property_${action === 'verify' ? 'verified' : 'rejected'}`,
            timestamp: new Date(),
            details: {
              propertyId: property._id,
              propertyName: property.propertyName,
              notes: notes || ''
            }
          }
        }
      });
      
      res.status(200).json({
        status: 'success',
        message: `Property ${action === 'verify' ? 'verified' : 'rejected'} successfully`,
        data: property
      });
    } catch (error) {
      console.error('Error in verifyProperty:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      res.status(500).json({
        status: 'error',
        message: errorMessage
      });
    }
  }
  
  /**
   * Get properties by verification status
   * @param req Express request
   * @param res Express response
   */
  async getPropertiesByStatus(req: Request, res: Response) {
    try {
      // Ensure the user is an admin
      if (!req.user?.role || !['admin', 'superadmin'].includes(req.user.role)) {
        return res.status(403).json({
          status: 'error',
          message: 'Admin access required'
        });
      }
      
      const { status } = req.params;
      
      if (!status || !['pending', 'verified', 'rejected'].includes(status)) {
        return res.status(400).json({
          status: 'error',
          message: 'Status must be one of: pending, verified, rejected'
        });
      }
      
      // Get properties with the requested status
      const properties = await Property.find({ verificationStatus: status })
        .populate('owner', 'name walletAddress worldIdVerified')
        .sort({ updatedAt: -1 }); // Most recently updated first
      
      res.status(200).json({
        status: 'success',
        data: properties
      });
    } catch (error) {
      console.error('Error in getPropertiesByStatus:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      res.status(500).json({
        status: 'error',
        message: errorMessage
      });
    }
  }
  
  /**
   * Get verification statistics
   * @param req Express request
   * @param res Express response
   */
  async getVerificationStats(req: Request, res: Response) {
    try {
      // Ensure the user is an admin
      if (!req.user?.role || !['admin', 'superadmin'].includes(req.user.role)) {
        return res.status(403).json({
          status: 'error',
          message: 'Admin access required'
        });
      }
      
      // Get counts for each verification status
      const [pending, verified, rejected, listedOnDaobitat] = await Promise.all([
        Property.countDocuments({ verificationStatus: 'pending' }),
        Property.countDocuments({ verificationStatus: 'verified' }),
        Property.countDocuments({ verificationStatus: 'rejected' }),
        Property.countDocuments({ listedOnDaobitat: true })
      ]);
      
      // Get total document counts
      const totalDocs = await Property.aggregate([
        { $unwind: '$documents' },
        { $count: 'total' }
      ]);
      
      // Get verified document counts
      const verifiedDocs = await Property.aggregate([
        { $unwind: '$documents' },
        { $match: { 'documents.verified': true } },
        { $count: 'total' }
      ]);
      
      // Get recent verifications (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const recentVerifications = await Property.countDocuments({
        verificationStatus: 'verified',
        updatedAt: { $gte: sevenDaysAgo }
      });
      
      res.status(200).json({
        status: 'success',
        data: {
          properties: {
            pending,
            verified, 
            rejected,
            listedOnDaobitat,
            total: pending + verified + rejected
          },
          documents: {
            total: totalDocs.length > 0 ? totalDocs[0].total : 0,
            verified: verifiedDocs.length > 0 ? verifiedDocs[0].total : 0
          },
          recentVerifications
        }
      });
    } catch (error) {
      console.error('Error in getVerificationStats:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      res.status(500).json({
        status: 'error',
        message: errorMessage
      });
    }
  }
}

// Export a singleton instance
export default new VerificationController();