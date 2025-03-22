import React, { createContext, useContext, ReactNode, useEffect } from 'react';

// This provider will help us manage MiniKit interactions globally
// and handle API errors at a higher level

interface MiniKitContextType {
  isReady: boolean;
}

const MiniKitContext = createContext<MiniKitContextType>({
  isReady: false,
});

export const useMiniKit = () => useContext(MiniKitContext);

const MiniKitProvider = ({ children }: { children: ReactNode }) => {
  const [isReady, setIsReady] = React.useState(false);

  useEffect(() => {
    // Add a global error handler for the usernames.worldcoin.org API
    // This is a workaround for the MiniKit library bug
    const originalFetch = window.fetch;
    
    window.fetch = async function(input, init) {
      // If this is a call to the problematic URL, intercept it
      if (input && typeof input === 'string' && input.includes('usernames.worldcoin.org/api/v1/query')) {
        console.warn('Intercepted problematic World ID API call. Providing fallback response.');
        
        // Create a mock response that won't cause errors
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ 
            usernames: ['user'] // Provide a dummy username array
          })
        } as Response);
      }
      
      // Otherwise, proceed with the original fetch
      return originalFetch.apply(this, [input, init] as any);
    };

    // Also patch any global error handlers that might prevent navigation
    const originalOnError = window.onerror;
    window.onerror = function(message, source, lineno, colno, error) {
      // If it's the known World ID username API error, suppress it
      if (message && 
          (message.toString().includes('usernames.worldcoin.org') || 
           message.toString().includes('undefined is not an object'))) {
        console.warn('Suppressed World ID API error:', message);
        return true; // Prevents the error from propagating
      }
      
      // Otherwise, use the original handler
      if (originalOnError) {
        return originalOnError.apply(this, arguments as any);
      }
      return false;
    };

    setIsReady(true);

    // Clean up function to restore original fetch
    return () => {
      window.fetch = originalFetch;
      window.onerror = originalOnError;
    };
  }, []);

  return (
    <MiniKitContext.Provider value={{ isReady }}>
      {children}
    </MiniKitContext.Provider>
  );
};

export default MiniKitProvider;