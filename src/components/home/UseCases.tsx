"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Home, Sun, Hammer, Briefcase, BarChart, Headphones } from "lucide-react";

const industries = [
    {
        name: "Real Estate",
        icon: Home,
        slug: "real-estate",
        color: "from-blue-600 to-cyan-500",
        image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000&auto=format&fit=crop"
    },
    {
        name: "Solar & Energy",
        icon: Sun,
        slug: "solar",
        color: "from-amber-500 to-orange-600",
        image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=1000&auto=format&fit=crop"
    },
    {
        name: "Roofing & Construction",
        icon: Hammer,
        slug: "roofing",
        color: "from-stone-600 to-gray-800",
        image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1000&auto=format&fit=crop"
    },
    {
        name: "Home Services",
        icon: Briefcase,
        slug: "home-services",
        color: "from-emerald-500 to-teal-600",
        image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1000&auto=format&fit=crop"
    },
    {
        name: "Local Agencies",
        icon: BarChart,
        slug: "local-agencies",
        color: "from-purple-500 to-indigo-600",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop"
    },
    {
        name: "Customer Support",
        icon: Headphones,
        slug: "customer-support",
        color: "from-pink-500 to-rose-600",
        image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1000&auto=format&fit=crop"
    },
];

export default function UseCases() {
    return (
        <section className="py-24 bg-gray-50 dark:bg-zinc-950 border-t border-black/5 dark:border-white/5 transition-colors duration-300" id="use-cases">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div className="max-w-2xl">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-3xl md:text-5xl font-bold tracking-tight text-black dark:text-white mb-6 transition-colors duration-300"
                        >
                            Industry-Specific <br /><span className="text-gray-500">Deployments</span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-lg text-gray-600 dark:text-gray-400 transition-colors duration-300"
                        >
                            See how different sectors utilize our AI voice agents to dominate their markets.
                        </motion.p>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <Link href="/use-cases" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium group transition-colors duration-300">
                            View all use cases <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {industries.map((industry, i) => (
                        <motion.div
                            key={industry.name}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Link href={`/use-cases/${industry.slug}`} className="block group">
                                <div className="relative overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 aspect-[4/3] flex flex-col justify-end p-6 shadow-md dark:shadow-none hover:shadow-xl dark:hover:shadow-none transition-all duration-500 group">

                                    {/* Base Image always visible instead of color gradient */}
                                    <div className="absolute inset-0 z-0">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20 z-10" />
                                        <img
                                            src={industry.image}
                                            alt={industry.name}
                                            className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-700"
                                        />
                                    </div>

                                    <div className="relative z-20 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                        <div className={`w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-4 border border-white/20 transition-all duration-500 group-hover:bg-blue-600 group-hover:border-blue-500/50`}>
                                            <industry.icon className="h-6 w-6 text-white transition-colors duration-500" />
                                        </div>
                                        <h3 className="text-2xl font-semibold text-white mb-2">{industry.name}</h3>
                                        <div className="flex items-center text-sm font-medium text-gray-300 opacity-0 transform translate-y-4 group-hover:text-blue-300 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                                            Explore Agents <ArrowRight className="ml-2 h-3 w-3" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
