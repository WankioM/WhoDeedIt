import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';

// JWT secret should be in env variables in production
const JWT_SECRET = process.env.JWT_SECRET || 'whodeedit-dev-secret';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

/**
 * Middleware to authenticate JWT token
 */
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication token required'
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    
    // Find user by ID
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'User not found'
      });
    }
    
    // Check if user is banned
    if (user.isBanned) {
      return res.status(403).json({
        status: 'error',
        message: 'Your account has been suspended',
        reason: user.bannedReason || 'Violation of terms'
      });
    }
    
    // Add user to request object
    req.user = user;
    
    // Update user's last login time
    user.lastLogin = new Date();
    await user.save();
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid token'
      });
    }
    
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        status: 'error',
        message: 'Token expired'
      });
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Authentication failed'
    });
  }
};

/**
 * Middleware to check if user is an admin
 */
export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // User must already be authenticated via authMiddleware
  if (!req.user) {
    return res.status(401).json({
      status: 'error',
      message: 'Authentication required'
    });
  }
  
  // Check if user has admin role
  if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
    return res.status(403).json({
      status: 'error',
      message: 'Admin access required'
    });
  }
  
  next();
};

/**
 * Middleware to check if user is World ID verified
 */
export const worldIdVerifiedMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // User must already be authenticated via authMiddleware
  if (!req.user) {
    return res.status(401).json({
      status: 'error',
      message: 'Authentication required'
    });
  }
  
  // Check if user is World ID verified
  if (!req.user.worldIdVerified) {
    return res.status(403).json({
      status: 'error',
      message: 'World ID verification required'
    });
  }
  
  next();
};