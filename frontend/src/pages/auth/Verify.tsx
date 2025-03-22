import { useState } from 'react';
import { MiniKit, VerifyCommandInput, VerificationLevel } from '@worldcoin/minikit-js';
import { useNavigate } from 'react-router-dom';


function Verify() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const navigate = useNavigate();
  
  // Define your action ID from the Developer Portal
  const ACTION_ID = 'whodeedit-verify'; // Replace with your actual action ID
  
  // You might want to get this from context or localStorage
  const getUserAddress = () => localStorage.getItem('user_address') || '';
  
  const handleVerify = async () => {
    setIsVerifying(true);
    setError(null);
    
    try {
      // Check if World App is installed
      if (!(MiniKit as any).isInstalled()) {
        setError('World App is not installed. Please install it first.');
        setIsVerifying(false);
        return;
      }
      
      // Get the user's address to use as a signal
      const userAddress = getUserAddress();
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
        
        // Navigate to wallet or appropriate page after successful verification
        setTimeout(() => {
          navigate('/');
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
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-milk">
      <h1 className="text-3xl font-bold mb-6 text-graphite font-florssolid">Verify Your Identity</h1>
      
      {verificationSuccess ? (
        <div className="text-center">
          <div className="text-green-600 text-xl mb-4">✓ Verification Successful!</div>
          <p className="text-graphite">Your identity has been verified. Redirecting you to the home page...</p>
        </div>
      ) : (
        <>
          <p className="mb-6 text-graphite text-center max-w-md">
            To access the full features of WhoDeedIt, we need to verify that you're a unique human.
            This helps maintain the integrity of our property records.
          </p>
          
          <button 
            onClick={handleVerify}
            disabled={isVerifying}
            className="bg-desertclay hover:bg-opacity-90 text-white px-8 py-4 rounded-lg font-medium disabled:bg-opacity-50 transition-all"
          >
            {isVerifying ? 'Verifying...' : 'Verify with World ID'}
          </button>
          
          {error && (
            <p className="mt-4 text-rustyred">
              {error}
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default Verify;