import type { Metadata } from 'next'
import './globals.css'
import ClickHearts from '@/components/ClickHearts'
import BackgroundMusic from '@/components/BackgroundMusic'
import FloatingQuotes from '@/components/FloatingQuotes'

export const metadata: Metadata = {
  title: 'For Muskan, with love ♥',
  description: 'A universe built just for you.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <ClickHearts />
        <BackgroundMusic />
        <FloatingQuotes />
      </body>
    </html>
  )
}
