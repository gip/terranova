import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { WorldAuthProvider } from 'next-world-auth/react'
import { Analytics } from '@vercel/analytics/next'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
})

export const metadata: Metadata = {
  title: "Terranova",
  description: "Social Miniapp"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <WorldAuthProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable}  bg-gradient-to-br from-purple-800 via-purple-950 to-white text-white antialiased`}
        >
          {children}
          <Analytics />
        </body>
      </WorldAuthProvider>
    </html>
  )
}
