import React from "react"

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
  
}: RootLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">{children}</main>
      {/* Footer is now handled centrally in App.tsx */}
    </div>
  )
}