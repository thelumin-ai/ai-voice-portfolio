"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getTestimonials } from "@/app/admin/(protected)/testimonials/actions";
import { Star, PlayCircle } from "lucide-react";

export default function Testimonials() {
    const [testimonials, setTestimonials] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const { data } = await getTestimonials();
                if (data && data.length > 0) {
                    setTestimonials(data.filter(t => t.status === 'published'));
                }
            } catch (error) {
                console.error("Failed to fetch testimonials:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTestimonials();
    }, []);

    if (isLoading || testimonials.length === 0) return null;

    return (
        <section className="py-24 bg-gray-50 dark:bg-zinc-950 relative border-t border-black/5 dark:border-white/5 transition-colors duration-300" id="testimonials">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold tracking-tight text-black dark:text-white mb-6 transition-colors duration-300"
                    >
                        Client <span className="text-blue-600 dark:text-blue-500">Success Stories</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-gray-600 dark:text-gray-400 transition-colors duration-300"
                    >
                        Hear directly from the agencies and businesses scaling with our AI voice systems.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.id + index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="h-full"
                        >
                            <div className="glass-panel p-8 group border border-black/5 dark:border-white/5 bg-white dark:bg-black/40 shadow-sm dark:shadow-none hover:shadow-xl dark:hover:shadow-none transition-all duration-500 flex flex-col h-full hover:border-blue-500/30">
                                <div className="flex text-yellow-400 mb-6">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-4 h-4 ${i < testimonial.rating ? 'fill-current' : 'text-gray-300 dark:text-gray-700'}`} />
                                    ))}
                                </div>
                                
                                <p className="text-gray-700 dark:text-gray-300 mb-8 italic flex-grow text-lg leading-relaxed">"{testimonial.content}"</p>
                                
                                <div className="flex items-center justify-between mt-auto pt-6 border-t border-black/5 dark:border-white/5">
                                    <div>
                                        <h4 className="font-bold text-black dark:text-white">{testimonial.client_name}</h4>
                                        {testimonial.company && (
                                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest font-semibold mt-1">{testimonial.company}</p>
                                        )}
                                    </div>
                                    {testimonial.video_url && (
                                        <a 
                                            href={testimonial.video_url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-600 hover:text-white transition-all duration-300"
                                        >
                                            <PlayCircle className="w-6 h-6" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
