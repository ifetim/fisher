import type { Metadata } from 'next'
import { Providers } from '@/components/Providers'
import './globals.css'
import '@/styles/fisher.css'

export const metadata: Metadata = {
  title: 'ClearMint — Your spending, decoded',
  description:
    'Campus-friendly personal finance: track spending, save smarter, connect your bank with Plaid.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" style={{ background: '#f6f6fa' }}>
      <body style={{ background: '#f6f6fa', margin: 0 }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
