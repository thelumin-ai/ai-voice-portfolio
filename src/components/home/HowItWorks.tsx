"use client";

import { motion } from "framer-motion";
import { MessageSquare, Cpu, Headphones, Zap, Rocket, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { getProcessSteps } from "@/app/admin/(protected)/process-steps/actions";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";

const defaultSteps = [
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
    const [processSteps, setProcessSteps] = useState<any[]>(defaultSteps);
    const [isLoading, setIsLoading] = useState(true);
    const swiperRef = useRef<SwiperType | null>(null);

    useEffect(() => {
        const fetchSteps = async () => {
            try {
                const data = await getProcessSteps();
                if (data.data && data.data.length > 0) {
                    const published = data.data.filter(s => s.status === 'published');
                    if (published.length > 0) {
                        const mappedData = published.map((s, index) => ({
                            ...s,
                            icon: (defaultSteps[index % defaultSteps.length] as any).icon || Rocket
                        }));
                        setProcessSteps(mappedData);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch process steps:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSteps();
    }, []);

    return (
        <section className="py-24 bg-white dark:bg-black relative border-t border-black/5 dark:border-white/5 overflow-hidden transition-colors duration-300" id="how-it-works">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
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
                        A battle-tested process to deploy enterprise AI voice automation in under 14 days.
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
                        autoplay={{ delay: 5000, disableOnInteraction: false }}
                        loop={processSteps.length > 3}
                        onSwiper={(swiper) => { swiperRef.current = swiper; }}
                        className="pb-4"
                    >
                        {processSteps.map((step, index) => (
                            <SwiperSlide key={step.title + index}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="h-full"
                                >
                                    <div className="glass-panel bg-white/50 dark:bg-zinc-900/50 p-8 relative overflow-hidden group hover:border-blue-500/30 transition-colors duration-300 border border-black/10 dark:border-white/10 h-full min-h-[280px]">
                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500/0 via-blue-500/50 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="flex items-center mb-4 text-blue-600 dark:text-blue-400">
                                            <span className="text-sm font-bold tracking-wider mr-4 opacity-50">STEP 0{index + 1}</span>
                                            <step.icon className="h-6 w-6" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-black dark:text-white mb-3 transition-colors duration-300">{step.title}</h3>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed transition-colors duration-300">{step.description}</p>
                                    </div>
                                </motion.div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Navigation Arrows */}
                    <div className="flex justify-center gap-3 mt-8">
                        <button
                            onClick={() => swiperRef.current?.slidePrev()}
                            className="w-10 h-10 rounded-full border border-black/10 dark:border-white/20 flex items-center justify-center text-black dark:text-white hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-all duration-300"
                            aria-label="Previous step"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => swiperRef.current?.slideNext()}
                            className="w-10 h-10 rounded-full border border-black/10 dark:border-white/20 flex items-center justify-center text-black dark:text-white hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-all duration-300"
                            aria-label="Next step"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
