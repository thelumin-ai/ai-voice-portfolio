import Link from 'next/link';
import { Github, Linkedin, Twitter } from 'lucide-react';
import { getSiteSettings } from '@/app/admin/(protected)/settings/actions';

export default async function Footer() {
    const { data: settings } = await getSiteSettings();
    const twitterUrl = settings?.social_links?.twitter;
    const linkedinUrl = settings?.social_links?.linkedin;
    const githubUrl = settings?.social_links?.github;
    const footerText = settings?.footer_text || `© ${new Date().getFullYear()} Abimbola Akinsanmi. All rights reserved.`;

    return (
        <footer className="border-t border-black/10 dark:border-white/10 bg-gray-50 dark:bg-black py-12 transition-colors duration-300">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <Link href="/" className="text-xl font-bold tracking-tighter text-black dark:text-white transition-colors duration-300">
                            Abimbola<span className="text-blue-600 dark:text-blue-500">.AI</span>
                        </Link>
                        <p className="text-gray-600 dark:text-gray-400 text-sm transition-colors duration-300">
                            Designing intelligent voice systems that instantly call leads, qualify prospects, and schedule appointments automatically.
                        </p>
                        <div className="flex space-x-4 pt-2">
                            {twitterUrl && (
                                <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors" aria-label="Twitter">
                                    <span className="sr-only">Twitter</span>
                                    <Twitter className="h-5 w-5" />
                                </a>
                            )}
                            {linkedinUrl && (
                                <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors" aria-label="LinkedIn">
                                    <span className="sr-only">LinkedIn</span>
                                    <Linkedin className="h-5 w-5" />
                                </a>
                            )}
                            {githubUrl && (
                                <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors" aria-label="GitHub">
                                    <span className="sr-only">GitHub</span>
                                    <Github className="h-5 w-5" />
                                </a>
                            )}
                            {/* Fallback if no links to show something or just empty */}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold tracking-wider text-black dark:text-white uppercase mb-4 transition-colors duration-300">Solutions</h3>
                        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                            <li><Link href="/#solutions" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Inbound Calling</Link></li>
                            <li><Link href="/#solutions" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Outbound Systems</Link></li>
                            <li><Link href="/#solutions" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Lead Qualification</Link></li>
                            <li><Link href="/#solutions" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Appointment Booking</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold tracking-wider text-black dark:text-white uppercase mb-4 transition-colors duration-300">Company</h3>
                        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                            <li><Link href="/#about" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About</Link></li>
                            <li><Link href="/#portfolio" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Portfolio</Link></li>
                            <li><Link href="/#how-it-works" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">How it Works</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold tracking-wider text-black dark:text-white uppercase mb-4 transition-colors duration-300">Start Here</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 transition-colors duration-300">Ready to automate your calls?</p>
                        <Link
                            href="https://www.upwork.com/services/product/development-it-abimbola-1889268991195383021?ref=project_share"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center rounded-md bg-black border border-black dark:bg-white/10 dark:border-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:hover:bg-white/20 transition-all"
                        >
                            Book a Consultation
                        </Link>
                    </div>
                </div>
                <div className="mt-12 border-t border-black/10 dark:border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between transition-colors duration-300">
                    <p className="text-sm text-gray-500">
                        {footerText}
                    </p>
                </div>
            </div>
        </footer>
    );
}
