"use client"

import { motion } from "framer-motion"

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-8"
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="block"
          >
            clementine
          </motion.span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="block text-2xl sm:text-3xl lg:text-4xl font-normal text-muted-foreground mt-4"
          >
            work in progress
          </motion.span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16"
        >
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground"
          >
            <span className="w-2 h-2 bg-muted-foreground rounded-full" />
            <span className="w-2 h-2 bg-muted-foreground rounded-full" />
            <span className="w-2 h-2 bg-muted-foreground rounded-full" />
          </motion.div>
        </motion.div>
      </div>
    </main>
  )
}