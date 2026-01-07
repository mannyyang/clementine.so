"use client";

import React, { useRef, useEffect, useState, useMemo } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { ChatMessage } from "./ui/chat-message";
import { cn } from "@/lib/utils";

export function Chat() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [input, setInput] = useState("");

  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/chat" }),
    []
  );

  const { messages, sendMessage, status, error } = useChat({
    transport,
  });

  const isLoading = status === "streaming" || status === "submitted";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  return (
    <div className="flex flex-col h-full w-full max-w-2xl mx-auto">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center p-8">
            <div className="text-center space-y-4">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-lg text-muted-foreground"
              >
                Ask me anything about my projects, skills, or how to get in
                touch.
              </motion.p>
            </div>
          </div>
        ) : (
          <div className="py-4 space-y-2">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                role={message.role as "user" | "assistant"}
                content={
                  message.parts
                    ?.filter((part) => part.type === "text")
                    .map((part) => (part as { type: "text"; text: string }).text)
                    .join("") || ""
                }
              />
            ))}
            {isLoading && (
              <div className="px-4 py-2">
                <motion.div
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-sm text-muted-foreground"
                >
                  Thinking...
                </motion.div>
              </div>
            )}
            {error && (
              <div className="px-4 py-2 text-sm text-destructive">
                Something went wrong. Please try again.
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area - Fixed at bottom */}
      <div className="flex-shrink-0 border-t border-border bg-background/80 backdrop-blur-sm p-4">
        <form onSubmit={onSubmit} className="relative">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Send a message..."
            disabled={isLoading}
            rows={1}
            className={cn(
              "w-full resize-none rounded-xl border border-input bg-background px-4 py-3 pr-12 text-sm",
              "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "min-h-[48px] max-h-[200px]"
            )}
          />
          <button
            type="submit"
            disabled={isLoading || !input?.trim()}
            className={cn(
              "absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg",
              "text-muted-foreground hover:text-foreground hover:bg-muted",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "transition-colors"
            )}
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </button>
        </form>
      </div>
    </div>
  );
}
