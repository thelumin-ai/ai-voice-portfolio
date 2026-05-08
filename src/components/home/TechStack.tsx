"use client";

import { motion } from "framer-motion";

const categories = [
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

import { useEffect, useState } from "react";
import { getTechStack } from "@/app/admin/(protected)/tech-stack/actions";

export default function TechStack() {
    const [groupedTech, setGroupedTech] = useState<any[]>(categories);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTech = async () => {
            try {
                const { data } = await getTechStack();
                if (data && data.length > 0) {
                    const published = data.filter(t => t.status === 'published');
                    if (published.length > 0) {
                        // Group by category
                        const grouped = published.reduce((acc: any, curr: any) => {
                            if (!acc[curr.category]) {
                                acc[curr.category] = { name: curr.category, tools: [] };
                            }
                            acc[curr.category].tools.push({ name: curr.name, icon_url: curr.icon_url });
                            return acc;
                        }, {});
                        setGroupedTech(Object.values(grouped));
                        setIsLoading(false);
                        return;
                    }
                }
            } catch (error) {
                console.error("Failed to fetch tech stack:", error);
            }
            setIsLoading(false);
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
                        We don't rely on basic, out-of-the-box software. We wire together industry-leading platforms to create robust, low-latency, and highly intelligent systems.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {groupedTech.map((category, index) => (
                        <motion.div
                            key={category.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="glass-panel p-8 group border border-black/5 dark:border-white/5 hover:border-black/20 dark:hover:border-white/20 transition-all bg-gray-50 dark:bg-black/40 shadow-sm dark:shadow-none duration-300"
                        >
                            <h3 className="text-lg font-semibold text-black dark:text-white mb-4 border-b border-black/10 dark:border-white/10 pb-4 transition-colors duration-300">{category.name}</h3>
                            <ul className="space-y-3">
                                {category.tools.map((tool: any) => {
                                    const toolName = typeof tool === 'string' ? tool : tool.name;
                                    const toolIcon = typeof tool === 'string' ? null : tool.icon_url;
                                    return (
                                        <li key={toolName} className="flex items-center text-gray-600 dark:text-gray-400 text-sm transition-colors duration-300">
                                            {toolIcon ? (
                                                <img src={toolIcon} alt={toolName} className="w-4 h-4 mr-3 object-contain" />
                                            ) : (
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-3" />
                                            )}
                                            {toolName}
                                        </li>
                                    );
                                })}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
