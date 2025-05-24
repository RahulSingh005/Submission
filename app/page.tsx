"use client";

import { useState } from "react";
import { InboxSidebar } from "@/components/inbox-sidebar";
import { ChatWindow } from "@/components/chat-window";
import { AICopilotPanel } from "@/components/ai-copilot-panel";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * @interface Conversation
 * @description
 */
export interface Conversation {
  id: number;
  name: string;
  avatar: string;
  subject: string;
  status: string;
  statusColor: string;
  time: string;
  unread: boolean;
  messages: Message[];
}

/**
 * @interface Message
 * @description Defines the structure of a message within a conversation.
 */
export interface Message {
  id: number;
  sender: "customer" | "agent";
  content: string;
  time: string;
  avatar: string;
}

/**
 * @constant conversationsData
 * @description Sample organization-related conversation data
 */
const conversationsData: Conversation[] = [
  {
    id: 1,
    name: "Emily Zhang",
    avatar: "EZ",
    subject: "Requesting refund for unopened product",
    status: "Open",
    statusColor: "bg-green-500",
    time: "2m",
    unread: true,
    messages: [
      {
        id: 1,
        sender: "customer",
        content:
          "Hello, I purchased a Bluetooth speaker from your store last month as a gift, but the recipient already has a similar one. It's unopened. Could I get a refund?",
        time: "2:45 PM",
        avatar: "EZ",
      },
      {
        id: 2,
        sender: "agent",
        content:
          "Hi Emily, thank you for reaching out to Acme Corp support. Let me check your order details. Could you please provide your order number?",
        time: "2:46 PM",
        avatar: "A",
      },
      {
        id: 3,
        sender: "customer",
        content: "Sure, the order number is #AC12345.",
        time: "2:46 PM",
        avatar: "EZ",
      },
      {
        id: 4,
        sender: "agent",
        content:
          "Thank you! I see your order was placed 40 days ago and is eligible for a refund as long as the product is unopened. I’ll email you a return label shortly.",
        time: "2:47 PM",
        avatar: "A",
      },
      {
        id: 5,
        sender: "customer",
        content: "Perfect, thank you for your help!",
        time: "2:48 PM",
        avatar: "EZ",
      },
    ],
  },
  {
    id: 2,
    name: "Rajat Verma",
    avatar: "RV",
    subject: "Product defect: screen flickering",
    status: "Waiting request",
    statusColor: "bg-yellow-500",
    time: "8m",
    unread: false,
    messages: [
      {
        id: 1,
        sender: "customer",
        content:
          "Hi, I recently bought a SmartTab Pro from your website and the screen keeps flickering. Can you help?",
        time: "3:10 PM",
        avatar: "RV",
      },
      {
        id: 2,
        sender: "agent",
        content:
          "Hello Rajat, I’m sorry to hear about the issue. Could you share your order number or product serial number?",
        time: "3:11 PM",
        avatar: "A",
      },
      {
        id: 3,
        sender: "customer",
        content: "Yes, the serial number is STP-998877.",
        time: "3:12 PM",
        avatar: "RV",
      },
      {
        id: 4,
        sender: "agent",
        content:
          "Thank you. Since your device is under warranty, we can arrange a replacement or repair. Which would you prefer?",
        time: "3:13 PM",
        avatar: "A",
      },
      {
        id: 5,
        sender: "customer",
        content: "I’d like a replacement, please.",
        time: "3:14 PM",
        avatar: "RV",
      },
      {
        id: 6,
        sender: "agent",
        content:
          "No problem, Rajat. I’ll initiate the replacement and send you a prepaid shipping label for the return.",
        time: "3:15 PM",
        avatar: "A",
      },
    ],
  },
  {
    id: 3,
    name: "Corporate Lead: FinEdge Ltd.",
    avatar: "FL",
    subject: "Request for enterprise pricing details",
    status: "",
    statusColor: "",
    time: "1h",
    unread: true,
    messages: [
      {
        id: 1,
        sender: "customer",
        content:
          "Good afternoon, we’re evaluating your platform for our team at FinEdge Ltd. Could you share your enterprise pricing and feature details?",
        time: "1:30 PM",
        avatar: "FL",
      },
      {
        id: 2,
        sender: "agent",
        content:
          "Hello! Thank you for your interest in Acme Corp. I’ll send you a detailed proposal and can arrange a call to discuss your requirements in depth.",
        time: "1:32 PM",
        avatar: "A",
      },
    ],
  },
];

export default function Home() {
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation>(conversationsData[0]);
  const [conversations, setConversations] =
    useState<Conversation[]>(conversationsData);
  const [showInbox, setShowInbox] = useState(false);
  const [showAICopilot, setShowAICopilot] = useState(false);
  const isMobile = useIsMobile();

  const handleConversationSelect = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: selectedConversation.messages.length + 1,
      sender: "agent",
      content,
      time: formatTimeClient(),
      avatar: "A",
    };

    function formatTimeClient() {
      return typeof window === "undefined"
        ? "00:00"
        : new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
    }

    const updatedConversations = conversations.map((conv) =>
      conv.id === selectedConversation.id
        ? { ...conv, messages: [...conv.messages, newMessage] }
        : conv
    );

    setConversations(updatedConversations);
    setSelectedConversation((prev) => ({
      ...prev,
      messages: [...prev.messages, newMessage],
    }));
  };

  return (
    <div className="h-full w-full bg-gradient-to-br from-purple-100 via-purple-50 to-blue-50">
      <div className="flex h-full w-full relative">
        {isMobile && (
          <Button
            variant="ghost"
            className="absolute top-2 left-2 z-50 bg-white/80 backdrop-blur-sm shadow-sm"
            onClick={() => setShowInbox(!showInbox)}
            aria-label="Toggle inbox sidebar"
          >
            <Menu className="w-5 h-5" />
          </Button>
        )}

        <div
          className={`${
            isMobile
              ? showInbox
                ? "block fixed inset-0 z-40 w-[85%] max-w-[300px]"
                : "hidden"
              : "w-1/4 flex-shrink-0"
          }`}
        >
          <InboxSidebar
            conversations={conversations}
            selectedConversation={selectedConversation}
            onConversationSelect={(conversation) => {
              handleConversationSelect(conversation);
              if (isMobile) setShowInbox(false);
            }}
          />
        </div>

        {isMobile && showInbox && (
          <div
            className="fixed inset-0 bg-black/30 z-30"
            onClick={() => setShowInbox(false)}
            aria-label="Close sidebar"
          ></div>
        )}

        <div className={`${isMobile ? "w-full" : "w-2/4"} relative`}>
          <ChatWindow
            conversation={selectedConversation}
            onSendMessage={handleSendMessage}
          />
        </div>

        <div
          className={`${
            isMobile
              ? showAICopilot
                ? "block fixed inset-0 z-40 w-[85%] max-w-[300px] right-0 left-auto"
                : "hidden"
              : "w-1/4 flex-shrink-0"
          }`}
        >
          <AICopilotPanel
            conversation={selectedConversation}
            onClose={isMobile ? () => setShowAICopilot(false) : undefined}
          />
        </div>

        {isMobile && showAICopilot && (
          <div
            className="fixed inset-0 bg-black/30 z-30"
            onClick={() => setShowAICopilot(false)}
            aria-label="Close AI copilot"
          ></div>
        )}

        {isMobile && !showAICopilot && (
          <Button
            className="fixed bottom-4 right-4 w-12 h-12 rounded-full bg-black shadow-md z-20 flex items-center justify-center"
            onClick={() => setShowAICopilot(true)}
            aria-label="Open AI copilot"
          >
            <Bot className="w-6 h-6 text-white" />
          </Button>
        )}
      </div>
    </div>
  );
}
