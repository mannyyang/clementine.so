"use client";

import { motion } from "framer-motion";
import { ProjectGrid } from "./project-grid";
import { projects, type Project } from "@/mastra/context/projects";

interface WelcomeMessageProps {
  onLearnMore: (project: Project) => void;
}

export function WelcomeMessage({ onLearnMore }: WelcomeMessageProps) {
  return (
    <div className="py-8">
      {/* Intro text */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <p className="text-lg leading-relaxed text-foreground">
          Hey! I&apos;m Manuel Yang, the founder of Clementine. I help
          businesses bring their ideas to life on the web — from full-stack
          applications to polished landing pages.
        </p>
        <p className="text-lg leading-relaxed text-foreground mt-4">
          Here&apos;s what I&apos;ve been building:
        </p>
      </motion.div>

      {/* Project grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <ProjectGrid projects={projects} onLearnMore={onLearnMore} />
      </motion.div>

      {/* Closing prompt */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="mt-8"
      >
        <p className="text-muted-foreground">
          Curious about any of these? Click &quot;Learn More&quot; or just ask
          me anything — I&apos;m happy to chat about my work, process, or how
          I might help with your project.
        </p>
      </motion.div>
    </div>
  );
}
