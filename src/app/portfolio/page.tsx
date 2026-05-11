"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Portfolio from "@/components/home/Portfolio";
import { motion } from "framer-motion";

export default function PortfolioPage() {
    return (
        <main className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
            <Navbar />
            
            <div className="pt-32 pb-12 bg-gray-50 dark:bg-zinc-950 border-b border-black/5 dark:border-white/5">
                <div className="container mx-auto px-4 text-center">
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-black text-black dark:text-white mb-6"
                    >
                        Our <span className="text-blue-600 dark:text-blue-500">Portfolio</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
                    >
                        Explore the AI voice architectures and automation systems we've built for industry-leading companies.
                    </motion.p>
                </div>
            </div>

            <div className="py-12">
                <Portfolio />
            </div>

            <Footer />
        </main>
    );
}
