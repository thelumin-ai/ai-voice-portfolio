"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ChevronRight, ShieldCheck, Zap, Activity, Home, Sun, Headphones, PhoneOutgoing, Mic, Radio } from "lucide-react";
import WebRTCVoiceDemo from "@/components/WebRTCVoiceDemo";

// Add the `vapiAgentId` property to each config. Reads from Vercel environment variables.
const defaultAgentConfigs = [
    { id: "real-estate", vapiAgentId: process.env.NEXT_PUBLIC_VAPI_AGENT_REAL_ESTATE || "087efbdc-3fcf-4329-a12e-819eb64d3882", name: "Real Estate Agent", icon: Home, desc: "Qualifies buyers/sellers and books property walkthroughs." },
    { id: "solar", vapiAgentId: process.env.NEXT_PUBLIC_VAPI_AGENT_SOLAR || "087efbdc-3fcf-4329-a12e-819eb64d3882", name: "Solar Sales Agent", icon: Sun, desc: "Verifies homeownership and estimates utility bills." },
    { id: "support", vapiAgentId: process.env.NEXT_PUBLIC_VAPI_AGENT_SUPPORT || "087efbdc-3fcf-4329-a12e-819eb64d3882", name: "Customer Support", icon: Headphones, desc: "Answers basic business and routing questions." },
    { id: "cold-caller", vapiAgentId: process.env.NEXT_PUBLIC_VAPI_AGENT_COLD_CALLER || "087efbdc-3fcf-4329-a12e-819eb64d3882", name: "Cold Calling AI", icon: PhoneOutgoing, desc: "Aggressive outbound dialing and objection handling." }
];

export default function Playground() {
    const [agentConfigs, setAgentConfigs] = useState<any[]>(defaultAgentConfigs);
    const [selectedAgent, setSelectedAgent] = useState(defaultAgentConfigs[0]);
    const [showConsultPopup, setShowConsultPopup] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [consultationLink, setConsultationLink] = useState("https://www.upwork.com/services/product/development-it-abimbola-1889268991195383021");

    // In a real application, you'd trigger this popup after a call ends
    // For the demo, we'll simulate it by observing the 'ended' state of the WebRTCDemo
    // OR just showing it after some timeout. For simplicity in this mock, we'll
    // assume the user interacts and we show it eventually, or via a button.

    useEffect(() => {
        // Read consultation link from layout data attribute
        const parent = document.querySelector('[data-consultation-link]');
        if (parent) {
            const link = parent.getAttribute('data-consultation-link');
            if (link) setConsultationLink(link);
        }
        // Brief initialization for branded loading screen
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="bg-gray-50 dark:bg-zinc-950 min-h-screen pt-24 pb-16 font-sans transition-colors duration-300">
            <AnimatePresence mode="wait">
            {isLoading ? (
                <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.4 }}
                    className="container mx-auto px-4 sm:px-6 lg:px-8"
                >
                    {/* Branded Loading Screen */}
                    <div className="flex flex-col items-center justify-center min-h-[70vh]">
                        {/* Animated Logo Mark */}
                        <div className="relative mb-8">
                            <div className="absolute inset-0 bg-blue-500/20 blur-[40px] rounded-full animate-pulse" />
                            <motion.div
                                animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                className="relative w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-600/30"
                            >
                                <Mic className="w-10 h-10 text-white" />
                            </motion.div>
                            <motion.div
                                animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                                className="absolute inset-0 border-2 border-blue-400/40 rounded-2xl"
                            />
                        </div>

                        {/* Branding */}
                        <h2 className="text-2xl font-bold text-black dark:text-white mb-2 transition-colors duration-300">
                            Abimbola<span className="text-blue-500">.AI</span>
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm transition-colors duration-300">
                            Initializing AI Playground...
                        </p>

                        {/* Loading Indicators */}
                        <div className="flex items-center gap-6 mb-12">
                            {["Connecting Agents", "Loading Models", "Preparing WebRTC"].map((label, i) => (
                                <motion.div
                                    key={label}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.3 }}
                                    className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500"
                                >
                                    <motion.div
                                        animate={{ scale: [1, 1.3, 1] }}
                                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.4 }}
                                        className="w-2 h-2 rounded-full bg-blue-500"
                                    />
                                    {label}
                                </motion.div>
                            ))}
                        </div>

                        {/* Skeleton Preview */}
                        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-4 gap-6 opacity-30">
                            <div className="lg:col-span-1 space-y-4">
                                <div className="bg-white dark:bg-black border border-black/5 dark:border-white/5 rounded-2xl p-6 h-48">
                                    <div className="h-3 w-24 bg-gray-200 dark:bg-zinc-800 rounded mb-4" />
                                    {[1,2,3].map(n => (
                                        <div key={n} className="h-10 bg-gray-100 dark:bg-zinc-900 rounded-xl mb-2" />
                                    ))}
                                </div>
                            </div>
                            <div className="lg:col-span-3">
                                <div className="bg-white dark:bg-black border border-black/5 dark:border-white/5 rounded-2xl h-64 flex items-center justify-center">
                                    <Radio className="w-8 h-8 text-gray-300 dark:text-zinc-700 animate-pulse" />
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            ) : (
                <motion.div
                    key="loaded"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">

                {/* Breadcrumbs */}
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-8 transition-colors duration-300">
                    <Link href="/" className="hover:text-black dark:hover:text-white transition-colors">Home</Link>
                    <ChevronRight className="h-4 w-4 mx-2" />
                    <span className="text-black dark:text-white bg-black/5 dark:bg-white/10 px-2 py-1 rounded transition-colors duration-300">Playground</span>
                </div>

                {/* Header */}
                <div className="max-w-3xl mb-12">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-extrabold text-black dark:text-white mb-4 transition-colors duration-300"
                    >
                        Talk to an <span className="text-blue-600 dark:text-blue-500 font-mono tracking-tighter glow-text">AI Voice Agent</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-gray-600 dark:text-gray-400 transition-colors duration-300"
                    >
                        Experience ultra-low latency voice AI in real-time. Select an agent profile below and click 'Start Call'. Ensure your microphone is enabled.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Left Sidebar - Options */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white dark:bg-black border border-black/10 dark:border-white/5 rounded-2xl p-6 relative overflow-hidden transition-colors duration-300 shadow-sm dark:shadow-none">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl" />
                            <h3 className="text-gray-500 dark:text-gray-400 font-semibold mb-4 uppercase tracking-wider text-xs transition-colors duration-300">Select Agent Profile</h3>

                            <div className="space-y-3">
                                {agentConfigs.map((agent) => (
                                    <button
                                        key={agent.id}
                                        onClick={() => setSelectedAgent(agent)}
                                        className={`w-full flex items-center p-3 rounded-xl transition-all border text-left ${selectedAgent.id === agent.id
                                            ? 'bg-blue-50 dark:bg-blue-600/20 border-blue-500/50 text-blue-700 dark:text-white'
                                            : 'bg-gray-50 dark:bg-zinc-900 border-black/5 dark:border-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-black dark:hover:text-gray-300'
                                            }`}
                                    >
                                        <agent.icon className={`w-5 h-5 mr-3 ${selectedAgent.id === agent.id ? 'text-blue-600 dark:text-blue-400' : ''}`} />
                                        <div>
                                            <div className="font-medium text-sm">{agent.name}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Live Stats UI element */}
                        <div className="bg-white dark:bg-black border border-black/10 dark:border-white/5 rounded-2xl p-6 transition-colors duration-300 shadow-sm dark:shadow-none">
                            <h3 className="text-gray-500 dark:text-gray-400 font-semibold mb-4 uppercase tracking-wider text-xs transition-colors duration-300">System Metrics</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600 dark:text-gray-400 flex items-center transition-colors duration-300"><Zap className="w-3 h-3 mr-2" /> Latency</span>
                                    <span className="text-green-600 dark:text-green-400 font-mono transition-colors duration-300">~400ms</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600 dark:text-gray-400 flex items-center transition-colors duration-300"><Activity className="w-3 h-3 mr-2" /> STT Engine</span>
                                    <span className="text-black dark:text-white transition-colors duration-300">Deepgram Nova-2</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600 dark:text-gray-400 flex items-center transition-colors duration-300"><ShieldCheck className="w-3 h-3 mr-2" /> Security</span>
                                    <span className="text-black dark:text-white transition-colors duration-300">HIPAA / SOC2</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Center Console - WebRTC Demo or Iframe */}
                    <div className="lg:col-span-3">
                        {selectedAgent.vapiAgentId.startsWith('http') && !selectedAgent.vapiAgentId.includes('vapi.ai') ? (
                            <div className="w-full h-[600px] rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 shadow-sm bg-white dark:bg-black">
                                <iframe src={selectedAgent.vapiAgentId} className="w-full h-full border-0" allow="microphone; camera; display-capture; autoplay; clipboard-read; clipboard-write" />
                            </div>
                        ) : (
                            <WebRTCVoiceDemo
                                agentRole={selectedAgent.name}
                                vapiAgentId={(() => {
                                    const id = selectedAgent.vapiAgentId;
                                    if (id.includes('vapi.ai')) {
                                        try {
                                            const url = new URL(id);
                                            const queryId = url.searchParams.get('id');
                                            if (queryId) return queryId;
                                            const pathId = url.pathname.split('/').pop();
                                            if (pathId && pathId !== '') return pathId;
                                        } catch (e) {
                                            return id.split('/').pop() || id;
                                        }
                                    }
                                    return id;
                                })()}
                            />
                        )}

                        <div className="mt-8 bg-blue-100 dark:bg-blue-900/10 border border-blue-500/20 rounded-xl p-6 text-center lg:hidden block transition-colors duration-300">
                            <p className="text-gray-700 dark:text-gray-300 mb-4 transition-colors duration-300">Want this exact system deployed into your business?</p>
                            <Link href={consultationLink} target="_blank" rel="noopener noreferrer" className="inline-block bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 font-semibold px-6 py-2 rounded-lg text-sm transition-colors duration-300">
                                Book a Consultation
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Consult Popup (Simplified logic for demo purposes) */}
            <AnimatePresence>
                {showConsultPopup && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="fixed bottom-8 right-8 bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 shadow-2xl rounded-2xl p-6 max-w-sm z-50 transition-colors duration-300"
                    >
                        <button onClick={() => setShowConsultPopup(false)} className="absolute top-4 right-4 text-gray-500 hover:text-black dark:hover:text-white transition-colors duration-300">✕</button>
                        <h4 className="text-xl font-bold text-black dark:text-white mb-2 transition-colors duration-300">Impressed by the Demo?</h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 transition-colors duration-300">Let's integrate an AI voice agent like this directly to your phone lines and CRM.</p>
                        <Link
                            href={consultationLink}
                            target="_blank"
                            className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors"
                        >
                            Book Consultation
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>

                </motion.div>
            )}
            </AnimatePresence>
        </div>
    );
}
