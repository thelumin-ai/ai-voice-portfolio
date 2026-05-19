"use client";

import { motion } from "framer-motion";
import { ProblemContent } from "@/app/admin/(protected)/content/defaults";

interface ProblemProps {
    content?: ProblemContent;
}

export default function Problem({ content }: ProblemProps) {
    const headline = content?.headline || "Most Businesses Lose Leads Because They Respond Too Late";
    const description = content?.description || 'The likelihood of qualifying a lead drops <strong>400%</strong> if they aren\'t called within the first 5 minutes. Human sales teams sleep, take breaks, and get overwhelmed.';
    const solutionTitle = content?.solution_title || "The Solution: AI Voice & Chat Automations";
    const solutionText = content?.solution_text || "Deploy systems that never sleep. Our AI agents respond to leads in seconds across voice and text, sound completely human, handle objections, and book qualified meetings directly to your calendar, 24/7/365.";

    return (
        <section className="py-24 bg-gray-50 dark:bg-zinc-950 relative border-t border-black/5 dark:border-white/5 transition-colors duration-300">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-6 tracking-tight transition-colors duration-300">
                            {headline}
                        </h2>
                        <p
                            className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-12 transition-colors duration-300"
                            dangerouslySetInnerHTML={{ __html: description }}
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="glass-panel p-8 md:p-12 relative overflow-hidden bg-white/60 dark:bg-black/40 text-left transition-colors duration-300"
                    >
                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                        <h3 className="text-2xl font-semibold text-black dark:text-white mb-4 transition-colors duration-300">{solutionTitle}</h3>
                        <p className="text-gray-700 dark:text-gray-300 transition-colors duration-300">
                            {solutionText}
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
