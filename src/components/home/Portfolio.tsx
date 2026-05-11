"use client";

import { motion } from "framer-motion";
import { PlayCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { getPortfolioProjects } from "@/app/admin/(protected)/portfolio/actions";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/pagination";

const defaultPortfolioItems = [
    {
        title: "Real Estate Appointment Setter",
        short_description: "An inbound/outbound hybrid agent that calls Facebook lead form submissions within 5 seconds, asks 4 qualification questions, and books directly to Calendly.",
        metrics: [{ value: "34%", label: "Conversion Rate" }, { value: "< 5s", label: "Response Time" }],
        color: "from-blue-500/20 to-indigo-500/20",
        borderColor: "border-blue-500/30",
        demo_link: "/playground"
    },
    {
        title: "Customer Support Router for E-commerce",
        short_description: "A 24/7 inbound agent that handles 'Where is my order?' queries by checking Shopify via API, and intelligently routes complex issues to human agents.",
        metrics: [{ value: "60%", label: "Ticket Deflection" }, { value: "24/7", label: "Availability" }],
        color: "from-purple-500/20 to-pink-500/20",
        borderColor: "border-purple-500/30",
        demo_link: "/playground"
    },
    {
        title: "Solar Pre-Qualification Outbound AI",
        short_description: "A high-volume outbound dialer designed to verify homeownership, calculate rough shade estimates, and schedule virtual consultations.",
        metrics: [{ value: "400+", label: "Calls/Day" }, { value: "12%", label: "Meeting Set Rate" }],
        color: "from-orange-500/20 to-red-500/20",
        borderColor: "border-orange-500/30",
        demo_link: "/playground"
    }
];

const colors = [
    { color: "from-blue-500/20 to-indigo-500/20", borderColor: "border-blue-500/30" },
    { color: "from-purple-500/20 to-pink-500/20", borderColor: "border-purple-500/30" },
    { color: "from-orange-500/20 to-red-500/20", borderColor: "border-orange-500/30" },
    { color: "from-green-500/20 to-emerald-500/20", borderColor: "border-green-500/30" },
    { color: "from-pink-500/20 to-rose-500/20", borderColor: "border-pink-500/30" },
]

export default function Portfolio() {
    const [portfolioItems, setPortfolioItems] = useState<any[]>(defaultPortfolioItems);
    const [isLoading, setIsLoading] = useState(true);
    const swiperRef = useRef<SwiperType | null>(null);

    useEffect(() => {
        const fetchPortfolios = async () => {
            try {
                const data = await getPortfolioProjects();
                if (data && data.length > 0) {
                    const mappedData = data.filter(p => p.status === 'published').map((p, index) => ({
                        ...p,
                        color: colors[index % colors.length].color,
                        borderColor: colors[index % colors.length].borderColor,
                    }));
                    setPortfolioItems(mappedData.length > 0 ? mappedData : defaultPortfolioItems);
                }
            } catch (error) {
                console.error("Failed to fetch portfolios:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPortfolios();
    }, []);

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

                <div className="relative pb-12">
                    <Swiper
                        modules={[Pagination, Autoplay]}
                        spaceBetween={16}
                        slidesPerView={2}
                        breakpoints={{
                            480: { slidesPerView: 3 },
                            640: { slidesPerView: 4 },
                            1024: { slidesPerView: 6 },
                        }}
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 5000, disableOnInteraction: false }}
                        loop={portfolioItems.length > 6}
                        onSwiper={(swiper) => { swiperRef.current = swiper; }}
                        className="pb-10"
                    >
                        {portfolioItems.map((item, index) => (
                            <SwiperSlide key={item.title + index}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="h-full"
                                >
                                    <div className={`p-8 rounded-2xl bg-gradient-to-br ${item.color} border border-black/5 dark:${item.borderColor} backdrop-blur-md relative overflow-hidden group shadow-sm dark:shadow-none bg-white dark:bg-transparent transition-colors duration-300 flex flex-col h-full min-h-[360px]`}>
                                        <div className="absolute inset-0 bg-black/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                        <div className="relative z-10 flex flex-col h-full">
                                            {item.cover_image_url && (
                                                <img src={item.cover_image_url} alt={item.title} className="w-full aspect-video object-cover rounded-lg mb-4" />
                                            )}
                                            
                                            {item.industry_tag && (
                                                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2 uppercase tracking-wider">
                                                    {item.industry_tag}
                                                </span>
                                            )}
                                            
                                            <h3 className="text-xl font-bold text-black dark:text-white mb-3 transition-colors duration-300">{item.title}</h3>
                                            <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 flex-grow transition-colors duration-300">{item.short_description}</p>

                                            <div className="space-y-2 mb-6">
                                                {item.metrics?.map((metric: any, i: number) => (
                                                    <div key={i} className="flex items-center text-xs text-blue-600 dark:text-blue-300 font-medium transition-colors duration-300">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2" />
                                                        {metric.value} {metric.label}
                                                    </div>
                                                ))}
                                            </div>

                                            <Link
                                                href={item.demo_link || "/playground"}
                                                className="inline-flex items-center text-sm font-semibold text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 mt-auto"
                                            >
                                                <PlayCircle className="w-4 h-4 mr-2" /> View Project
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Dots handled by pagination */}
                </div>
            </div>
        </section>
    );
}
