import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function Footer() {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <footer className="bg-milk border-t border-lightstone/30">
      <div className="container mx-auto py-10 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <h3 className="font-bold text-xl text-graphite">
              Who<span className="text-desertclay">Deed</span>It
            </h3>
            <p className="text-graphite/70 text-sm max-w-xs">
              Secure property ownership verification with blockchain integration and cutting-edge World ID technology.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-graphite">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-graphite/70 hover:text-graphite transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('/verify')}
                  className="text-graphite/70 hover:text-graphite transition-colors"
                >
                  Verify Identity
                </button>
              </li>
              <li>
                <Link to="/dashboard" className="text-graphite/70 hover:text-graphite transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('/wallet')}
                  className="text-graphite/70 hover:text-graphite transition-colors"
                >
                  My Properties
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-graphite">Help & Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/faq" className="text-graphite/70 hover:text-graphite transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-graphite/70 hover:text-graphite transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-graphite/70 hover:text-graphite transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-graphite/70 hover:text-graphite transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="h-px w-full bg-lightstone/30 my-6"></div>

        <div className="flex flex-col md:flex-row items-center justify-between text-sm text-graphite/70">
          <p>© 2025 WhoDeedIt. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-graphite transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-graphite transition-colors">
              Terms
            </Link>
            <Link to="/cookies" className="hover:text-graphite transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}