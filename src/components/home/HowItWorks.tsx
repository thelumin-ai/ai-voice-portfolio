"use client";

import { motion } from "framer-motion";
import { MessageSquare, Cpu, Headphones, Zap, Rocket } from "lucide-react";
import { useEffect, useState } from "react";
import { getProcessSteps } from "@/app/admin/(protected)/process-steps/actions";

const steps = [
    {
        title: "Consultation & Strategy",
        description: "We analyze your current sales process, identify bottlenecks, and map out where AI voice agents will have the biggest ROI.",
        icon: MessageSquare,
    },
    {
        title: "Conversation Design",
        description: "Crafting the perfect script, objection handling protocols, and dynamic variable routing so the AI sounds human and persuasive.",
        icon: Headphones,
    },
    {
        title: "Voice Agent Development",
        description: "Building the core intelligence using LLMs, text-to-speech engines, and connecting it to our ultra-low latency WebRTC infrastructure.",
        icon: Cpu,
    },
    {
        title: "Testing & Optimization",
        description: "Rigorous stress testing with hundreds of simulated calls to ensure flawless performance and zero hallucinations.",
        icon: Zap,
    },
    {
        title: "Deployment & Automation",
        description: "Connecting the agent to your CRM, calendar, and phone lines. The system goes live and starts handling calls automatically.",
        icon: Rocket,
    },
];

export default function HowItWorks() {
    const [processSteps, setProcessSteps] = useState<any[]>(steps);

    useEffect(() => {
        const fetchSteps = async () => {
            try {
                const data = await getProcessSteps();
                if (data.data && data.data.length > 0) {
                    const published = data.data.filter((s: any) => s.status === 'published');
                    if (published.length > 0) {
                        const mappedData = published.map((s: any, index: number) => ({
                            ...s,
                            icon: steps[index % steps.length]?.icon || Rocket
                        }));
                        setProcessSteps(mappedData);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch process steps:", error);
            }
        };
        fetchSteps();
    }, []);

    return (
        <section className="py-24 bg-white dark:bg-black relative border-t border-black/5 dark:border-white/5 overflow-hidden transition-colors duration-300" id="how-it-works">
            {/* Background stylistic line (The Tree Trunk) */}
            <div className="absolute top-0 bottom-0 left-1/2 w-[2px] bg-gradient-to-b from-blue-500/0 via-blue-500/30 to-blue-500/0 hidden md:block" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold tracking-tight text-black dark:text-white mb-6 transition-colors duration-300"
                    >
                        How We Build <span className="text-blue-600 dark:text-blue-500">Your System</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-gray-600 dark:text-gray-400 transition-colors duration-300"
                    >
                        A battle-tested 5-step process to deploy enterprise AI voice automation in under 14 days.
                    </motion.p>
                </div>

                <div className="max-w-6xl mx-auto">
                    {processSteps.map((step, index) => (
                        <motion.div
                            key={step.title + index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className={`relative flex items-center mb-24 last:mb-0 ${index % 2 === 0 ? "md:flex-row-reverse" : "md:flex-row"} flex-col`}
                        >
                            {/* Timeline dot (The Tree Node) */}
                            <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-white dark:bg-black border-4 border-blue-500/20 items-center justify-center z-10 transition-colors duration-300 shadow-lg shadow-blue-500/10">
                                <div className="w-4 h-4 rounded-full bg-blue-500 animate-pulse" />
                            </div>

                            {/* Content box (The Tree Branch) */}
                            <div className={`w-full md:w-[45%] ${index % 2 === 0 ? "md:pl-12" : "md:pr-12"} mb-8 md:mb-0`}>
                                <div className="glass-panel bg-white/60 dark:bg-zinc-900/60 p-10 rounded-3xl relative overflow-hidden group hover:border-blue-500/40 transition-all duration-500 border border-black/5 dark:border-white/5 hover:shadow-2xl hover:shadow-blue-500/5 hover:-translate-y-1">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500/0 via-blue-500/60 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="flex items-center mb-6">
                                        <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 mr-4">
                                            <step.icon className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-black tracking-[0.2em] text-blue-600 dark:text-blue-500 uppercase">Step 0{index + 1}</span>
                                            <h3 className="text-2xl font-bold text-black dark:text-white transition-colors duration-300">{step.title}</h3>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed transition-colors duration-300">{step.description}</p>
                                </div>
                            </div>
                            
                            {/* Empty space for the other side */}
                            <div className="hidden md:block md:w-[45%]" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
