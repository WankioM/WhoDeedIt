import { Request, Response } from 'express';
import { verifyCloudProof, IVerifyResponse, ISuccessResult } from '@worldcoin/minikit-js';

interface IRequestPayload {
  payload: ISuccessResult;
  action: string;
  signal: string | undefined;
}

// Verify World ID proof
export default async function verifyHandler(req: Request, res: Response) {
  try {
    // Extract the payload from the request
    const { payload, action, signal } = req.body as IRequestPayload;
    
    // Log the received payload for debugging
    console.log('Received verification payload:', {
      action,
      signal,
      proof_received: !!payload.proof,
      merkle_root: payload.merkle_root,
      nullifier_hash: payload.nullifier_hash,
      verification_level: payload.verification_level
    });
    
    // Verify that we received a proper payload
    if (!payload || !action) {
      return res.status(400).json({
        success: false,
        error: 'Missing required verification parameters'
      });
    }
    
    // Get your app_id from environment variables
    const app_id = process.env.WORLD_APP_ID as `app_${string}`;
    
    if (!app_id) {
      console.error('WORLD_APP_ID environment variable is not set');
      return res.status(500).json({
        success: false,
        error: 'Server configuration error'
      });
    }
    
    // Verify the proof with World ID
    const verifyRes = await verifyCloudProof(payload, app_id, action, signal) as IVerifyResponse;
    
    console.log('Verification result:', verifyRes);
    
    if (verifyRes.success) {
      // Verification successful
      
      // Get the wallet address from the signal (if provided)
      const walletAddress = signal;
      
      // Store the verification status in your database
      // This is where you would typically:
      // 1. Set the user as verified in your database
      // 2. Record the verification details (nullifier_hash, etc.)
      // 3. Update any relevant user records
      
      // For example (pseudo-code):
      // await db.users.updateOne(
      //   { walletAddress },
      //   { 
      //     $set: { 
      //       verified: true,
      //       verification_level: payload.verification_level,
      //       verified_at: new Date()
      //     }
      //   }
      // );
      
      // For now, we'll just return success
      return res.status(200).json({
        success: true,
        status: 200,
        message: 'Verification successful',
        verifyRes
      });
    } else {
      // Verification failed
      console.error('Verification failed:', verifyRes);
      
      return res.status(400).json({
        success: false,
        status: 400,
        message: 'Verification failed',
        verifyRes
      });
    }
  } catch (error: any) {
    // Handle any unexpected errors
    console.error('Error in verify endpoint:', error);
    
    return res.status(500).json({
      success: false,
      error: error.message || 'An unexpected error occurred during verification'
    });
  }
}