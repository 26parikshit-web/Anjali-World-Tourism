"use client";

import { Plane } from "lucide-react";
import { EnquiryChatbot } from "./enquiry-chatbot";
import { useChatbot } from "@/contexts/chatbot-context";

export function EnquiryButton() {
  const { isOpen, openChatbot, closeChatbot } = useChatbot();

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={openChatbot}
        className="fixed bottom-6 right-6 z-40 group"
        aria-label="Open enquiry chat"
      >
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-2xl bg-zinc-900 blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
        
        {/* Button */}
        <div className="relative p-4 rounded-2xl bg-zinc-900 text-white shadow-2xl hover:bg-zinc-800 hover:scale-105 active:scale-95 transition-all duration-300 border border-zinc-800">
          <Plane className="w-6 h-6" />
          
          {/* Online indicator */}
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white shadow-sm">
            <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
          </span>
        </div>
        
        {/* Tooltip */}
        <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-4 py-2.5 bg-zinc-900 text-white text-sm font-medium rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl pointer-events-none border border-zinc-800">
          Plan your trip ✈️
          <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rotate-45 w-2.5 h-2.5 bg-zinc-900 border-r border-t border-zinc-800" />
        </span>
      </button>

      {/* Chatbot Modal */}
      <EnquiryChatbot isOpen={isOpen} onClose={closeChatbot} />
    </>
  );
}
