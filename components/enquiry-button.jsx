"use client";

import { MessageCircle } from "lucide-react";
import { EnquiryChatbot } from "./enquiry-chatbot";
import { useChatbot } from "@/contexts/chatbot-context";

export function EnquiryButton() {
  const { isOpen, openChatbot, closeChatbot } = useChatbot();

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={openChatbot}
        className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white shadow-2xl hover:scale-110 transition-all duration-300 group"
        aria-label="Open enquiry chat"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
        
        {/* Tooltip */}
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-2 bg-zinc-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Plan your trip 🌍
        </span>
      </button>

      {/* Chatbot Modal */}
      <EnquiryChatbot isOpen={isOpen} onClose={closeChatbot} />
    </>
  );
}
