import { useState, useEffect } from 'react';
import useUser from '@/services/useUser';


interface Step1Props {
  onContinue: () => void;
  userAddress: string | null;
  isDaobitatConnected: boolean;
}

function Step1DaobitatConnect({ onContinue, userAddress, isDaobitatConnected }: Step1Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { user } = useUser();
  
  // Check existing connection on load
  useEffect(() => {
    const checkConnection = async () => {
      if (userAddress && isDaobitatConnected) {
        // If already connected, show success message and allow continuing
        setSuccess(true);
      } else if (userAddress && user?.worldIdVerified) {
        // If user is verified with World ID, they're good to go
        setSuccess(true);
      }
    };
    
    checkConnection();
  }, [userAddress, isDaobitatConnected, user]);
  
  const handleConnect = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!userAddress) {
        throw new Error('User wallet address not available');
      }
      
      // Simulate a connection to Daobitat
      // In a real app, this would make an API call to link the user's World ID to Daobitat
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check if the user is verified with World ID
      if (user?.worldIdVerified) {
        setSuccess(true);
        // Wait a bit before continuing to show success state
        setTimeout(() => {
          onContinue();
        }, 1500);
      } else {
        throw new Error('Your World ID is not verified. Please complete World ID verification first.');
      }
    } catch (err: any) {
      console.error('Error connecting to Daobitat:', err);
      setError(err.message || 'Failed to connect to Daobitat');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="mb-6 p-6 bg-milk rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold text-graphite mb-4">Step 1: Connect to Daobitat</h2>
      <p className="text-gray-600 mb-6">
        Before listing your property, you need to connect your World ID verification to Daobitat.
        This allows your verified identity to be recognized in the Daobitat marketplace.
      </p>
      
      <div className="bg-white p-5 rounded-lg border border-lightstone mb-6">
        <h3 className="font-medium text-graphite mb-2">What happens when you connect?</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-600">
          <li>Your World ID wallet address will be used to create or access your Daobitat account</li>
          <li>You'll be registered as a verified property lister on Daobitat</li>
          <li>Properties you submit will be marked as verified by World ID</li>
          <li>Your personal information will remain private and secure</li>
        </ul>
      </div>
      
      {success ? (
        <div className="p-4 bg-green-50 text-green-700 rounded-lg mb-6 flex items-start">
          <svg className="h-5 w-5 text-green-400 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="font-medium">Successfully connected to Daobitat!</p>
            <p className="text-sm">Your World ID is now linked to Daobitat. You can continue to the next step.</p>
          </div>
        </div>
      ) : null}
      
      {error && (
        <div className="p-4 bg-red-50 text-rustyred rounded-lg mb-6">
          <p className="font-medium">Connection error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}
      
      <div className="flex justify-between">
        {success ? (
          <button
            onClick={onContinue}
            className="px-6 py-2 bg-graphite text-white rounded-md hover:bg-opacity-90 transition-colors"
          >
            Continue to Next Step
          </button>
        ) : (
          <button
            onClick={handleConnect}
            disabled={loading || !userAddress}
            className="px-6 py-2 bg-graphite text-white rounded-md hover:bg-opacity-90 transition-colors disabled:bg-opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Connecting...
              </span>
            ) : (
              'Connect World ID to Daobitat'
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default Step1DaobitatConnect;