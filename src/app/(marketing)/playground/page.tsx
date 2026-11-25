"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ChevronRight, ShieldCheck, Zap, Activity, Home, Sun, Headphones, PhoneOutgoing, Cpu } from "lucide-react";
import { getPublishedPlaygroundApps } from "@/app/admin/(protected)/playground/actions";
import { DEFAULT_VAPI_AGENT_ID, VAPI_DEMO_AGENTS } from "@/lib/vapiConfig";

const WebRTCVoiceDemo = dynamic(() => import("@/components/WebRTCVoiceDemo"), {
    ssr: false,
    loading: () => (
        <div className="w-full max-w-2xl mx-auto h-[540px] sm:h-[600px] rounded-2xl bg-black/5 dark:bg-zinc-900/50 animate-pulse border border-black/10 dark:border-white/10" />
    ),
});

const defaultAgentConfigs = [
    { id: "real-estate", vapiAgentId: VAPI_DEMO_AGENTS.realEstate, name: "Real Estate Agent", icon: Home, desc: "Qualifies buyers/sellers and books property walkthroughs." },
    { id: "solar", vapiAgentId: VAPI_DEMO_AGENTS.solar, name: "Solar Sales Agent", icon: Sun, desc: "Verifies homeownership and estimates utility bills." },
    { id: "support", vapiAgentId: VAPI_DEMO_AGENTS.support, name: "Customer Support", icon: Headphones, desc: "Answers basic business and routing questions." },
    { id: "cold-caller", vapiAgentId: VAPI_DEMO_AGENTS.coldCaller, name: "Cold Calling AI", icon: PhoneOutgoing, desc: "Aggressive outbound dialing and objection handling." }
];

function resolveCategoryIcon(category?: string) {
    const lower = (category || '').toLowerCase();
    if (lower.includes('real') || lower.includes('estate')) return Home;
    if (lower.includes('solar') || lower.includes('energy')) return Sun;
    if (lower.includes('support') || lower.includes('service')) return Headphones;
    if (lower.includes('sales') || lower.includes('cold') || lower.includes('outbound')) return PhoneOutgoing;
    return Cpu;
}

function extractVapiAgentId(rawId: string): string {
    if (rawId.includes('vapi.ai')) {
        try {
            const url = new URL(rawId);
            const queryId = url.searchParams.get('id') || url.searchParams.get('assistantId');
            if (queryId) return queryId;
            const pathId = url.pathname.split('/').filter(Boolean).pop();
            if (pathId) return pathId;
        } catch {
            return rawId.split('/').pop() || rawId;
        }
    }
    return rawId;
}

export default function Playground() {
    const [agentConfigs, setAgentConfigs] = useState(defaultAgentConfigs);
    const [selectedAgentId, setSelectedAgentId] = useState(defaultAgentConfigs[0].id);
    const [showConsultPopup, setShowConsultPopup] = useState(false);
    const [consultationLink, setConsultationLink] = useState("https://www.upwork.com/services/product/development-it-abimbola-1889268991195383021");

    useEffect(() => {
        let active = true;

        const loadPlayground = async () => {
            try {
                await Promise.resolve();
                const parent = document.querySelector('[data-consultation-link]');
                const link = parent?.getAttribute('data-consultation-link');
                if (active && link) setConsultationLink(link);

                const { data } = await getPublishedPlaygroundApps();
                if (active && data && data.length > 0) {
                    const mapped = data.map((app: { id: string; title: string; description: string; category?: string; embed_url?: string }) => ({
                        id: app.id,
                        vapiAgentId: app.embed_url || DEFAULT_VAPI_AGENT_ID,
                        name: app.title,
                        icon: resolveCategoryIcon(app.category || app.title),
                        desc: app.description,
                    }));
                    setAgentConfigs(mapped);
                    setSelectedAgentId(mapped[0].id);
                }
            } catch (err) {
                console.error("Failed to fetch playground apps:", err);
            }
        };

        loadPlayground();
        return () => {
            active = false;
        };
    }, []);

    const selectedAgent = useMemo(
        () => agentConfigs.find((a) => a.id === selectedAgentId) || agentConfigs[0],
        [agentConfigs, selectedAgentId]
    );

    return (
        <div className="bg-gray-50 dark:bg-zinc-950 min-h-screen pt-10 pb-16 font-sans transition-colors duration-300">
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
                        Talk to an <span className="text-blue-600 dark:text-blue-500 font-mono tracking-tighter">AI Voice Agent</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-gray-600 dark:text-gray-400 transition-colors duration-300"
                    >
                        Experience ultra-low latency voice AI in real-time. Select an agent profile below and click &apos;Start Call&apos;. Ensure your microphone is enabled.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Left Sidebar - Options */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white dark:bg-black border border-black/10 dark:border-white/5 rounded-2xl p-6 relative overflow-hidden transition-colors duration-300 shadow-sm dark:shadow-none">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl pointer-events-none" />
                            <h2 className="text-gray-500 dark:text-gray-400 font-semibold mb-4 uppercase tracking-wider text-xs transition-colors duration-300">Select Agent Profile</h2>

                            <div className="space-y-3">
                                {agentConfigs.map((agent) => (
                                    <button
                                        key={agent.id}
                                        type="button"
                                        onClick={() => setSelectedAgentId(agent.id)}
                                        className={`w-full flex items-center p-3 rounded-xl transition-all border text-left ${selectedAgent.id === agent.id
                                            ? 'bg-blue-50 dark:bg-blue-600/20 border-blue-500/50 text-blue-700 dark:text-white'
                                            : 'bg-gray-50 dark:bg-zinc-900 border-black/5 dark:border-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-black dark:hover:text-gray-300'
                                            }`}
                                    >
                                        <agent.icon className={`w-5 h-5 mr-3 shrink-0 ${selectedAgent.id === agent.id ? 'text-blue-600 dark:text-blue-400' : ''}`} />
                                        <div className="min-w-0">
                                            <div className="font-medium text-sm truncate">{agent.name}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Live Stats UI element */}
                        <div className="bg-white dark:bg-black border border-black/10 dark:border-white/5 rounded-2xl p-6 transition-colors duration-300 shadow-sm dark:shadow-none">
                            <h2 className="text-gray-500 dark:text-gray-400 font-semibold mb-4 uppercase tracking-wider text-xs transition-colors duration-300">System Metrics</h2>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm gap-2">
                                    <span className="text-gray-600 dark:text-gray-400 flex items-center transition-colors duration-300"><Zap className="w-3 h-3 mr-2 shrink-0" /> Latency</span>
                                    <span className="text-green-600 dark:text-green-400 font-mono transition-colors duration-300">~400ms</span>
                                </div>
                                <div className="flex justify-between items-center text-sm gap-2">
                                    <span className="text-gray-600 dark:text-gray-400 flex items-center transition-colors duration-300"><Activity className="w-3 h-3 mr-2 shrink-0" /> STT Engine</span>
                                    <span className="text-black dark:text-white transition-colors duration-300">Deepgram Nova-2</span>
                                </div>
                                <div className="flex justify-between items-center text-sm gap-2">
                                    <span className="text-gray-600 dark:text-gray-400 flex items-center transition-colors duration-300"><ShieldCheck className="w-3 h-3 mr-2 shrink-0" /> Security</span>
                                    <span className="text-black dark:text-white transition-colors duration-300">HIPAA / SOC2</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Center Console - WebRTC Demo or Iframe */}
                    <div className="lg:col-span-3">
                        {selectedAgent.vapiAgentId.startsWith('http') && !selectedAgent.vapiAgentId.includes('vapi.ai') ? (
                            <div className="w-full h-[600px] rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 shadow-sm bg-white dark:bg-black">
                                <iframe
                                    src={selectedAgent.vapiAgentId}
                                    title={selectedAgent.name}
                                    className="w-full h-full border-0"
                                    allow="microphone; camera; display-capture; autoplay; clipboard-read; clipboard-write"
                                />
                            </div>
                        ) : (
                            <WebRTCVoiceDemo
                                agentRole={selectedAgent.name}
                                vapiAgentId={extractVapiAgentId(selectedAgent.vapiAgentId)}
                                onCallEnded={() => setShowConsultPopup(true)}
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

            {/* Post-Call Consult Popup */}
            <AnimatePresence>
                {showConsultPopup && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="fixed bottom-24 right-4 sm:right-8 bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 shadow-2xl rounded-2xl p-6 max-w-sm z-40 transition-colors duration-300"
                        role="dialog"
                        aria-label="Consultation invitation"
                    >
                        <button
                            type="button"
                            onClick={() => setShowConsultPopup(false)}
                            aria-label="Close consultation popup"
                            className="absolute top-4 right-4 text-gray-500 hover:text-black dark:hover:text-white transition-colors duration-300"
                        >
                            ✕
                        </button>
                        <h3 className="text-xl font-bold text-black dark:text-white mb-2 transition-colors duration-300">Impressed by the Demo?</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 transition-colors duration-300">Let&apos;s integrate an AI voice agent like this directly into your phone lines and CRM.</p>
                        <Link
                            href={consultationLink}
                            target="_blank"
                            rel="noopener noreferrer"
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
