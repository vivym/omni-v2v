import clsx from 'clsx'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'OmniV2V',
  description: 'OmniV2V',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full bg-gray-100">
      <body className={clsx(inter.className, 'h-full flex scroll-smooth antialiased')}>
        {children}
      </body>
    </html>
  )
}
