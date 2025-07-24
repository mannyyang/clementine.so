import type { Metadata } from "next"
import React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Clementine | Portfolio",
  description: "Personal portfolio showcasing projects and skills",
  keywords: ["portfolio", "developer", "projects"],
  authors: [{ name: "Clementine" }],
  openGraph: {
    title: "Clementine | Portfolio",
    description: "Personal portfolio showcasing projects and skills",
    url: "https://clementine.so",
    siteName: "Clementine",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          inter.className,
          "min-h-screen bg-background font-sans antialiased"
        )}
      >
        {children}
      </body>
    </html>
  )
}