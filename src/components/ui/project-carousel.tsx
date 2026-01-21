"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProjectCarouselProps {
  screenshots: string[];
  projectName: string;
}

export function ProjectCarousel({
  screenshots,
  projectName,
}: ProjectCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? screenshots.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) =>
      prev === screenshots.length - 1 ? 0 : prev + 1
    );
  };

  if (screenshots.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full">
      {/* Main image container */}
      <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-muted">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0"
          >
            <Image
              src={screenshots[currentIndex]}
              alt={`${projectName} screenshot ${currentIndex + 1}`}
              fill
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation arrows (only show if multiple screenshots) */}
        {screenshots.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className={cn(
                "absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full",
                "bg-background/80 backdrop-blur-sm border border-border",
                "hover:bg-background transition-colors",
                "opacity-0 group-hover:opacity-100 focus:opacity-100"
              )}
              aria-label="Previous screenshot"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={goToNext}
              className={cn(
                "absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full",
                "bg-background/80 backdrop-blur-sm border border-border",
                "hover:bg-background transition-colors",
                "opacity-0 group-hover:opacity-100 focus:opacity-100"
              )}
              aria-label="Next screenshot"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      {/* Dots indicator (only show if multiple screenshots) */}
      {screenshots.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-2">
          {screenshots.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "w-1.5 h-1.5 rounded-full transition-colors",
                index === currentIndex
                  ? "bg-primary"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              )}
              aria-label={`Go to screenshot ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
