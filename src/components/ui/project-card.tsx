"use client";

import { motion } from "framer-motion";
import { ExternalLink, MessageCircle } from "lucide-react";
import Image from "next/image";
import type { Project } from "@/mastra/context/projects";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
  onLearnMore: (project: Project) => void;
}

export function ProjectCard({ project, onLearnMore }: ProjectCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border bg-card",
        "shadow-sm hover:shadow-md transition-shadow duration-200"
      )}
    >
      {/* Screenshot */}
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <Image
          src={project.screenshots[0]}
          alt={`${project.name} screenshot`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span
            className={cn(
              "px-2 py-1 text-xs font-medium rounded-full",
              project.category === "product"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground"
            )}
          >
            {project.category === "product" ? "Product" : "Client"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-foreground">{project.name}</h3>
          <p className="text-sm text-muted-foreground">{project.tagline}</p>
        </div>

        {/* Tech stack badges */}
        <div className="flex flex-wrap gap-1.5">
          {project.techStack.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 text-xs bg-muted text-muted-foreground rounded-md"
            >
              {tech}
            </span>
          ))}
          {project.techStack.length > 3 && (
            <span className="px-2 py-0.5 text-xs text-muted-foreground">
              +{project.techStack.length - 3}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg",
              "bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            )}
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Visit Site
          </a>
          <button
            onClick={() => onLearnMore(project)}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg",
              "border border-border bg-background hover:bg-muted transition-colors"
            )}
          >
            <MessageCircle className="h-3.5 w-3.5" />
            Learn More
          </button>
        </div>
      </div>
    </motion.div>
  );
}
