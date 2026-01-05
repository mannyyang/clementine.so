"use client"

import { motion } from "framer-motion"
import { Chat } from "@/components/chat"

export default function HomePage() {
  return (
    <main className="flex flex-col h-screen">
      {/* Header */}
      <header className="flex-shrink-0 py-8 px-4 sm:px-6 lg:px-8 text-center border-b border-border">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-4xl font-bold tracking-tight"
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            clementine
          </motion.span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-sm text-muted-foreground mt-2"
        >
          Ask me anything
        </motion.p>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-hidden">
        <Chat />
      </div>
    </main>
  )
}
