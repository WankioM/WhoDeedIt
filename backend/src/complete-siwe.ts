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