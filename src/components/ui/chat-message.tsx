"use client";

import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import { ProjectDetailCard } from "./project-detail-card";
import type { Project } from "@/mastra/context/projects";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  project?: Project | null;
}

export function ChatMessage({ role, content, project }: ChatMessageProps) {
  const isUser = role === "user";

  // If this is an assistant message about a project, render rich card
  if (!isUser && project && content) {
    return <ProjectDetailCard project={project} description={content} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "group flex w-full items-end gap-2 py-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "flex flex-col gap-2 overflow-hidden rounded-2xl text-lg",
          isUser
            ? "max-w-[80%] bg-primary text-primary-foreground px-4 py-3"
            : "text-foreground max-w-[90%]"
        )}
      >
        {isUser ? (
          <div className="whitespace-pre-wrap leading-relaxed">{content}</div>
        ) : (
          <div className="prose prose-lg dark:prose-invert max-w-none leading-relaxed prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-0 prose-headings:mt-4 prose-headings:mb-2 prose-strong:font-semibold prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        )}
      </div>
    </motion.div>
  );
}
