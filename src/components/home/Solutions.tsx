"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { getServices } from "@/app/admin/(protected)/services/actions";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Grid } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/grid";

const defaultSolutions = [
    {
        title: "AI Voice & Chat Agents",
        description: "Never miss a lead. AI agents handle level-one support, answer FAQs, and direct customers 24/7 across voice and text.",
        icon_name: "PhoneIncoming",
        href: "/#solutions"
    },
    {
        title: "Omni-Channel Outreach",
        description: "Scale your outbound infinitely. AI cold callers and automated SMS sequences reach hundreds of leads simultaneously.",
        icon_name: "PhoneOutgoing",
        href: "/#solutions"
    },
    {
        title: "Automated Lead Qualification",
        description: "Intelligently ask qualifying questions via chat or voice, grade the prospect, and route hot leads to closers.",
        icon_name: "UserCheck",
        href: "/#solutions"
    },
    {
        title: "CRM & ERP Integrations",
        description: "Seamlessly connect AI voice agents to your existing CRM, ERP, or helpdesk systems for real-time data sync and workflow automation.",
        icon_name: "Database",
        href: "/#solutions"
    },
    {
        title: "Appointment Scheduling",
        description: "AI agents that check calendar availability, handle rescheduling, and send confirmations — without human intervention.",
        icon_name: "CalendarCheck",
        href: "/#solutions"
    },
    {
        title: "Custom AI Dashboards",
        description: "Get full visibility into your AI's performance with real-time analytics, call transcripts, and conversion tracking.",
        icon_name: "BarChart3",
        href: "/#solutions"
    },
    {
        title: "Multi-Language Support",
        description: "Deploy AI voice agents that speak and understand over 50+ languages with native-level fluency and local accents.",
        icon_name: "Languages",
        href: "/#solutions"
    },
];

export default function Solutions() {
    const [solutions, setSolutions] = useState<any[]>(defaultSolutions);
    const [isLoading, setIsLoading] = useState(true);
    const swiperRef = useRef<SwiperType | null>(null);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const { data } = await getServices();
                if (data && data.length > 0) {
                    const published = data.filter((s: any) => s.status === 'published');
                    if (published.length > 0) {
                        setSolutions(published);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch services:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchServices();
    }, []);

    const getIcon = (iconName: string) => {
        return (LucideIcons as any)[iconName] || LucideIcons.Zap;
    };

    return (
        <section className="py-24 bg-gray-50 dark:bg-zinc-950 relative border-t border-black/5 dark:border-white/5 transition-colors duration-300" id="solutions">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold tracking-tight text-black dark:text-white mb-6 transition-colors duration-300"
                    >
                        Enterprise-Grade <span className="text-blue-600 dark:text-blue-500">AI Automations</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-gray-600 dark:text-gray-400 transition-colors duration-300"
                    >
                        Custom-built conversational AI and business automation architectures designed specifically to drive conversions and operational efficiency.
                    </motion.p>
                </div>

                <div className="relative pb-12">
                    <Swiper
                        modules={[Pagination, Grid]}
                        spaceBetween={24}
                        slidesPerView={2}
                        grid={{
                            rows: 2,
                            fill: 'row'
                        }}
                        breakpoints={{
                            1024: { 
                                slidesPerView: 3,
                                grid: { rows: 3 }
                            },
                        }}
                        pagination={{ clickable: true }}
                        onSwiper={(swiper) => { swiperRef.current = swiper; }}
                        className="pb-10 h-auto"
                    >
                        {solutions.map((solution, index) => {
                            const IconComponent = getIcon(solution.icon_name);
                            return (
                            <SwiperSlide key={solution.title + index} className="!h-auto mb-6">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: (index % 6) * 0.1 }}
                                    className="h-full"
                                >
                                    <div className="glass-panel p-8 h-full bg-white dark:bg-black/40 border border-black/5 dark:border-white/5 shadow-sm dark:shadow-none hover:shadow-xl dark:hover:shadow-none transition-all duration-300 group flex flex-col min-h-[220px]">
                                        <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                            <IconComponent className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-xl font-bold text-black dark:text-white mb-3 transition-colors duration-300">{solution.title}</h3>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed transition-colors duration-300 line-clamp-3">{solution.description}</p>
                                    </div>
                                </motion.div>
                            </SwiperSlide>
                        )})}
                    </Swiper>
                </div>
            </div>
        </section>
    );
}
