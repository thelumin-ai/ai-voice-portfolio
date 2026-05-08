"use client";

import { motion } from "framer-motion";
import { ArrowRight, PlayCircle, FileText, Image as ImageIcon, Video, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

const defaultPortfolioItems = [
    {
        title: "Real Estate Appointment Setter",
        description: "An inbound/outbound hybrid agent that calls Facebook lead form submissions within 5 seconds, asks 4 qualification questions, and books directly to Calendly.",
        metrics: ["34% Conversion Rate", "< 5s Response Time", "Follow Up Boss Integration"],
        color: "from-blue-500/20 to-indigo-500/20",
        borderColor: "border-blue-500/30",
        type: "voice"
    },
    {
        title: "Customer Support Router for E-commerce",
        description: "A 24/7 inbound agent that handles 'Where is my order?' queries by checking Shopify via API, and intelligently routes complex issues to human agents.",
        metrics: ["60% Ticket Deflection", "24/7 Availability", "Shopify API Sync"],
        color: "from-purple-500/20 to-pink-500/20",
        borderColor: "border-purple-500/30",
        type: "voice"
    },
    {
        title: "Solar Pre-Qualification Outbound AI",
        description: "A high-volume outbound dialer designed to verify homeownership, calculate rough shade estimates, and schedule virtual consultations.",
        metrics: ["400+ Calls/Day", "12% Meeting Set Rate", "GoHighLevel Sync"],
        color: "from-orange-500/20 to-red-500/20",
        borderColor: "border-orange-500/30",
        type: "voice"
    }
];

export default function Portfolio() {
    const [portfolioItems, setPortfolioItems] = useState<any[]>(defaultPortfolioItems);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPortfolios = async () => {
            try {
                const res = await fetch("/api/portfolio");
                if (res.ok) {
                    const { data } = await res.json();
                    if (data && data.length > 0) {
                        setPortfolioItems([...defaultPortfolioItems, ...data]);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch portfolios:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPortfolios();
    }, []);

    const getIcon = (type: string) => {
        switch (type) {
            case 'image': return <ImageIcon className="w-4 h-4 mr-2" />;
            case 'video': return <Video className="w-4 h-4 mr-2" />;
            case 'pdf': return <FileText className="w-4 h-4 mr-2" />;
            default: return <PlayCircle className="w-4 h-4 mr-2" />;
        }
    };

    const getButtonText = (type: string) => {
        switch (type) {
            case 'image': return "View Image";
            case 'video': return "Watch Video";
            case 'pdf': return "View Document";
            default: return "Listen to Demo";
        }
    };

    const getLinkHref = (item: any) => {
        return item.type === 'voice' || !item.media_url ? "/playground" : item.media_url;
    };

    return (
        <section className="py-24 bg-gray-50 dark:bg-zinc-950 relative border-t border-black/5 dark:border-white/5 transition-colors duration-300" id="portfolio">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-black dark:text-white mb-6 transition-colors duration-300">
                        Systems I've Built
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 transition-colors duration-300">
                        Real-world AI voice architectures driving measurable revenue for my clients.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {portfolioItems.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={`p-8 rounded-2xl bg-gradient-to-br ${item.color} border border-black/5 dark:${item.borderColor} backdrop-blur-md relative overflow-hidden group shadow-sm dark:shadow-none bg-white dark:bg-transparent transition-colors duration-300`}
                        >
                            {/* Hover effect glow */}
                            <div className="absolute inset-0 bg-black/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            <div className="relative z-10 flex flex-col h-full">
                                <h3 className="text-xl font-bold text-black dark:text-white mb-3 transition-colors duration-300">{item.title}</h3>
                                <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 flex-grow transition-colors duration-300">{item.description}</p>

                                <div className="space-y-2 mb-6">
                                    {item.metrics?.map((metric: string, i: number) => (
                                        <div key={i} className="flex items-center text-xs text-blue-600 dark:text-blue-300 font-medium transition-colors duration-300">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2" />
                                            {metric}
                                        </div>
                                    ))}
                                </div>

                                {item.type === 'image' || item.type === 'pdf' || item.type === 'video' ? (
                                    <a
                                        href={getLinkHref(item)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center text-sm font-semibold text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300"
                                    >
                                        {getIcon(item.type)} {getButtonText(item.type)}
                                    </a>
                                ) : (
                                    <Link
                                        href={getLinkHref(item)}
                                        className="inline-flex items-center text-sm font-semibold text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300"
                                    >
                                        {getIcon(item.type || 'voice')} {getButtonText(item.type || 'voice')}
                                    </Link>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
