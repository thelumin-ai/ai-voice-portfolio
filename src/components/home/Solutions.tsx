"use client";

import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { getServices } from "@/app/admin/(protected)/services/actions";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";

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
                    const published = data.filter(s => s.status === 'published');
                    if (published.length > 0) {
                        setSolutions(published.map(s => ({ ...s, href: "/#solutions" })));
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

    // Helper to render icon by name
    const renderIcon = (iconName: string) => {
        const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.CheckCircle;
        return <IconComponent className="h-10 w-10 text-blue-600 dark:text-blue-400 mb-6 group-hover:scale-110 transition-transform" />;
    };

    return (
        <section className="py-24 bg-gray-100 dark:bg-black relative transition-colors duration-300" id="solutions">
            <div className="absolute top-1/2 left-0 w-full h-[300px] bg-blue-900/10 blur-[100px] pointer-events-none rounded-full" />
            <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 z-10">
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

                <div className="relative">
                    <Swiper
                        modules={[Navigation, Autoplay]}
                        spaceBetween={24}
                        slidesPerView={1}
                        breakpoints={{
                            640: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                        }}
                        autoplay={{ delay: 4000, disableOnInteraction: false }}
                        loop={solutions.length > 3}
                        onSwiper={(swiper) => { swiperRef.current = swiper; }}
                        className="pb-4"
                    >
                        {solutions.map((solution, index) => (
                            <SwiperSlide key={solution.title + index}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Link href={solution.href} className="block group h-full">
                                        <div className="glass-panel p-8 h-full transition-all duration-300 hover:border-blue-500/50 hover:bg-white/50 dark:hover:bg-white/5 relative overflow-hidden group shadow-sm dark:shadow-none bg-white/50 dark:bg-black/40 min-h-[240px]">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-full translate-x-16 -translate-y-16 group-hover:bg-blue-500/20 transition-colors" />
                                            {renderIcon(solution.icon_name || 'CheckCircle')}
                                            <h3 className="text-xl font-semibold text-black dark:text-white mb-3 transition-colors duration-300">{solution.title}</h3>
                                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed transition-colors duration-300">{solution.description}</p>
                                        </div>
                                    </Link>
                                </motion.div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Navigation Arrows */}
                    <div className="flex justify-center gap-3 mt-8">
                        <button
                            onClick={() => swiperRef.current?.slidePrev()}
                            className="w-10 h-10 rounded-full border border-black/10 dark:border-white/20 flex items-center justify-center text-black dark:text-white hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-all duration-300"
                            aria-label="Previous slide"
                        >
                            <LucideIcons.ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => swiperRef.current?.slideNext()}
                            className="w-10 h-10 rounded-full border border-black/10 dark:border-white/20 flex items-center justify-center text-black dark:text-white hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-all duration-300"
                            aria-label="Next slide"
                        >
                            <LucideIcons.ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
