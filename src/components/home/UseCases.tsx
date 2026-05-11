"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import * as LucideIcons from "lucide-react";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { getUseCases } from "@/app/admin/(protected)/use-cases/actions";

const defaultUseCases = [
    {
        name: "Real Estate",
        icon_name: "Home",
        industry_slug: "real-estate",
        cover_image_url: "https://images.unsplash.com/photo-1560184897-ae75f418493e?q=80&w=1000&auto=format&fit=crop",
        headline: "Speed-to-Lead AI Calling",
        problem: "Leads go cold in minutes. AI agents call instantly, qualify prospects, and book showings on autopilot.",
        results: [{ stat: "300%", label: "Increase in connect rate" }]
    },
    {
        name: "Solar & Energy",
        icon_name: "Sun",
        industry_slug: "solar",
        cover_image_url: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=1000&auto=format&fit=crop",
        headline: "High-Volume Pre-Qualification",
        problem: "Sales reps waste hours dialing un-qualified homeowners or renters.",
        results: [{ stat: "12hrs", label: "Saved per rep weekly" }]
    },
    {
        name: "Home Services",
        icon_name: "Hammer",
        industry_slug: "home-services",
        cover_image_url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1000&auto=format&fit=crop",
        headline: "24/7 Booking & Dispatch",
        problem: "Missed calls mean missed revenue. Customers call competitors when you don't answer.",
        results: [{ stat: "40%", label: "More bookings captured" }]
    }
];

export default function UseCases() {
    const [useCases, setUseCases] = useState<any[]>(defaultUseCases);

    useEffect(() => {
        const fetchCases = async () => {
            try {
                const { data } = await getUseCases();
                if (data && data.length > 0) {
                    const published = data.filter((u: any) => u.status === 'published');
                    if (published.length > 0) {
                        if (published.length < 3) {
                            const combined = [...published, ...defaultUseCases.slice(published.length)];
                            setUseCases(combined);
                        } else {
                            setUseCases(published);
                        }
                    }
                }
            } catch (error) {
                console.error("Failed to fetch use cases:", error);
            }
        };
        fetchCases();
    }, []);

    const getIcon = (iconName: string) => {
        return (LucideIcons as any)[iconName] || LucideIcons.Briefcase;
    };

    return (
        <section className="py-24 bg-white dark:bg-black border-t border-black/5 dark:border-white/5 relative transition-colors duration-300" id="use-cases">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div className="max-w-2xl">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-3xl md:text-5xl font-bold tracking-tight text-black dark:text-white mb-6 transition-colors duration-300"
                        >
                            Industry-Specific <br /><span className="text-gray-500">Deployments</span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-lg text-gray-600 dark:text-gray-400 transition-colors duration-300"
                        >
                            See how different sectors utilize our AI voice agents to dominate their markets.
                        </motion.p>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <Link href="/use-cases" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium group transition-colors duration-300">
                            View all use cases <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {useCases.map((useCase, i) => {
                        const Icon = getIcon(useCase.icon_name);
                        return (
                            <motion.div
                                key={useCase.industry_slug + i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Link href={`/use-cases/${useCase.industry_slug}`} className="block group">
                                    <div className="relative overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 aspect-[3/4] flex flex-col justify-end p-8 shadow-md dark:shadow-none hover:shadow-2xl dark:hover:shadow-none transition-all duration-500 group">
                                        {/* Background Image */}
                                        <div className="absolute inset-0 z-0">
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent z-10" />
                                            <img
                                                src={useCase.cover_image_url || 'https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=1000&auto=format&fit=crop'}
                                                alt={useCase.name}
                                                className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-700"
                                            />
                                        </div>

                                        <div className="relative z-20 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-4 border border-white/20 group-hover:bg-blue-600 group-hover:border-blue-500/50 transition-all duration-500">
                                                <Icon className="h-6 w-6 text-white" />
                                            </div>
                                            <h3 className="text-2xl font-bold text-white mb-2">{useCase.name}</h3>
                                            <p className="text-gray-300 text-sm mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 line-clamp-2">
                                                {useCase.headline}
                                            </p>
                                            <div className="flex items-center text-xs font-bold text-blue-400 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                                                EXPLORE AGENTS <ArrowRight className="ml-2 h-3 w-3" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
