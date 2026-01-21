"use client";

import React, { useRef, useState, useMemo, useCallback } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { ArrowDown, ArrowUp, Paperclip, Plus } from "lucide-react";
import { StickToBottom, useStickToBottomContext } from "use-stick-to-bottom";
import { ChatMessage } from "./ui/chat-message";
import { WelcomeMessage } from "./ui/welcome-message";
import { projects, type Project } from "@/mastra/context/projects";
import { cn } from "@/lib/utils";

// Helper to find a project from a "Tell me more about X" message
function findProjectFromMessage(message: string): Project | null {
  const lowerMessage = message.toLowerCase();
  for (const project of projects) {
    if (lowerMessage.includes(project.name.toLowerCase())) {
      return project;
    }
  }
  return null;
}

// Generate a unique ID for thread identification
function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// Get or create a persistent thread ID from localStorage
function getThreadId() {
  if (typeof window === "undefined") return generateId();

  const stored = localStorage.getItem("chat-thread-id");
  if (stored) return stored;

  const newId = generateId();
  localStorage.setItem("chat-thread-id", newId);
  return newId;
}

// Scroll to bottom button
function ScrollToBottomButton() {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext();

  const handleClick = useCallback(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  if (isAtBottom) return null;

  return (
    <button
      onClick={handleClick}
      className={cn(
        "absolute bottom-36 left-1/2 -translate-x-1/2 z-20",
        "flex items-center justify-center",
        "h-8 w-8 rounded-full",
        "bg-background border border-border shadow-md",
        "hover:bg-muted transition-colors"
      )}
      type="button"
    >
      <ArrowDown className="h-4 w-4" />
    </button>
  );
}

// Suggestions component
const suggestions = [
  "What technologies do you work with?",
  "Tell me about your process",
  "How can we work together?",
];

function Suggestions({ onSuggestionClick }: { onSuggestionClick: (s: string) => void }) {
  return (
    <div className="w-full overflow-x-auto">
      <div className="flex flex-nowrap gap-2 pb-3">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => onSuggestionClick(suggestion)}
            className={cn(
              "shrink-0 px-4 py-2 text-sm rounded-full",
              "border border-border bg-background",
              "hover:bg-muted transition-colors",
              "cursor-pointer whitespace-nowrap"
            )}
            type="button"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}

// Custom loader matching reference
function Loader() {
  return (
    <div className="inline-flex animate-spin items-center justify-center">
      <svg
        height={16}
        strokeLinejoin="round"
        style={{ color: "currentcolor" }}
        viewBox="0 0 16 16"
        width={16}
      >
        <title>Loading</title>
        <g clipPath="url(#clip0_loader)">
          <path d="M8 0V4" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8 16V12" opacity="0.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M3.29773 1.52783L5.64887 4.7639" opacity="0.9" stroke="currentColor" strokeWidth="1.5" />
          <path d="M12.7023 1.52783L10.3511 4.7639" opacity="0.1" stroke="currentColor" strokeWidth="1.5" />
          <path d="M12.7023 14.472L10.3511 11.236" opacity="0.4" stroke="currentColor" strokeWidth="1.5" />
          <path d="M3.29773 14.472L5.64887 11.236" opacity="0.6" stroke="currentColor" strokeWidth="1.5" />
          <path d="M15.6085 5.52783L11.8043 6.7639" opacity="0.2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M0.391602 10.472L4.19583 9.23598" opacity="0.7" stroke="currentColor" strokeWidth="1.5" />
          <path d="M15.6085 10.4722L11.8043 9.2361" opacity="0.3" stroke="currentColor" strokeWidth="1.5" />
          <path d="M0.391602 5.52783L4.19583 6.7639" opacity="0.8" stroke="currentColor" strokeWidth="1.5" />
        </g>
        <defs>
          <clipPath id="clip0_loader">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

export function Chat() {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [input, setInput] = useState("");

  // Get persistent thread ID for conversation continuity
  const threadId = useMemo(() => getThreadId(), []);
  const resourceId = "visitor";

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: { threadId, resourceId },
      }),
    [threadId]
  );

  const { messages, sendMessage, status } = useChat({
    transport,
  });

  const isLoading = status === "streaming" || status === "submitted";

  // Handle "Learn More" click from project cards
  const handleLearnMore = async (project: Project) => {
    if (isLoading) return;
    await sendMessage({ text: `Tell me more about ${project.name}` });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const message = input.trim();
    setInput("");
    await sendMessage({ text: message });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e);
    }
  };

  const handleSuggestionClick = async (suggestion: string) => {
    if (isLoading) return;
    await sendMessage({ text: suggestion });
  };

  return (
    <div className="relative w-full h-full">
      {/* Conversation Area - full width/height with scrolling */}
      <StickToBottom
        className="absolute inset-0 overflow-y-auto"
        initial="smooth"
        resize="smooth"
      >
        <StickToBottom.Content className="max-w-4xl mx-auto p-4 pb-40">
          {/* Welcome message with project cards - always visible */}
          <WelcomeMessage onLearnMore={handleLearnMore} />

          {/* Conversation messages */}
          {messages.map((message, index) => {
            const content = message.parts
              ?.filter((part) => part.type === "text")
              .map((part) => (part as { type: "text"; text: string }).text)
              .join("") || "";

            // For assistant messages, check if the previous user message was about a project
            let relatedProject: Project | null = null;
            if (message.role === "assistant" && index > 0) {
              const prevMessage = messages[index - 1];
              if (prevMessage?.role === "user") {
                const prevContent = prevMessage.parts
                  ?.filter((part) => part.type === "text")
                  .map((part) => (part as { type: "text"; text: string }).text)
                  .join("") || "";
                relatedProject = findProjectFromMessage(prevContent);
              }
            }

            return (
              <ChatMessage
                key={message.id}
                role={message.role as "user" | "assistant"}
                content={content}
                project={relatedProject}
              />
            );
          })}

          {/* Loading state - show during submitted or streaming with no visible content */}
          {(status === "submitted" || (status === "streaming" && messages.length > 0 &&
            !messages[messages.length - 1]?.parts?.some(
              (part) => part.type === "text" && (part as { type: "text"; text: string }).text?.length > 0
            ))) && (
            <div className="flex items-center gap-2 py-4 text-muted-foreground">
              <Loader />
            </div>
          )}
        </StickToBottom.Content>
        <ScrollToBottomButton />
      </StickToBottom>

      {/* Fixed bottom input area */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background to-transparent pt-8 pb-4 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Suggestions - show only when no conversation yet */}
          {messages.length === 0 && (
            <Suggestions onSuggestionClick={handleSuggestionClick} />
          )}

          {/* Prompt Input */}
          <form onSubmit={onSubmit}>
            <div
              className={cn(
                "rounded-2xl border border-input bg-background",
                "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
                "transition-shadow overflow-hidden"
              )}
            >
              {/* Input body */}
              <div className="px-4 pt-3">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything..."
                  disabled={isLoading}
                  rows={1}
                  className={cn(
                    "w-full resize-none bg-transparent text-sm",
                    "placeholder:text-muted-foreground",
                    "focus:outline-none",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    "min-h-[24px] max-h-[200px]"
                  )}
                />
              </div>

              {/* Input footer */}
              <div className="flex items-center justify-between px-3 py-2">
                {/* Left side tools */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    className={cn(
                      "flex items-center justify-center",
                      "h-8 w-8 rounded-lg",
                      "text-muted-foreground hover:text-foreground",
                      "hover:bg-muted transition-colors"
                    )}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className={cn(
                      "flex items-center justify-center",
                      "h-8 w-8 rounded-lg",
                      "text-muted-foreground hover:text-foreground",
                      "hover:bg-muted transition-colors"
                    )}
                  >
                    <Paperclip className="h-4 w-4" />
                  </button>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading || !input?.trim()}
                  className={cn(
                    "flex items-center justify-center",
                    "h-8 w-8 rounded-lg",
                    "bg-primary text-primary-foreground",
                    "hover:bg-primary/90",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    "transition-colors"
                  )}
                >
                  {isLoading ? (
                    <Loader />
                  ) : (
                    <ArrowUp className="h-4 w-4" />
                  )}
                  <span className="sr-only">Send message</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
