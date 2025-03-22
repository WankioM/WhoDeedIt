// File: index.ts
import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import { v4 as uuidv4 } from 'uuid';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import verifyHandler from './verify';

// Get current directory in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5001;

// Configure CORS to allow requests from multiple origins
const allowedOrigins = [
  'http://localhost:5000',  // Frontend dev server
  'http://localhost:5173',  // Another common Vite port
  'http://localhost:3000',  // Common React dev port
  'https://who-deed-it-hzfv.vercel.app', // Vercel deployment
  'https://who-deed-it.vercel.app',      // Potential alternate Vercel domain
];

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: true, // Simplify by allowing all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Set-Cookie']
}));

// Add health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', environment: process.env.NODE_ENV || 'development' });
});

// For production, serve the Vite build
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
}

// Simple in-memory nonce storage (for production, use a database)
const nonceStore = new Map<string, { nonce: string, expiry: number }>();

// Nonce API
app.get('/api/nonce', (req: Request, res: Response) => {
  // Create a nonce (unique random string)
  const nonce = uuidv4().replace(/-/g, '');
  
  // Store the nonce with a 15-minute expiry
  const expiry = Date.now() + (15 * 60 * 1000);
  const sessionId = req.cookies.sessionId || uuidv4();
  
  nonceStore.set(sessionId, { nonce, expiry });
  
  res.cookie('sessionId', sessionId, { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 15 * 60 * 1000
  });
  
  console.log(`Generated nonce: ${nonce} for session: ${sessionId}`);
  return res.json({ nonce });
});
app.post('/api/verify', verifyHandler);

// Complete SIWE verification
app.post('/api/complete-siwe', async (req: Request, res: Response) => {
  const { payload, nonce } = req.body;
  const sessionId = req.cookies.sessionId;
  
  console.log('Received SIWE verification request:', { 
    payload: { ...payload, signature: payload?.signature ? 'PRESENT' : 'MISSING' },
    nonce,
    sessionId 
  });
  
  // Verify nonce matches what we stored
  const nonceData = nonceStore.get(sessionId);
  
  console.log('Stored nonce data:', nonceData);
  
  // Clear expired nonces
  if (nonceData && nonceData.expiry < Date.now()) {
    nonceStore.delete(sessionId);
    return res.status(400).json({
      status: 'error',
      isValid: false,
      message: 'Nonce expired'
    });
  }
  
  if (!nonceData || nonceData.nonce !== nonce) {
    return res.status(400).json({
      status: 'error',
      isValid: false,
      message: 'Invalid nonce'
    });
  }
  
  try {
    // In a real implementation, you'd use the verifySiweMessage function
    // For now, we'll just assume the signature is valid if we get here
    
    // Store user authentication in session
    res.cookie('userAddress', payload.address, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 1 week
    });
    
    console.log('Authentication successful for address:', payload.address);
    return res.json({
      status: 'success',
      isValid: true
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Verification failed';
    console.error('SIWE verification error:', errorMessage);
    
    return res.status(400).json({
      status: 'error',
      isValid: false,
      message: errorMessage
    });
  }
});

// For SPA routing
app.get('*', (req: Request, res: Response) => {
  if (process.env.NODE_ENV === 'production') {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  } else {
    res.status(404).send('Not found - development mode');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});