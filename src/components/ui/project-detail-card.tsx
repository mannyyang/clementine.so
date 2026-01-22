"use client";

import { motion } from "framer-motion";
import { ExternalLink, ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { useState, useCallback, useEffect } from "react";
import type { Project } from "@/mastra/context/projects";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

interface ProjectDetailCardProps {
  project: Project;
  description: string;
}

export function ProjectDetailCard({ project, description }: ProjectDetailCardProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const [expandedApi, setExpandedApi] = useState<CarouselApi>();
  const [expandedCurrent, setExpandedCurrent] = useState(0);
  const hasMultipleImages = project.screenshots.length > 1;

  // Handle main carousel selection changes
  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    onSelect();

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  // Handle expanded carousel selection changes
  useEffect(() => {
    if (!expandedApi) return;

    const onSelect = () => {
      setExpandedCurrent(expandedApi.selectedScrollSnap());
    };

    expandedApi.on("select", onSelect);
    onSelect();

    return () => {
      expandedApi.off("select", onSelect);
    };
  }, [expandedApi]);

  // Sync expanded carousel to clicked image
  useEffect(() => {
    if (expandedImage && expandedApi) {
      const index = project.screenshots.indexOf(expandedImage);
      if (index !== -1) {
        expandedApi.scrollTo(index, true);
      }
    }
  }, [expandedImage, expandedApi, project.screenshots]);

  const scrollPrev = useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = useCallback(() => {
    api?.scrollNext();
  }, [api]);

  const expandedScrollPrev = useCallback(() => {
    expandedApi?.scrollPrev();
  }, [expandedApi]);

  const expandedScrollNext = useCallback(() => {
    expandedApi?.scrollNext();
  }, [expandedApi]);

  const handleImageClick = (imageSrc: string) => {
    setExpandedImage(imageSrc);
  };

  const handleCloseExpanded = () => {
    setExpandedImage(null);
  };

  // Handle keyboard navigation in expanded view
  useEffect(() => {
    if (!expandedImage) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        expandedScrollPrev();
      } else if (e.key === "ArrowRight") {
        expandedScrollNext();
      } else if (e.key === "Escape") {
        handleCloseExpanded();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [expandedImage, expandedScrollPrev, expandedScrollNext]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="py-4"
      >
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          {/* Header with screenshot carousel */}
          <div className="relative aspect-[16/9] bg-muted group">
            <Carousel
              setApi={setApi}
              opts={{
                loop: true,
                dragFree: false,
              }}
              className="w-full h-full"
            >
              <CarouselContent className="h-full ml-0">
                {project.screenshots.map((screenshot, index) => (
                  <CarouselItem
                    key={index}
                    className="h-full pl-0 cursor-pointer"
                    onClick={() => handleImageClick(screenshot)}
                  >
                    <div className="relative w-full h-full aspect-[16/9]">
                      <Image
                        src={screenshot}
                        alt={`${project.name} screenshot ${index + 1}`}
                        fill
                        className="object-cover"
                        draggable={false}
                      />
                      {/* Zoom hint overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm rounded-full p-2">
                          <ZoomIn className="h-5 w-5 text-foreground" />
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>

            {/* Navigation arrows for carousel */}
            {hasMultipleImages && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    scrollPrev();
                  }}
                  className={cn(
                    "absolute left-3 top-1/2 -translate-y-1/2 z-10",
                    "h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm",
                    "flex items-center justify-center",
                    "border border-border shadow-sm",
                    "hover:bg-background active:scale-95 transition-all",
                    "touch-manipulation"
                  )}
                  type="button"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    scrollNext();
                  }}
                  className={cn(
                    "absolute right-3 top-1/2 -translate-y-1/2 z-10",
                    "h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm",
                    "flex items-center justify-center",
                    "border border-border shadow-sm",
                    "hover:bg-background active:scale-95 transition-all",
                    "touch-manipulation"
                  )}
                  type="button"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>

                {/* Image indicators */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {project.screenshots.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        api?.scrollTo(index);
                      }}
                      className={cn(
                        "h-2 rounded-full transition-all touch-manipulation",
                        index === current
                          ? "w-6 bg-white"
                          : "w-2 bg-white/50 hover:bg-white/75 active:bg-white/90"
                      )}
                      type="button"
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
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

      {/* Expanded Image Dialog */}
      <Dialog open={!!expandedImage} onOpenChange={(open) => !open && handleCloseExpanded()}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] w-auto h-auto p-0 border-0 bg-transparent overflow-hidden">
          <VisuallyHidden.Root>
            <DialogTitle>{project.name} - Image Gallery</DialogTitle>
          </VisuallyHidden.Root>

          {/* Close button */}
          <button
            onClick={handleCloseExpanded}
            className={cn(
              "absolute right-4 top-4 z-50",
              "h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm",
              "flex items-center justify-center",
              "border border-border shadow-lg",
              "hover:bg-background active:scale-95 transition-all",
              "touch-manipulation"
            )}
            type="button"
            aria-label="Close expanded view"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="relative w-[90vw] max-w-7xl">
            <Carousel
              setApi={setExpandedApi}
              opts={{
                loop: true,
                startIndex: project.screenshots.indexOf(expandedImage || project.screenshots[0]),
              }}
              className="w-full"
            >
              <CarouselContent className="ml-0">
                {project.screenshots.map((screenshot, index) => (
                  <CarouselItem key={index} className="pl-0">
                    <div className="relative aspect-[16/9] w-full rounded-lg overflow-hidden bg-black/50">
                      <Image
                        src={screenshot}
                        alt={`${project.name} screenshot ${index + 1}`}
                        fill
                        className="object-contain"
                        draggable={false}
                        priority
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>

            {/* Expanded view navigation arrows */}
            {hasMultipleImages && (
              <>
                <button
                  onClick={expandedScrollPrev}
                  className={cn(
                    "absolute left-4 top-1/2 -translate-y-1/2 z-10",
                    "h-12 w-12 rounded-full bg-background/80 backdrop-blur-sm",
                    "flex items-center justify-center",
                    "border border-border shadow-lg",
                    "hover:bg-background active:scale-95 transition-all",
                    "touch-manipulation"
                  )}
                  type="button"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={expandedScrollNext}
                  className={cn(
                    "absolute right-4 top-1/2 -translate-y-1/2 z-10",
                    "h-12 w-12 rounded-full bg-background/80 backdrop-blur-sm",
                    "flex items-center justify-center",
                    "border border-border shadow-lg",
                    "hover:bg-background active:scale-95 transition-all",
                    "touch-manipulation"
                  )}
                  type="button"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>

                {/* Expanded view image indicators */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {project.screenshots.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => expandedApi?.scrollTo(index)}
                      className={cn(
                        "h-2.5 rounded-full transition-all touch-manipulation",
                        index === expandedCurrent
                          ? "w-8 bg-white"
                          : "w-2.5 bg-white/50 hover:bg-white/75 active:bg-white/90"
                      )}
                      type="button"
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Image counter */}
            <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-sm text-sm font-medium">
              {expandedCurrent + 1} / {project.screenshots.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
