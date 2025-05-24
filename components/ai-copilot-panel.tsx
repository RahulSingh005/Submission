"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Bot, ArrowRight, Copy, ChevronDown, X } from "lucide-react";
import type { Conversation } from "@/app/page";

interface AICopilotPanelProps {
  conversation: Conversation;
  onClose?: () => void;
}

interface AIResponse {
  id: string;
  question: string;
  answer: string;
  sources: string[];
  isGenerating: boolean;
}

export function AICopilotPanel({ conversation, onClose }: AICopilotPanelProps) {
  const [activeTab, setActiveTab] = useState<"copilot" | "details">("copilot");
  const [question, setQuestion] = useState("");
  const [responses, setResponses] = useState<AIResponse[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const suggestedPrompts = [
    "How do I get a refund?",
    "What's your return policy?",
    "How can I track my order?",
    "Do you offer international shipping?",
  ];

  const relevantSources = [
    "Getting a refund",
    "Refund for an order placed by mistake",
    "Refund for an unwanted gift",
    "Return policy guidelines",
    "Order tracking information",
  ];

  const simulateAIResponse = async (userQuestion: string): Promise<string> => {
    const responses = {
      "How do I get a refund?":
        "We understand that sometimes a purchase may not meet your expectations, and you may need to request a refund.\n\nTo assist you with your refund request, could you please provide your order ID and proof of purchase.",
      "What if the order was over 60 days ago?":
        "I understand your concern about the 60-day policy. While our standard policy is 60 days, we do review exceptions on a case-by-case basis. Let me check what options might be available for your specific situation.",
      default:
        "I'd be happy to help you with that question. Let me gather some relevant information for you.",
    };

    const response =
      responses[userQuestion as keyof typeof responses] || responses.default;

    return new Promise((resolve) => {
      setTimeout(() => resolve(response), 1500);
    });
  };

  const handleSubmit = async (questionText: string) => {
    if (!questionText.trim()) return;

    const newResponse: AIResponse = {
      id: `response-${responses.length + 1}`,
      question: questionText,
      answer: "",
      sources: relevantSources.slice(0, 3),
      isGenerating: true,
    };

    setResponses((prev) => [...prev, newResponse]);
    setIsGenerating(true);
    setQuestion("");

    try {
      const answer = await simulateAIResponse(questionText);

      setResponses((prev) =>
        prev.map((r) =>
          r.id === newResponse.id ? { ...r, answer, isGenerating: false } : r
        )
      );
    } catch (error) {
      console.error("Error generating response:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(question);
  };

  const handleSuggestedPrompt = (prompt: string) => {
    handleSubmit(prompt);
  };

  return (
    <div className="relative h-full w-full flex flex-col items-stretch bg-[#F8F9FB] rounded-2xl shadow-lg overflow-hidden font-sans">
      {/* Header with Tabs and Close Button */}
      <div className="flex items-center justify-between px-6 pt-6 pb-2 bg-white border-b border-gray-100">
        <div className="flex space-x-8">
          <button
            className={`pb-2 text-base font-medium transition-all ${
              activeTab === "copilot"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-400 border-b-2 border-transparent hover:text-blue-500"
            }`}
            onClick={() => setActiveTab("copilot")}
          >
            AI Copilot
          </button>
          <button
            className={`pb-2 text-base font-medium transition-all ${
              activeTab === "details"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-400 border-b-2 border-transparent hover:text-blue-500"
            }`}
            onClick={() => setActiveTab("details")}
          >
            Details
          </button>
        </div>
        {typeof onClose === "function" && (
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-blue-50 transition"
            aria-label="Close AI Copilot"
          >
            <X className="w-5 h-5 text-blue-400" />
          </button>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center items-center bg-gradient-to-br from-white via-white to-[#F4F6FF] relative overflow-y-auto">
        {activeTab === "copilot" ? (
          <>
            {/* Welcome Section */}
            {responses.length === 0 && (
              <div className="flex flex-col items-center justify-center mt-16 w-full">
                <div className="mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-2xl">
                    <Bot className="w-7 h-7 text-gray-700" />
                  </div>
                </div>
                <h2 className="font-semibold text-gray-900 text-lg mb-1">
                  Hi, I’m Fin AI Copilot
                </h2>
                <p className="text-gray-500 text-sm mb-12 text-center">
                  Ask me anything about this conversation.
                </p>
              </div>
            )}

            {/* Suggested Prompt */}
            {responses.length === 0 && (
              <div className="absolute bottom-28 left-0 w-full flex justify-center pointer-events-none">
                <button
                  onClick={() => handleSuggestedPrompt("How do I get a refund?")}
                  className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm text-blue-600 text-sm font-medium hover:bg-blue-50 transition pointer-events-auto"
                  tabIndex={0}
                >
                  <span>💡</span>
                  How do I get a refund?
                </button>
              </div>
            )}

            {/* AI Responses */}
            {responses.length > 0 && (
              <div className="w-full max-w-lg mx-auto px-2 space-y-8 mb-6 mt-6">
                {responses.map((response) => (
                  <div key={response.id} className="space-y-4">
                    {/* User Question */}
                    <div className="flex justify-end">
                      <div className="bg-blue-100 text-blue-900 px-4 py-2 rounded-2xl rounded-br-md shadow-sm max-w-[70%]">
                        {response.question}
                      </div>
                    </div>
                    {/* AI Response */}
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center shadow mt-1">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-white border border-blue-100 px-4 py-3 rounded-2xl rounded-bl-md shadow max-w-[75%]">
                        {response.isGenerating ? (
                          <div className="flex items-center gap-2">
                            <span className="animate-spin inline-block w-4 h-4 border-2 border-blue-300 border-t-transparent rounded-full"></span>
                            <span className="text-sm text-blue-500">
                              Generating response...
                            </span>
                          </div>
                        ) : (
                          <p className="text-sm text-blue-900 whitespace-pre-line">
                            {response.answer}
                          </p>
                        )}
                        {!response.isGenerating && response.sources.length > 0 && (
                          <div className="mt-3">
                            <div className="flex flex-wrap gap-2">
                              {response.sources.map((source, index) => (
                                <span
                                  key={index}
                                  className="bg-blue-50 text-blue-500 px-3 py-1 rounded-full text-xs"
                                >
                                  {source}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="w-full max-w-lg mx-auto px-2 flex flex-col items-center justify-center h-full">
            <div className="bg-white rounded-2xl p-6 shadow border border-blue-100 w-full">
              <h4 className="font-semibold text-blue-900 mb-4 text-lg">
                Conversation Details
              </h4>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-blue-500">Customer:</span>
                  <span className="ml-2 text-blue-900">{conversation.name}</span>
                </div>
                <div>
                  <span className="text-blue-500">Status:</span>
                  <Badge
                    variant="outline"
                    className="ml-2 bg-green-50 text-green-700 border-green-200"
                  >
                    {conversation.status}
                  </Badge>
                </div>
                <div>
                  <span className="text-blue-500">Last activity:</span>
                  <span className="ml-2 text-blue-900">{conversation.time}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Bar */}
      {activeTab === "copilot" && (
        <div className="absolute bottom-0 left-0 w-full px-6 pb-6">
          <form
            onSubmit={handleQuestionSubmit}
            className="flex items-center bg-white rounded-full border border-gray-200 shadow-md px-4 py-2"
          >
            <Input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Type your message…"
              className="flex-1 border-0 bg-transparent focus:ring-0 text-gray-900 placeholder:text-gray-400"
              disabled={isGenerating}
            />
            <Button
              type="submit"
              size="icon"
              className="ml-2 h-9 w-9 rounded-full bg-blue-600 hover:bg-blue-700 shadow transition"
              disabled={isGenerating || !question.trim()}
            >
              <ArrowRight className="w-5 h-5 text-white" />
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
