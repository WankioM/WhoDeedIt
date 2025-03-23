import { useState } from 'react';
import { MiniKit, VerificationLevel, VerifyCommandInput } from '@worldcoin/minikit-js';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth-provider';
import Navbar from './navbar';

function VerifyIdentity() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const navigate = useNavigate();
  const { userAddress, isDevelopmentMode, verify, isAuthenticated } = useAuth();
  
  // Define your action ID from the Developer Portal
  const ACTION_ID = 'whodeedit-verify'; // Replace with your actual action ID
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const handleVerify = async () => {
    setIsVerifying(true);
    setError(null);
    
    try {
      // If in development mode, use the simulated verification
      if (isDevelopmentMode) {
        await verify();
        setVerificationSuccess(true);
        
        // Navigate to dashboard after a brief delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
        
        return;
      }
      
      // For production, proceed with the World ID verification flow
      
      // Check if World App is installed
      if (!(MiniKit as any).isInstalled()) {
        setError('World App is not installed. Please install it first.');
        setIsVerifying(false);
        return;
      }
      
      // Check for user address
      if (!userAddress) {
        setError('No wallet address found. Please login first.');
        setIsVerifying(false);
        return;
      }
      
      // Create the verification payload
      const verifyPayload: VerifyCommandInput = {
        action: ACTION_ID,
        signal: userAddress, // Using wallet address as the signal
        verification_level: VerificationLevel.Orb, // Or VerificationLevel.Device if you want to allow device verification
      };
      
      console.log('Initiating verification with payload:', verifyPayload);
      
      // Call the verify command
      const miniKitAny = MiniKit as any;
      const { finalPayload } = await miniKitAny.commandsAsync.verify(verifyPayload);
      
      // Check if there was an error in the verify command
      if (finalPayload.status === 'error') {
        console.error('Verification error:', finalPayload);
        throw new Error(`Verification failed: ${finalPayload.message || 'Please try again'}`);
      }
      
      console.log('Verification command succeeded:', finalPayload);
      
      // Get API base URL
      const isProduction = window.location.hostname !== 'localhost';
      const apiBaseUrl = isProduction 
        ? 'https://who-deed-it-hzfv.vercel.app' 
        : 'http://localhost:5001';
      
      // Send the proof to your backend for verification
      const verifyResponse = await fetch(`${apiBaseUrl}/api/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          payload: finalPayload,
          action: ACTION_ID,
          signal: userAddress,
        }),
        credentials: 'include', // Important for cookies
      });
      
      if (!verifyResponse.ok) {
        throw new Error(`Backend verification failed: ${verifyResponse.status} ${verifyResponse.statusText}`);
      }
      
      const verifyResult = await verifyResponse.json();
      console.log('Backend verification result:', verifyResult);
      
      // Check if backend verification was successful
      if (verifyResult.status === 200) {
        setVerificationSuccess(true);
        // Store verification status
        localStorage.setItem('verified', 'true');
        
        // Navigate to dashboard after successful verification
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        throw new Error(verifyResult.verifyRes?.error || 'Verification failed on the backend.');
      }
    } catch (err: any) {
      console.error('Verification process error:', err);
      setError(err.message || 'Failed to complete verification. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-milk">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow rounded-lg p-8">
          <h1 className="text-3xl font-bold mb-6 text-graphite font-florssolid">Verify Your Identity</h1>
          
          {isDevelopmentMode && (
            <div className="mb-6 px-4 py-2 bg-amber-100 border border-amber-300 rounded-md">
              <p className="text-amber-800">
                Development Mode Active - Using simulated verification
              </p>
            </div>
          )}
          
          {verificationSuccess ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-green-600 mb-4">Verification Successful!</h2>
              <p className="text-graphite mb-6">
                Your identity has been verified with World ID. You now have access to all features.
              </p>
              <p className="text-graphite text-sm">
                Redirecting you to the dashboard...
              </p>
            </div>
          ) : (
            <>
              <div className="mb-8 space-y-4">
                <h2 className="text-xl font-semibold text-graphite">Why verify your identity?</h2>
                <p className="text-graphite">
                  Identity verification helps maintain the integrity of our property records and ensures that only real humans
                  can participate in our ecosystem. World ID provides a private and secure way to prove you're a unique person.
                </p>
                
                <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-blue-800">What happens during verification?</h3>
                  <ul className="mt-2 pl-5 list-disc text-blue-700 space-y-1">
                    <li>You'll be prompted to connect with your World ID</li>
                    <li>Your biometric data never leaves your device</li>
                    <li>Only a zero-knowledge proof is shared with our service</li>
                    <li>The verification is private and respects your data sovereignty</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex flex-col items-center mt-8">
                <button 
                  onClick={handleVerify}
                  disabled={isVerifying}
                  className="w-full sm:w-auto px-8 py-4 bg-desertclay hover:bg-opacity-90 text-white rounded-lg font-medium disabled:bg-opacity-50 transition-all"
                >
                  {isVerifying ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Verifying...
                    </span>
                  ) : isDevelopmentMode 
                    ? 'Simulate Verification' 
                    : 'Verify with World ID'
                  }
                </button>
                
                {error && (
                  <div className="mt-4 w-full p-4 bg-red-50 text-rustyred rounded-lg">
                    <p className="text-center">{error}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default VerifyIdentity;