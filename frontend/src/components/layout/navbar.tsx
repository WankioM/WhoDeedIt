import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth-provider';

interface NavbarProps {
  user?: {
    name: string;
    image?: string;
    initials: string;
  };
}

// Changed function name from 'navbar' to 'Navbar' (capital N)
function Navbar({user }: NavbarProps) {
  console.log(user);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, userAddress, isVerified, logout } = useAuth();
  const navigate = useNavigate();

  // Format wallet address for display
  const formatAddress = (address: string | null) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img
                className="block h-8 w-auto"
                src="/logo.svg"
                alt="WhoDeedIt"
              />
              <span className="ml-2 text-lg font-florssolid text-graphite">WhoDeedIt</span>
            </Link>
            
            {/* Desktop navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className="border-transparent text-graphite hover:border-desertclay hover:text-desertclay inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Home
              </Link>
              
              {isAuthenticated && (
                <>
                  <Link
                    to="/dashboard"
                    className="border-transparent text-graphite hover:border-desertclay hover:text-desertclay inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Dashboard
                  </Link>
                  
                  <Link
                    to="/property/verify"
                    className="border-transparent text-graphite hover:border-desertclay hover:text-desertclay inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Verify Ownership
                  </Link>
                </>
              )}
              
              <Link
                to="/about"
                className="border-transparent text-graphite hover:border-desertclay hover:text-desertclay inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                About
              </Link>
            </div>
          </div>
          
          {/* Right section */}
          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center">
                {/* Verification badge */}
                {isVerified && (
                  <div className="mr-3 hidden sm:block">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <svg className="-ml-0.5 mr-1.5 h-2 w-2 text-green-400" fill="currentColor" viewBox="0 0 8 8">
                        <circle cx="4" cy="4" r="3" />
                      </svg>
                      Verified
                    </span>
                  </div>
                )}
                
                {/* User address */}
                <div className="mr-3 text-sm text-graphite hidden sm:block">
                  {formatAddress(userAddress)}
                </div>
                
                {/* Profile dropdown */}
                <div className="ml-3 relative">
                  <div>
                    <button
                      onClick={() => setIsMenuOpen(!isMenuOpen)}
                      className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-desertclay"
                    >
                      <span className="sr-only">Open user menu</span>
                      <div className="h-8 w-8 rounded-full bg-desertclay flex items-center justify-center text-white">
                        {userAddress ? userAddress.substring(2, 4) : '??'}
                      </div>
                    </button>
                  </div>
                  
                  {/* Dropdown menu */}
                  {isMenuOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-10">
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 text-sm text-graphite hover:bg-gray-100"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 text-sm text-graphite hover:bg-gray-100"
                        onClick={() => {
                          setIsMenuOpen(false);
                          navigate('/dashboard');
                        }}
                      >
                        Profile
                      </Link>
                      
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          handleLogout();
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-graphite hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <Link
                  to="/login"
                  className="text-graphite hover:text-desertclay px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="ml-3 bg-desertclay hover:bg-opacity-90 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
            
            {/* Mobile menu button */}
            <div className="flex items-center sm:hidden ml-4">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-graphite hover:text-desertclay hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-desertclay"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="text-graphite hover:bg-gray-50 hover:text-desertclay block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            
            {isAuthenticated && (
              <>
                <Link
                  to="/dashboard"
                  className="text-graphite hover:bg-gray-50 hover:text-desertclay block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                
                <Link
                  to="/property/verify"
                  className="text-graphite hover:bg-gray-50 hover:text-desertclay block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Verify Ownership
                </Link>
              </>
            )}
            
            <Link
              to="/about"
              className="text-graphite hover:bg-gray-50 hover:text-desertclay block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            
            {!isAuthenticated && (
              <>
                <Link
                  to="/login"
                  className="text-graphite hover:bg-gray-50 hover:text-desertclay block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                
                <Link
                  to="/signup"
                  className="text-graphite hover:bg-gray-50 hover:text-desertclay block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

// Export the component with the name "Navbar"
export default Navbar;