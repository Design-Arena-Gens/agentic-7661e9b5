import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SmartTeammates Mod - by Skyline',
  description: 'Advanced AI teammate bot configuration and simulation',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
