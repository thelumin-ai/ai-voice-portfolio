"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, Sparkles, Database, Layers, PhoneCall, Calendar } from "lucide-react";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: Date;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      sender: "bot",
      text: "Hi there! I am Abimbola's AI Automation Assistant.\n\nI can answer questions about AI Voice Agents (Vapi/Retell), Workflow Automations (n8n/Make.com), and CRM Systems (HubSpot/GoHighLevel). How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [awaitingBookingConfirm, setAwaitingBookingConfirm] = useState(false);

  const [leadStep, setLeadStep] = useState<"idle" | "name" | "email" | "message" | "submitting">("idle");
  const [leadData, setLeadData] = useState({ name: "", email: "", phone: "", message: "" });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  const quickReplies = [
    { text: "Connect Voice with n8n/Make", type: "tech" },
    { text: "Automate GHL & HubSpot CRM", type: "crm" },
    { text: "Vapi vs Retell AI Agents", type: "voice" },
    { text: "Book an automation audit", type: "lead" },
  ];

  const appendBotMessage = (text: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `bot-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        sender: "bot",
        text,
        timestamp: new Date(),
      },
    ]);
  };

  const handleLeadFlow = async (trimmedText: string) => {
    if (leadStep === "name") {
      setLeadData((prev) => ({ ...prev, name: trimmedText }));
      setLeadStep("email");
      setIsTyping(false);
      appendBotMessage(`Thanks, ${trimmedText}! What is the best email to reach you?`);
      return;
    }

    if (leadStep === "email") {
      if (!EMAIL_REGEX.test(trimmedText)) {
        setIsTyping(false);
        appendBotMessage("That doesn't look like a valid email address. Please enter a valid email (e.g., name@company.com):");
        return;
      }
      setLeadData((prev) => ({ ...prev, email: trimmedText }));
      setLeadStep("message");
      setIsTyping(false);
      appendBotMessage("Got it! Briefly describe the automation or voice agent bottleneck you want to solve:");
      return;
    }

    if (leadStep === "message") {
      setLeadStep("submitting");
      const finalLeadData = { ...leadData, message: trimmedText };

      try {
        const res = await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(finalLeadData),
        });

        const payload = await res.json().catch(() => ({}));

        if (res.ok) {
          appendBotMessage(
            `Perfect! Your request has been recorded.\n\nAbimbola will reach out to you at ${finalLeadData.email} within 24 hours. Feel free to ask any other questions below!`
          );
          setLeadData({ name: "", email: "", phone: "", message: "" });
          setLeadStep("idle");
        } else {
          appendBotMessage(
            `I couldn't submit your request (${payload?.error || "validation error"}). Please try again or use the Consultation form on the page.`
          );
          setLeadStep("idle");
          setLeadData({ name: "", email: "", phone: "", message: "" });
        }
      } catch {
        appendBotMessage(
          "We hit a network error saving your details. Please try again or use the Consultation form directly on the page."
        );
        setLeadStep("idle");
        setLeadData({ name: "", email: "", phone: "", message: "" });
      } finally {
        setIsTyping(false);
      }
    }
  };

  const handleSendMessage = async (rawText: string) => {
    const trimmed = rawText.trim();
    if (!trimmed || leadStep === "submitting") return;

    const userMsg: Message = {
      id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      sender: "user",
      text: trimmed,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(async () => {
      if (leadStep !== "idle") {
        await handleLeadFlow(trimmed);
        return;
      }

      const query = trimmed.toLowerCase();

      if (
        (awaitingBookingConfirm && ["yes", "yeah", "yep", "sure", "ok", "okay"].includes(query)) ||
        query.includes("book") ||
        query.includes("audit") ||
        query.includes("consult") ||
        query.includes("contact") ||
        query.includes("hire")
      ) {
        setAwaitingBookingConfirm(false);
        setLeadStep("name");
        setIsTyping(false);
        appendBotMessage("Awesome choice! Let's book a custom strategy session for your business. First, what is your name?");
        return;
      }

      setAwaitingBookingConfirm(false);

      let botResponse = "";

      if (query.includes("n8n") || query.includes("make") || query.includes("workflow") || query.includes("connect")) {
        botResponse =
          "I build unified multi-channel workflows using n8n and Make.com! When an AI Voice agent finishes a call:\n\n1. n8n analyzes the call transcript.\n2. Make.com triggers a personalized SMS/WhatsApp follow-up.\n3. CRM webhooks sync notes directly to GoHighLevel or HubSpot automatically.";
      } else if (query.includes("crm") || query.includes("hubspot") || query.includes("ghl") || query.includes("gohighlevel")) {
        botResponse =
          "I connect AI Agents and webhooks natively with HubSpot, GoHighLevel, Salesforce, and custom Supabase backends. When a lead is captured, CRM sequences and deal stages update automatically without manual entry.";
      } else if (query.includes("vapi") || query.includes("retell") || query.includes("agent") || query.includes("voice")) {
        botResponse =
          "I build ultra-low-latency voice agents on both Vapi.ai and Retell AI:\n\n- Retell AI: Great WebRTC latency and custom voice tuning.\n- Vapi.ai: Flexible system prompts and tool-calling pipelines.\n\nI pick the best platform for your inbound, outbound, or API requirements.";
      } else {
        try {
          const apiRes = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: trimmed }),
          });
          if (apiRes.ok) {
            const data = await apiRes.json();
            botResponse =
              typeof data?.response === "string" && data.response.trim()
                ? data.response.trim()
                : "Ask me about Vapi, Retell AI, n8n workflows, or type 'book' to request a consultation.";
          } else {
            setAwaitingBookingConfirm(true);
            botResponse =
              "Abimbola specializes in AI Voice Agents, CRM setups (HubSpot/GHL), and custom n8n/Make workflows.\n\nWould you like me to book a quick consultation so Abimbola can map out a custom automation blueprint for you? (Type 'yes' or click the quick action below!)";
          }
        } catch {
          setAwaitingBookingConfirm(true);
          botResponse =
            "Abimbola specializes in AI Voice Agents, CRM setups (HubSpot/GHL), and custom n8n/Make workflows.\n\nWould you like me to book a quick consultation so Abimbola can map out a custom automation blueprint for you? (Type 'yes' or click the quick action below!)";
        }
      }

      setIsTyping(false);
      appendBotMessage(botResponse);
    }, 600);
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 font-sans flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            role="dialog"
            aria-label="Abimbola AI Automation Assistant"
            className="w-[calc(100vw-2rem)] max-w-[380px] h-[min(520px,calc(100dvh-6.5rem))] bg-zinc-950/95 backdrop-blur-xl border border-zinc-800 rounded-2xl flex flex-col shadow-2xl overflow-hidden mb-3"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-900 to-indigo-950 p-4 border-b border-zinc-800 flex justify-between items-center gap-2 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center relative shrink-0">
                  <Bot className="w-5 h-5 text-blue-400 animate-pulse" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-zinc-950" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5 truncate">
                    Abimbola&apos;s AI Agent
                    <Sparkles className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  </h3>
                  <p className="text-xs text-blue-200/70 font-semibold truncate">Voice &amp; Workflow Automation</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg bg-zinc-900/50 hover:bg-zinc-900 text-gray-300 hover:text-white transition-all flex items-center justify-center border border-zinc-800 shrink-0"
                aria-label="Close chat assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl p-3.5 text-sm whitespace-pre-wrap break-words ${
                      msg.sender === "user"
                        ? "bg-blue-600 text-white font-medium"
                        : "bg-zinc-900 text-gray-200 border border-zinc-800/80"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-zinc-900 border border-zinc-800/80 rounded-xl p-3 text-gray-400 text-sm flex gap-1 items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick replies & Inputs */}
            <div className="p-3 bg-zinc-900/40 border-t border-zinc-900 space-y-3 shrink-0">
              {leadStep === "idle" && (
                <div className="flex flex-wrap gap-1.5">
                  {quickReplies.map((reply, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSendMessage(reply.text)}
                      className="text-xs px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-gray-300 border border-zinc-800 hover:border-zinc-700 transition-all flex items-center gap-1.5"
                    >
                      {reply.type === "voice" && <PhoneCall className="w-3 h-3 text-blue-400 shrink-0" />}
                      {reply.type === "crm" && <Database className="w-3 h-3 text-emerald-400 shrink-0" />}
                      {reply.type === "tech" && <Layers className="w-3 h-3 text-indigo-400 shrink-0" />}
                      {reply.type === "lead" && <Calendar className="w-3 h-3 text-amber-400 shrink-0" />}
                      <span>{reply.text}</span>
                    </button>
                  ))}
                </div>
              )}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage(inputValue);
                }}
                className="flex items-center gap-2"
              >
                <input
                  type={leadStep === "email" ? "email" : "text"}
                  value={inputValue}
                  disabled={leadStep === "submitting"}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={
                    leadStep === "name"
                      ? "Enter your name..."
                      : leadStep === "email"
                      ? "Enter your email..."
                      : leadStep === "message"
                      ? "Describe your project..."
                      : leadStep === "submitting"
                      ? "Sending..."
                      : "Type your query here..."
                  }
                  className="flex-1 min-w-0 px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 placeholder-gray-500 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={leadStep === "submitting"}
                  className="w-10 h-10 shrink-0 rounded-xl bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Launcher Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition-all shadow-[0_0_40px_-5px_rgba(59,130,246,0.6)] hover:scale-105 active:scale-95"
        aria-label={isOpen ? "Close chat assistant" : "Open chat assistant"}
        aria-expanded={isOpen}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6 animate-pulse" />}
      </button>
    </div>
  );
}
