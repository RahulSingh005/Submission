"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Wand2 } from "lucide-react";

interface TextEditorProps {
  text: string;
  onClose: () => void;
  onApply: (newText: string) => void;
}

export function TextEditor({ text, onClose, onApply }: TextEditorProps) {
  const [editedText, setEditedText] = useState(text);
  const [isProcessing, setIsProcessing] = useState(false);

  const rephraseOptions = [
    "My tone of voice",
    "More friendly",
    "More formal",
    "Fix grammar & spelling",
    "Translate...",
  ];

  const handleRephrase = async (option: string) => {
    setIsProcessing(true);
    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    let newText = editedText;
    switch (option) {
      case "More friendly":
        newText = editedText.replace(/\./g, "! 😊");
        break;
      case "More formal":
        newText = editedText.replace(/!/g, ".").replace(/😊/g, "");
        break;
      case "Fix grammar & spelling":
        newText = editedText.charAt(0).toUpperCase() + editedText.slice(1);
        break;
      default:
        newText = editedText;
    }
    
    setEditedText(newText);
    setIsProcessing(false);
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <div className="flex items-center gap-3">
          <Wand2 className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Edit Message</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          aria-label="Close editor"
        >
          <X className="w-5 h-5 text-gray-500" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Rephrase Options */}
        <div className="w-64 border-r p-4 space-y-2 bg-gray-50">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Rephrase Options</h4>
          {rephraseOptions.map((option) => (
            <Button
              key={option}
              variant="ghost"
              size="sm"
              onClick={() => handleRephrase(option)}
              className="w-full justify-start text-gray-700 hover:bg-gray-100 rounded-lg px-3 py-2 text-sm"
              disabled={isProcessing}
            >
              {option}
            </Button>
          ))}
        </div>

        {/* Text Editor */}
        <div className="flex-1 flex flex-col">
          <textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className="flex-1 p-6 text-base text-gray-900 resize-none focus:outline-none"
            placeholder="Start typing your message..."
            disabled={isProcessing}
          />
        </div>
      </div>

      {/* Footer Actions */}
      <div className="border-t px-6 py-4 flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={onClose}
          className="px-6"
          disabled={isProcessing}
        >
          Cancel
        </Button>
        <Button
          onClick={() => onApply(editedText)}
          className="px-6 bg-blue-600 hover:bg-blue-700"
          disabled={isProcessing}
        >
          {isProcessing ? "Applying..." : "Apply Changes"}
        </Button>
      </div>
    </div>
  );
}
