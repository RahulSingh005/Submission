"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronDown, User } from "lucide-react";
import type { Conversation } from "@/app/page";

interface InboxSidebarProps {
  conversations: Conversation[];
  selectedConversation: Conversation;
  onConversationSelect: (conversation: Conversation) => void;
}

export function InboxSidebar({
  conversations,
  selectedConversation,
  onConversationSelect,
}: InboxSidebarProps) {
  return (
    <div className="relative flex flex-col h-full w-full bg-white border-r border-gray-100">
      {/* Subtle blue gradient at the bottom */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-1/5 bg-gradient-to-t from-blue-100 to-transparent opacity-70"
        style={{ filter: "blur(12px)" }}
      />

      {/* Header */}
      <div className="p-5 border-b border-gray-100 bg-white z-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Your inbox</h2>
          <Avatar className="w-9 h-9">
            <AvatarFallback className="bg-gray-100 text-gray-500">
              <User className="w-5 h-5" />
            </AvatarFallback>
          </Avatar>
        </div>
        {/* Filters */}
        <div className="flex gap-2 mb-1">
          <button
            className="flex items-center px-4 py-1 rounded-full text-xs font-semibold bg-blue-600 text-white shadow-none focus:outline-none"
            tabIndex={0}
          >
            5 Open
            <ChevronDown className="w-3 h-3 ml-1" />
          </button>
          <button
            className="flex items-center px-4 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 shadow-none focus:outline-none"
            tabIndex={0}
          >
            Waiting longest
            <ChevronDown className="w-3 h-3 ml-1" />
          </button>
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
        {conversations.map((conversation) => {
          const isSelected = conversation.id === selectedConversation.id;
          return (
            <button
              key={conversation.id}
              onClick={() => onConversationSelect(conversation)}
              className={`
                group w-full flex items-start gap-3 rounded-xl transition
                px-3 py-3
                ${
                  isSelected
                    ? "bg-blue-50 border-l-4 border-blue-600 shadow"
                    : "hover:bg-gray-50"
                }
                focus:outline-none
              `}
              tabIndex={0}
              aria-current={isSelected ? "true" : undefined}
            >
              <Avatar className="w-10 h-10 flex-shrink-0 mt-1">
                <AvatarFallback className="bg-purple-100 text-purple-700 text-xs font-medium">
                  {conversation.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-900 truncate">
                    {conversation.name}
                  </span>
                  <span className="text-xs text-gray-400 ml-2 whitespace-nowrap">
                    {conversation.time}
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-1 mb-0.5">
                  {conversation.unread && (
                    <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-1" />
                  )}
                  <span className="text-xs text-gray-600 truncate max-w-[120px]">
                    {conversation.subject}
                  </span>
                </div>
                {conversation.status && (
                  <div className="flex items-center gap-1 mt-1">
                    <span
                      className={`w-2 h-2 rounded-full inline-block ${conversation.statusColor}`}
                    ></span>
                    <span className="text-xs text-gray-500">{conversation.status}</span>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
