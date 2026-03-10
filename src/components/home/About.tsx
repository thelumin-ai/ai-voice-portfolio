"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function About() {
    return (
        <section className="py-24 bg-gray-50 dark:bg-black relative border-t border-black/5 dark:border-white/5 overflow-hidden transition-colors duration-300" id="about">
            <div className="absolute top-1/2 right-0 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="w-full lg:w-1/2"
                    >
                        <div className="relative">
                            {/* Decorative elements behind image */}
                            <div className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-blue-500/30 rounded-tl-xl" />
                            <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-2 border-r-2 border-blue-500/30 rounded-br-xl" />

                            <div className="aspect-[4/5] bg-gray-200 dark:bg-zinc-900 rounded-2xl border border-black/10 dark:border-white/10 overflow-hidden relative transition-colors duration-300">
                                {/* Placeholder for Abimbola's picture */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent z-10" />
                                <img
                                    src="https://www.upwork.com/profile-portraits/c1f0MmKCe7L4GHTyIJqYDiWObG81jSfHZe7KtyFqXt2upsHb-VOhj3OplpEyrHwSmV"
                                    alt="Abimbola Akinsanmi - AI Voice & Business Automation Expert"
                                    className="w-full h-full object-cover transition-all duration-700"
                                />
                                <div className="absolute bottom-6 left-6 z-20">
                                    <h3 className="text-2xl font-bold text-white">Abimbola Akinsanmi</h3>
                                    <p className="text-blue-400 font-medium">Business Automation & AI Voice Expert</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="w-full lg:w-1/2"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-black dark:text-white mb-6 transition-colors duration-300">
                            Business Automation & <span className="text-blue-600 dark:text-blue-500">Voice AI</span>
                        </h2>
                        <div className="space-y-6 text-lg text-gray-600 dark:text-gray-400 mb-8 transition-colors duration-300">
                            <p>
                                I build AI voice systems that book 15–30+ qualified appointments per month without you hiring SDRs. I’m Abimbola Akinsanmi, a Business Automation Expert specializing in AI Voice Systems, CRM/ERP integrations, and scalable AI Automation frameworks.
                            </p>
                            <p>
                                My mission is to replace chaos with control, replace missed calls with human-sounding AI conversations, and replace manual work with seamless, self-operating AI systems that help companies grow faster while spending less.
                            </p>
                            <ul className="space-y-3 pt-4">
                                {[
                                    "Conversational Voice AI Design",
                                    "Self-Hosted n8n Infrastructure",
                                    "CRM & ERP Integrations",
                                    "Custom Visibility Dashboards"
                                ].map((skill) => (
                                    <li key={skill} className="flex items-center text-gray-700 dark:text-gray-300 transition-colors duration-300">
                                        <CheckCircle2 className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                                        {skill}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="flex flex-wrap gap-4 mt-8">
                            <Link
                                href="https://www.upwork.com/services/product/development-it-abimbola-1889268991195383021?ref=project_share"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center rounded-lg bg-black dark:bg-white px-8 py-4 text-sm font-semibold text-white dark:text-black shadow-sm hover:bg-gray-800 dark:hover:bg-gray-200 transition-all"
                            >
                                Hire Me on Upwork
                            </Link>

                            <Link
                                href="https://www.linkedin.com/in/luminous1automation/?skipRedirect=true"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center rounded-lg border border-black/10 dark:border-white/20 bg-transparent px-8 py-4 text-sm font-semibold text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                            >
                                <svg className="w-5 h-5 mr-2 -ml-1" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                                Connect on LinkedIn
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
