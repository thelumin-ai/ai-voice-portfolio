"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import * as LucideIcons from "lucide-react";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { getPublishedUseCases } from "@/app/admin/(protected)/use-cases/actions";
import type { UseCaseRecord } from "@/lib/types";
import { RICH_USE_CASES, mergePublishedUseCases } from "@/lib/useCasesData";
import { isSafeHttpUrl } from "@/lib/url";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const iconRegistry = LucideIcons as unknown as Record<string, LucideIcon>;

function chunkArray<T>(arr: T[], size: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
        result.push(arr.slice(i, i + size));
    }
    return result;
}

const FALLBACK_COVER =
    "https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=1000&auto=format&fit=crop";

function resolveCoverUrl(url?: string | null): string {
    if (!url) return FALLBACK_COVER;
    if (isSafeHttpUrl(url) || (url.startsWith("/") && !url.startsWith("//"))) {
        return url;
    }
    return FALLBACK_COVER;
}

export default function UseCases() {
    const [useCases, setUseCases] = useState<UseCaseRecord[]>(RICH_USE_CASES);

    useEffect(() => {
        const fetchCases = async () => {
            try {
                const { data } = await getPublishedUseCases();
                if (data && data.length > 0) {
                    setUseCases(mergePublishedUseCases(data as UseCaseRecord[]));
                }
            } catch (error) {
                console.error("Failed to fetch use cases:", error);
            }
        };
        fetchCases();
    }, []);

    const getIcon = (iconName?: string | null): LucideIcon => {
        return (iconName && iconRegistry[iconName]) || LucideIcons.Briefcase;
    };

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const chunkSize = isMobile ? 4 : 9;
    const slides = chunkArray(useCases, chunkSize);

    return (
        <section className="py-24 bg-white dark:bg-black border-t border-black/5 dark:border-white/5 relative transition-colors duration-300" id="use-cases">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px]">
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
                                    {slideItems.map((useCase, index) => {
                                        const Icon = getIcon(useCase.icon_name);
                                        return (
                                            <Link key={useCase.industry_slug || index} href={`/use-cases/${useCase.industry_slug}`} className="block group h-full">
                                                <div className="relative overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 h-full min-h-[300px] md:min-h-[400px] flex flex-col justify-end p-6 md:p-8 shadow-sm dark:shadow-none hover:shadow-2xl dark:hover:shadow-none transition-all duration-500">
                                                    {/* Background Image */}
                                                    <div className="absolute inset-0 z-0">
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent z-10" />
                                                        <Image
                                                            src={resolveCoverUrl(useCase.cover_image_url)}
                                                            alt={useCase.name}
                                                            fill
                                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                            className="object-cover transform scale-100 group-hover:scale-110 transition-transform duration-700"
                                                        />
                                                    </div>

                                                    <div className="relative z-20 transform translate-y-0 md:translate-y-4 md:group-hover:translate-y-0 transition-transform duration-500">
                                                        <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-4 border border-white/20 group-hover:bg-blue-600 group-hover:border-blue-500/50 transition-all duration-500">
                                                            <Icon className="h-6 w-6 text-white" />
                                                        </div>
                                                        <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{useCase.name}</h3>
                                                        <p className="text-gray-300 text-sm mb-4 md:mb-6 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 line-clamp-2">
                                                            {useCase.headline}
                                                        </p>
                                                        <div className="flex items-center text-xs font-bold text-blue-400 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500 delay-100">
                                                            EXPLORE AGENTS <ArrowRight className="ml-2 h-3 w-3" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
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
