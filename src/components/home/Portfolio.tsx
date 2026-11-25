"use client";

import { motion, AnimatePresence } from "framer-motion";
import { PlayCircle, X, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { getPublicPortfolioProjects } from "@/app/admin/(protected)/portfolio/actions";
import { sanitizeHref } from "@/lib/url";
import { DEFAULT_VAPI_AGENT_ID } from "@/lib/vapiConfig";
import type { PortfolioMediaFile, PortfolioMetric, PortfolioProject } from "@/lib/types";

const WebRTCVoiceDemo = dynamic(() => import("@/components/WebRTCVoiceDemo"), {
    ssr: false,
    loading: () => (
        <div className="w-full max-w-2xl mx-auto h-[540px] sm:h-[600px] rounded-2xl bg-black/5 dark:bg-zinc-900/50 animate-pulse border border-black/10 dark:border-white/10" />
    ),
});

const RetellVoiceDemo = dynamic(() => import("@/components/RetellVoiceDemo"), {
    ssr: false,
    loading: () => (
        <div className="w-full max-w-2xl mx-auto h-[540px] sm:h-[600px] rounded-2xl bg-black/5 dark:bg-zinc-900/50 animate-pulse border border-black/10 dark:border-white/10" />
    ),
});

const defaultPortfolioItems: PortfolioProject[] = [
    {
        title: "Real Estate Appointment Setter",
        short_description: "An inbound/outbound hybrid agent that calls Facebook lead form submissions within 5 seconds, asks 4 qualification questions, and books directly to Calendly.",
        metrics: [{ value: "34%", label: "Conversion Rate" }, { value: "< 5s", label: "Response Time" }],
        color: "from-blue-500/20 to-indigo-500/20",
        borderClass: "border-black/10 dark:border-blue-500/30",
        project_type: "webrtc",
        media_url: DEFAULT_VAPI_AGENT_ID
    },
    {
        title: "Customer Support Router for E-commerce",
        short_description: "A 24/7 inbound agent that handles 'Where is my order?' queries by checking Shopify via API, and intelligently routes complex issues to human agents.",
        metrics: [{ value: "60%", label: "Ticket Deflection" }, { value: "24/7", label: "Availability" }],
        color: "from-purple-500/20 to-pink-500/20",
        borderClass: "border-black/10 dark:border-purple-500/30",
        project_type: "webrtc",
        media_url: DEFAULT_VAPI_AGENT_ID
    },
    {
        title: "Solar Pre-Qualification Outbound AI",
        short_description: "A high-volume outbound dialer designed to verify homeownership, calculate rough shade estimates, and schedule virtual consultations.",
        metrics: [{ value: "400+", label: "Calls/Day" }, { value: "12%", label: "Meeting Set Rate" }],
        color: "from-orange-500/20 to-red-500/20",
        borderClass: "border-black/10 dark:border-orange-500/30",
        project_type: "webrtc",
        media_url: DEFAULT_VAPI_AGENT_ID
    }
];

const colorThemes = [
    { color: "from-blue-500/20 to-indigo-500/20", borderClass: "border-black/10 dark:border-blue-500/30" },
    { color: "from-purple-500/20 to-pink-500/20", borderClass: "border-black/10 dark:border-purple-500/30" },
    { color: "from-orange-500/20 to-red-500/20", borderClass: "border-black/10 dark:border-orange-500/30" },
    { color: "from-green-500/20 to-emerald-500/20", borderClass: "border-black/10 dark:border-green-500/30" },
    { color: "from-pink-500/20 to-rose-500/20", borderClass: "border-black/10 dark:border-pink-500/30" },
];

export default function Portfolio({ showAll = false }: { showAll?: boolean }) {
    const [allItems, setAllItems] = useState<PortfolioProject[]>(defaultPortfolioItems);
    const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);

    useEffect(() => {
        const fetchPortfolios = async () => {
            try {
                const published = (await getPublicPortfolioProjects()) as PortfolioProject[];
                if (published && published.length > 0) {
                    if (showAll) {
                        setAllItems(published.map((p, index) => ({
                            ...p,
                            color: colorThemes[index % colorThemes.length].color,
                            borderClass: colorThemes[index % colorThemes.length].borderClass,
                        })));
                    } else {
                        const featured = published.filter(p => p.is_featured);
                        const others = published.filter(p => !p.is_featured);
                        const finalItems: PortfolioProject[] = [...featured, ...others].slice(0, 3);

                        if (finalItems.length < 3) {
                            defaultPortfolioItems.forEach(defItem => {
                                if (finalItems.length < 3 && !finalItems.find(p => p.title === defItem.title)) {
                                    finalItems.push(defItem);
                                }
                            });
                        }

                        setAllItems(finalItems.map((p, index) => ({
                            ...p,
                            color: colorThemes[index % colorThemes.length].color,
                            borderClass: colorThemes[index % colorThemes.length].borderClass,
                        })));
                    }
                }
            } catch (error) {
                console.error("Failed to fetch portfolios:", error);
            }
        };
        fetchPortfolios();
    }, [showAll]);

    useEffect(() => {
        if (!selectedProject) return;
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setSelectedProject(null);
        };
        window.addEventListener("keydown", onKeyDown);
        return () => {
            document.body.style.overflow = prevOverflow;
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [selectedProject]);

    const itemsToDisplay = allItems;
    const modalMetrics = selectedProject ? getPremiumMetrics(selectedProject.title || '', selectedProject.metrics) : [];

    return (
        <section className={`py-24 bg-gray-50 dark:bg-zinc-950 relative border-t border-black/5 dark:border-white/5 transition-colors duration-300 ${showAll ? 'min-h-screen pt-16' : ''}`} id="portfolio">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px]">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold tracking-tight text-black dark:text-white mb-6 transition-colors duration-300"
                    >
                        {showAll ? <>All <span className="text-blue-600 dark:text-blue-500">Projects</span></> : <>Systems I&apos;ve <span className="text-blue-600 dark:text-blue-500">Built</span></>}
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 auto-rows-fr">
                        {itemsToDisplay.map((item, index) => (
                            <PortfolioCard
                                key={item.id || item.title + index}
                                item={item}
                                index={index}
                                onClick={() => setSelectedProject(item)}
                            />
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 auto-rows-fr"
                    >
                        {itemsToDisplay.slice(0, 3).map((item, index) => (
                            <PortfolioCard
                                key={item.id || item.title + index}
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
                    <div
                        className="fixed inset-0 z-[100] overflow-y-auto bg-black/85 backdrop-blur-md p-3 sm:p-6 md:p-8"
                        onClick={() => setSelectedProject(null)}
                    >
                        <div className="min-h-full flex items-center justify-center">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                role="dialog"
                                aria-modal="true"
                                aria-label={selectedProject.title}
                                onClick={(e) => e.stopPropagation()}
                                className="relative w-full max-w-4xl bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl border border-black/10 dark:border-white/10 my-4"
                            >
                                <div className="flex items-center justify-between gap-4 p-5 sm:p-6 border-b border-black/5 dark:border-white/5 bg-gray-50 dark:bg-zinc-800/50">
                                    <div className="min-w-0">
                                        <h3 className="text-lg sm:text-xl font-bold text-black dark:text-white truncate">{selectedProject.title}</h3>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider">{selectedProject.industry_tag}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedProject(null)}
                                        className="p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors shrink-0"
                                        aria-label="Close modal"
                                    >
                                        <X className="w-6 h-6 text-gray-500 dark:text-gray-300" />
                                    </button>
                                </div>

                                <div className="p-5 sm:p-8 md:p-10 max-h-[75dvh] overflow-y-auto custom-scrollbar">
                                    {selectedProject.cover_image_url && (
                                        <div className="relative mb-8 rounded-2xl overflow-hidden aspect-[16/9] max-h-80 w-full border border-black/10 dark:border-white/10 bg-zinc-950 shadow-md">
                                            <Image
                                                src={selectedProject.cover_image_url}
                                                alt={selectedProject.title}
                                                fill
                                                sizes="(max-width: 1024px) 100vw, 896px"
                                                className="object-cover"
                                            />
                                        </div>
                                    )}

                                    {selectedProject.project_type === 'iframe' && (
                                        <div className="max-w-md mx-auto h-[520px] sm:h-[600px] bg-zinc-100 dark:bg-black rounded-3xl overflow-hidden shadow-2xl border border-black/10 dark:border-white/10 relative">
                                            <iframe
                                                src={sanitizeHref(selectedProject.media_url, 'about:blank')}
                                                title={`${selectedProject.title} Interactive Demo`}
                                                allow="microphone; camera; display-capture; autoplay; clipboard-read; clipboard-write"
                                                className="w-full h-full border-0"
                                            />
                                        </div>
                                    )}

                                    {selectedProject.project_type === 'webrtc' && (() => {
                                        const urlOrId = selectedProject.media_url || DEFAULT_VAPI_AGENT_ID;
                                        const isVapiShareUrl = urlOrId.includes('vapi.ai') && urlOrId.includes('shareKey=');
                                        const isRetellPlatform = selectedProject.voice_platform === 'retell';

                                        if (isVapiShareUrl) {
                                            return (
                                                <div className="max-w-md mx-auto h-[520px] sm:h-[600px] bg-zinc-100 dark:bg-black rounded-3xl overflow-hidden shadow-2xl border border-black/10 dark:border-white/10 relative">
                                                    <iframe
                                                        src={sanitizeHref(urlOrId, 'about:blank')}
                                                        title={`${selectedProject.title} Vapi Demo`}
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
                                                        projectId={selectedProject.id}
                                                        agentId={urlOrId}
                                                    />
                                                    <p className="text-center text-xs text-gray-500 mt-6 font-medium">
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
                                                <p className="text-center text-xs text-gray-500 mt-6 font-medium">
                                                    Live WebRTC demo. Ensure your microphone is enabled.
                                                </p>
                                            </div>
                                        );
                                    })()}

                                    {selectedProject.project_type === 'audio' && (() => {
                                        const rawAudioSrc = selectedProject.media_url ||
                                            (selectedProject.media_files || []).find((f: PortfolioMediaFile) => f.type === 'audio')?.url;
                                        const audioSrc = rawAudioSrc ? sanitizeHref(rawAudioSrc, '') : '';
                                        return (
                                            <div className="flex flex-col items-center justify-center py-10">
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
                                                        className="text-xs text-blue-600 dark:text-blue-400 underline mt-4"
                                                    >
                                                        Open Direct Link
                                                    </a>
                                                )}
                                            </div>
                                        );
                                    })()}

                                    {selectedProject.project_type === 'video' && (() => {
                                        const rawVideoSrc = selectedProject.media_url ||
                                            (selectedProject.media_files || []).find((f: PortfolioMediaFile) => f.type === 'video')?.url;
                                        const videoSrc = rawVideoSrc ? sanitizeHref(rawVideoSrc, '') : '';
                                        return (
                                            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-2xl">
                                                {!videoSrc ? (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">No video source found.</div>
                                                ) : videoSrc.includes('youtube.com') || videoSrc.includes('youtu.be') ? (
                                                    <iframe
                                                        key={videoSrc}
                                                        title={`${selectedProject.title} Video Demo`}
                                                        src={videoSrc.includes('youtube.com/embed/') ? videoSrc : videoSrc.replace('watch?v=', 'embed/').split('&')[0].replace('youtu.be/', 'youtube.com/embed/')}
                                                        className="w-full h-full border-0"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                    />
                                                ) : videoSrc.includes('vimeo.com') ? (
                                                    <iframe
                                                        key={videoSrc}
                                                        title={`${selectedProject.title} Vimeo Demo`}
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

                                    <div className="mt-10 pt-8 border-t border-black/5 dark:border-white/5 space-y-8">
                                        <div>
                                            <h4 className="font-bold text-black dark:text-white uppercase tracking-wider text-xs mb-3">
                                                Full Project Overview &amp; Description
                                            </h4>
                                            <div className="p-5 sm:p-6 rounded-2xl bg-gray-50 dark:bg-black/40 border border-black/5 dark:border-white/5 text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                                                {selectedProject.short_description || getPremiumDescription(selectedProject.title, '')}
                                            </div>
                                        </div>

                                        {modalMetrics.length > 0 && (
                                            <div>
                                                <h4 className="font-bold text-black dark:text-white mb-4 uppercase tracking-wider text-xs">
                                                    Key Performance Indicators
                                                </h4>
                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                                    {modalMetrics.map((m, i) => (
                                                        <div key={i} className="bg-gray-50 dark:bg-black/40 border border-black/5 dark:border-white/5 rounded-xl p-4">
                                                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-500">{m.value}</div>
                                                            <div className="text-[10px] text-gray-500 uppercase font-bold mt-1">{m.label}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="p-5 sm:p-6 bg-gray-50 dark:bg-black/60 border-t border-black/5 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400">
                                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" /> Ready for Deployment
                                    </div>
                                    <Link
                                        href="/#consultation"
                                        onClick={() => setSelectedProject(null)}
                                        className="w-full sm:w-auto text-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all hover:shadow-lg hover:shadow-blue-600/20 active:scale-95"
                                    >
                                        Book a Free Consultation
                                    </Link>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
}

function getPremiumDescription(title: string, desc: string): string {
    const d = (desc || '').trim();
    const isGibberish = !d || d.length < 18 || (d.length < 35 && !d.includes(' ')) || d.toLowerCase().includes('testing') || d.includes(';');
    if (isGibberish) {
        const lowerTitle = title.toLowerCase();
        if (lowerTitle.includes('nursing') || lowerTitle.includes('nurse') || lowerTitle.includes('health')) {
            return "An intelligent healthcare coordinator agent that pre-qualifies patients, processes initial symptoms, and automates appointment bookings seamlessly.";
        }
        if (lowerTitle.includes('cold calling') || lowerTitle.includes('outbound')) {
            return "A high-performance outbound voice agent trained in robust objection handling, active listening, and direct CRM data synchronization.";
        }
        if (lowerTitle.includes('albanian') || lowerTitle.includes('language')) {
            return "A high-speed multi-lingual translation and client support assistant trained to handle fluent customer inquiries in real-time.";
        }
        if (lowerTitle.includes('receptionist') || lowerTitle.includes('front desk')) {
            return "A virtual office assistant that manages inbound inquiries, qualifies incoming leads, and integrates bookings directly with calendar apps.";
        }
        return "An enterprise-grade workflow automation agent built to eliminate manual entries, integrate platforms, and accelerate business performance.";
    }
    return desc;
}

function getPremiumTag(title: string, tag: string): string {
    const t = (tag || '').trim().toLowerCase();
    const isGeneric = !t || t.length < 3 || t === 'testing' || t === 'test' || t === 'health' || t === 'real estate';
    if (isGeneric) {
        const lowerTitle = title.toLowerCase();
        if (lowerTitle.includes('nursing') || lowerTitle.includes('nurse') || lowerTitle.includes('health')) {
            return "Healthcare AI";
        }
        if (lowerTitle.includes('cold calling') || lowerTitle.includes('outbound')) {
            return "Outbound Sales";
        }
        if (lowerTitle.includes('albanian') || lowerTitle.includes('language')) {
            return "Global Support";
        }
        if (lowerTitle.includes('receptionist') || lowerTitle.includes('front desk')) {
            return "Automated CRM";
        }
        return "AI Automation";
    }
    return tag;
}

function getPremiumMetrics(title: string, metrics: unknown): PortfolioMetric[] {
    let parsedMetrics: PortfolioMetric[] = [];
    if (metrics) {
        if (Array.isArray(metrics)) {
            parsedMetrics = metrics as PortfolioMetric[];
        } else if (typeof metrics === 'string') {
            try {
                const parsed = JSON.parse(metrics);
                if (Array.isArray(parsed)) {
                    parsedMetrics = parsed as PortfolioMetric[];
                }
            } catch {
                // Ignore malformed JSON string
            }
        }
    }

    if (parsedMetrics.length === 0) {
        const lowerTitle = title.toLowerCase();
        if (lowerTitle.includes('nursing') || lowerTitle.includes('nurse') || lowerTitle.includes('health')) {
            return [{ value: "98%", label: "Patient Match" }, { value: "24/7", label: "Availability" }];
        }
        if (lowerTitle.includes('cold calling') || lowerTitle.includes('outbound')) {
            return [{ value: "32%", label: "Lead Converted" }, { value: "< 3s", label: "Speed to Lead" }];
        }
        if (lowerTitle.includes('receptionist') || lowerTitle.includes('front desk') || lowerTitle.includes('crm')) {
            return [{ value: "95%", label: "Data Accuracy" }, { value: "100%", label: "CRM Logged" }];
        }
        return [{ value: "99.9%", label: "Uptime" }, { value: "3x", label: "Efficiency Boost" }];
    }
    return parsedMetrics;
}

function PortfolioCard({ item, index, onClick }: { item: PortfolioProject; index: number; onClick: () => void }) {
    const title = item.title || 'AI Automation Suite';
    const tag = getPremiumTag(title, item.industry_tag || '');
    const rawDesc = getPremiumDescription(title, item.short_description || '');
    const previewDesc = rawDesc.length > 400 ? `${rawDesc.slice(0, 400)}...` : rawDesc;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: (index % 3) * 0.1 }}
            className="h-full"
        >
            <div
                onClick={onClick}
                className={`p-6 md:p-7 rounded-3xl bg-gradient-to-br ${item.color || 'from-blue-500/10 to-indigo-500/10'} border ${item.borderClass || 'border-black/10 dark:border-blue-500/20'} backdrop-blur-md relative overflow-hidden group shadow-sm dark:shadow-none bg-white/70 dark:bg-zinc-900/60 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/10 h-full flex flex-col justify-between min-h-[460px] cursor-pointer`}
            >
                <div className="absolute inset-0 bg-white/10 dark:bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div className="relative z-10 flex flex-col h-full">
                    {/* 1. PORTFOLIO IMAGE */}
                    <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-zinc-950/80 mb-5 flex-shrink-0 border border-black/5 dark:border-white/10 shadow-inner">
                        {item.cover_image_url ? (
                            <Image
                                src={item.cover_image_url}
                                alt={title}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900/40 via-indigo-900/30 to-zinc-900/50 text-zinc-300 text-xs font-bold uppercase tracking-widest p-4 text-center">
                                AI Voice System
                            </div>
                        )}
                        <div className="absolute top-3 left-3">
                            <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-black/75 backdrop-blur-md text-blue-400 border border-white/10 uppercase tracking-wider">
                                {tag}
                            </span>
                        </div>
                    </div>

                    {/* 2. Portfolio Title (Uniform Height) */}
                    <h3 className="text-lg md:text-xl font-bold text-black dark:text-white mb-2 line-clamp-2 h-[3.5rem] leading-snug transition-colors duration-300">
                        {title}
                    </h3>

                    {/* 3. First 400 characters preview with fixed height container */}
                    <div className="mb-4 h-[4.5rem] overflow-hidden">
                        <p className="text-gray-600 dark:text-gray-300 text-xs md:text-sm line-clamp-3 leading-relaxed">
                            {previewDesc}
                        </p>
                    </div>

                    {/* 4. View Project Action */}
                    <div className="mt-auto pt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between gap-2">
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onClick();
                            }}
                            className="inline-flex items-center text-sm font-bold text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 text-left whitespace-nowrap"
                        >
                            <span>View Project</span>
                            <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform flex-shrink-0" />
                        </button>
                        {item.project_type && (
                            <span className="text-[10px] text-zinc-500 uppercase font-semibold whitespace-nowrap">
                                {item.project_type === 'webrtc' ? 'Interactive AI' : item.project_type === 'audio' ? 'Audio Call' : item.project_type === 'video' ? 'Video Demo' : 'Live Demo'}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
