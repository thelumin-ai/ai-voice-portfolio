"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar } from "lucide-react";

export default function Consultation() {
    return (
        <section className="py-24 bg-blue-950 relative overflow-hidden" id="consultation">
            {/* Abstract background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-blue-900 via-transparent to-black pointer-events-none" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="glass-panel p-8 md:p-16 max-w-4xl mx-auto text-center border-blue-500/30 bg-black/60">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        <div className="mx-auto w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-8 border border-blue-500/30">
                            <Calendar className="h-8 w-8 text-blue-400" />
                        </div>

                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">
                            Stop Missing Revenue Opportunities
                        </h2>

                        <p className="text-xl text-blue-100/70 mb-10 max-w-2xl mx-auto">
                            Book a discovery call to map out exactly how AI voice agents and smart chatbots can instantly follow up, qualify leads, and pack your calendar.
                        </p>

                        <Link
                            href="https://www.upwork.com/services/product/development-it-abimbola-18892689911195383021?ref=project_share"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center rounded-lg bg-blue-500 px-8 py-4 text-lg font-bold text-white shadow-[0_0_40px_-10px_rgba(59,130,246,0.6)] hover:bg-blue-400 hover:scale-105 transition-all duration-300 w-full sm:w-auto"
                        >
                            Book Your Strategy Session
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
