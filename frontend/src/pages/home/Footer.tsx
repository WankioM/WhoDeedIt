
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <footer className="bg-graphite text-milk">
      <div className="container mx-auto py-8 md:py-10 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <h3 className="font-bold text-xl">
              Who<span className="text-desertclay">Deed</span>It
            </h3>
            <p className="text-milk/80 text-sm max-w-xs">
              Secure property ownership verification with blockchain integration and World ID identity verification.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => handleNavigation('/')}
                  className="text-milk/70 hover:text-desertclay transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('/signup')}
                  className="text-milk/70 hover:text-desertclay transition-colors"
                >
                  Verify Identity
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('/dashboard')}
                  className="text-milk/70 hover:text-desertclay transition-colors"
                >
                  Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('/wallet')}
                  className="text-milk/70 hover:text-desertclay transition-colors"
                >
                  My Properties
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium">Help & Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => handleNavigation('/faq')}
                  className="text-milk/70 hover:text-desertclay transition-colors"
                >
                  FAQ
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('/contact')}
                  className="text-milk/70 hover:text-desertclay transition-colors"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('/privacy')}
                  className="text-milk/70 hover:text-desertclay transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('/terms')}
                  className="text-milk/70 hover:text-desertclay transition-colors"
                >
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-6 bg-milk/20" />

        <div className="flex flex-col md:flex-row items-center justify-between text-sm text-milk/60">
          <p>© 2025 WhoDeedIt. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <button
              onClick={() => handleNavigation('/privacy')}
              className="hover:text-desertclay transition-colors"
            >
              Privacy
            </button>
            <button
              onClick={() => handleNavigation('/terms')}
              className="hover:text-desertclay transition-colors"
            >
              Terms
            </button>
            <button
              onClick={() => handleNavigation('/cookies')}
              className="hover:text-desertclay transition-colors"
            >
              Cookies
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}