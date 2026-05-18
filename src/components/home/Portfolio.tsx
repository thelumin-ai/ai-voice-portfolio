"use client";

import { motion, AnimatePresence } from "framer-motion";
import { PlayCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getPortfolioProjects } from "@/app/admin/(protected)/portfolio/actions";
import WebRTCVoiceDemo from "@/components/WebRTCVoiceDemo";
import RetellVoiceDemo from "@/components/RetellVoiceDemo";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

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

export default function Portfolio({ showAll = false }: { showAll?: boolean }) {
    const [allItems, setAllItems] = useState<any[]>(defaultPortfolioItems);
    const [selectedProject, setSelectedProject] = useState<any | null>(null);

    useEffect(() => {
        const fetchPortfolios = async () => {
            try {
                const data = await getPortfolioProjects();
                if (data && data.length > 0) {
                    const published = data.filter(p => p.status === 'published');
                    
                    if (showAll) {
                        setAllItems(published.map((p, index) => ({
                            ...p,
                            color: colors[index % colors.length].color,
                            borderColor: colors[index % colors.length].borderColor,
                        })));
                    } else {
                        // Home page logic: Prioritize featured, then fill with other published items up to 4
                        const featured = published.filter(p => p.is_featured);
                        const others = published.filter(p => !p.is_featured);
                        const combined = [...featured, ...others].slice(0, 4);
                        
                        // If still not enough, add default items as fallback
                        let finalItems = [...combined];
                        if (finalItems.length < 4) {
                            defaultPortfolioItems.forEach(defItem => {
                                if (finalItems.length < 4 && !finalItems.find(p => p.title === defItem.title)) {
                                    finalItems.push(defItem);
                                }
                            });
                        }

                        setAllItems(finalItems.map((p, index) => ({
                            ...p,
                            color: colors[index % colors.length].color,
                            borderColor: colors[index % colors.length].borderColor,
                        })));
                    }
                }
            } catch (error) {
                console.error("Failed to fetch portfolios:", error);
            }
        };
        fetchPortfolios();
    }, []);

    // For the home page widget (showAll=false), we want the slider.
    // If showAll=true, we could just render a normal grid, but let's keep the slider logic consistent or just render all items.
    
    const chunkArray = (arr: any[], size: number) => {
        const result = [];
        for (let i = 0; i < arr.length; i += size) {
            result.push(arr.slice(i, i + size));
        }
        return result;
    };

    const [isMobile, setIsMobile] = useState(false);
    
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Home widget uses chunking for the slider. Full page just shows everything.
    const chunkSize = isMobile ? 4 : 9;
    const itemsToDisplay = showAll ? allItems : allItems;
    const slides = chunkArray(itemsToDisplay, chunkSize);

    return (
        <section className={`py-24 bg-gray-50 dark:bg-zinc-950 relative border-t border-black/5 dark:border-white/5 transition-colors duration-300 ${showAll ? 'min-h-screen pt-32' : ''}`} id="portfolio">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px]">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold tracking-tight text-black dark:text-white mb-6 transition-colors duration-300"
                    >
                        {showAll ? <>All <span className="text-blue-600 dark:text-blue-500">Projects</span></> : <>Systems I've <span className="text-blue-600 dark:text-blue-500">Built</span></>}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-gray-600 dark:text-gray-400 transition-colors duration-300"
                    >
                        {showAll
                            ? `${allItems.length} projects — click any card to explore the demo, call recording, or video.`
                            : 'Real-world AI voice architectures driving measurable revenue for my clients.'}
                    </motion.p>
                    {!showAll && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="mt-6"
                        >
                            <Link href="/portfolio" className="inline-flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                                View All Projects →
                            </Link>
                        </motion.div>
                    )}
                </div>

                {showAll ? (
                    // On the dedicated /portfolio page, we show a responsive grid
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 auto-rows-fr">
                        {itemsToDisplay.map((item, index) => (
                            <PortfolioCard 
                                key={item.title + index} 
                                item={item} 
                                index={index} 
                                onClick={() => setSelectedProject(item)} 
                            />
                        ))}
                    </div>
                ) : (
                    // On the homepage, use a static grid: 4 on one row desktop, 2x2 mobile
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 auto-rows-fr"
                    >
                        {itemsToDisplay.slice(0, 4).map((item, index) => (
                            <PortfolioCard 
                                key={item.title + index} 
                                item={item} 
                                index={index} 
                                onClick={() => setSelectedProject(item)} 
                            />
                        ))}
                    </motion.div>
                )}
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
                            className="absolute inset-0 bg-black/90 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-4xl bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl z-10 border border-white/10"
                        >
                            <div className="flex items-center justify-between p-6 border-b border-black/5 dark:border-white/5 bg-gray-50 dark:bg-zinc-800/50">
                                <div>
                                    <h3 className="text-xl font-bold text-black dark:text-white">{selectedProject.title}</h3>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider">{selectedProject.industry_tag}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedProject(null)}
                                    className="p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors"
                                    aria-label="Close modal"
                                >
                                    <X className="w-6 h-6 text-gray-500" />
                                </button>
                            </div>

                            <div className="p-8 md:p-12 max-h-[70vh] overflow-y-auto">
                                {selectedProject.project_type === 'iframe' && (
                                    <div className="max-w-md mx-auto h-[600px] bg-zinc-100 dark:bg-black rounded-3xl overflow-hidden shadow-2xl border border-black/10 dark:border-white/10 relative">
                                        <iframe
                                            src={selectedProject.media_url}
                                            allow="microphone; camera; display-capture; autoplay; clipboard-read; clipboard-write"
                                            className="w-full h-full border-0"
                                        />
                                    </div>
                                )}

                                {selectedProject.project_type === 'webrtc' && (() => {
                                    const urlOrId = selectedProject.media_url || "087efbdc-3fcf-4329-a12e-819eb64d3882";
                                    const isVapiShareUrl = urlOrId.includes('vapi.ai') && urlOrId.includes('shareKey=');
                                    const isRetellPlatform = selectedProject.voice_platform === 'retell';

                                    if (isVapiShareUrl) {
                                        return (
                                            <div className="max-w-md mx-auto h-[600px] bg-zinc-100 dark:bg-black rounded-3xl overflow-hidden shadow-2xl border border-black/10 dark:border-white/10 relative">
                                                <iframe
                                                    src={urlOrId}
                                                    allow="microphone; camera; display-capture; autoplay; clipboard-read; clipboard-write"
                                                    className="w-full h-full border-0"
                                                />
                                            </div>
                                        );
                                    }

                                    if (isRetellPlatform) {
                                        return (
                                            <div className="max-w-2xl mx-auto">
                                                <RetellVoiceDemo
                                                    agentRole={selectedProject.title}
                                                    agentId={urlOrId}
                                                    apiKey={selectedProject.api_key || undefined}
                                                />
                                                <p className="text-center text-xs text-gray-500 mt-8 font-medium">
                                                    Live Retell WebRTC demo. Ensure your microphone is enabled.
                                                </p>
                                            </div>
                                        );
                                    }

                                    return (
                                        <div className="max-w-2xl mx-auto">
                                            <WebRTCVoiceDemo
                                                agentRole={selectedProject.title}
                                                vapiAgentId={urlOrId}
                                                apiKey={selectedProject.api_key || undefined}
                                            />
                                            <p className="text-center text-xs text-gray-500 mt-8 font-medium">
                                                Live WebRTC demo. Ensure your microphone is enabled.
                                            </p>
                                        </div>
                                    );
                                })()}

                                {selectedProject.project_type === 'audio' && (() => {
                                    // Resolve the audio source: media_url first, then first audio in media_files
                                    const audioSrc = selectedProject.media_url ||
                                        (selectedProject.media_files || []).find((f: any) => f.type === 'audio')?.url;
                                    return (
                                    <div className="flex flex-col items-center justify-center py-12">
                                        <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-8">
                                            <PlayCircle className="w-12 h-12 text-blue-600" />
                                        </div>
                                        <h4 className="text-2xl font-bold mb-6 text-black dark:text-white">Call Recording</h4>
                                        {audioSrc ? (
                                            <audio 
                                                key={audioSrc} 
                                                src={audioSrc}
                                                controls 
                                                preload="auto"
                                                className="w-full max-w-md shadow-lg rounded-full"
                                            >
                                                Your browser does not support the audio element.
                                            </audio>
                                        ) : (
                                            <p className="text-gray-500 text-sm">No audio file found. Please add an audio file in the admin panel.</p>
                                        )}
                                        {audioSrc && (
                                            <a 
                                                href={audioSrc} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-[10px] text-blue-600 dark:text-blue-400 underline mt-4"
                                            >
                                                Open Direct Link
                                            </a>
                                        )}
                                    </div>
                                    );
                                })()}

                                {selectedProject.project_type === 'video' && (() => {
                                    const videoSrc = selectedProject.media_url ||
                                        (selectedProject.media_files || []).find((f: any) => f.type === 'video')?.url;
                                    return (
                                    <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-2xl">
                                        {!videoSrc ? (
                                            <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">No video source found.</div>
                                        ) : videoSrc.includes('youtube.com') || videoSrc.includes('youtu.be') ? (
                                            <iframe
                                                key={videoSrc}
                                                src={videoSrc.includes('youtube.com/embed/') ? videoSrc : videoSrc.replace('watch?v=', 'embed/').split('&')[0].replace('youtu.be/', 'youtube.com/embed/')}
                                                className="w-full h-full border-0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            />
                                        ) : videoSrc.includes('vimeo.com') ? (
                                            <iframe
                                                key={videoSrc}
                                                src={`https://player.vimeo.com/video/${videoSrc.split('/').pop()}`}
                                                className="w-full h-full border-0"
                                                allow="autoplay; fullscreen; picture-in-picture"
                                                allowFullScreen
                                            />
                                        ) : (
                                            <video 
                                                key={videoSrc}
                                                src={videoSrc}
                                                controls 
                                                className="w-full h-full"
                                            >
                                                Your browser does not support the video tag.
                                            </video>
                                        )}
                                    </div>
                                    );
                                })()}
                                
                                <div className="mt-12 pt-8 border-t border-black/5 dark:border-white/5 grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div>
                                        <h4 className="font-bold text-black dark:text-white mb-4 uppercase tracking-tighter text-sm">Deployment Strategy</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{selectedProject.short_description}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-black dark:text-white mb-4 uppercase tracking-tighter text-sm">Key Performance Indicators</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            {selectedProject.metrics?.map((m: any, i: number) => (
                                                <div key={i} className="bg-gray-50 dark:bg-black/40 border border-black/5 dark:border-white/5 rounded-xl p-4">
                                                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-500">{m.value}</div>
                                                    <div className="text-[10px] text-gray-500 uppercase font-bold">{m.label}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-6 bg-gray-50 dark:bg-black/60 border-t border-black/5 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
                                <div className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400">
                                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" /> Ready for Deployment
                                </div>
                                <Link 
                                    href="/#consultation" 
                                    onClick={() => setSelectedProject(null)}
                                    className="px-10 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all hover:shadow-lg hover:shadow-blue-600/20 active:scale-95"
                                >
                                    Book a Free Consultation
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
}

// Extracted card component for reuse
function PortfolioCard({ item, index, onClick }: { item: any, index: number, onClick: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: (index % 3) * 0.1 }}
            className="h-full"
        >
            <div className={`p-6 md:p-8 rounded-3xl bg-gradient-to-br ${item.color} border border-black/5 dark:${item.borderColor} backdrop-blur-md relative overflow-hidden group shadow-sm dark:shadow-none bg-white/50 dark:bg-black/20 transition-all duration-500 hover:scale-[1.02] h-full flex flex-col min-h-[350px]`}>
                <div className="absolute inset-0 bg-white/10 dark:bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative z-10 flex flex-col h-full">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-2 uppercase tracking-widest">{item.industry_tag || 'Enterprise'}</span>
                    <h3 className="text-xl md:text-2xl font-bold text-black dark:text-white mb-3 transition-colors duration-300">{item.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base mb-8 flex-grow leading-relaxed transition-colors duration-300">{item.short_description}</p>

                    <div className="flex flex-wrap gap-4 mb-8">
                        {item.metrics?.map((metric: any, i: number) => (
                            <div key={i} className="flex flex-col">
                                <span className="text-lg font-bold text-black dark:text-white">{metric.value}</span>
                                <span className="text-[10px] text-gray-500 uppercase font-semibold">{metric.label}</span>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={onClick}
                        className="inline-flex items-center text-sm font-bold text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 mt-auto"
                    >
                        <PlayCircle className="w-5 h-5 mr-2" /> 
                        {item.project_type === 'webrtc' ? 'TALK TO AGENT' : item.project_type === 'iframe' ? 'TRY LIVE DEMO' : item.project_type === 'audio' ? 'LISTEN TO CALL' : 'WATCH DEMO'}
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
