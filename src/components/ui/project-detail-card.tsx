"use client";

import { motion } from "framer-motion";
import { ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { useState } from "react";
import type { Project } from "@/mastra/context/projects";
import { cn } from "@/lib/utils";

interface ProjectDetailCardProps {
  project: Project;
  description: string;
}

export function ProjectDetailCard({ project, description }: ProjectDetailCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const hasMultipleImages = project.screenshots.length > 1;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % project.screenshots.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? project.screenshots.length - 1 : prev - 1
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="py-4"
    >
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        {/* Header with screenshot carousel */}
        <div className="relative aspect-[16/9] bg-muted">
          <Image
            src={project.screenshots[currentImageIndex]}
            alt={`${project.name} screenshot ${currentImageIndex + 1}`}
            fill
            className="object-cover"
          />

          {/* Navigation arrows for carousel */}
          {hasMultipleImages && (
            <>
              <button
                onClick={prevImage}
                className={cn(
                  "absolute left-3 top-1/2 -translate-y-1/2",
                  "h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm",
                  "flex items-center justify-center",
                  "border border-border shadow-sm",
                  "hover:bg-background transition-colors"
                )}
                type="button"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={nextImage}
                className={cn(
                  "absolute right-3 top-1/2 -translate-y-1/2",
                  "h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm",
                  "flex items-center justify-center",
                  "border border-border shadow-sm",
                  "hover:bg-background transition-colors"
                )}
                type="button"
              >
                <ChevronRight className="h-4 w-4" />
              </button>

              {/* Image indicators */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {project.screenshots.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={cn(
                      "h-1.5 rounded-full transition-all",
                      index === currentImageIndex
                        ? "w-4 bg-white"
                        : "w-1.5 bg-white/50 hover:bg-white/75"
                    )}
                    type="button"
                  />
                ))}
              </div>
            </>
          )}

          {/* Category and role badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            <span
              className={cn(
                "px-2.5 py-1 text-xs font-medium rounded-full",
                project.category === "product"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              )}
            >
              {project.category === "product" ? "Product" : "Client"}
            </span>
            <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-background/80 backdrop-blur-sm text-foreground">
              {project.role}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Title */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-foreground">{project.name}</h3>
              <p className="text-muted-foreground">{project.tagline}</p>
            </div>
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "shrink-0 flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg",
                "bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              )}
            >
              <ExternalLink className="h-4 w-4" />
              Visit Site
            </a>
          </div>

          {/* Tech stack */}
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 text-sm bg-muted text-muted-foreground rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* AI-generated description */}
          <div className="prose prose-lg dark:prose-invert max-w-none leading-relaxed prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-0 prose-headings:mt-4 prose-headings:mb-2 prose-strong:font-semibold prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
            <ReactMarkdown>{description}</ReactMarkdown>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
