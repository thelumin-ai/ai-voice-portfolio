"use client";

import { motion } from "framer-motion";
import { MessageSquare, Cpu, Headphones, Zap, Rocket } from "lucide-react";

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
    return (
        <section className="py-24 bg-white dark:bg-black relative border-t border-black/5 dark:border-white/5 overflow-hidden transition-colors duration-300" id="how-it-works">
            {/* Background stylistic line */}
            <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gradient-to-b from-blue-500/0 via-blue-500/20 to-blue-500/0 hidden md:block" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold tracking-tight text-black dark:text-white mb-6 transition-colors duration-300"
                    >
                        How We Build <span className="text-gradient">Your System</span>
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

                <div className="max-w-4xl mx-auto">
                    {steps.map((step, index) => (
                        <motion.div
                            key={step.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ delay: index * 0.1 }}
                            className={`relative flex items-center mb-12 last:mb-0 ${index % 2 === 0 ? "md:flex-row-reverse" : "md:flex-row"
                                } flex-col`}
                        >
                            {/* Timeline dot */}
                            <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white dark:bg-black border-4 border-blue-500/20 items-center justify-center z-10 transition-colors duration-300">
                                <div className="w-2 h-2 rounded-full bg-blue-500" />
                            </div>

                            {/* Content box */}
                            <div className={`w-full md:w-1/2 ${index % 2 === 0 ? "md:pl-16" : "md:pr-16"
                                } mb-8 md:mb-0`}>
                                <div className="glass-panel bg-white/50 dark:bg-zinc-900/50 p-8 relative overflow-hidden group hover:border-blue-500/30 transition-colors duration-300 border border-black/10 dark:border-white/10">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500/0 via-blue-500/50 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="flex items-center mb-4 text-blue-600 dark:text-blue-400">
                                        <span className="text-sm font-bold tracking-wider mr-4 opacity-50">STEP 0{index + 1}</span>
                                        <step.icon className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-black dark:text-white mb-3 transition-colors duration-300">{step.title}</h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed transition-colors duration-300">{step.description}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
