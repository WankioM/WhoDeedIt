// File: server.js
const express = require('express');
const cookieParser = require('cookie-parser');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173', // Your Vite dev server
  credentials: true
}));

// For production, serve the Vite build
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
}

// Simple in-memory nonce storage (for production, use a database)
const nonceStore = new Map();

// Nonce API
app.get('/api/nonce', (req, res) => {
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
});

// Complete SIWE verification
app.post('/api/complete-siwe', async (req, res) => {
  const { payload, nonce } = req.body;
  const sessionId = req.cookies.sessionId;
  
  // Verify nonce matches what we stored
  const nonceData = nonceStore.get(sessionId);
  
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
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 1 week
    });
    
    return res.json({
      status: 'success',
      isValid: true
    });
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      isValid: false,
      message: error.message || 'Verification failed'
    });
  }
});

// For SPA routing
app.get('*', (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  } else {
    res.status(404).send('Not found - development mode');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});