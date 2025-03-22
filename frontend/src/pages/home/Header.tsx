import { Link } from 'react-router-dom';
import { useAuth } from '../../context/auth-provider';

export default function Header() {
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-graphite px-4 py-3 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold text-milk font-florssolid">WhoDeedIt</Link>
        </div>
        
        <nav className="flex items-center space-x-4">
          <Link to="/" className="text-milk hover:text-lightstone hidden sm:block">Home</Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="text-milk hover:text-lightstone">Dashboard</Link>
              <button 
                onClick={handleLogout}
                className="rounded bg-lightstone px-3 py-1 text-graphite hover:bg-opacity-80 transition-colors"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-milk hover:text-lightstone">Login</Link>
              <Link to="/signup" className="rounded bg-milk px-3 py-1 text-graphite hover:bg-lightstone hover:text-milk transition-colors">
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}