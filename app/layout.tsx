import type { Metadata } from 'next'
import './globals.css'
import ClickHearts from '@/components/ClickHearts'

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
      </body>
    </html>
  )
}
