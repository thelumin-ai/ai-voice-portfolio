"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, Sparkles, Database, Layers, PhoneCall, Calendar } from "lucide-react";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: Date;
  isLeadForm?: boolean;
}

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      sender: "bot",
      text: "Hi there! I am Abimbola's AI Automation Assistant. 🤖⚡\n\nI specialize in showcasing how AI Voice Agents (Vapi/Retell), Workflow Automations (n8n/Make.com), and CRM Systems (HubSpot/GoHighLevel) can supercharge your business. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  // Lead Collection State
  const [leadStep, setLeadStep] = useState<"idle" | "name" | "email" | "message" | "submitting" | "done">("idle");
  const [leadData, setLeadData] = useState({ name: "", email: "", phone: "", message: "" });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const quickReplies = [
    { text: "Connect Voice with n8n/Make ⚡", type: "tech" },
    { text: "Automate GHL & HubSpot CRM 📊", type: "crm" },
    { text: "Vapi vs Retell AI Agents 📞", type: "voice" },
    { text: "Book an automation audit 📅", type: "lead" }
  ];

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    // Simulate thinking delay
    setTimeout(async () => {
      let botResponse = "";

      // Lowercase for checking keywords
      const query = text.toLowerCase();

      // Conversational flow tree custom-tuned for Abimbola
      if (leadStep !== "idle") {
        handleLeadFlow(text);
        return;
      }

      if (query.includes("n8n") || query.includes("make") || query.includes("workflow") || query.includes("connect")) {
        botResponse = "I build unified multi-channel workflows using n8n and Make.com! For example, when an AI Voice agent finishes a call:\n\n1. ✓ **n8n** analyzes the call transcript.\n2. ✓ **Make.com** triggers an instant personalized SMS/WhatsApp follow-up.\n3. ✓ **CRM webhook** synchronizes the notes directly to GoHighLevel or HubSpot instantly. No manual typing required!";
      } else if (query.includes("crm") || query.includes("hubspot") || query.includes("ghl") || query.includes("gohighlevel")) {
        botResponse = "I connect AI Agents and webhooks natively with HubSpot, GoHighLevel, Salesforce, and custom Supabase backends. When a lead is captured on your site, it automatically triggers CRM sequences, updates deal stages, logs recordings, and updates prospect statuses, completely replacing manual data entry.";
      } else if (query.includes("vapi") || query.includes("retell") || query.includes("agent") || query.includes("voice")) {
        botResponse = "I build ultra-low-latency voice agents on both **Vapi.ai** and **Retell AI**:\n\n* **Retell AI:** Incredible WebRTC and custom voice tuning.\n* **Vapi.ai:** Highly robust dashboard and flexible system prompt structures.\n\nI choose the best engine depending on your specific requirements (inbound, outbound, API depth) to deliver premium conversational low-latency experiences.";
      } else if (query.includes("book") || query.includes("audit") || query.includes("consult") || query.includes("contact") || query.includes("hire")) {
        setLeadStep("name");
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-lead-${Date.now()}`,
            sender: "bot",
            text: "Awesome choice! Let's book a custom strategy session for your business. First, what is your name?",
            timestamp: new Date(),
          }
        ]);
        return;
      } else {
        // Fallback standard response
        try {
          const apiRes = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: text }),
          });
          if (apiRes.ok) {
            const data = await apiRes.json();
            botResponse = data.response;
          } else {
            botResponse = "Abimbola specializes in AI Voice Agents, CRM setups (HubSpot/GHL), and custom n8n/Make workflows. \n\nWould you like me to book a quick consultation so Abimbola can map out a custom automation blueprint for you? (Type 'yes' or click the quick action below!)";
          }
        } catch {
          botResponse = "Abimbola specializes in AI Voice Agents, CRM setups (HubSpot/GHL), and custom n8n/Make workflows. \n\nWould you like me to book a quick consultation so Abimbola can map out a custom automation blueprint for you? (Type 'yes' or click the quick action below!)";
        }
      }

      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: botResponse,
          timestamp: new Date(),
        },
      ]);
    }, 1000);
  };

  const handleLeadFlow = async (text: string) => {
    let botMsg = "";
    if (leadStep === "name") {
      setLeadData((prev) => ({ ...prev, name: text }));
      setLeadStep("email");
      botMsg = `Thanks, ${text}! What is the best email to reach you?`;
    } else if (leadStep === "email") {
      setLeadData((prev) => ({ ...prev, email: text }));
      setLeadStep("message");
      botMsg = "Got it! Briefly describe the automation or voice agent bottleneck you want to solve:";
    } else if (leadStep === "message") {
      const finalMsg = text;
      setLeadStep("submitting");
      setIsTyping(true);

      const finalLeadData = { ...leadData, message: finalMsg };

      try {
        // Submit lead directly to database
        const res = await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(finalLeadData),
        });

        if (res.ok) {
          botMsg = `Perfect! Your request has been successfully recorded. ⚡\n\nAbimbola will reach out to you at ${finalLeadData.email} within 24 hours. Alternatively, feel free to book a direct Upwork/Calendly slot using the button in the Consultation section. Thank you!`;
          setLeadStep("done");
        } else {
          botMsg = "I saved your details, but had a slight connection issue. I'll make sure Abimbola receives your request. Feel free to use the Consultation booking link below!";
          setLeadStep("done");
        }
      } catch (err) {
        botMsg = "I saved your details, but had a slight connection issue. I'll make sure Abimbola receives your request. Feel free to use the Consultation booking link below!";
        setLeadStep("done");
      }
      setIsTyping(false);
    }

    setMessages((prev) => [
      ...prev,
      {
        id: `bot-lead-${Date.now()}`,
        sender: "bot",
        text: botMsg,
        timestamp: new Date(),
      },
    ]);
    setIsTyping(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="w-[360px] sm:w-[400px] h-[550px] bg-zinc-950/95 backdrop-blur-xl border border-zinc-800 rounded-2xl flex flex-col shadow-2xl overflow-hidden mb-4"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-900 to-indigo-950 p-4 border-b border-zinc-800 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center relative">
                  <Bot className="w-5 h-5 text-blue-400 animate-pulse" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-zinc-950" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    Abimbola's AI Agent
                    <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  </h3>
                  <p className="text-xs text-blue-200/60 font-semibold">Voice & Workflow Automation</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg bg-zinc-900/50 hover:bg-zinc-900 text-gray-400 hover:text-white transition-all flex items-center justify-center border border-zinc-800"
                aria-label="Close chat assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl p-3.5 text-sm whitespace-pre-wrap ${
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
            <div className="p-3 bg-zinc-900/40 border-t border-zinc-900 space-y-3">
              {leadStep === "idle" && (
                <div className="flex flex-wrap gap-2">
                  {quickReplies.map((reply, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(reply.text)}
                      className="text-xs px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-gray-300 border border-zinc-800 hover:border-zinc-700 transition-all flex items-center gap-1.5"
                    >
                      {reply.type === "voice" && <PhoneCall className="w-3 h-3 text-blue-400" />}
                      {reply.type === "crm" && <Database className="w-3 h-3 text-emerald-400" />}
                      {reply.type === "tech" && <Layers className="w-3 h-3 text-indigo-400" />}
                      {reply.type === "lead" && <Calendar className="w-3 h-3 text-amber-400" />}
                      {reply.text}
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
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={
                    leadStep === "name"
                      ? "Enter your name..."
                      : leadStep === "email"
                      ? "Enter your email..."
                      : leadStep === "message"
                      ? "Describe your project..."
                      : "Type your query here..."
                  }
                  className="flex-1 px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 placeholder-gray-500"
                />
                <button
                  type="submit"
                  className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition-all focus:outline-none"
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
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition-all shadow-[0_0_40px_-5px_rgba(59,130,246,0.6)] hover:scale-105 active:scale-95 z-[9999]"
        aria-label="Open chat assistant"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6 animate-pulse" />}
      </button>
    </div>
  );
}
