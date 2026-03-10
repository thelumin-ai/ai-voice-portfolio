"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Square, Loader2, Volume2 } from 'lucide-react';

// 1. Import Vapi SDK
import Vapi from '@vapi-ai/web';

type AgentState = 'idle' | 'connecting' | 'listening' | 'processing' | 'speaking';

interface Message {
    role: 'user' | 'agent';
    content: string;
}

interface WebRTCVoiceDemoProps {
    agentRole?: string;
    // We can pass specific Vapi Agent IDs down from the playground based on the selected dropdown
    vapiAgentId?: string;
}

// 2. You will put your PUBLIC Vapi key here (this is safe to expose in client code, it only lets them talk to an agent, not edit them)
const vapiKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || "f34943b9-1b82-42e4-9d69-42bf4834b1f7";

// Default fallback agent ID if none is passed
const defaultAgentId = process.env.NEXT_PUBLIC_VAPI_AGENT_DEFAULT || "087efbdc-3fcf-4329-a12e-819eb64d3882";

export default function WebRTCVoiceDemo({ agentRole = 'Real Estate Agent', vapiAgentId = defaultAgentId }: WebRTCVoiceDemoProps) {
    const [state, setState] = useState<AgentState>('idle');
    const [messages, setMessages] = useState<Message[]>([]);
    const transcriptRef = useRef<HTMLDivElement>(null);
    const [error, setError] = useState<string | null>(null);

    // Store the Vapi instance in a ref so it persists across renders
    const vapiRef = useRef<any>(null);

    // Auto-scroll transcript
    useEffect(() => {
        if (transcriptRef.current) {
            transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
        }
    }, [messages]);

    // Setup Vapi event listeners when component mounts
    useEffect(() => {
        // Prevent initializing multiple times
        if (!vapiRef.current) {
            vapiRef.current = new Vapi(vapiKey);

            // --- Event Listeners ---

            // Fired when the call starts successfully
            vapiRef.current.on('call-start', () => {
                setState('listening'); // Default to listening when waiting for them or us
                setError(null);
                setMessages([]);
            });

            // Fired when the call ends
            vapiRef.current.on('call-end', () => {
                setState('idle');
                // We could trigger a "post call" webhook or popup here
            });

            // Fired when there's an error
            vapiRef.current.on('error', (e: any) => {
                console.error("Vapi Error:", e);
                setState('idle');
                // Don't show generic API key errors aggressively since we know it's missing initially
                if (vapiKey === "your-public-api-key-here") {
                    setError("Please insert your Vapi Public Key and Agent ID in the code to connect.");
                } else {
                    setError(e.message || "An error occurred connecting to the voice agent.");
                }
            });

            // Fired when either the user or the AI starts speaking
            vapiRef.current.on('speech-start', (event: any) => {
                // Provide visual indication of who is talking
                if (event.role === 'user') {
                    setState('listening');
                } else if (event.role === 'assistant') {
                    setState('speaking');
                }
            });

            // Fired to give live transcript updates
            vapiRef.current.on('message', (message: any) => {
                // Wait for the final transcript block, or show partials if preferred
                if (message.type === 'transcript') {
                    if (message.transcriptType === 'final') {
                        setMessages(prev => [...prev, {
                            role: message.role === 'assistant' ? 'agent' : 'user',
                            content: message.transcript
                        }]);

                        // If the user just finished a thought, the AI is probably processing its response
                        if (message.role === 'user') {
                            setState('processing');
                        }
                    }
                }
            });
        }

        // Cleanup when component unmounts
        return () => {
            if (vapiRef.current) {
                vapiRef.current.stop();
            }
        };
    }, []);

    const startConversation = async () => {
        try {
            setError(null);
            setState('connecting');

            // Request mic explicitly sometimes helps catch errors early before SDK does
            await navigator.mediaDevices.getUserMedia({ audio: true });

            // Tell VAPI to call your specific Agent
            // You create this Agent ID in your Vapi.ai Dashboard
            await vapiRef.current.start(vapiAgentId);

        } catch (err: any) {
            console.error("Mic error or Vapi start error:", err);
            setError("Microphone access denied or connection failed.");
            setState('idle');
        }
    };

    const stopConversation = () => {
        if (vapiRef.current) {
            vapiRef.current.stop();
        }
        setState('idle');
    };

    return (
        <div className="w-full max-w-2xl mx-auto glass-panel rounded-2xl overflow-hidden flex flex-col h-[600px] border border-black/10 dark:border-white/10 relative transition-colors duration-300 shadow-sm dark:shadow-none bg-white/40 dark:bg-transparent">

            {/* Header Area */}
            <div className="p-6 border-b border-black/10 dark:border-white/10 bg-black/5 dark:bg-black/40 flex justify-between items-center z-10 transition-colors duration-300">
                <div>
                    <h3 className="text-black dark:text-white font-semibold text-lg transition-colors duration-300">{agentRole}</h3>
                    <div className="flex items-center text-sm">
                        <div className={`w-2 h-2 rounded-full mr-2 transition-colors duration-300 ${state === 'idle' ? 'bg-gray-400 dark:bg-gray-500' :
                            state === 'connecting' ? 'bg-yellow-500' :
                                state === 'speaking' ? 'bg-blue-500 animate-pulse' :
                                    state === 'listening' ? 'bg-green-500' : 'bg-purple-500'
                            }`} />
                        <span className="text-gray-600 dark:text-gray-400 capitalize transition-colors duration-300">{state}</span>
                    </div>
                </div>

                {state === 'idle' ? (
                    <button
                        onClick={startConversation}
                        className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors font-medium text-sm"
                    >
                        <Mic className="w-4 h-4 mr-2" />
                        Start Call
                    </button>
                ) : (
                    <button
                        onClick={stopConversation}
                        className="flex items-center px-4 py-2 bg-red-600/20 hover:bg-red-600/40 text-red-500 border border-red-600/30 rounded-lg transition-colors font-medium text-sm"
                    >
                        <Square className="w-4 h-4 mr-2 fill-current" />
                        End Call
                    </button>
                )}
            </div>

            {/* Transcript Area */}
            <div
                ref={transcriptRef}
                className="flex-1 p-6 overflow-y-auto space-y-4 scroll-smooth z-10 bg-white/50 dark:bg-transparent transition-colors duration-300"
            >
                {error ? (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm text-center transition-colors duration-300">
                        {error}
                    </div>
                ) : messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 space-y-4 transition-colors duration-300">
                        <Volume2 className="w-12 h-12 opacity-20" />
                        <p>Ready to start the conversation.</p>
                    </div>
                ) : (
                    messages.map((msg, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[80%] p-4 rounded-2xl transition-colors duration-300 ${msg.role === 'user'
                                    ? 'bg-blue-100 dark:bg-blue-600/20 border border-blue-200 dark:border-blue-500/30 text-blue-900 dark:text-blue-100 rounded-tr-sm shadow-sm dark:shadow-none'
                                    : 'bg-white dark:bg-white/10 border border-black/10 dark:border-white/5 text-gray-800 dark:text-gray-200 rounded-tl-sm shadow-sm dark:shadow-none'
                                    }`}
                            >
                                <div className="text-xs opacity-50 mb-1 font-medium capitalize">
                                    {msg.role}
                                </div>
                                <div className="leading-relaxed whitespace-pre-wrap">{msg.content}</div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Status Footer / Interactive Area */}
            <div className="p-6 border-t border-black/10 dark:border-white/10 bg-black/5 dark:bg-black/60 relative z-10 min-h-[100px] flex items-center justify-center transition-colors duration-300">
                <AnimatePresence mode="wait">
                    {state === 'idle' && (
                        <motion.div
                            key="idle"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-gray-500 flex items-center"
                        >
                            <MicOff className="w-5 h-5 mr-3" />
                            <span>Microphone muted</span>
                        </motion.div>
                    )}

                    {state === 'connecting' && (
                        <motion.div
                            key="connecting"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-yellow-500 flex items-center"
                        >
                            <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                            <span>Securing WebRTC connection...</span>
                        </motion.div>
                    )}

                    {state === 'listening' && (
                        <motion.div
                            key="listening"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
                                <div className="w-12 h-12 bg-green-500/20 border border-green-500/50 rounded-full flex items-center justify-center relative z-10">
                                    <Mic className="w-6 h-6 text-green-400" />
                                </div>
                            </div>
                            <span className="text-green-400 text-sm mt-3 font-medium">Listening...</span>
                        </motion.div>
                    )}

                    {state === 'processing' && (
                        <motion.div
                            key="processing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-purple-400 flex items-center"
                        >
                            <div className="flex space-x-1 border border-purple-500/30 bg-purple-500/10 px-4 py-2 rounded-full items-center">
                                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" />
                                <span className="ml-3 text-sm font-medium">Processing LLM...</span>
                            </div>
                        </motion.div>
                    )}

                    {state === 'speaking' && (
                        <motion.div
                            key="speaking"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center w-full"
                        >
                            <div className="flex space-x-1 items-center justify-center h-12 w-full max-w-[200px]">
                                {[...Array(20)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="w-1.5 bg-blue-500 rounded-full"
                                        animate={{
                                            height: ['20%', '100%', '20%'],
                                            opacity: [0.5, 1, 0.5]
                                        }}
                                        transition={{
                                            duration: 0.5 + Math.random() * 0.5,
                                            repeat: Infinity,
                                            repeatType: "reverse",
                                            delay: Math.random() * 0.5
                                        }}
                                    />
                                ))}
                            </div>
                            <span className="text-blue-400 text-sm mt-3 font-medium flex items-center">
                                <Volume2 className="w-4 h-4 mr-2" /> AI Speaking
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Background gradient abstract based on state */}
            <div
                className={`absolute inset-0 z-0 opacity-10 blur-[100px] transition-colors duration-1000 pointer-events-none
           ${state === 'listening' ? 'bg-green-500' : ''}
           ${state === 'speaking' ? 'bg-blue-500' : ''}
           ${state === 'processing' ? 'bg-purple-500' : ''}
           ${state === 'connecting' ? 'bg-yellow-500' : ''}
         `}
            />
        </div>
    );
}
