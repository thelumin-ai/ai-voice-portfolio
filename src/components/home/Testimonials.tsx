"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { getTestimonials } from "@/app/admin/(protected)/testimonials/actions";
import { Star, PlayCircle, X } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Grid } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/grid";

export default function Testimonials() {
    const [testimonials, setTestimonials] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const swiperRef = useRef<SwiperType | null>(null);

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
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold tracking-tight text-black dark:text-white mb-6 transition-colors duration-300"
                    >
                        Client <span className="text-blue-600 dark:text-blue-500 text-gradient">Success Stories</span>
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

                <div className="relative pb-12">
                    <Swiper
                        modules={[Pagination, Autoplay, Grid]}
                        spaceBetween={24}
                        slidesPerView={2}
                        grid={{
                            rows: 2,
                            fill: 'row'
                        }}
                        breakpoints={{
                            1024: { 
                                slidesPerView: 3,
                                grid: { rows: 3 }
                            },
                        }}
                        autoplay={{ delay: 6000, disableOnInteraction: false }}
                        pagination={{ clickable: true }}
                        onSwiper={(swiper) => { swiperRef.current = swiper; }}
                        className="pb-10 h-auto"
                    >
                        {testimonials.map((testimonial, index) => (
                            <SwiperSlide key={testimonial.id} className="!h-auto mb-6">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: (index % 6) * 0.1 }}
                                    className="h-full"
                                >
                                    <div className="glass-panel p-8 group border border-black/5 dark:border-white/5 bg-white dark:bg-black/40 shadow-sm dark:shadow-none transition-all duration-300 flex flex-col h-full min-h-[250px]">
                                        <div className="flex text-yellow-400 mb-4">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`w-4 h-4 ${i < testimonial.rating ? 'fill-current' : 'text-gray-300 dark:text-gray-700'}`} />
                                            ))}
                                        </div>
                                        
                                        <p className="text-gray-700 dark:text-gray-300 mb-6 italic flex-grow text-sm">"{testimonial.content}"</p>
                                        
                                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-black/5 dark:border-white/5">
                                            <div>
                                                <h4 className="font-bold text-black dark:text-white text-sm">{testimonial.client_name}</h4>
                                                {testimonial.company && (
                                                    <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">{testimonial.company}</p>
                                                )}
                                            </div>
                                            {testimonial.video_url && (
                                                <a 
                                                    href={testimonial.video_url} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                                                >
                                                    <PlayCircle className="w-4 h-4" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    );
}
