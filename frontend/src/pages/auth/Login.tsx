import { MiniKit } from '@worldcoin/minikit-js';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // First check if the World App is installed
      const isInstalled = (MiniKit as any).isInstalled();
      if (!isInstalled) {
        setError('World App is not installed. Please install it first.');
        setIsLoading(false);
        return;
      }
      
      // Fetch nonce from our backend
      const res = await fetch('/api/nonce');
      const { nonce } = await res.json();
      
      // Use the walletAuth command with proper parameters
      const miniKitAny = MiniKit as any;
      const { _commandPayload, finalPayload } = await miniKitAny.commandsAsync.walletAuth({
        nonce: nonce,
        expirationTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week
        notBefore: new Date(Date.now() - 60 * 1000), // 1 minute ago
        statement: 'Sign in to WhoDeedIt to verify your identity and property ownership.',
      });
      
      // Handle authentication error
      if (finalPayload.status === 'error') {
        console.error('Authentication failed:', finalPayload);
        setError('Authentication failed. Please try again.');
        return;
      }
      
      // Complete the authentication process by verifying on backend
      const verifyResponse = await fetch('/api/complete-siwe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payload: finalPayload,
          nonce,
        }),
      });
      
      const verifyResult = await verifyResponse.json();
      
      if (verifyResult.isValid) {
        // Store user info in localStorage for client-side access
        localStorage.setItem('user_address', finalPayload.address);
        
        // Access wallet address directly from MiniKit if available
        const walletAddress = miniKitAny.walletAddress;
        if (walletAddress) {
          console.log('Wallet address from MiniKit:', walletAddress);
        }
        
        // Redirect to the wallet page
        navigate('/wallet');
      } else {
        setError('Signature verification failed. Please try again.');
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
    </div>
  );
}

export default Login;