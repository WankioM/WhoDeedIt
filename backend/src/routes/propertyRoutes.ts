import express, { Request, Response, NextFunction } from 'express';
import WorldIDAuthenticationController from '../controllers/auth/World ID Authentication Controller';
import propertyController from '../controllers/properties/Property Controller';
import VerificationController from '../controllers/properties/VerificationController';
import { getDocumentUploadUrl, verifyDocument } from '../controllers/DocumentUploadController';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

/**
 * Express-compatible async handler wrapper
 * This is a simple implementation that will work with TypeScript
 * by using @ts-ignore to bypass the return type checking
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
  };
}

// ==========================================
// PROPERTY ROUTES - PUBLIC
// ==========================================
// @ts-ignore - Suppress TypeScript return type error
router.get('/properties/:id', asyncHandler((req, res) => propertyController.getProperty(req, res)));

// ==========================================
// PROPERTY ROUTES - AUTHENTICATED
// ==========================================
// @ts-ignore - Suppress TypeScript return type error
router.post('/properties', authMiddleware, asyncHandler((req, res) => propertyController.createProperty(req, res)));
// @ts-ignore - Suppress TypeScript return type error
router.patch('/properties/:id', authMiddleware, asyncHandler((req, res) => propertyController.updateProperty(req, res)));
// @ts-ignore - Suppress TypeScript return type error
router.get('/properties/user/all', authMiddleware, asyncHandler((req, res) => propertyController.getUserProperties(req, res)));

// Document upload and verification
// @ts-ignore - Suppress TypeScript return type error
router.post('/uploads/document', authMiddleware, asyncHandler((req, res) => getDocumentUploadUrl(req, res)));
// @ts-ignore - Suppress TypeScript return type error
router.post('/properties/:id/documents', authMiddleware, asyncHandler((req, res) => propertyController.addPropertyDocument(req, res)));
// @ts-ignore - Suppress TypeScript return type error
router.get('/properties/:id/verification', authMiddleware, asyncHandler((req, res) => propertyController.getVerificationStatus(req, res)));
// @ts-ignore - Suppress TypeScript return type error
router.post('/properties/:id/submit-to-daobitat', authMiddleware, asyncHandler((req, res) => propertyController.submitToDaobitat(req, res)));

export default router;