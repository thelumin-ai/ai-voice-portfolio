import Link from "next/link";
import { ArrowLeft, ShieldCheck, Mail, Calendar, Eye, Database, Share2, Lock } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | Abimbola Akinsanmi - AI Voice Automation",
  description: "Privacy Policy and data practices for Abimbola Akinsanmi's AI Voice Automation portfolio, consulting, and voice agents.",
};

export default function PrivacyPage() {
  return (
    <div className="bg-white dark:bg-zinc-950 min-h-screen pt-28 pb-24 font-sans transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        
        {/* Back Link */}
        <Link 
          href="/" 
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 mb-10 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>

        {/* Hero Section */}
        <header className="mb-12 border-b border-gray-200 dark:border-zinc-800 pb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30 mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Secure &amp; Transparent Data Practices</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-black dark:text-white mb-6 leading-tight tracking-tight">
            Privacy Policy
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-500" />
              <span>Last updated: June 23, 2026</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-green-500" />
              <span>SSL Secured connection</span>
            </div>
          </div>
        </header>

        {/* Executive Summary Cards */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-black dark:text-white mb-6">At a Glance</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-gray-100 dark:border-zinc-800/80 bg-gray-50/50 dark:bg-zinc-900/30 backdrop-blur-sm">
              <div className="p-3 bg-blue-500/10 rounded-xl w-fit mb-4 text-blue-600 dark:text-blue-400">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-black dark:text-white mb-2">What We Collect</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Contact information from consultation bookings and voice transcript data from voice playground interactions.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-gray-100 dark:border-zinc-800/80 bg-gray-50/50 dark:bg-zinc-900/30 backdrop-blur-sm">
              <div className="p-3 bg-indigo-500/10 rounded-xl w-fit mb-4 text-indigo-600 dark:text-indigo-400">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-black dark:text-white mb-2">How We Use It</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                To process scheduling, build and optimize AI voice agents, and deliver custom technical integrations.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-gray-100 dark:border-zinc-800/80 bg-gray-50/50 dark:bg-zinc-900/30 backdrop-blur-sm">
              <div className="p-3 bg-purple-500/10 rounded-xl w-fit mb-4 text-purple-600 dark:text-purple-400">
                <Share2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-black dark:text-white mb-2">Third Parties</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Data is only shared with essential providers (Vapi.ai, Retell AI, Supabase, Calendly) to enable voice features and scheduling.
              </p>
            </div>
          </div>
        </section>

        {/* Detailed Policy - Prose styled */}
        <section className="prose prose-lg dark:prose-invert prose-blue max-w-none prose-headings:font-bold prose-headings:text-black dark:prose-headings:text-white prose-a:text-blue-600 dark:prose-a:text-blue-400 hover:prose-a:text-blue-500 transition-colors">
          <p>
            Welcome to the AI Voice Automation Portfolio of <strong>Abimbola Akinsanmi</strong> (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;). We are committed to protecting your privacy and ensuring transparency in how we handle data.
          </p>
          <p>
            This Privacy Policy details how we collect, utilize, and protect your information when you visit our website, schedule consulting sessions, or test our live AI voice agent demos and playground solutions.
          </p>

          <h2>1. Information We Collect</h2>
          <p>
            We only collect information that is strictly necessary to provide our voice automation services, respond to inquiries, or deliver system demonstrations. This includes:
          </p>
          <ul>
            <li>
              <strong>Consultation Details:</strong> When you book a call through Calendly or other booking systems, we collect your name, email address, company details, phone number (if provided), and any details about your voice automation project requirements.
            </li>
            <li>
              <strong>Voice Playground Data:</strong> If you use our interactive voice testing consoles or demos, we process temporary voice audio streams, telephone connections, and real-time conversation transcripts via our telephony partners.
            </li>
            <li>
              <strong>Analytics &amp; Usage Data:</strong> We may collect standard details regarding how you interact with our site, including IP addresses, browser specifications, and referral URLs.
            </li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>
            Your information is processed for the following clear and limited purposes:
          </p>
          <ol>
            <li>To schedule, confirm, and conduct consulting and technical implementation sessions.</li>
            <li>To demonstrate and improve the conversational capability, accuracy, and performance of our custom AI voice agents.</li>
            <li>To manage client agreements and process payments via our freelancing platform partners (e.g. Upwork, Fiverr) where applicable.</li>
            <li>To secure our web application against malicious activity and ensure site stability.</li>
          </ol>

          <h2>3. Third-Party Integrations</h2>
          <p>
            We design our systems securely and do not sell your personal data. To provide advanced voice testing and booking capabilities, we integrate with trusted third-party platforms that have their own privacy compliance measures:
          </p>
          <ul>
            <li>
              <strong>Retell AI &amp; Vapi.ai:</strong> Used to run WebRTC audio connections, telephony routes, and text-to-speech / speech-to-text models. Call transcripts are stored temporarily to diagnose system errors.
            </li>
            <li>
              <strong>Calendly:</strong> Used to schedule online meetings and gather initial project inquiries.
            </li>
            <li>
              <strong>Supabase:</strong> Used as our secure, database management and application storage provider.
            </li>
            <li>
              <strong>Upwork &amp; Fiverr:</strong> Used to process contracts, service payments, and escrow transactions.
            </li>
          </ul>

          <h2>4. Data Retention &amp; Deletion</h2>
          <p>
            We do not retain voice recordings or transcript history indefinitely. Playground call data and transcripts are regularly deleted or anonymized. 
          </p>
          <p>
            If you wish to have your consultation scheduling data, transcripts, or email records permanently deleted from our databases, please contact us directly and we will process your request within 5 business days.
          </p>

          <h2>5. Security of Your Data</h2>
          <p>
            We implement strict security measures to safeguard your information. All API interactions (including those with Retell AI and Vapi.ai) are handled securely on the server side to ensure API tokens are never exposed. We enforce SSL/TLS encryption across our web application routes and database connections.
          </p>

          <h2>6. Changes to This Policy</h2>
          <p>
            We may update our Privacy Policy periodically to reflect shifts in technology, integrations, or legal guidelines. The &ldquo;Last Updated&rdquo; date at the top of this page indicates when modifications were last applied.
          </p>

          <h2>7. Contact Information</h2>
          <p>
            For questions, data deletion requests, or technical feedback regarding our privacy practices, please contact us:
          </p>
          <div className="not-prose mt-8 p-6 rounded-2xl bg-blue-50/50 dark:bg-blue-950/10 border border-blue-100/50 dark:border-blue-900/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="font-bold text-black dark:text-white text-base">Direct Privacy Contact</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Abimbola Akinsanmi — AI Voice Automation Engineer</p>
            </div>
            <a 
              href="mailto:contact@abimbola.ai" 
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors shadow-sm w-fit"
            >
              <Mail className="w-4 h-4" />
              <span>contact@abimbola.ai</span>
            </a>
          </div>
        </section>

      </div>
    </div>
  );
}
