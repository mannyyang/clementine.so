"use client"

import Image from "next/image"
import { Mail } from "lucide-react"
import { Chat } from "@/components/chat"

export default function HomePage() {
  return (
    <main className="h-dvh w-full flex flex-col">
      {/* Header */}
      <header className="flex-shrink-0 px-4 py-3 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Clementine Studios"
              width={24}
              height={24}
              className="w-6 h-6"
            />
            <span className="font-semibold text-foreground">Clementine Studios</span>
          </div>
          <a
            href="mailto:manuel@clementine.so"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Mail className="h-4 w-4" />
            <span className="hidden sm:inline">Email me</span>
          </a>
        </div>
      </header>

      {/* Chat area */}
      <div className="flex-1 min-h-0 relative">
        <Chat />
      </div>
    </main>
  )
}
