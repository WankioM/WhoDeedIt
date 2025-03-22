import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-blue-600 px-4 py-3 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-white">WhoDeedIt</Link>
        <nav className="flex space-x-4">
          <Link to="/login" className="text-white hover:text-blue-200">Login</Link>
          <Link to="/signup" className="rounded bg-white px-3 py-1 text-blue-600 hover:bg-blue-100">Sign Up</Link>
        </nav>
      </div>
    </header>
  );
}