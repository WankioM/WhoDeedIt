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
      // Type assertion to work around missing types
      const miniKitAny = MiniKit as any;
      
      // Use the wallet_auth command with type assertion
      const result = await miniKitAny.wallet_auth();
      
      // After successful authentication, access user info with type safety workaround
      console.log('User authenticated with address:', result.address);
      console.log('Username:', miniKitAny.auth?.username);
      console.log('Profile picture:', miniKitAny.auth?.profile_picture);
      
      // Store the auth info for later use
      localStorage.setItem('user_address', result.address);
      localStorage.setItem('username', miniKitAny.auth?.username || '');
      localStorage.setItem('profile_picture', miniKitAny.auth?.profile_picture || '');
      
      // Redirect to the dashboard/wallet page
      navigate('/wallet');
    } catch (err) {
      console.error('Authentication error:', err);
      setError('Failed to authenticate. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-6">Login to WhoDeedIt</h1>
      
      <button 
        onClick={handleLogin}
        disabled={isLoading}
        className="bg-desertclay text-white px-6 py-3 rounded-lg font-medium disabled:bg-opacity-70"
      >
        {isLoading ? 'Connecting...' : 'Sign in with World ID'}
      </button>
      
      {error && (
        <p className="mt-4 text-rustyred">{error}</p>
      )}
      
      <p className="mt-6 text-sm text-graphite">
        Authenticate securely using your World ID wallet
      </p>
    </div>
  );
}

export default Login;