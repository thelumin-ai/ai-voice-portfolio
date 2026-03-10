"use client";

import { use } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ChevronRight } from "lucide-react";

// Mock data for industries (in a real app, this might come from a CMS or separate data file)
const industryData = {
    "real-estate": {
        name: "Real Estate",
        headline: "AI Voice Agent for Real Estate Lead Qualification",
        subhead: "Instantly call property leads, qualify buyers and sellers, and schedule property walkthroughs.",
        problem: "Real estate leads go cold in minutes. Whether they're from Zillow, Facebook Ads, or your website, if you don't call them immediately, another agent will.",
        features: [
            "Instant lead calling (< 5 seconds)",
            "Buyer and seller qualification",
            "Appointment booking",
            "CRM updates (Follow Up Boss, etc.)",
            "Live hot-lead transfer to your phone"
        ],
        flow: [
            { step: "Greeting", desc: "Agent introduces itself on behalf of your brokerage." },
            { step: "Intent Detection", desc: "Determines if they are buying, selling, or both." },
            { step: "Qualification", desc: "Asks about budget, timeline, and pre-approval status." },
            { step: "Action", desc: "Schedules a showing or consultation directly on your calendar." }
        ],
        results: [
            { stat: "300%", label: "Increase in Lead Connection Rate" },
            { stat: "24/7", label: "Speed to Lead" },
            { stat: "40hrs", label: "Saved Monthly per Agent" }
        ]
    },
    "solar": {
        name: "Solar & Energy",
        headline: "AI Voice Agent for Solar Appointment Setting",
        subhead: "Qualify homeowners, calculate rough estimates, and book solar consultations automatically.",
        problem: "Solar sales requires high-volume calling to filter through renters, unqualified homes, and bad roofs. Human SDRs burn out quickly on this repetitive task.",
        features: [
            "High-volume outbound dialing",
            "Homeowner verification",
            "Utility bill pre-qualification",
            "Roof shading basic questions",
            "Automated calendar booking"
        ],
        flow: [
            { step: "Greeting", desc: "Mentions state-specific solar incentives." },
            { step: "Verification", desc: "Confirms they own the home and their average electricity bill." },
            { step: "Interest Check", desc: "Explains potential savings to gauge interest." },
            { step: "Booking", desc: "Schedules an in-home or virtual consultation." }
        ],
        results: [
            { stat: "4x", label: "More Appointments Booked" },
            { stat: "$0", label: "Wasted on Unqualified Leads" },
            { stat: "100%", label: "CRM Logging Accuracy" }
        ]
    }
};

export default function IndustryPage({ params }: { params: Promise<{ industry: string }> }) {
    const { industry } = use(params);
    // Use the data or fallback to a generic shape if the industry isn't in our mock data yet
    const data = industryData[industry as keyof typeof industryData] || {
        name: industry.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        headline: `AI Voice Automation for ${industry}`,
        subhead: "Automate your customer interactions, qualify leads, and drive revenue while you sleep.",
        problem: "In today's fast-paced market, delayed follow-ups kill deals. Typical sales teams can't scale infinitely to capture every opportunity instantly.",
        features: ["Instant lead response", "Intelligent qualification", "Calendar routing", "CRM integration", "24/7 Availability"],
        flow: [
            { step: "Discovery", desc: "Identifies caller intent." },
            { step: "Qualification", desc: "Extracts key data points needed for the sale." },
            { step: "Routing", desc: "Sends the caller to the right next step." },
        ],
        results: [
            { stat: "2x", label: "Conversion Rate" },
            { stat: "Instant", label: "Follow-up" }
        ]
    };

    return (
        <div className="bg-black min-h-screen pt-24 pb-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumbs */}
                <div className="flex items-center text-sm text-gray-400 mb-8">
                    <Link href="/" className="hover:text-white transition-colors">Home</Link>
                    <ChevronRight className="h-4 w-4 mx-2" />
                    <Link href="/#use-cases" className="hover:text-white transition-colors">Use Cases</Link>
                    <ChevronRight className="h-4 w-4 mx-2" />
                    <span className="text-white bg-white/10 px-2 py-1 rounded">{data.name}</span>
                </div>

                {/* Hero */}
                <div className="max-w-4xl mb-20 relative">
                    <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-600/20 blur-[50px] rounded-full" />
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight relative z-10"
                    >
                        {data.headline}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-gray-400 leading-relaxed"
                    >
                        {data.subhead}
                    </motion.p>
                </div>

                {/* content grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left Column (Info) */}
                    <div className="lg:col-span-2 space-y-16">

                        {/* Problem */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-2xl font-bold text-white mb-4 border-b border-white/10 pb-2">The Challenge</h2>
                            <p className="text-gray-300 text-lg leading-relaxed">{data.problem}</p>
                        </motion.section>

                        {/* Features */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-2">What The AI Does</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {data.features.map((feature, i) => (
                                    <div key={i} className="flex items-start">
                                        <CheckCircle2 className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-300">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.section>

                        {/* Conversation Flow */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-2">Conversation Flow Logic</h2>
                            <div className="space-y-4">
                                {data.flow.map((step, i) => (
                                    <div key={i} className="glass-panel p-6 flex gap-4 items-start">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold border border-blue-500/30">
                                            {i + 1}
                                        </div>
                                        <div>
                                            <h4 className="text-white font-semibold mb-1">{step.step}</h4>
                                            <p className="text-gray-400 text-sm">{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.section>

                    </div>

                    {/* Right Column (Demo & Results) */}
                    <div className="space-y-8">
                        {/* Demo Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass-panel border-blue-500/30 p-8 sticky top-24"
                        >
                            <h3 className="text-xl font-bold text-white mb-2">Talk to the Agent</h3>
                            <p className="text-gray-400 text-sm mb-6">Test the live AI configuration for the {data.name} industry.</p>

                            {/* Visual placeholder for the WebRTC component that will go here later */}
                            <div className="bg-black rounded-lg border border-white/10 p-4 mb-6 text-center">
                                <div className="w-16 h-16 bg-blue-500/10 rounded-full mx-auto flex items-center justify-center mb-3">
                                    <div className="w-8 h-8 bg-blue-500 rounded-full animate-pulse" />
                                </div>
                                <p className="text-sm text-gray-500 italic">WebRTC Demo Component Loading...</p>
                            </div>

                            <Link
                                href="/playground"
                                className="block w-full text-center py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
                            >
                                Test in Playground
                            </Link>
                        </motion.div>

                        {/* Results */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="grid grid-cols-1 gap-4"
                        >
                            <h3 className="text-lg font-semibold text-white mb-2">Expected Results</h3>
                            {data.results.map((result, i) => (
                                <div key={i} className="bg-zinc-900 border border-white/5 rounded-xl p-4 flex flex-col items-center text-center">
                                    <span className="text-3xl font-black text-white text-gradient mb-1">{result.stat}</span>
                                    <span className="text-xs text-gray-400 uppercase tracking-wider">{result.label}</span>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>

                {/* Final CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-24 text-center glass-panel p-12 border-blue-500/20"
                >
                    <h2 className="text-3xl font-bold text-white mb-4">Ready to automate your {data.name} operations?</h2>
                    <p className="text-gray-400 mb-8 max-w-2xl mx-auto">Stop leaving money on the table. Let's build a custom voice AI system designed perfectly for your specific business logic.</p>
                    <Link
                        href="https://www.upwork.com/services/product/development-it-abimbola-1889268991195383021?ref=project_share"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-4 text-sm font-bold text-black shadow-sm hover:bg-gray-200 transition-all"
                    >
                        Book Strategy Session
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
