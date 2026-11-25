"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { AnimatePresence, motion } from 'framer-motion';
import { sanitizeHref } from '@/lib/url';

export default function Navbar({ consultationLink = "https://www.upwork.com/services/product/development-it-abimbola-1889268991195383021" }: { consultationLink?: string }) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen((prev) => !prev);
    const safeConsultationLink = sanitizeHref(consultationLink, "/#consultation");

    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/#solutions", label: "Solutions" },
        { href: "/#use-cases", label: "Use Cases" },
        { href: "/portfolio", label: "Portfolio" },
        { href: "/#estimator", label: "Price Estimator" },
        { href: "/#how-it-works", label: "How It Works" },
        { href: "/#about", label: "About" },
        { href: "/blog", label: "Blog" },
    ];

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-black/10 dark:border-white/10 bg-white/80 dark:bg-black/80 backdrop-blur-md transition-colors duration-300">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px]">
                <div className="flex h-16 items-center justify-between gap-4">
                    <div className="flex-shrink-0">
                        <Link href="/" className="text-xl font-bold tracking-tighter text-black dark:text-white whitespace-nowrap">
                            Abimbola<span className="text-blue-500">.AI</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation (shown at lg >= 1024px so 768px tablet uses mobile drawer cleanly) */}
                    <div className="hidden lg:block min-w-0">
                        <div className="ml-4 flex items-center gap-4 xl:gap-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors duration-200 text-sm font-medium whitespace-nowrap"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="hidden lg:flex items-center space-x-3 shrink-0">
                        <ThemeToggle />
                        <Link
                            href={safeConsultationLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 whitespace-nowrap shrink-0"
                        >
                            Book Consultation
                        </Link>
                    </div>

                    {/* Mobile & Tablet menu button */}
                    <div className="lg:hidden flex items-center space-x-3 shrink-0">
                        <ThemeToggle />
                        <button
                            type="button"
                            onClick={toggleMenu}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                            aria-label="Toggle navigation menu"
                            aria-expanded={isOpen}
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? (
                                <X className="block h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Menu className="block h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile & Tablet drawer */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden overflow-hidden border-t border-black/10 dark:border-white/10"
                    >
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-black">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="px-3 py-4">
                                <Link
                                    href={safeConsultationLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => setIsOpen(false)}
                                    className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                >
                                    Book Consultation
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
