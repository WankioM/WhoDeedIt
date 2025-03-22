import  { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the shape of our authentication context
interface AuthContextType {
  isAuthenticated: boolean;
  isVerified: boolean;
  userAddress: string | null;
  login: (address: string) => void;
  verify: () => void;
  logout: () => void;
  isDevelopmentMode: boolean;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isVerified: false,
  userAddress: null,
  login: () => {},
  verify: () => {},
  logout: () => {},
  isDevelopmentMode: false
});

// Hook for using the auth context
export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [isDevelopmentMode, setIsDevelopmentMode] = useState(false);

  // Check if we're in development mode
  useEffect(() => {
    const devMode = process.env.REACT_APP_DEV_AUTH === 'true' || 
                    window.location.hostname === 'localhost';
    setIsDevelopmentMode(devMode);
    
    console.log('Development mode:', devMode);
  }, []);

  // Load authentication state from localStorage on initial render
  useEffect(() => {
    const loadAuthState = () => {
      const storedAddress = localStorage.getItem('user_address');
      const storedVerified = localStorage.getItem('user_verified') === 'true';
      
      if (storedAddress) {
        setIsAuthenticated(true);
        setUserAddress(storedAddress);
        setIsVerified(storedVerified);
      }
    };
    
    loadAuthState();
    
    // Listen for storage events (e.g., when another tab updates localStorage)
    const handleStorageChange = () => {
      loadAuthState();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Cleanup event listener
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  // Login function
  const login = (address: string) => {
    localStorage.setItem('user_address', address);
    setIsAuthenticated(true);
    setUserAddress(address);
  };
  
  // Verification function
  const verify = () => {
    localStorage.setItem('user_verified', 'true');
    setIsVerified(true);
  };
  
  // Logout function
  const logout = () => {
    localStorage.removeItem('user_address');
    localStorage.removeItem('user_verified');
    setIsAuthenticated(false);
    setIsVerified(false);
    setUserAddress(null);
  };
  
  // Auto-login for development mode if enabled
  useEffect(() => {
    if (isDevelopmentMode && !isAuthenticated) {
      // Only auto-login if a manual login hasn't happened
      const devAddress = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
      
      // Don't overwrite existing values
      if (!localStorage.getItem('user_address')) {
        console.log('Development mode: Auto-login enabled');
        setTimeout(() => {
          login(devAddress);
        }, 100);
      }
    }
  }, [isDevelopmentMode, isAuthenticated]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isVerified,
        userAddress,
        login,
        verify,
        logout,
        isDevelopmentMode
      }}
    >
      {children}
    </AuthContext.Provider>
  );}