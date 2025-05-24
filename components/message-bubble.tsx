"use client";

import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AskCopilotModal } from "@/components/ask-copilot-modal";
import { ClientOnly } from "@/components/client-only";
import { Pencil } from "lucide-react";
import type { Message } from "@/app/page";

interface MessageBubbleProps {
  message: Message;
  onTextEdit: (text: string) => void;
}

export function MessageBubble({ message, onTextEdit }: MessageBubbleProps) {
  const [showAskCopilot, setShowAskCopilot] = useState(false);

  if (!message) return null;

  const isAgent = message.sender === "agent";
  const isCustomer = message.sender === "customer";

  // For accessibility: allow keyboard open for copilot modal
  const handleMessageClick = () => {
    if (isCustomer) setShowAskCopilot(true);
  };

  // Support editing agent messages
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onTextEdit(message.content || "");
  };

  return (
    <>
      <div
        className={`flex items-end gap-2 mb-2 ${
          isAgent ? "justify-end" : "justify-start"
        }`}
      >
        {/* Avatar left for customer, right for agent */}
        {isCustomer && (
          <Avatar className="w-8 h-8 flex-shrink-0 shadow">
            <AvatarFallback className="bg-purple-100 text-purple-700 text-sm font-medium">
              {message.avatar || "U"}
            </AvatarFallback>
          </Avatar>
        )}

        {/* Bubble */}
        <div
          tabIndex={isCustomer ? 0 : -1}
          aria-label={
            isCustomer
              ? "Customer message, click or press enter for Copilot"
              : "Agent message"
          }
          onClick={handleMessageClick}
          onKeyDown={e => {
            if (isCustomer && (e.key === "Enter" || e.key === " ")) {
              handleMessageClick();
            }
          }}
          className={`
            group
            relative
            max-w-md
            px-4 py-3
            rounded-2xl
            shadow-md
            cursor-pointer
            transition-all
            focus:outline-none
            ${isAgent
              ? "bg-gradient-to-br from-blue-100 to-blue-200 text-blue-900 border border-blue-100"
              : "bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900 border border-gray-200 hover:bg-gray-200"}
            ${isCustomer ? "hover:ring-2 hover:ring-purple-200" : ""}
          `}
        >
          <p className="text-sm whitespace-pre-line">{message.content || ""}</p>

          <div className="flex items-center justify-between mt-2">
            <ClientOnly
              fallback={<span className="text-xs text-gray-400">Loading...</span>}
            >
              <span
                className={`text-xs ${
                  isAgent ? "text-blue-700" : "text-gray-500"
                }`}
              >
                {message.time || ""}
              </span>
            </ClientOnly>
            {isAgent && (
              <span className="flex items-center gap-1">
                <span className="text-xs text-blue-700">Seen</span>
                <button
                  className="ml-2 p-1 rounded hover:bg-blue-100 transition"
                  aria-label="Edit message"
                  tabIndex={0}
                  onClick={handleEditClick}
                >
                  <Pencil className="w-4 h-4 text-blue-500" />
                </button>
              </span>
            )}
          </div>

          {/* Copilot hint for customer */}
          {isCustomer && (
            <span className="absolute -bottom-6 left-2 text-xs text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
              Ask Copilot about this message
            </span>
          )}
        </div>

        {isAgent && (
          <Avatar className="w-8 h-8 flex-shrink-0 shadow">
            <AvatarFallback className="bg-blue-100 text-blue-700 text-sm font-medium">
              {message.avatar || "A"}
            </AvatarFallback>
          </Avatar>
        )}
      </div>

      {showAskCopilot && (
        <AskCopilotModal
          message={message}
          onClose={() => setShowAskCopilot(false)}
        />
      )}
    </>
  );
}
