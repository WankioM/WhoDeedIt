import express, { Request, Response, NextFunction } from 'express';
import WorldIDAuthenticationController from '../controllers/auth/World ID Authentication Controller';
import PropertyController from '../controllers/properties/Property Controller';
import VerificationController from '../controllers/properties/VerificationController';
import { getDocumentUploadUrl, verifyDocument } from '../controllers/DocumentUploadController';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Create a variable for the controller instance
const worldIDAuthController = WorldIDAuthenticationController;

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

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================
// @ts-ignore - Disable TypeScript errors for Express route handlers
router.post('/auth/world-id', asyncHandler((req, res) => worldIDAuthController.worldIdSignIn(req, res)));

// @ts-ignore - Disable TypeScript errors for Express route handlers
router.get('/auth/me', authMiddleware, asyncHandler((req, res) => worldIDAuthController.getCurrentUser(req, res)));

// @ts-ignore - Disable TypeScript errors for Express route handlers
router.patch('/auth/profile', authMiddleware, asyncHandler((req, res) => worldIDAuthController.updateProfile(req, res)));

export default router;