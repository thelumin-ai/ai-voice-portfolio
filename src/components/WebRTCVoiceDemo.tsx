"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Square, Loader2, Volume2 } from 'lucide-react';
import Vapi from '@vapi-ai/web';
import { DEFAULT_VAPI_AGENT_ID, DEFAULT_VAPI_PUBLIC_KEY } from '@/lib/vapiConfig';
import { getErrorMessage } from '@/lib/errors';

type AgentState = 'idle' | 'connecting' | 'listening' | 'processing' | 'speaking';

interface Message {
    role: 'user' | 'agent';
    content: string;
}

interface VapiTranscriptMessage {
    type?: string;
    role?: string;
    transcriptType?: string;
    transcript?: string;
}

interface WebRTCVoiceDemoProps {
    agentRole?: string;
    vapiAgentId?: string;
    apiKey?: string;
    onCallEnded?: () => void;
}

const BAR_DURATIONS = [0.55, 0.72, 0.61, 0.84, 0.58, 0.9, 0.66, 0.77, 0.52, 0.81, 0.69, 0.63, 0.88, 0.59, 0.74];
const BAR_DELAYS = [0, 0.12, 0.25, 0.08, 0.34, 0.19, 0.41, 0.05, 0.29, 0.15, 0.38, 0.11, 0.22, 0.44, 0.17];

export default function WebRTCVoiceDemo({
    agentRole = 'Real Estate Agent',
    vapiAgentId = DEFAULT_VAPI_AGENT_ID,
    apiKey,
    onCallEnded,
}: WebRTCVoiceDemoProps) {
    const [state, setState] = useState<AgentState>('idle');
    const [messages, setMessages] = useState<Message[]>([]);
    const [activeMessage, setActiveMessage] = useState<{ role: 'user' | 'agent', content: string } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const sourceKey = `${apiKey || ''}:${vapiAgentId}`;
    const [prevSourceKey, setPrevSourceKey] = useState(sourceKey);
    if (prevSourceKey !== sourceKey) {
        setPrevSourceKey(sourceKey);
        setState('idle');
        setMessages([]);
        setActiveMessage(null);
        setError(null);
    }

    const transcriptRef = useRef<HTMLDivElement>(null);
    const vapiRef = useRef<Vapi | null>(null);
    const onCallEndedRef = useRef(onCallEnded);

    useEffect(() => {
        onCallEndedRef.current = onCallEnded;
    }, [onCallEnded]);

    useEffect(() => {
        if (transcriptRef.current) {
            transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
        }
    }, [messages, activeMessage]);

    // Recreate SDK whenever apiKey or agent changes
    useEffect(() => {
        const client = new Vapi(apiKey || DEFAULT_VAPI_PUBLIC_KEY);
        vapiRef.current = client;

        client.on('call-start', () => {
            setState('listening');
            setError(null);
            setMessages([]);
            setActiveMessage(null);
        });

        client.on('call-end', () => {
            setState('idle');
            setActiveMessage(null);
            onCallEndedRef.current?.();
        });

        client.on('error', (e: unknown) => {
            console.error("Vapi Error:", e);
            setState('idle');
            setError(getErrorMessage(e, "An error occurred connecting to the voice agent."));
        });

        client.on('speech-start', () => {
            setState('speaking');
        });

        client.on('speech-end', () => {
            setState((prev) => (prev === 'speaking' ? 'listening' : prev));
        });

        client.on('message', (message: VapiTranscriptMessage) => {
            if (message.type === 'transcript' && message.transcript) {
                const role = message.role === 'assistant' ? 'agent' : 'user';

                if (message.transcriptType === 'partial') {
                    setActiveMessage({ role, content: message.transcript });
                } else if (message.transcriptType === 'final') {
                    setMessages(prev => [...prev, { role, content: message.transcript! }]);
                    setActiveMessage(null);
                    if (message.role === 'user') setState('processing');
                }
            }
        });

        return () => {
            try {
                client.stop();
            } catch {}
            if (vapiRef.current === client) {
                vapiRef.current = null;
            }
        };
    }, [apiKey, vapiAgentId]);

    const startConversation = async () => {
        if (!vapiRef.current) return;
        try {
            setError(null);
            setState('connecting');
            // Check mic permission cleanly and immediately release probe stream so SDK owns mic cleanly
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            stream.getTracks().forEach((track) => track.stop());
            await vapiRef.current.start(vapiAgentId);
        } catch (err: unknown) {
            console.error("Vapi start error:", err);
            setError(getErrorMessage(err, "Microphone access denied or connection failed."));
            setState('idle');
        }
    };

    const stopConversation = () => {
        if (vapiRef.current) {
            try {
                vapiRef.current.stop();
            } catch {}
        }
        setState('idle');
    };

    return (
        <div className="w-full max-w-2xl mx-auto glass-panel rounded-2xl overflow-hidden flex flex-col h-[540px] sm:h-[600px] border border-black/10 dark:border-white/10 relative transition-colors duration-300 shadow-sm dark:shadow-none bg-white/40 dark:bg-transparent">
            {/* Header Area */}
            <div className="p-4 sm:p-6 border-b border-black/10 dark:border-white/10 bg-black/5 dark:bg-black/40 flex flex-wrap justify-between items-center gap-3 z-10">
                <div className="min-w-0">
                    <h3 className="text-black dark:text-white font-semibold text-base sm:text-lg truncate">{agentRole}</h3>
                    <div className="flex items-center text-sm">
                        <div className={`w-2 h-2 rounded-full mr-2 shrink-0 ${state === 'idle' ? 'bg-gray-400' : state === 'connecting' ? 'bg-yellow-500' : state === 'speaking' ? 'bg-blue-500 animate-pulse' : state === 'listening' ? 'bg-green-500' : 'bg-purple-500'}`} />
                        <span className="text-gray-600 dark:text-gray-400 capitalize">{state}</span>
                    </div>
                </div>
                {state === 'idle' ? (
                    <button type="button" onClick={startConversation} className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors font-medium text-sm shrink-0 whitespace-nowrap">
                        <Mic className="w-4 h-4 mr-2 shrink-0" /> Start Call
                    </button>
                ) : (
                    <button type="button" onClick={stopConversation} className="flex items-center px-4 py-2 bg-red-600/20 hover:bg-red-600/40 text-red-500 border border-red-600/30 rounded-lg transition-colors font-medium text-sm shrink-0 whitespace-nowrap">
                        <Square className="w-4 h-4 mr-2 fill-current shrink-0" /> End Call
                    </button>
                )}
            </div>

            {/* Transcript Area */}
            <div ref={transcriptRef} className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 scroll-smooth z-10 bg-white/50 dark:bg-transparent custom-scrollbar">
                {error ? (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm text-center">{error}</div>
                ) : messages.length === 0 && !activeMessage ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 space-y-4">
                        <Volume2 className="w-12 h-12 opacity-20" />
                        <p className="text-center text-sm sm:text-base">Ready to start the conversation.</p>
                    </div>
                ) : (
                    <>
                        {messages.map((msg, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-3.5 sm:p-4 rounded-2xl ${msg.role === 'user' ? 'bg-blue-100 dark:bg-blue-600/20 border border-blue-200 dark:border-blue-500/30 text-blue-900 dark:text-blue-100 rounded-tr-sm' : 'bg-white dark:bg-white/10 border border-black/10 dark:border-white/5 text-gray-800 dark:text-gray-200 rounded-tl-sm'}`}>
                                    <div className="text-[10px] opacity-50 mb-1 font-bold uppercase tracking-wider">{msg.role}</div>
                                    <div className="leading-relaxed whitespace-pre-wrap text-sm sm:text-base">{msg.content}</div>
                                </div>
                            </motion.div>
                        ))}
                        {activeMessage && (
                            <motion.div key="active" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${activeMessage.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-3.5 sm:p-4 rounded-2xl opacity-70 ${activeMessage.role === 'user' ? 'bg-blue-50 dark:bg-blue-600/10 border border-blue-200/50 dark:border-blue-500/20 text-blue-900/70 dark:text-blue-100/70 rounded-tr-sm' : 'bg-white/70 dark:bg-white/5 border border-black/5 dark:border-white/5 text-gray-800/70 dark:text-gray-200/70 rounded-tl-sm'}`}>
                                    <div className="text-[10px] opacity-50 mb-1 font-bold uppercase tracking-wider">{activeMessage.role} (speaking...)</div>
                                    <div className="leading-relaxed whitespace-pre-wrap italic text-sm sm:text-base">{activeMessage.content}</div>
                                </div>
                            </motion.div>
                        )}
                    </>
                )}
            </div>

            {/* Status Footer */}
            <div className="p-4 sm:p-6 border-t border-black/10 dark:border-white/10 bg-black/5 dark:bg-black/60 relative z-10 min-h-[92px] flex items-center justify-center">
                <AnimatePresence mode="wait">
                    {state === 'idle' && (
                        <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-gray-500 flex items-center text-sm sm:text-base">
                            <MicOff className="w-5 h-5 mr-3" /> <span>Microphone muted</span>
                        </motion.div>
                    )}
                    {state === 'connecting' && (
                        <motion.div key="connecting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-yellow-500 flex items-center text-sm sm:text-base">
                            <Loader2 className="w-5 h-5 mr-3 animate-spin" /> <span>Connecting WebRTC...</span>
                        </motion.div>
                    )}
                    {state === 'listening' && (
                        <motion.div key="listening" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center">
                            <div className="relative">
                                <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
                                <div className="w-12 h-12 bg-green-500/20 border border-green-500/50 rounded-full flex items-center justify-center relative z-10"><Mic className="w-6 h-6 text-green-400" /></div>
                            </div>
                            <span className="text-green-400 text-sm mt-2 font-medium">Listening...</span>
                        </motion.div>
                    )}
                    {state === 'processing' && (
                        <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-purple-400 flex items-center">
                            <div className="flex space-x-1 border border-purple-500/30 bg-purple-500/10 px-4 py-2 rounded-full items-center">
                                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" />
                                <span className="ml-3 text-sm font-medium">Processing...</span>
                            </div>
                        </motion.div>
                    )}
                    {state === 'speaking' && (
                        <motion.div key="speaking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center w-full">
                            <div className="flex space-x-1 items-center justify-center h-12 w-full max-w-[200px]">
                                {BAR_DURATIONS.map((duration, i) => (
                                    <motion.div
                                        key={i}
                                        className="w-1.5 bg-blue-500 rounded-full"
                                        animate={{ height: ['20%', '100%', '20%'], opacity: [0.5, 1, 0.5] }}
                                        transition={{ duration, repeat: Infinity, repeatType: "reverse", delay: BAR_DELAYS[i] }}
                                    />
                                ))}
                            </div>
                            <span className="text-blue-400 text-sm mt-2 font-medium">AI Speaking</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
