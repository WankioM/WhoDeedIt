import Link from "next/link"
import { RootLayout } from "@/components/layout/root-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRightIcon } from "lucide-react"

export default function HomePage() {
  return (
    <RootLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-background to-secondary/20 py-16 md:py-24">
        <div className="container mx-auto px-4 space-y-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
            Secure Asset Verification with <span className="text-teal-500">Blockchain</span> Power
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Verify and manage asset ownership with our secure, transparent, and blockchain-enabled KYC platform.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" asChild>
              <Link href="/signup">
                Get Started
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/learn-more">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Key Features</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Our platform combines advanced KYC processes with blockchain technology to provide a secure and transparent verification system.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-500/10 text-teal-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 8V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2" />
                    <path d="M18 16v-8" />
                    <line x1="15" y1="12" x2="21" y2="12" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">Multi-option Authentication</h3>
                <p className="text-muted-foreground">
                  Choose from World ID, KYC providers, or wallet connection for flexible yet secure authentication.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-500/10 text-teal-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">Blockchain Verification</h3>
                <p className="text-muted-foreground">
                  Asset ownership certificates stored on blockchain for immutable, transparent verification.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-500/10 text-teal-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">Secure Transfer System</h3>
                <p className="text-muted-foreground">
                  Easily and securely transfer property ownership with blockchain-verified transactions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-24 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <p className="text-4xl md:text-5xl font-bold text-teal-500">10,000+</p>
              <p className="text-muted-foreground">Properties Verified</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl md:text-5xl font-bold text-teal-500">5,000+</p>
              <p className="text-muted-foreground">Satisfied Users</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl md:text-5xl font-bold text-teal-500">99.9%</p>
              <p className="text-muted-foreground">Verification Success Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="bg-slate-800 rounded-xl p-8 md:p-12 text-center space-y-6 text-white">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Ready to Verify Your Asset?</h2>
            <p className="text-white/90 max-w-2xl mx-auto">
              Join thousands of users who trust our platform for secure, blockchain-powered asset verification.
            </p>
            <Button size="lg" className="bg-teal-500 hover:bg-teal-600" asChild>
              <Link href="/signup">Get Started Now</Link>
            </Button>
          </div>
        </div>
      </section>
    </RootLayout>
  )
}