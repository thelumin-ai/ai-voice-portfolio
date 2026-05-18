"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";

import { useState } from "react";

export default function Consultation({ consultationLink = "https://www.upwork.com/services/product/development-it-abimbola-1889268991195383021" }: { consultationLink?: string }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus('idle');

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            company: formData.get('company'),
            phone: formData.get('phone'),
            message: formData.get('message'),
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
        } catch (error) {
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="py-24 bg-blue-950 relative overflow-hidden" id="consultation">
            {/* Abstract background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-blue-900 via-transparent to-black pointer-events-none" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-[1400px]">
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

                        <p className="text-xl text-blue-200 mb-10 max-w-2xl mx-auto">
                            Book a discovery call to map out exactly how AI voice agents and smart chatbots can instantly follow up, qualify leads, and pack your calendar.
                        </p>

                        <div className="bg-black/50 p-6 rounded-xl border border-white/10 mt-8 text-left max-w-xl mx-auto">
                            {submitStatus === 'success' ? (
                                <div className="text-center p-6 bg-green-500/10 border border-green-500/20 rounded-lg">
                                    <h3 className="text-xl font-bold text-green-400 mb-2">Message Sent!</h3>
                                    <p className="text-green-200">Thanks for reaching out. I'll get back to you shortly to schedule our strategy session.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-gray-300">Name *</label>
                                            <input required type="text" name="name" className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white focus:outline-none focus:border-blue-500" placeholder="John Doe" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-gray-300">Email *</label>
                                            <input required type="email" name="email" className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white focus:outline-none focus:border-blue-500" placeholder="john@company.com" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-gray-300">Company</label>
                                            <input type="text" name="company" className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white focus:outline-none focus:border-blue-500" placeholder="Acme Corp" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-gray-300">Phone</label>
                                            <input type="tel" name="phone" className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white focus:outline-none focus:border-blue-500" placeholder="+1 (555) 000-0000" />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-300">Message</label>
                                        <textarea name="message" rows={3} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white focus:outline-none focus:border-blue-500" placeholder="Tell me about your current bottlenecks..."></textarea>
                                    </div>
                                    
                                    <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                                        <button 
                                            type="submit" 
                                            disabled={isSubmitting}
                                            className="w-full inline-flex items-center justify-center rounded-lg bg-blue-500 px-8 py-3 font-bold text-white shadow-[0_0_40px_-10px_rgba(59,130,246,0.6)] hover:bg-blue-400 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isSubmitting ? 'Sending...' : 'Request Consultation'}
                                        </button>
                                        <a href={consultationLink} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center px-8 py-3 border border-white/10 rounded-lg text-white hover:bg-white/5 font-bold transition-all text-center">



                                            
                                                Book via Provider Platform
                                                <ArrowRight className="ml-2 h-5 w-5" />
                                            
                                        </a>
                                    </div>
                                    {submitStatus === 'error' && <p className="text-red-400 text-sm mt-2">There was an error sending your message. Please try again.</p>}
                                </form>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
