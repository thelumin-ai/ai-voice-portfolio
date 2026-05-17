"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ChevronRight, ShieldCheck, Zap, Activity, Home, Sun, Headphones, PhoneOutgoing } from "lucide-react";
import WebRTCVoiceDemo from "@/components/WebRTCVoiceDemo";
import { getPlaygroundApps } from "@/app/admin/(protected)/playground/actions";

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

    // In a real application, you'd trigger this popup after a call ends
    // For the demo, we'll simulate it by observing the 'ended' state of the WebRTCDemo
    // OR just showing it after some timeout. For simplicity in this mock, we'll
    // assume the user interacts and we show it eventually, or via a button.

    useEffect(() => {
        const fetchApps = async () => {
            const { data } = await getPlaygroundApps();
            if (data && data.length > 0) {
                const published = data.filter((a: any) => a.status === 'published');
                if (published.length > 0) {
                    const mapped = published.map((a: any, i: number) => ({
                        id: a.id,
                        vapiAgentId: a.embed_url || "087efbdc-3fcf-4329-a12e-819eb64d3882",
                        name: a.title,
                        icon: defaultAgentConfigs[i % defaultAgentConfigs.length].icon,
                        desc: a.description
                    }));
                    setAgentConfigs(mapped);
                    setSelectedAgent(mapped[0]);
                }
            }
        };
        fetchApps();
    }, []);

    return (
        <div className="bg-gray-50 dark:bg-zinc-950 min-h-screen pt-24 pb-16 font-sans transition-colors duration-300">
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
                            <Link href="https://www.upwork.com/services/product/development-it-abimbola-1889268991195383021?ref=project_share" className="inline-block bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 font-semibold px-6 py-2 rounded-lg text-sm transition-colors duration-300">
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
                            href="https://www.upwork.com/services/product/development-it-abimbola-1889268991195383021?ref=project_share"
                            target="_blank"
                            className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors"
                        >
                            Book Consultation
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}
