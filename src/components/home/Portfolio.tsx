"use client";

import { motion, AnimatePresence } from "framer-motion";
import { PlayCircle, X } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { getPortfolioProjects } from "@/app/admin/(protected)/portfolio/actions";
import WebRTCVoiceDemo from "@/components/WebRTCVoiceDemo";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Grid } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/grid";

const defaultPortfolioItems = [
    {
        title: "Real Estate Appointment Setter",
        short_description: "An inbound/outbound hybrid agent that calls Facebook lead form submissions within 5 seconds, asks 4 qualification questions, and books directly to Calendly.",
        metrics: [{ value: "34%", label: "Conversion Rate" }, { value: "< 5s", label: "Response Time" }],
        color: "from-blue-500/20 to-indigo-500/20",
        borderColor: "border-blue-500/30",
        project_type: "webrtc",
        media_url: "087efbdc-3fcf-4329-a12e-819eb64d3882"
    },
    {
        title: "Customer Support Router for E-commerce",
        short_description: "A 24/7 inbound agent that handles 'Where is my order?' queries by checking Shopify via API, and intelligently routes complex issues to human agents.",
        metrics: [{ value: "60%", label: "Ticket Deflection" }, { value: "24/7", label: "Availability" }],
        color: "from-purple-500/20 to-pink-500/20",
        borderColor: "border-purple-500/30",
        project_type: "webrtc",
        media_url: "087efbdc-3fcf-4329-a12e-819eb64d3882"
    },
    {
        title: "Solar Pre-Qualification Outbound AI",
        short_description: "A high-volume outbound dialer designed to verify homeownership, calculate rough shade estimates, and schedule virtual consultations.",
        metrics: [{ value: "400+", label: "Calls/Day" }, { value: "12%", label: "Meeting Set Rate" }],
        color: "from-orange-500/20 to-red-500/20",
        borderColor: "border-orange-500/30",
        project_type: "webrtc",
        media_url: "087efbdc-3fcf-4329-a12e-819eb64d3882"
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
    const [selectedProject, setSelectedProject] = useState<any | null>(null);
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
                        {portfolioItems.map((item, index) => (
                            <SwiperSlide key={item.title + index} className="!h-auto mb-6">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: (index % 6) * 0.1 }}
                                    className="h-full"
                                >
                                    <div className={`p-8 rounded-2xl bg-gradient-to-br ${item.color} border border-black/5 dark:${item.borderColor} backdrop-blur-md relative overflow-hidden group shadow-sm dark:shadow-none bg-white dark:bg-transparent transition-colors duration-300 flex flex-col h-full min-h-[320px]`}>
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
                                            <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 flex-grow transition-colors duration-300 line-clamp-3">{item.short_description}</p>

                                            <div className="space-y-2 mb-6">
                                                {item.metrics?.map((metric: any, i: number) => (
                                                    <div key={i} className="flex items-center text-xs text-blue-600 dark:text-blue-300 font-medium transition-colors duration-300">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2" />
                                                        {metric.value} {metric.label}
                                                    </div>
                                                ))}
                                            </div>

                                            <button
                                                onClick={() => setSelectedProject(item)}
                                                className="inline-flex items-center text-sm font-semibold text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 mt-auto text-left"
                                            >
                                                <PlayCircle className="w-4 h-4 mr-2" /> 
                                                {item.project_type === 'webrtc' ? 'Talk to Agent' : item.project_type === 'audio' ? 'Listen to Call' : 'Watch Demo'}
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>

            {/* Portfolio Media Player Modal */}
            <AnimatePresence>
                {selectedProject && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-8">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedProject(null)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-4xl bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl z-10"
                        >
                            <div className="flex items-center justify-between p-4 border-b border-black/5 dark:border-white/5">
                                <div>
                                    <h3 className="font-bold text-black dark:text-white">{selectedProject.title}</h3>
                                    <p className="text-xs text-gray-500">{selectedProject.industry_tag}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedProject(null)}
                                    className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            <div className="p-6 md:p-10 max-h-[80vh] overflow-y-auto">
                                {selectedProject.project_type === 'webrtc' && (
                                    <div className="max-w-2xl mx-auto">
                                        <WebRTCVoiceDemo
                                            agentRole={selectedProject.title}
                                            vapiAgentId={selectedProject.media_url || "087efbdc-3fcf-4329-a12e-819eb64d3882"}
                                        />
                                        <p className="text-center text-xs text-gray-500 mt-6">
                                            Click "Start Call" to interact with this agent live. Ensure your microphone is enabled.
                                        </p>
                                    </div>
                                )}

                                {selectedProject.project_type === 'audio' && (
                                    <div className="flex flex-col items-center justify-center py-12">
                                        <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6">
                                            <PlayCircle className="w-10 h-10 text-blue-600" />
                                        </div>
                                        <h4 className="text-xl font-bold mb-4 text-black dark:text-white">Listen to Call Recording</h4>
                                        <audio controls className="w-full max-w-md">
                                            <source src={selectedProject.media_url} type="audio/mpeg" />
                                            Your browser does not support the audio element.
                                        </audio>
                                    </div>
                                )}

                                {selectedProject.project_type === 'video' && (
                                    <div className="aspect-video w-full rounded-xl overflow-hidden bg-black shadow-lg">
                                        {selectedProject.media_url?.includes('youtube.com') || selectedProject.media_url?.includes('youtu.be') ? (
                                            <iframe
                                                src={selectedProject.media_url.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                                                className="w-full h-full border-0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            />
                                        ) : (
                                            <video controls className="w-full h-full">
                                                <source src={selectedProject.media_url} type="video/mp4" />
                                                Your browser does not support the video tag.
                                            </video>
                                        )}
                                    </div>
                                )}
                                
                                <div className="mt-8 pt-8 border-t border-black/5 dark:border-white/5">
                                    <h4 className="font-semibold text-black dark:text-white mb-2">Project Overview</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedProject.short_description}</p>
                                    
                                    <div className="mt-6 flex flex-wrap gap-4">
                                        {selectedProject.metrics?.map((m: any, i: number) => (
                                            <div key={i} className="bg-gray-50 dark:bg-black/40 border border-black/5 dark:border-white/5 rounded-lg p-3 min-w-[120px]">
                                                <div className="text-xl font-bold text-blue-600 dark:text-blue-500">{m.value}</div>
                                                <div className="text-[10px] text-gray-500 uppercase font-semibold">{m.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-4 bg-gray-50 dark:bg-black/60 border-t border-black/5 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <p className="text-xs text-gray-500">Interested in this specific deployment?</p>
                                <Link 
                                    href="/#consultation" 
                                    onClick={() => setSelectedProject(null)}
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors"
                                >
                                    Book a Consultation
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
}
