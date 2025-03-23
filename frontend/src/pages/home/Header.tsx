import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth-provider';

export default function Header() {
  const { isAuthenticated, userAddress, isVerified, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
    <header className="relative bg-graphite shadow-lg">
      {/* Gradient overlays for visual interest */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 right-0 w-64 h-64 bg-desertclay/10 blur-3xl rounded-full"></div>
        <div className="absolute -left-20 top-0 w-64 h-64 bg-rustyred/5 blur-3xl rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-florssolid text-milk">
                Who<span className="text-desertclay">Deed</span>It
              </span>
            </Link>
            
            {/* Desktop navigation */}
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              <Link
                to="/"
                className="group text-milk hover:text-rustyred transition-colors duration-300 inline-flex flex-col items-center px-1 pt-1 text-sm"
              >
                <span>Home</span>
                <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-rustyred"></span>
              </Link>
              
              {isAuthenticated && (
                <>
                  <Link
                    to="/dashboard"
                    className="group text-milk hover:text-rustyred transition-colors duration-300 inline-flex flex-col items-center px-1 pt-1 text-sm"
                  >
                    <span>Dashboard</span>
                    <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-rustyred"></span>
                  </Link>
                  
                  <Link
                    to="/property/verify"
                    className="group text-milk hover:text-rustyred transition-colors duration-300 inline-flex flex-col items-center px-1 pt-1 text-sm"
                  >
                    <span>Verify Ownership</span>
                    <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-rustyred"></span>
                  </Link>
                </>
              )}
              
              <Link
                to="/about"
                className="group text-milk hover:text-rustyred transition-colors duration-300 inline-flex flex-col items-center px-1 pt-1 text-sm"
              >
                <span>About</span>
                <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-rustyred"></span>
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
                <div className="mr-3 text-sm text-lightstone hidden sm:block">
                  {formatAddress(userAddress)}
                </div>
                
                {/* Profile dropdown */}
                <div className="ml-3 relative">
                  <div>
                    <button
                      onClick={() => setIsMenuOpen(!isMenuOpen)}
                      className="rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rustyred"
                    >
                      <span className="sr-only">Open user menu</span>
                      <div className="h-8 w-8 rounded-full bg-desertclay flex items-center justify-center text-white transition-transform hover:scale-105">
                        {userAddress ? userAddress.substring(2, 4) : '??'}
                      </div>
                    </button>
                  </div>
                  
                  {/* Dropdown menu */}
                  {isMenuOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-50">
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
                  className="text-milk hover:text-rustyred transition-colors duration-300 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="ml-3 bg-milk hover:bg-milk/90 text-graphite hover:text-rustyred transition-colors duration-300 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
            
            {/* Mobile menu button */}
            <div className="flex items-center sm:hidden ml-4">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-milk hover:text-rustyred hover:bg-graphite/80 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-rustyred"
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
        <div className="sm:hidden bg-graphite/95 absolute w-full z-40">
          <div className="pt-2 pb-3 space-y-1 px-4">
            <Link
              to="/"
              className="text-milk hover:text-rustyred block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            
            {isAuthenticated && (
              <>
                <Link
                  to="/dashboard"
                  className="text-milk hover:text-rustyred block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                
                <Link
                  to="/property/verify"
                  className="text-milk hover:text-rustyred block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Verify Ownership
                </Link>
              </>
            )}
            
            <Link
              to="/about"
              className="text-milk hover:text-rustyred block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            
            {!isAuthenticated && (
              <>
                <Link
                  to="/login"
                  className="text-milk hover:text-rustyred block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                
                <Link
                  to="/signup"
                  className="text-milk hover:text-rustyred block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}