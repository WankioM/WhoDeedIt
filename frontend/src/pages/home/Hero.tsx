import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRightIcon, CheckCircle2, Shield, Home } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export default function Hero() {
  // Animation states
  const [isVisible, setIsVisible] = useState(false)
  const navigate = useNavigate()
  
  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleAddProperty = () => {
    navigate('/dashboard', { state: { activeTab: 'properties' } })
  }
  
  return (
    <>
      {/* Hero Section with Animated Background */}
      <section className="relative overflow-hidden py-10 md:py-20 bg-gradient-to-b from-milk to-lightstone/40">
        {/* Animated background elements - reduced size for mobile */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-40 md:w-80 h-40 md:h-80 rounded-full bg-gradient-to-r from-lightstone/20 to-graphite/5 blur-3xl transform animate-float-slow" />
          <div className="absolute top-40 -left-10 w-40 md:w-60 h-40 md:h-60 rounded-full bg-gradient-to-r from-lightstone/30 to-lightstone/10 blur-3xl transform animate-float" />
          <div className="absolute bottom-0 left-1/2 w-full h-1/2 bg-gradient-to-t from-white to-transparent" />
        </div>
        
        <div className="container relative mx-auto px-4 space-y-4 md:space-y-8 text-center">
          <div 
            className={`transition-all duration-1000 transform ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            <h1 className="text-3xl md:text-6xl font-florssolid tracking-tighter leading-tight mb-4 md:mb-6">
              Secure <span className="bg-gradient-to-r from-rustyred to-desertclay bg-clip-text text-transparent">Property Verification</span> with Blockchain
            </h1>
            <p className="text-base md:text-xl text-graphite/80 max-w-3xl mx-auto mb-6 md:mb-8 px-2">
              Verify and manage property ownership with our secure, transparent, and blockchain-enabled platform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 md:pt-4">
              <Button 
                size="lg" 
                className="bg-graphite hover:bg-graphite/90 text-milk transform transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl w-full sm:w-auto text-sm md:text-base py-2 h-auto"
                asChild
              >
                <Link to="/signup">
                  Get Started
                  <ArrowRightIcon className="ml-2 h-4 w-4 animate-bounce-x" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-graphite text-graphite hover:bg-graphite/5 transition-all duration-300 hover:shadow-md w-full sm:w-auto text-sm md:text-base py-2 h-auto mt-2 sm:mt-0"
                asChild
              >
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with Hover Effects */}
      <section className="py-10 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div 
            className="text-center space-y-2 md:space-y-4 mb-8 md:mb-16"
          >
            <h2 className="text-2xl md:text-4xl font-bold text-graphite">Key Features</h2>
            <div className="h-1 w-16 md:w-24 bg-gradient-to-r from-rustyred to-desertclay mx-auto my-2 md:my-4"></div>
            <p className="text-sm md:text-base text-graphite/80 max-w-3xl mx-auto px-2">
              Our platform combines advanced KYC processes with blockchain technology to provide a secure and transparent verification system.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-8">
            {/* Card 1 */}
            <Card className="border border-lightstone/60 hover:border-desertclay/50 transition-all duration-300 hover:shadow-lg group overflow-hidden">
              <CardContent className="pt-4 pb-4 md:pt-6 md:pb-6 space-y-2 md:space-y-4">
                <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-lightstone/30 text-rustyred group-hover:scale-110 transition-transform duration-300">
                  <Shield className="h-5 w-5 md:h-6 md:w-6" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-graphite group-hover:text-desertclay transition-colors duration-300">World ID Authentication</h3>
                <p className="text-sm md:text-base text-graphite/70">
                  Secure proof-of-personhood with Worldcoin's privacy-preserving identity verification.
                </p>
              </CardContent>
            </Card>

            {/* Card 2 */}
            <Card className="border border-lightstone/60 hover:border-desertclay/50 transition-all duration-300 hover:shadow-lg group overflow-hidden">
              <CardContent className="pt-4 pb-4 md:pt-6 md:pb-6 space-y-2 md:space-y-4">
                <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-lightstone/30 text-rustyred group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle2 className="h-5 w-5 md:h-6 md:w-6" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-graphite group-hover:text-desertclay transition-colors duration-300">Blockchain Verification</h3>
                <p className="text-sm md:text-base text-graphite/70">
                  Property ownership documents verified and stored on blockchain for immutable proof.
                </p>
              </CardContent>
            </Card>

            {/* Card 3 */}
            <Card className="border border-lightstone/60 hover:border-desertclay/50 transition-all duration-300 hover:shadow-lg group overflow-hidden">
              <CardContent className="pt-4 pb-4 md:pt-6 md:pb-6 space-y-2 md:space-y-4">
                <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-lightstone/30 text-rustyred group-hover:scale-110 transition-transform duration-300">
                  <Home className="h-5 w-5 md:h-6 md:w-6" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-graphite group-hover:text-desertclay transition-colors duration-300">Secure Property Transfer</h3>
                <p className="text-sm md:text-base text-graphite/70">
                  Seamlessly transfer verified property ownership with tamper-proof records.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section with Background Pattern */}
      <section className="py-10 md:py-24 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="relative bg-graphite rounded-xl p-6 md:p-12 text-center space-y-4 md:space-y-6 text-white overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-full" 
                   style={{backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
            </div>
            
            <div className="relative z-10">
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 md:mb-6">Ready to Verify Your Property?</h2>
              <p className="text-sm md:text-base text-white/80 max-w-2xl mx-auto mb-6 md:mb-8 px-2">
                Join our platform for secure, blockchain-powered property verification and management.
              </p>
              <Button 
                size="lg" 
                className="bg-desertclay text-milk hover:bg-desertclay/90 transform transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl text-sm md:text-base py-2 h-auto"
                onClick={handleAddProperty}
              >
                Add Property Now
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}