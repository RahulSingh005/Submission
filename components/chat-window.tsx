"use client";

import type React from "react";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MoreHorizontal,
  Smile,
  Paperclip,
  Send,
  X,
  Bold,
  Italic,
  Code,
  Link,
  Hash,
} from "lucide-react";
import { MessageBubble } from "@/components/message-bubble";
import { TextEditor } from "@/components/text-editor";
import type { Conversation } from "@/app/page";

interface ChatWindowProps {
  conversation: Conversation;
  onSendMessage: (content: string) => void;
  onClose?: () => void;
}

export function ChatWindow({ conversation, onSendMessage, onClose }: ChatWindowProps) {
  const [message, setMessage] = useState("");
  const [showEditor, setShowEditor] = useState(false);
  const [editingText, setEditingText] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextEdit = (text: string) => {
    setEditingText(text);
    setShowEditor(true);
  };

  const handleEditorClose = () => {
    setShowEditor(false);
    setEditingText("");
  };

  const handleEditorApply = (newText: string) => {
    setMessage(newText);
    setShowEditor(false);
    setEditingText("");
  };

  // No-op handlers for icon buttons
  const handlePaperclip = () => {
    // TODO: Implement attachment logic
    // For now, just a placeholder
  };

  const handleEmoji = () => {
    // TODO: Implement emoji picker logic
    // For now, just a placeholder
  };

  const handleMore = () => {
    // TODO: Implement more menu logic
    // For now, just a placeholder
  };

  if (!conversation || !conversation.messages) {
    return (
      <div className="bg-white h-full w-full flex items-center justify-center">
        <p className="text-gray-500">No conversation selected</p>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col h-full w-full bg-[#F8F9FB]">
      {/* Subtle gradient */}
      <div
        className="pointer-events-none absolute bottom-0 right-0 w-2/3 h-1/3 bg-gradient-to-tl from-[#f8e7fa] via-[#e7f0fa] to-transparent opacity-80"
        style={{ filter: "blur(16px) saturate(1.5)" }}
      />
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Avatar className="w-9 h-9">
            <AvatarFallback className="bg-purple-100 text-purple-700 text-sm font-medium">
              {conversation.avatar}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-gray-900 text-base">{conversation.name}</h3>
            {conversation.status && (
              <span className="ml-1 text-xs text-gray-400">{conversation.status}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-gray-100"
            type="button"
            aria-label="More actions"
            onClick={handleMore}
          >
            <MoreHorizontal className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-gray-100"
            onClick={onClose}
            aria-label="Close"
            type="button"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6">
        {conversation.messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            onTextEdit={handleTextEdit}
          />
        ))}
      </div>
      {/* Input */}
      <div className="relative z-10 px-6 pb-6 pt-2 bg-transparent">
        <div className="flex items-center gap-2 bg-white rounded-full shadow-md border border-gray-100 px-4 py-2">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 bg-transparent border-0 focus:ring-0 resize-none text-base text-gray-900 placeholder:text-gray-400 leading-normal py-2"
            rows={1}
            style={{ minHeight: 40, maxHeight: 120 }}
          />
          <Button
            variant="ghost"
            size="icon"
            className="p-1 h-8 w-8 text-gray-500"
            type="button"
            aria-label="Attach file"
            onClick={handlePaperclip}
          >
            <Paperclip className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="p-1 h-8 w-8 text-gray-500"
            type="button"
            aria-label="Insert emoji"
            onClick={handleEmoji}
          >
            <Smile className="w-4 h-4" />
          </Button>
          <Button
            onClick={handleSend}
            size="icon"
            className="ml-1 h-9 w-9 rounded-full bg-blue-600 hover:bg-blue-700 shadow transition disabled:bg-blue-200"
            disabled={!message.trim()}
            type="button"
            aria-label="Send message"
          >
            <Send className="w-5 h-5 text-white" />
          </Button>
        </div>
      </div>
      {showEditor && (
        <TextEditor
          text={editingText}
          onClose={handleEditorClose}
          onApply={handleEditorApply}
        />
      )}
    </div>
  );
}
