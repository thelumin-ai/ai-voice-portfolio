"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import * as LucideIcons from "lucide-react";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { getPublishedServices } from "@/app/admin/(protected)/services/actions";
import { sanitizeHref } from "@/lib/url";
import type { ServiceRecord } from "@/lib/types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

interface SolutionItem extends Pick<ServiceRecord, "id" | "title" | "description" | "icon_name" | "link"> {
    href?: string;
}

const iconRegistry = LucideIcons as unknown as Record<string, LucideIcon>;

const SERVICE_SLUG_HINTS: Array<{ match: RegExp; href: string }> = [
    { match: /support|inbound|helpdesk|ticket/i, href: "/use-cases/customer-support" },
    { match: /sales|outbound|qualif|sdr/i, href: "/use-cases/sales" },
    { match: /ivr|routing|reception|menu/i, href: "/use-cases/ivr" },
    { match: /schedul|calendar|appointment|booking/i, href: "/use-cases/scheduling" },
    { match: /crm|erp|integrat|webhook|hubspot|salesforce/i, href: "/use-cases/crm-integration" },
    { match: /language|multilingual|global|spanish/i, href: "/use-cases/multi-language" },
    { match: /dashboard|analytic|sentiment|telemetry|qa/i, href: "/use-cases/custom-dashboards" },
    { match: /real estate|property|broker/i, href: "/use-cases/real-estate" },
    { match: /solar|energy/i, href: "/use-cases/solar" },
    { match: /home service|hvac|plumb|dispatch/i, href: "/use-cases/home-services" },
    { match: /consult|agency|legal|intake/i, href: "/use-cases/consulting" },
    { match: /finance|insur|mortgage|compliance/i, href: "/use-cases/finance" },
];

function resolveSolutionHref(solution: SolutionItem): string {
    const explicit = solution.href || solution.link;
    if (explicit && explicit.trim() && explicit.trim() !== "/use-cases") {
        return sanitizeHref(explicit, "/use-cases");
    }
    const haystack = `${solution.title || ""} ${solution.description || ""}`;
    for (const rule of SERVICE_SLUG_HINTS) {
        if (rule.match.test(haystack)) {
            return rule.href;
        }
    }
    return sanitizeHref(explicit, "/use-cases");
}

function chunkArray<T>(arr: T[], size: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
        result.push(arr.slice(i, i + size));
    }
    return result;
}

const defaultSolutions: SolutionItem[] = [
    {
        title: "Inbound Customer Support AI",
        description: "Deploy 24/7 voice agents that handle Tier-1 support, check order statuses via API, and intelligently route complex issues to human agents.",
        icon_name: "Headphones",
        href: "/use-cases/customer-support"
    },
    {
        title: "Outbound Sales & Qualification",
        description: "High-volume AI dialers that call leads within 5 seconds of form submission, qualify them against your criteria, and book appointments.",
        icon_name: "PhoneOutgoing",
        href: "/use-cases/sales"
    },
    {
        title: "Interactive Voice Response (IVR) 2.0",
        description: "Replace frustrating phone menus with conversational AI that understands natural language and solves problems instantly.",
        icon_name: "MessageSquare",
        href: "/use-cases/ivr"
    },
    {
        title: "Automated Appointment Scheduling",
        description: "AI agents that call prospects, find a time that works for everyone, and book directly into your Google Calendar or Calendly.",
        icon_name: "Calendar",
        href: "/use-cases/scheduling"
    },
    {
        title: "CRM & ERP Integrations",
        description: "Seamlessly connect AI voice agents to your existing CRM, ERP, or helpdesk systems for real-time data sync and workflow automation.",
        icon_name: "Database",
        href: "/use-cases/crm-integration"
    },
    {
        title: "Multi-Language Support",
        description: "Communicate with your global audience effortlessly. Our agents can fluidly switch between over 30 languages in real-time.",
        icon_name: "Globe",
        href: "/use-cases/multi-language"
    },
    {
        title: "Custom AI Dashboards",
        description: "Get real-time visibility into your agent's performance, view call transcripts, and analyze sentiment with custom analytics dashboards.",
        icon_name: "BarChart",
        href: "/use-cases/custom-dashboards"
    }
];

export default function Solutions() {
    const [solutions, setSolutions] = useState<SolutionItem[]>(defaultSolutions);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const { data } = await getPublishedServices();
                if (data && data.length > 0) {
                    setSolutions(data as SolutionItem[]);
                }
            } catch (error) {
                console.error("Failed to fetch services:", error);
            }
        };
        fetchServices();
    }, []);

    const getIcon = (iconName?: string | null): LucideIcon => {
        return (iconName && iconRegistry[iconName]) || LucideIcons.Cpu;
    };

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const chunkSize = isMobile ? 4 : 9;
    const slides = chunkArray(solutions, chunkSize);

    return (
        <section className="py-24 bg-gray-50 dark:bg-zinc-950 relative border-t border-black/5 dark:border-white/5 transition-colors duration-300" id="solutions">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px]">
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
                        We build robust, scalable AI voice systems that seamlessly integrate with your existing infrastructure to drive measurable ROI.
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="relative pb-16"
                >
                    <Swiper
                        key={chunkSize}
                        modules={[Pagination]}
                        spaceBetween={30}
                        slidesPerView={1}
                        pagination={{ clickable: true }}
                        className="w-full"
                    >
                        {slides.map((slideItems, slideIndex) => (
                            <SwiperSlide key={slideIndex}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 auto-rows-fr">
                                    {slideItems.map((solution, index) => {
                                        const Icon = getIcon(solution.icon_name);
                                        const href = resolveSolutionHref(solution);
                                        return (
                                            <div
                                                key={solution.id || index}
                                                className="bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-3xl p-6 md:p-8 flex flex-col group hover:border-blue-500/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
                                            >
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-full pointer-events-none transition-transform group-hover:scale-150 duration-500" />

                                                <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                                    <Icon className="h-7 w-7" />
                                                </div>

                                                <h3 className="text-xl font-bold text-black dark:text-white mb-4 transition-colors duration-300">
                                                    {solution.title}
                                                </h3>

                                                <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base leading-relaxed mb-8 flex-grow transition-colors duration-300">
                                                    {solution.description}
                                                </p>

                                                <Link
                                                    href={href}
                                                    className="inline-flex items-center text-sm font-bold text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors mt-auto"
                                                >
                                                    Learn more <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                                </Link>
                                            </div>
                                        );
                                    })}
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </motion.div>
            </div>
        </section>
    );
}
