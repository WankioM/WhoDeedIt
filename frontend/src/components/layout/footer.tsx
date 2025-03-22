"use client"

import { useNavigate } from 'react-router-dom';
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <footer className="bg-background border-t">
      <div className="kyc-container py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <h3 className="font-bold text-xl text-primary">
              Asset<span className="text-teal">Verify</span>
            </h3>
            <p className="text-muted-foreground text-sm max-w-xs">
              Secure asset ownership verification with blockchain integration and cutting-edge KYC technology.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('/kyc')}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Verify Identity
                </button>
              </li>
              <li>
                <Link href="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('/wallet')}
                  className="text-muted-foreground hover:text-primary transition-colors"
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
                <Link href="/faq" className="text-muted-foreground hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
          <p>© 2025 AssetVerify. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-primary transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-primary transition-colors">
              Terms
            </Link>
            <Link href="/cookies" className="hover:text-primary transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}