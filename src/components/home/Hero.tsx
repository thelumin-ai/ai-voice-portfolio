"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Mic } from "lucide-react";
import { HeroContent } from "@/app/admin/(protected)/content/defaults";

interface HeroProps {
    consultationLink?: string;
    content?: HeroContent;
}

export default function Hero({ consultationLink = "https://www.upwork.com/services/product/development-it-abimbola-1889268991195383021", content }: HeroProps) {
    const badge = content?.badge || "Next-Gen AI & Voice Automation";
    const headline = content?.headline || "AI Voice Agents & Chatbots That Call, Qualify, and Convert Leads Automatically";
    const subtext = content?.subtext || "I design intelligent voice systems and omni-channel automations that instantly engage leads, qualify prospects, and scale your business automatically.";
    const ctaPrimary = content?.cta_primary || "Try a Live AI Agent";
    const ctaSecondary = content?.cta_secondary || "Book a Consultation";

    // Split headline for styling - find the last line break point
    const words = headline.split(' ');

    return (
        <div className="relative overflow-hidden bg-black pt-24 pb-32 lg:pt-36 lg:pb-40">
            {/* Background glow effects */}
            <div className="absolute top-0 left-1/2 w-full -translate-x-1/2 h-[500px] opacity-20 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-500/30 to-transparent blur-3xl rounded-full mix-blend-screen" />
            </div>

            <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 z-10 max-w-[1400px]">
                <div className="text-center max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="inline-flex items-center rounded-full bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-400 ring-1 ring-inset ring-blue-500/20 mb-8">
                            <span className="relative flex h-2 w-2 mr-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            {badge}
                        </span>
                    </motion.div>

                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6">
                        {headline}
                    </h1>

                    <p className="mt-6 text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
                        {subtext}
                    </p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link
                            href="/playground"
                            className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-white px-8 py-3.5 text-sm font-semibold text-black shadow-sm hover:bg-gray-100 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white group"
                        >
                            <Mic className="mr-2 h-4 w-4 text-black group-hover:scale-110 transition-transform" />
                            {ctaPrimary}
                        </Link>
                        <Link
                            href={consultationLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-blue-600/10 px-8 py-3.5 text-sm font-semibold text-blue-400 ring-1 ring-inset ring-blue-500/20 hover:bg-blue-600/20 transition-all"
                        >
                            {ctaSecondary}
                        </Link>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
