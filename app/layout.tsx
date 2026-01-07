import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Design Theater",
  description:
    " Evaluating Thinking Authenticity in UI Generating Agent",
  authors: [
    { name: "Kashif Imteyaz" },
    { name: "Daniel Lee" },
    { name: "Md Kaif Imteyaz" },
    { name: "Kaif Shaikh" },
    { name: "Dr. Saiph Savage" }
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
