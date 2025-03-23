import React from "react"

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

  showFooter = true,

}: RootLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
    
      <main className="flex-1">{children}</main>
      {showFooter && <Footer />}
    </div>
  )
}
