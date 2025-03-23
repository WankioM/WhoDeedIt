import { useNavigate } from 'react-router-dom';
import { Separator } from '@radix-ui/react-separator';

export default function Footer() {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <footer className="bg-graphite text-milk">
      <div className="container mx-auto py-8 md:py-10 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and description */}
          <div className="space-y-3">
            <h3 className="font-bold text-xl text-milk">
              Who<span className="text-rustyred">Deed</span>It
            </h3>
            <p className="text-milk text-sm max-w-xs">
              Secure property ownership verification with blockchain integration and World ID identity verification.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-medium text-rustyred">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <div
                  onClick={() => handleNavigation('/')}
                  className="text-milk hover:text-rustyred transition-colors"
                >
                  Home
                </div>
              </li>
              <li>
                <div
                  onClick={() => handleNavigation('/signup')}
                  className="text-milk hover:text-rustyred transition-colors"
                > 
                  Verify Identity
                </div>
              </li>
              <li>
                <div
                  onClick={() => handleNavigation('/dashboard')}
                  className="text-milk hover:text-rustyred transition-colors"
                >
                  Dashboard
                </div>
              </li>
              <li>
                <div
                  onClick={() => handleNavigation('/wallet')}
                  className="text-milk hover:text-rustyred transition-colors"
                >
                  My Properties
                </div>
              </li>
            </ul>
          </div>

          {/* Help & Support */}
          <div className="space-y-3">
            <h4 className="font-medium text-rustyred">Help & Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <div
                  onClick={() => handleNavigation('/faq')}
                  className="text-milk hover:text-rustyred transition-colors"
                >
                  FAQ
                </div>
              </li>
              <li>
                <div
                  onClick={() => handleNavigation('/contact')}
                  className="text-milk hover:text-rustyred transition-colors"
                >
                  Contact Us
                </div>
              </li>
              <li>
                <div
                  onClick={() => handleNavigation('/privacy')}
                  className="text-milk hover:text-rustyred transition-colors"
                >
                  Privacy Policy
                </div>
              </li>
              <li>
                <div
                  onClick={() => handleNavigation('/terms')}
                  className="text-milk hover:text-rustyred transition-colors"
                >
                  Terms of Service
                </div>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-6 bg-rustyred/30" />

        <div className="flex flex-col md:flex-row items-center justify-between text-sm">
          <p className="text-milk">© 2025 WhoDeedIt. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <div
              onClick={() => handleNavigation('/privacy')}
              className="text-milk hover:text-rustyred transition-colors"
            >
              Privacy
            </div>
            <div
              onClick={() => handleNavigation('/terms')}
              className="text-milk hover:text-rustyred transition-colors"
            >
              Terms
            </div>
            <div
              onClick={() => handleNavigation('/cookies')}
              className="text-milk hover:text-rustyred transition-colors"
            >
              Cookies
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}