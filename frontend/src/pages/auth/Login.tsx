import { MiniKit } from '@worldcoin/minikit-js';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiBaseUrl, setApiBaseUrl] = useState<string>('');
  const navigate = useNavigate();

  // Set up the correct API URL based on environment
  useEffect(() => {
    // Check if we're in production (Vercel) or development
    const isProduction = window.location.hostname !== 'localhost';
    const baseUrl = isProduction 
      ? 'https://who-deed-it-hzfv.vercel.app' 
      : 'http://localhost:5001';
      
    setApiBaseUrl(baseUrl);
    console.log('API Base URL:', baseUrl);
  }, []);

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // First check if the World App is installed
      if (!(MiniKit as any).isInstalled()) {
        setError('World App is not installed. Please install it first.');
        setIsLoading(false);
        return;
      }
      
      // Fetch nonce from our backend
      const res = await fetch(`${apiBaseUrl}/api/nonce`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!res.ok) {
        throw new Error(`Failed to fetch nonce: ${res.status} ${res.statusText}`);
      }
      
      const { nonce } = await res.json();
      console.log('Received nonce:', nonce);
      
      // Use the walletAuth command with proper parameters
      const miniKitAny = MiniKit as any;
      
      console.log('Calling walletAuth with params:', {
        nonce,
        expirationTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        notBefore: new Date(Date.now() - 60 * 1000),
        statement: 'Sign in to WhoDeedIt to verify your identity and property ownership.'
      });
      
      const result = await miniKitAny.commandsAsync.walletAuth({
        nonce,
        expirationTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week
        notBefore: new Date(Date.now() - 60 * 1000), // 1 minute ago
        statement: 'Sign in to WhoDeedIt to verify your identity and property ownership.',
      });
      
      const { finalPayload } = result;
      console.log('Authentication result:', result);
      
      // Handle authentication error
      if (finalPayload.status === 'error') {
        console.error('Authentication failed:', finalPayload);
        setError(`Authentication failed: ${finalPayload.message || 'Please try again'}`);
        return;
      }
      
      // Complete the authentication process by verifying on backend
      console.log('Sending verification to backend:', {
        payload: finalPayload,
        nonce
      });
      
      const verifyResponse = await fetch(`${apiBaseUrl}/api/complete-siwe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          payload: finalPayload,
          nonce,
        }),
        credentials: 'include', // Important for cookies to be sent with the request
      });
      
      if (!verifyResponse.ok) {
        throw new Error(`Verification failed: ${verifyResponse.status} ${verifyResponse.statusText}`);
      }
      
      const verifyResult = await verifyResponse.json();
      console.log('Verification result:', verifyResult);
      
      if (verifyResult.isValid) {
        // Store user info in localStorage for client-side access
        localStorage.setItem('user_address', finalPayload.address);
        
        // Redirect to the wallet page
        navigate('/wallet');
      } else {
        setError(`Signature verification failed: ${verifyResult.message || 'Please try again'}`);
      }
    } catch (err: any) {
      console.error('Authentication error:', err);
      setError(err.message || 'Failed to authenticate. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-milk">
      <h1 className="text-3xl font-bold mb-6 text-graphite font-florssolid">Login to WhoDeedIt</h1>
      
      <button 
        onClick={handleLogin}
        disabled={isLoading}
        className="bg-desertclay hover:bg-opacity-90 text-white px-8 py-4 rounded-lg font-medium disabled:bg-opacity-50 transition-all"
      >
        {isLoading ? 'Connecting...' : 'Sign in with World ID'}
      </button>
      
      {error && (
        <p className="mt-4 text-rustyred">{error}</p>
      )}
      
      <p className="mt-6 text-sm text-graphite font-helvetica-light">
        Authenticate securely using your World ID wallet to verify your identity
      </p>
      
      <div className="mt-4 text-xs text-gray-500">
        API URL: {apiBaseUrl}
      </div>
    </div>
  );
}

export default Login;