"use client";

import { motion } from "framer-motion";
import { PhoneIncoming, PhoneOutgoing, UserCheck, RefreshCw, CalendarCheck, Clock } from "lucide-react";
import Link from "next/link";

const solutions = [
    {
        title: "AI Voice & Chat Agents",
        description: "Never miss a lead. AI agents handle level-one support, answer FAQs, and direct customers 24/7 across voice and text.",
        icon: PhoneIncoming,
        href: "/#solutions"
    },
    {
        title: "Omni-Channel Outreach",
        description: "Scale your outbound infinitely. AI cold callers and automated SMS sequences reach hundreds of leads simultaneously.",
        icon: PhoneOutgoing,
        href: "/#solutions"
    },
    {
        title: "Automated Lead Qualification",
        description: "Intelligently ask qualifying questions via chat or voice, grade the prospect, and route hot leads to closers.",
        icon: UserCheck,
        href: "/#solutions"
    },
    {
        title: "CRM & ERP Automations",
        description: "Automatically log transcripts, sync data between platforms, and trigger webhooks to update deal stages.",
        icon: RefreshCw,
        href: "/#solutions"
    },
    {
        title: "Smart Appointment Booking",
        description: "Integrates with your calendar to find slots, handle timezones, and lock in meetings directly from the conversation.",
        icon: CalendarCheck,
        href: "/#solutions"
    },
    {
        title: "Missed Opportunity Recovery",
        description: "Instantly text, email, or call back anyone who drops off, rescuing lost revenue automatically.",
        icon: Clock,
        href: "/#solutions"
    }
];

export default function Solutions() {
    return (
        <section className="py-24 bg-gray-100 dark:bg-black relative transition-colors duration-300" id="solutions">
            <div className="absolute top-1/2 left-0 w-full h-[300px] bg-blue-900/10 blur-[100px] pointer-events-none rounded-full" />
            <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold tracking-tight text-black dark:text-white mb-6 transition-colors duration-300"
                    >
                        Enterprise-Grade <span className="text-blue-600 dark:text-blue-500">AI Automations</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-gray-600 dark:text-gray-400 transition-colors duration-300"
                    >
                        Custom-built conversational AI and business automation architectures designed specifically to drive conversions and operational efficiency.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {solutions.map((solution, index) => (
                        <motion.div
                            key={solution.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link href={solution.href} className="block group h-full">
                                <div className="glass-panel p-8 h-full transition-all duration-300 hover:border-blue-500/50 hover:bg-white/50 dark:hover:bg-white/5 relative overflow-hidden group shadow-sm dark:shadow-none bg-white/50 dark:bg-black/40">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-full translate-x-16 -translate-y-16 group-hover:bg-blue-500/20 transition-colors" />
                                    <solution.icon className="h-10 w-10 text-blue-600 dark:text-blue-400 mb-6 group-hover:scale-110 transition-transform" />
                                    <h3 className="text-xl font-semibold text-black dark:text-white mb-3 transition-colors duration-300">{solution.title}</h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed transition-colors duration-300">{solution.description}</p>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
