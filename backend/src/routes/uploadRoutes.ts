import express, { Request, Response, NextFunction } from 'express';
import WorldIDAuthenticationController from '../controllers/auth/World ID Authentication Controller';
import propertyController from '../controllers/properties/Property Controller';
import VerificationController from '../controllers/properties/VerificationController';
import { getDocumentUploadUrl, verifyDocument } from '../controllers/DocumentUploadController';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

/**
 * This wrapper ensures Express route handlers conform to the expected void return type
 */
function asyncHandler(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err: any) => {
      console.error('Route error:', err);
      if (!res.headersSent) {
        res.status(500).json({
          status: 'error',
          message: err instanceof Error ? err.message : 'An unexpected error occurred'
        });
      }
      next(err);
    });
    // Return void explicitly
    return;
  };
}

// Document upload and verification
// @ts-ignore - Disable TypeScript errors for Express route handlers
router.post('/uploads/document', authMiddleware, asyncHandler((req, res) => getDocumentUploadUrl(req, res)));

// @ts-ignore - Disable TypeScript errors for Express route handlers
router.post('/properties/:id/documents', authMiddleware, asyncHandler((req, res) => propertyController.addPropertyDocument(req, res)));

// @ts-ignore - Disable TypeScript errors for Express route handlers
router.get('/properties/:id/verification', authMiddleware, asyncHandler((req, res) => propertyController.getVerificationStatus(req, res)));

// @ts-ignore - Disable TypeScript errors for Express route handlers
router.post('/properties/:id/submit-to-daobitat', authMiddleware, asyncHandler((req, res) => propertyController.submitToDaobitat(req, res)));

export default router;