"use client";

import { cn } from "@/lib/utils";
import { MessageSquare, Plus, Settings } from "lucide-react";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  return (
    <div
      className={cn(
        "flex h-full w-[260px] flex-col border-r border-border bg-muted/30",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <span className="font-semibold text-sm">clementine</span>
        <button
          className={cn(
            "flex items-center justify-center",
            "h-8 w-8 rounded-lg",
            "hover:bg-muted transition-colors"
          )}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Chat history */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {/* Active chat */}
          <button
            className={cn(
              "flex items-center gap-3 w-full px-3 py-2 rounded-lg",
              "bg-muted text-foreground text-sm text-left",
              "hover:bg-muted/80 transition-colors"
            )}
          >
            <MessageSquare className="h-4 w-4 shrink-0" />
            <span className="truncate">New conversation</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-border">
        <button
          className={cn(
            "flex items-center gap-3 w-full px-3 py-2 rounded-lg",
            "text-muted-foreground text-sm text-left",
            "hover:bg-muted hover:text-foreground transition-colors"
          )}
        >
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
}
