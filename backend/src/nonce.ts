import { v4 as uuidv4 } from 'uuid';

// Simple in-memory nonce storage (for production, use a database)
const nonceStore = new Map<string, { nonce: string, expiry: number }>();

export const generateNonce = (req: any, res: any) => {
  // Create a nonce (unique random string)
  const nonce = uuidv4().replace(/-/g, '');
  
  // Store the nonce with a 15-minute expiry
  const expiry = Date.now() + (15 * 60 * 1000);
  const sessionId = req.cookies.sessionId || uuidv4();
  
  nonceStore.set(sessionId, { nonce, expiry });
  
  // Set cookie for session tracking
  res.cookie('sessionId', sessionId, { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000
  });
  
  return res.json({ nonce });
};

export const getNonce = (sessionId: string) => {
  const nonceData = nonceStore.get(sessionId);
  
  // Clear expired nonces
  if (nonceData && nonceData.expiry < Date.now()) {
    nonceStore.delete(sessionId);
    return null;
  }
  
  return nonceData?.nonce;
};

// File: src/api/complete-siwe.ts
import { verifySiweMessage } from '@worldcoin/minikit-js';
import { getNonce } from './nonce';

export const completeSiwe = async (req: any, res: any) => {
  const { payload, nonce } = req.body;
  const sessionId = req.cookies.sessionId;
  
  // Verify nonce matches what we stored
  const storedNonce = getNonce(sessionId);
  if (!storedNonce || storedNonce !== nonce) {
    return res.status(400).json({
      status: 'error',
      isValid: false,
      message: 'Invalid nonce'
    });
  }
  
  try {
    // Verify the SIWE message
    const validMessage = await verifySiweMessage(payload, nonce);
    
    if (validMessage.isValid) {
      // Store user authentication in session
      // For production, use a proper session management system
      res.cookie('userAddress', payload.address, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 1 week
      });
    }
    
    return res.json({
      status: 'success',
      isValid: validMessage.isValid
    });
  } catch (error: any) {
    return res.status(400).json({
      status: 'error',
      isValid: false,
      message: error.message
    });
  }
};