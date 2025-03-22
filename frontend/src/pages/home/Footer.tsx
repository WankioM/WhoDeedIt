import { useNavigate } from 'react-router-dom';

export default function Footer() {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <footer className="bg-gray-800 py-6 text-center text-white">
      <div className="container mx-auto">
        <div className="flex justify-center space-x-8 mb-4">
          <button 
            onClick={() => handleNavigation('/kyc')} 
            className="text-white hover:text-blue-300 transition duration-200"
          >
            Verify Identity
          </button>
          <button 
            onClick={() => handleNavigation('/wallet')} 
            className="text-white hover:text-blue-300 transition duration-200"
          >
            My Properties
          </button>
        </div>
        <p>© 2025 WhoDeedIt. All rights reserved.</p>
      </div>
    </footer>
  );
}