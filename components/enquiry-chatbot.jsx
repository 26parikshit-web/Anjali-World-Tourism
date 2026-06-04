"use client";

import { useState, useEffect, useRef } from "react";
import { X, Send, Calendar, User, Mail, Phone, Users, MapPin, DollarSign } from "lucide-react";

const questions = [
  {
    id: "name",
    question: "Hi! 👋 I'm here to help you plan your perfect trip. What's your name?",
    placeholder: "Enter your name",
    type: "text",
    icon: User,
  },
  {
    id: "email",
    question: "Great to meet you, {name}! 📧 What's your email address?",
    placeholder: "your@email.com",
    type: "email",
    icon: Mail,
  },
  {
    id: "phone",
    question: "Perfect! 📱 What's your phone number?",
    placeholder: "+91 XXXXXXXXXX",
    type: "tel",
    icon: Phone,
  },
  {
    id: "passengers",
    question: "How many people will be traveling? 👥",
    placeholder: "Number of passengers",
    type: "number",
    icon: Users,
  },
  {
    id: "duration",
    question: "When are you planning to travel? 📅",
    placeholder: "Select dates",
    type: "date",
    icon: Calendar,
  },
  {
    id: "place",
    question: "Which destination are you interested in? 🗺️",
    placeholder: "e.g., Kashmir, Goa, Dubai",
    type: "text",
    icon: MapPin,
  },
  {
    id: "budget",
    question: "What's your approximate budget per person? 💰",
    placeholder: "e.g., ₹25,000",
    type: "text",
    icon: DollarSign,
  },
];

export function EnquiryChatbot({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showEnquiry, setShowEnquiry] = useState(false);
  const [enquirySent, setEnquirySent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Initial greeting
      setTimeout(() => {
        addBotMessage(questions[0].question);
      }, 500);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && !isTyping && !showEnquiry) {
      inputRef.current?.focus();
    }
  }, [isOpen, isTyping, showEnquiry, currentStep]);

  const addBotMessage = (text) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { type: "bot", text }]);
      setIsTyping(false);
    }, 800);
  };

  const addUserMessage = (text) => {
    setMessages((prev) => [...prev, { type: "user", text }]);
  };

  const formatQuestion = (question) => {
    return question.replace("{name}", formData.name || "there");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const currentQuestion = questions[currentStep];
    const value = inputValue.trim();

    // Add user message
    addUserMessage(value);

    // Save data
    setFormData((prev) => ({ ...prev, [currentQuestion.id]: value }));

    // Clear input
    setInputValue("");

    // Move to next question or show enquiry
    if (currentStep < questions.length - 1) {
      setTimeout(() => {
        const nextQuestion = questions[currentStep + 1];
        addBotMessage(formatQuestion(nextQuestion.question));
        setCurrentStep(currentStep + 1);
      }, 1000);
    } else {
      // All questions answered - automatically send enquiry
      setTimeout(() => {
        addBotMessage(
          "Thank you for providing all the details! 🎉 Let me submit your enquiry..."
        );
        setShowEnquiry(true);
        // Automatically send the enquiry
        setTimeout(() => {
          sendEnquiry({ ...formData, [currentQuestion.id]: value });
        }, 1000);
      }, 1000);
    }
  };

  const sendEnquiry = async (data) => {
    setIsSending(true);
    
    try {
      const response = await fetch('/api/enquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setEnquirySent(true);
        setTimeout(() => {
          addBotMessage(
            "✅ Your enquiry has been sent successfully! Our team will contact you shortly. 📞\n\nWould you like to book a meeting with us?"
          );
        }, 800);
      } else {
        addBotMessage(
          "⚠️ There was an issue sending your enquiry. Please try again or contact us directly."
        );
      }
    } catch (error) {
      console.error('Error sending enquiry:', error);
      addBotMessage(
        "⚠️ There was an error processing your request. Please try again later."
      );
    } finally {
      setIsSending(false);
    }
  };

  const bookMeeting = () => {
    // Use the existing cal.com link with pre-filled data
    const meetingURL = `https://cal.com/varsha-tourism-ndqbdf/15min?name=${encodeURIComponent(
      formData.name || ''
    )}&email=${encodeURIComponent(formData.email || '')}&notes=${encodeURIComponent(
      `Phone: ${formData.phone || 'N/A'}\nDestination: ${formData.place || 'N/A'}\nPassengers: ${formData.passengers || 'N/A'}\nBudget: ${formData.budget || 'N/A'}`
    )}`;

    window.open(meetingURL, "_blank");
  };

  if (!isOpen) return null;

  const currentQuestion = questions[currentStep];
  const Icon = currentQuestion?.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Chatbot Container */}
      <div className="relative w-full sm:max-w-md mx-auto bg-white sm:rounded-2xl shadow-2xl flex flex-col h-[100vh] sm:h-[600px] sm:max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-200 bg-gradient-to-r from-zinc-900 to-zinc-800 text-white sm:rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              🌍
            </div>
            <div>
              <h3 className="font-semibold text-sm">Travel Assistant</h3>
              <p className="text-xs text-white/80">
                {isTyping ? "Typing..." : "Online"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
                  message.type === "user"
                    ? "bg-zinc-900 text-white rounded-br-sm"
                    : "bg-white text-zinc-900 shadow-sm border border-zinc-100 rounded-bl-sm"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white px-4 py-3 rounded-2xl shadow-sm border border-zinc-100 rounded-bl-sm">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" />
                  <div
                    className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  />
                  <div
                    className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Enquiry Summary */}
          {showEnquiry && (
            <div className="bg-white rounded-xl border border-zinc-200 p-4 space-y-2 shadow-sm">
              <h4 className="font-semibold text-zinc-900 text-sm mb-3">
                📋 Your Details:
              </h4>
              {Object.entries(formData).map(([key, value]) => {
                const q = questions.find((q) => q.id === key);
                const QuestionIcon = q?.icon;
                return (
                  <div
                    key={key}
                    className="flex items-center gap-2 text-sm text-zinc-700"
                  >
                    {QuestionIcon && (
                      <QuestionIcon className="w-4 h-4 text-zinc-400" />
                    )}
                    <span className="font-medium capitalize">{key}:</span>
                    <span>{value}</span>
                  </div>
                );
              })}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        {!showEnquiry && !enquirySent && (
          <form onSubmit={handleSubmit} className="p-4 border-t border-zinc-200 bg-white sm:rounded-b-2xl">
            <div className="flex items-center gap-2">
              {Icon && (
                <div className="p-2 rounded-lg bg-zinc-100">
                  <Icon className="w-5 h-5 text-zinc-600" />
                </div>
              )}
              <input
                ref={inputRef}
                type={currentQuestion?.type || "text"}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={currentQuestion?.placeholder}
                className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50 text-sm outline-none focus:border-zinc-400 focus:bg-white"
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="p-2.5 rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 disabled:bg-zinc-300 disabled:cursor-not-allowed transition"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        )}

        {/* Action Buttons */}
        {showEnquiry && enquirySent && (
          <div className="p-4 border-t border-zinc-200 bg-white space-y-2 sm:rounded-b-2xl">
            <button
              onClick={bookMeeting}
              className="w-full py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-sm flex items-center justify-center gap-2 transition"
            >
              <Calendar className="w-4 h-4" />
              Book a Meeting
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
