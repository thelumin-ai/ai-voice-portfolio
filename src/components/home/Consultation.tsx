"use client";

import { motion } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";
import { useState } from "react";
import { sanitizeHref } from "@/lib/url";

export default function Consultation({ consultationLink = "https://www.upwork.com/services/product/development-it-abimbola-1889268991195383021" }: { consultationLink?: string }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const safeConsultationLink = sanitizeHref(consultationLink, "https://www.upwork.com");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus('idle');

        const formData = new FormData(e.currentTarget);
        const data = {
            name: String(formData.get('name') || '').trim(),
            email: String(formData.get('email') || '').trim(),
            company: String(formData.get('company') || '').trim(),
            phone: String(formData.get('phone') || '').trim(),
            message: String(formData.get('message') || '').trim(),
        };

        try {
            const res = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                setSubmitStatus('success');
            } else {
                setSubmitStatus('error');
            }
        } catch {
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="py-24 bg-blue-950 text-white relative overflow-hidden" id="consultation">
            {/* Abstract background (pure CSS, zero external 402 SVG requests) */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(rgba(96,165,250,0.22)_1px,transparent_1px)] [background-size:24px_24px] opacity-30" />
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-blue-900/90 via-transparent to-black" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-[1400px]">
                <div className="bg-zinc-950/85 backdrop-blur-lg border border-blue-500/30 rounded-2xl p-5 sm:p-8 md:p-14 max-w-4xl mx-auto text-center shadow-2xl">
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

                        <p className="text-lg sm:text-xl text-blue-200 mb-10 max-w-2xl mx-auto">
                            Book a discovery call to map out exactly how AI voice agents and smart chatbots can instantly follow up, qualify leads, and pack your calendar.
                        </p>

                        <div className="bg-black/50 p-4 sm:p-6 rounded-xl border border-white/10 mt-8 text-left max-w-xl mx-auto">
                            {submitStatus === 'success' ? (
                                <div className="text-center p-6 bg-green-500/10 border border-green-500/20 rounded-lg">
                                    <h3 className="text-xl font-bold text-green-400 mb-2">Message Sent!</h3>
                                    <p className="text-green-200">Thanks for reaching out. I&apos;ll get back to you shortly to schedule our strategy session.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label htmlFor="consultation-name" className="text-sm font-medium text-gray-300">Name *</label>
                                            <input id="consultation-name" required type="text" name="name" className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white focus:outline-none focus:border-blue-500" placeholder="John Doe" />
                                        </div>
                                        <div className="space-y-1">
                                            <label htmlFor="consultation-email" className="text-sm font-medium text-gray-300">Email *</label>
                                            <input id="consultation-email" required type="email" name="email" className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white focus:outline-none focus:border-blue-500" placeholder="john@company.com" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label htmlFor="consultation-company" className="text-sm font-medium text-gray-300">Company</label>
                                            <input id="consultation-company" type="text" name="company" className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white focus:outline-none focus:border-blue-500" placeholder="Acme Corp" />
                                        </div>
                                        <div className="space-y-1">
                                            <label htmlFor="consultation-phone" className="text-sm font-medium text-gray-300">Phone</label>
                                            <input id="consultation-phone" type="tel" name="phone" className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white focus:outline-none focus:border-blue-500" placeholder="+1 (555) 000-0000" />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label htmlFor="consultation-message" className="text-sm font-medium text-gray-300">Message</label>
                                        <textarea id="consultation-message" name="message" rows={3} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white focus:outline-none focus:border-blue-500" placeholder="Tell me about your current bottlenecks..."></textarea>
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-stretch gap-4 pt-2">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full min-h-[52px] inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 font-bold text-white shadow-[0_0_40px_-10px_rgba(59,130,246,0.6)] hover:bg-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                                        >
                                            {isSubmitting ? 'Sending...' : 'Request Consultation'}
                                        </button>
                                        <a
                                            href={safeConsultationLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full min-h-[52px] flex items-center justify-center px-6 py-3 border border-white/15 rounded-lg text-white hover:bg-white/10 font-bold transition-all text-center whitespace-nowrap"
                                        >
                                            Book via Provider
                                            <ArrowRight className="ml-2 h-5 w-5 shrink-0" />
                                        </a>
                                    </div>
                                    {submitStatus === 'error' && (
                                        <p className="text-red-400 text-sm mt-2">There was an error sending your message. Please check your details and try again.</p>
                                    )}
                                </form>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
