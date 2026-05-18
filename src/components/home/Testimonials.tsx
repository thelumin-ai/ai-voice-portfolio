"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getTestimonials } from "@/app/admin/(protected)/testimonials/actions";
import { Star, PlayCircle, Quote } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/pagination";

const defaultTestimonials = [
    {
        client_name: "Sarah Jenkins",
        company: "Elevation Real Estate",
        content: "Before Abimbola's AI voice agent, our reps spent 6 hours a day dialing un-qualified leads. Now, the AI calls every new lead within 5 seconds, qualifies them, and books them straight to our Calendly. We've seen a 300% increase in connected calls.",
        rating: 5,
        image_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop"
    },
    {
        client_name: "Michael Chen",
        company: "SunPower Solutions",
        content: "We deployed the outbound pre-qualification agent for our solar campaigns. It handles 500+ calls daily without breaking a sweat, handling objections like 'not interested' with perfect rebuttals. It feels like we hired an army of SDRs.",
        rating: 5,
        image_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop"
    },
    {
        client_name: "David Rodriguez",
        company: "Apex Home Services",
        content: "Missed calls used to mean lost revenue for our plumbing business. The inbound 24/7 AI agent Abimbola built now answers every single call, gets the customer's issue, and dispatches the right tech. It paid for itself in week one.",
        rating: 5,
        image_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop"
    },
    {
        client_name: "Emily Watson",
        company: "TechFlow SaaS",
        content: "Our tier-1 support was overwhelmed. The AI voice router now handles all 'where is my order' and 'reset password' queries automatically, passing only complex issues to our human agents. Incredible latency and natural voice.",
        rating: 5,
        image_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop"
    },
    {
        client_name: "James Carter",
        company: "Carter Legal Group",
        content: "The intake automation system is flawless. The AI conducts a natural discovery call with potential clients, extracting key legal details before scheduling a consultation with our attorneys.",
        rating: 5,
        image_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&auto=format&fit=crop"
    },
    {
        client_name: "Anita Patel",
        company: "Global Logistics Inc",
        content: "We needed a scalable way to confirm delivery schedules. The AI agent makes hundreds of outbound confirmation calls daily and updates our ERP in real-time. A masterpiece of automation.",
        rating: 5,
        image_url: "https://images.unsplash.com/photo-1598550874175-4d0ef4374a22?q=80&w=200&auto=format&fit=crop"
    }
];

export default function Testimonials() {
    const [testimonials, setTestimonials] = useState<any[]>(defaultTestimonials);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const { data } = await getTestimonials();
                if (data && data.length > 0) {
                    const published = data.filter((t: any) => t.status === 'published');
                    if (published.length > 0) {
                        setTestimonials(published);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch testimonials:", error);
            }
        };
        fetchTestimonials();
    }, []);

    // Create chunks for the grid layout: 9 items per slide for desktop (3x3), 4 items per slide for mobile (2x2)
    // To keep it simple and responsive across breakpoints, we will just use CSS Grid inside each SwiperSlide
    const chunkArray = (arr: any[], size: number) => {
        const result = [];
        for (let i = 0; i < arr.length; i += size) {
            result.push(arr.slice(i, i + size));
        }
        return result;
    };

    // We'll use 9 items per slide. On mobile, the grid will be 2 cols, showing up to 9 items (which might scroll vertically or we rely on CSS to hide overflow). 
    // Wait, the user specifically wants 3x3 on desktop and 2x2 on mobile.
    // To achieve this cleanly with Swiper, we chunk by 9. On mobile, we can use CSS to limit to 4 items and hide the rest, or we dynamically change the chunk size.
    // A dynamic chunk size approach:
    const [isMobile, setIsMobile] = useState(false);
    
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize(); // Initial check
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const chunkSize = isMobile ? 4 : 9;
    const slides = chunkArray(testimonials, chunkSize);

    return (
        <section className="py-24 bg-gray-50 dark:bg-zinc-950 relative border-t border-black/5 dark:border-white/5 transition-colors duration-300" id="testimonials">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px]">
                <div className="text-center max-w-3xl mx-auto mb-16">
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
                        Don't just take my word for it. Hear from the businesses that have transformed their operations with my AI voice systems.
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="relative pb-16" // padding for pagination dots
                >
                    <Swiper
                        modules={[Pagination, Autoplay]}
                        spaceBetween={30}
                        slidesPerView={1}
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 6000, disableOnInteraction: true }}
                        loop={slides.length > 1}
                        className="w-full"
                    >
                        {slides.map((slideItems, slideIndex) => (
                            <SwiperSlide key={slideIndex}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 auto-rows-fr">
                                    {slideItems.map((testimonial, index) => (
                                        <div
                                            key={testimonial.id || index}
                                            className="bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-3xl p-6 md:p-8 flex flex-col shadow-sm hover:shadow-lg transition-all duration-300"
                                        >
                                            <div className="flex items-center gap-4 mb-6">
                                                {testimonial.image_url ? (
                                                    <img 
                                                        src={testimonial.image_url} 
                                                        alt={testimonial.client_name}
                                                        loading="lazy"
                                                        className="w-14 h-14 rounded-full object-cover border-2 border-blue-100 dark:border-blue-900/30"
                                                    />
                                                ) : (
                                                    <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 font-bold text-xl">
                                                        {testimonial.client_name.charAt(0)}
                                                    </div>
                                                )}
                                                <div>
                                                    <h3 className="font-bold text-black dark:text-white text-lg">{testimonial.client_name}</h3>
                                                    {testimonial.company && (
                                                        <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">{testimonial.company}</p>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <div className="flex text-yellow-400 mb-4">
                                                {[...Array(testimonial.rating || 5)].map((_, i) => (
                                                    <Star key={i} className="w-4 h-4 fill-current" />
                                                ))}
                                            </div>
                                            
                                            <div className="relative flex-grow">
                                                <Quote className="absolute -top-2 -left-2 w-8 h-8 text-black/5 dark:text-white/5 rotate-180" />
                                                <p className="text-gray-600 dark:text-gray-300 relative z-10 leading-relaxed text-sm md:text-base">
                                                    "{testimonial.content}"
                                                </p>
                                            </div>

                                            {testimonial.video_url && (
                                                <div className="mt-6 pt-6 border-t border-black/5 dark:border-white/5">
                                                    <a 
                                                        href={testimonial.video_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                                                    >
                                                        <PlayCircle className="w-4 h-4 mr-2" /> Watch Video Testimonial
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </motion.div>
            </div>
        </section>
    );
}
