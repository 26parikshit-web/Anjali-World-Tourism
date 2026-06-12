"use client";

import { useState, useEffect, useRef } from "react";
import { X, Send, Calendar, User, Mail, Phone, Users, MapPin, IndianRupee, Plane, CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import { validateEnquiryField } from "@/lib/form-validation";

const questions = [
  {
    id: "name",
    question: "Hey there! I'm your travel assistant. What's your name?",
    placeholder: "Enter your name",
    type: "text",
    icon: User,
  },
  {
    id: "email",
    question: "Nice to meet you, {name}! What's your email?",
    placeholder: "your@email.com",
    type: "email",
    icon: Mail,
  },
  {
    id: "phone",
    question: "Great! And your phone number?",
    placeholder: "+91 XXXXXXXXXX",
    type: "tel",
    icon: Phone,
  },
  {
    id: "passengers",
    question: "How many travelers in your group?",
    placeholder: "Number of travelers",
    type: "number",
    icon: Users,
  },
  {
    id: "duration",
    question: "When would you like to travel?",
    placeholder: "Select your travel date",
    type: "date",
    icon: Calendar,
  },
  {
    id: "place",
    question: "Where's your dream destination?",
    placeholder: "e.g., Kashmir, Goa, Dubai",
    type: "text",
    icon: MapPin,
  },
  {
    id: "budget",
    question: "What's your budget per person?",
    placeholder: "e.g., ₹25,000",
    type: "text",
    icon: IndianRupee,
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
    }, 600);
  };

  const addUserMessage = (text) => {
    setMessages((prev) => [...prev, { type: "user", text }]);
  };

  const formatQuestion = (question) => {
    return question.replace("{name}", formData.name || "there");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    const currentQuestion = questions[currentStep];
    const value = inputValue.trim();

    const validation = validateEnquiryField(currentQuestion.id, value);
    if (!validation.valid) {
      addBotMessage(validation.message);
      return;
    }

    addUserMessage(value);
    setFormData((prev) => ({ ...prev, [currentQuestion.id]: value }));
    setInputValue("");

    if (currentStep < questions.length - 1) {
      setTimeout(() => {
        const nextQuestion = questions[currentStep + 1];
        addBotMessage(formatQuestion(nextQuestion.question));
        setCurrentStep(currentStep + 1);
      }, 800);
    } else {
      setTimeout(() => {
        addBotMessage("Perfect! Let me submit your travel request...");
        setShowEnquiry(true);
        setTimeout(() => {
          sendEnquiry({ ...formData, [currentQuestion.id]: value });
        }, 800);
      }, 800);
    }
  };

  const sendEnquiry = async (data) => {
    setIsSending(true);
    
    try {
      const response = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setEnquirySent(true);
        setTimeout(() => {
          addBotMessage("Your enquiry has been sent! Our travel experts will reach out to you soon.");
        }, 600);
      } else {
        addBotMessage("Something went wrong. Please try again or contact us directly.");
      }
    } catch (error) {
      console.error('Error sending enquiry:', error);
      addBotMessage("Connection error. Please check your internet and try again.");
    } finally {
      setIsSending(false);
    }
  };

  const bookMeeting = () => {
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
  const progress = ((currentStep) / questions.length) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Chatbot Container */}
      <div className="relative w-full sm:max-w-[420px] mx-auto bg-white sm:rounded-3xl shadow-2xl flex flex-col h-[100dvh] sm:h-[650px] sm:max-h-[90vh] overflow-hidden border border-zinc-200">
        
        {/* Header */}
        <div className="relative overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-zinc-900" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.1)_0%,_transparent_50%)]" />
          
          <div className="relative px-5 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/20">
                    <Plane className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-400 rounded-full border-2 border-zinc-900 shadow-sm" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-base tracking-tight">Travel Assistant</h3>
                  <p className="text-xs text-zinc-400 flex items-center gap-1.5">
                    {isTyping ? (
                      <>
                        <span className="flex gap-0.5">
                          <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                        </span>
                        typing
                      </>
                    ) : (
                      <>
                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                        Online now
                      </>
                    )}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-200 border border-white/10"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Progress Bar */}
            {!showEnquiry && (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-zinc-500 font-medium">Step {currentStep + 1} of {questions.length}</span>
                  <span className="text-xs text-zinc-500 font-medium">{Math.round(progress)}%</span>
                </div>
                <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4 bg-zinc-50">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.type === "user" ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom-2 duration-300`}
            >
              {message.type === "bot" && (
                <div className="w-8 h-8 rounded-xl bg-zinc-900 flex items-center justify-center mr-2 mt-1 shadow-md flex-shrink-0">
                  <Plane className="w-4 h-4 text-white" />
                </div>
              )}
              <div
                className={`max-w-[75%] px-4 py-3 text-sm leading-relaxed ${
                  message.type === "user"
                    ? "bg-zinc-900 text-white rounded-2xl rounded-br-md shadow-lg"
                    : "bg-white text-zinc-700 rounded-2xl rounded-bl-md shadow-sm border border-zinc-200"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start animate-in fade-in duration-300">
              <div className="w-8 h-8 rounded-xl bg-zinc-900 flex items-center justify-center mr-2 shadow-md flex-shrink-0">
                <Plane className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white px-5 py-3.5 rounded-2xl rounded-bl-md shadow-sm border border-zinc-200">
                <div className="flex gap-1.5 items-center">
                  <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          {/* Summary Card */}
          {showEnquiry && (
            <div className="animate-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  {enquirySent ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <Loader2 className="w-5 h-5 text-zinc-900 animate-spin" />
                  )}
                  <h4 className="font-semibold text-zinc-900 text-sm">
                    {enquirySent ? "Enquiry Submitted" : "Submitting..."}
                  </h4>
                </div>
                <div className="space-y-3">
                  {Object.entries(formData).map(([key, value]) => {
                    const q = questions.find((q) => q.id === key);
                    const QuestionIcon = q?.icon;
                    const labels = {
                      name: "Name",
                      email: "Email",
                      phone: "Phone",
                      passengers: "Travelers",
                      duration: "Travel Date",
                      place: "Destination",
                      budget: "Budget"
                    };
                    return (
                      <div
                        key={key}
                        className="flex items-center gap-3 text-sm bg-zinc-50 rounded-xl px-3 py-2.5 border border-zinc-100"
                      >
                        {QuestionIcon && (
                          <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center flex-shrink-0">
                            <QuestionIcon className="w-4 h-4 text-white" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-zinc-400 font-medium">{labels[key] || key}</p>
                          <p className="text-zinc-900 font-medium truncate">{value}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        {!showEnquiry && !enquirySent && (
          <div className="p-4 bg-white border-t border-zinc-200">
            <form onSubmit={handleSubmit}>
              <div className="flex items-center gap-3 bg-zinc-100 rounded-2xl p-1.5 border border-zinc-200 focus-within:border-zinc-400 focus-within:ring-4 focus-within:ring-zinc-100 transition-all duration-200">
                {Icon && (
                  <div className="ml-2 p-2 rounded-xl bg-zinc-900">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                )}
                <input
                  ref={inputRef}
                  type={currentQuestion?.type || "text"}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={currentQuestion?.placeholder}
                  className="flex-1 px-2 py-3 bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 outline-none"
                  disabled={isTyping}
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className="p-3 rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 disabled:bg-zinc-300 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Book Meeting Button */}
        {showEnquiry && enquirySent && (
          <div className="p-4 bg-white border-t border-zinc-200">
            <button
              onClick={bookMeeting}
              className="w-full py-4 px-6 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-sm flex items-center justify-center gap-2.5 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
            >
              <Calendar className="w-5 h-5" />
              Book a Meeting with Our Expert
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-center text-xs text-zinc-400 mt-3">
              Or we'll call you within 24 hours
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
