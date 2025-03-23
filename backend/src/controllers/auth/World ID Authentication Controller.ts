import { Request, Response } from 'express';
import { User, IUser } from '../../models/user';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

// Environment variables would be loaded from .env in production
const JWT_SECRET = process.env.JWT_SECRET || 'whodeedit-dev-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export class WorldIDAuthController {
  /**
   * Handle World ID authentication
   * @param req Express request
   * @param res Express response
   */
  async worldIdSignIn(req: Request, res: Response) {
    try {
      const { walletAddress, worldIdProof } = req.body;
      
      if (!walletAddress) {
        return res.status(400).json({
          status: 'error',
          message: 'Wallet address is required'
        });
      }
      
      // In a production app, you would verify the proof with World ID's SDK here
      // For now, we'll assume the proof is valid if it's provided
      
      // Find or create user by wallet address
      let user = await User.findOne({ walletAddress });
      
      if (!user) {
        // Create new user if not found
        user = new User({
          walletAddress,
          worldIdVerified: true,
          worldIdVerifiedAt: new Date(),
          role: 'lister', // All users are listers as requested
          verified: {
            email: false,
            phone: false,
            wallet: true
          },
          isVerified: true,
          verifiedAt: new Date()
        });
        
        await user.save();
      } else {
        // Update existing user's verification status
        user.worldIdVerified = true;
        user.worldIdVerifiedAt = new Date();
        
        // Also update the verified.wallet field for backward compatibility
        if (!user.verified) {
          user.verified = {
            email: false,
            phone: false,
            wallet: true
          };
        } else {
          user.verified.wallet = true;
        }
        
        // Log activity
        if (!user.activityLog) {
          user.activityLog = [];
        }
        
        user.activityLog.push({
          action: 'world_id_verification',
          timestamp: new Date(),
          details: { method: 'World ID' }
        });
        
        // Update last login
        user.lastLogin = new Date();
        
        await user.save();
      }
      
      // Generate JWT token
      const token = this.generateToken(user._id as Types.ObjectId);
      
      res.status(200).json({
        status: 'success',
        data: {
          user: {
            id: user._id,
            name: user.name,
            walletAddress: user.walletAddress,
            profileImage: user.profileImage,
            worldIdVerified: user.worldIdVerified,
            role: user.role
          },
          token
        }
      });
    } catch (error) {
      console.error('Error in worldIdSignIn:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      res.status(500).json({
        status: 'error',
        message: errorMessage
      });
    }
  }
  
  /**
   * Update user profile after World ID authentication
   * @param req Express request
   * @param res Express response
   */
  async updateProfile(req: Request, res: Response) {
    try {
      const userId = req.user?._id;
      
      if (!userId) {
        return res.status(401).json({
          status: 'error',
          message: 'Unauthorized'
        });
      }
      
      const { name, profileImage } = req.body;
      
      // Only allow specific fields to be updated
      const updateData: any = {};
      if (name) updateData.name = name;
      if (profileImage) updateData.profileImage = profileImage;
      
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        updateData,
        { new: true }
      );
      
      if (!updatedUser) {
        return res.status(404).json({
          status: 'error',
          message: 'User not found'
        });
      }
      
      res.status(200).json({
        status: 'success',
        data: {
          user: {
            id: updatedUser._id,
            name: updatedUser.name,
            walletAddress: updatedUser.walletAddress,
            profileImage: updatedUser.profileImage,
            worldIdVerified: updatedUser.worldIdVerified,
            role: updatedUser.role
          }
        }
      });
    } catch (error) {
      console.error('Error in updateProfile:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      res.status(500).json({
        status: 'error',
        message: errorMessage
      });
    }
  }
  
  /**
   * Get current user profile
   * @param req Express request
   * @param res Express response
   */
  async getCurrentUser(req: Request, res: Response) {
    try {
      const userId = req.user?._id;
      
      if (!userId) {
        return res.status(401).json({
          status: 'error',
          message: 'Unauthorized'
        });
      }
      
      const user = await User.findById(userId);
      
      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'User not found'
        });
      }
      
      res.status(200).json({
        status: 'success',
        data: {
          user: {
            id: user._id,
            name: user.name,
            walletAddress: user.walletAddress,
            profileImage: user.profileImage,
            worldIdVerified: user.worldIdVerified,
            role: user.role,
            propertiesCount: user.properties.length
          }
        }
      });
    } catch (error) {
      console.error('Error in getCurrentUser:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      res.status(500).json({
        status: 'error',
        message: errorMessage
      });
    }
  }
  
  /**
   * Generate JWT token
   * @param userId User ID
   * @returns JWT token
   */
  private generateToken(userId: Types.ObjectId | string): string {
    const payload = {
      userId
    };
    
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN
    });
  }
}

export default new WorldIDAuthController();