import type { Metadata, Viewport } from "next"
import React from "react"
import "./globals.css"
import { cn } from "@/lib/utils"

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
}

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
          "h-full bg-background font-sans antialiased overflow-hidden"
        )}
      >
        {children}
      </body>
    </html>
  )
}