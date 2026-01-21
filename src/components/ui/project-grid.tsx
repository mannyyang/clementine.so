"use client";

import { motion } from "framer-motion";
import { ProjectCard } from "./project-card";
import type { Project } from "@/mastra/context/projects";

interface ProjectGridProps {
  projects: Project[];
  onLearnMore: (_project: Project) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
    },
  },
};

export function ProjectGrid({ projects, onLearnMore }: ProjectGridProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 gap-4"
    >
      {projects.map((project) => (
        <motion.div key={project.id} variants={itemVariants}>
          <ProjectCard project={project} onLearnMore={onLearnMore} />
        </motion.div>
      ))}
    </motion.div>
  );
}
