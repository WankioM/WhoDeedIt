import React from "react"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"

interface RootLayoutProps {
  children: React.ReactNode
  showNav?: boolean
  showFooter?: boolean
  user?: {
    name: string
    image?: string
    initials: string
  }
}

export function RootLayout({
  children,
  showNav = true,
  showFooter = true,
  user,
}: RootLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      {showNav && <Navbar user={user} />}
      <main className="flex-1">{children}</main>
      {showFooter && <Footer />}
    </div>
  )
}
