"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getTechStack } from "@/app/admin/(protected)/tech-stack/actions";

const defaultCategories = [
    {
        name: "Voice & Chat Infrastructure",
        tools: ["VAPI", "Retell", "Twilio", "LiveKit", "Typebot"]
    },
    {
        name: "Automation engines",
        tools: ["Make.com", "n8n", "Zapier", "Custom Webhooks"]
    },
    {
        name: "Voice & Text generation",
        tools: ["ElevenLabs", "GPT-4o", "Deepgram", "Claude 3.5 Sonnet"]
    },
    {
        name: "Core intelligence",
        tools: ["OpenAI Custom Assistants", "RAG Workflows", "LangChain"]
    },
    {
        name: "Integrations",
        tools: ["GoHighLevel", "HubSpot", "Google Calendar", "Slack"]
    }
];

export default function TechStack() {
    const [groupedTech, setGroupedTech] = useState<any[]>(defaultCategories);

    useEffect(() => {
        const fetchTech = async () => {
            try {
                const { data } = await getTechStack();
                if (data && data.length > 0) {
                    const published = data.filter(t => t.status === 'published');
                    if (published.length > 0) {
                        const grouped = published.reduce((acc: any, curr: any) => {
                            if (!acc[curr.category]) {
                                acc[curr.category] = { name: curr.category, tools: [] };
                            }
                            acc[curr.category].tools.push({ name: curr.name, icon_url: curr.icon_url });
                            return acc;
                        }, {});
                        const groupedArray = Object.values(grouped);
                        
                        if (groupedArray.length < 3) {
                            const combined = [...groupedArray, ...defaultCategories.slice(groupedArray.length)];
                            setGroupedTech(combined);
                        } else {
                            setGroupedTech(groupedArray);
                        }
                    }
                }
            } catch (error) {
                console.error("Failed to fetch tech stack:", error);
            }
        };
        fetchTech();
    }, []);

    return (
        <section className="py-24 bg-white dark:bg-zinc-950 relative border-t border-black/5 dark:border-white/5 transition-colors duration-300">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold tracking-tight text-black dark:text-white mb-6 transition-colors duration-300"
                    >
                        Powered by the <br /> <span className="text-blue-600 dark:text-blue-500 text-gradient">Best Tools on Earth</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-gray-600 dark:text-gray-400 transition-colors duration-300"
                    >
                        We wire together industry-leading platforms to create robust, low-latency, and highly intelligent systems.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {groupedTech.map((category, index) => (
                        <motion.div
                            key={category.name + index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="h-full"
                        >
                            <div className="glass-panel p-8 group border border-black/5 dark:border-white/5 hover:border-blue-500/30 transition-all bg-gray-50 dark:bg-black/40 shadow-sm dark:shadow-none duration-500 h-full">
                                <h3 className="text-xl font-bold text-black dark:text-white mb-6 border-b border-black/5 dark:border-white/5 pb-6 transition-colors duration-300 tracking-tight">{category.name}</h3>
                                <ul className="space-y-4">
                                    {category.tools.map((tool: any, i: number) => {
                                        const toolName = typeof tool === 'string' ? tool : tool.name;
                                        const toolIcon = typeof tool === 'string' ? null : tool.icon_url;
                                        return (
                                            <li key={toolName + i} className="flex items-center text-gray-600 dark:text-gray-300 font-medium transition-colors duration-300 group/item">
                                                {toolIcon ? (
                                                    <img src={toolIcon} alt={toolName} className="w-5 h-5 mr-4 object-contain group-hover/item:scale-110 transition-transform" />
                                                ) : (
                                                    <div className="w-2 h-2 rounded-full bg-blue-500/50 mr-4 group-hover/item:bg-blue-500 transition-colors" />
                                                )}
                                                {toolName}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
