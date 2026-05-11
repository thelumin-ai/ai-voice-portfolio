import { getUseCaseBySlug } from "@/app/admin/(protected)/use-cases/actions";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, CheckCircle2 } from "lucide-react";

// Fallback data for when the database is empty
const fallbackUseCases: Record<string, any> = {
    "real-estate": {
        name: "Real Estate",
        industry_slug: "real-estate",
        headline: "Instant Lead Calling",
        subhead: "AI voice agents that call leads within seconds, qualify prospects, and book showings — automatically.",
        problem: "Online leads convert best when called within 5 minutes. Most agents take hours or even days to respond, losing the deal before it even starts.",
        features: ["Speed to lead < 5s", "Live hot-transfers to agents", "Automated showing scheduling", "Lead qualification scoring", "CRM auto-sync"],
        flow: [
            { step: "Lead Captured", desc: "A new lead submits a form on your website or landing page." },
            { step: "AI Calls Instantly", desc: "Within seconds, the AI agent calls the lead to qualify them." },
            { step: "Qualification", desc: "The AI asks budget, timeline, and location preference questions." },
            { step: "Hot Transfer", desc: "Qualified leads are instantly transferred to your best available agent." },
        ],
        results: [{ stat: "300%", label: "Increase in connect rate" }, { stat: "<5s", label: "Speed to lead" }],
    },
    "solar": {
        name: "Solar & Energy",
        industry_slug: "solar",
        headline: "High-Volume Pre-Qualification",
        subhead: "AI agents that pre-qualify solar leads at scale, filtering by homeownership, utility costs, and roof eligibility.",
        problem: "Sales reps waste hours dialing un-qualified homeowners or renters. Manual dialing can't keep up with lead volume.",
        features: ["Utility bill size filtering", "Homeowner verification", "Virtual consultation booking", "Roof eligibility screening", "Automated follow-ups"],
        flow: [
            { step: "Lead Ingested", desc: "Leads arrive from Facebook ads, Google, or purchased lists." },
            { step: "AI Pre-Screen", desc: "The agent verifies homeownership and asks about utility costs." },
            { step: "Qualification", desc: "Eligible leads are scored and prioritized." },
            { step: "Consultation Booked", desc: "Qualified homeowners are booked for a virtual or in-person consultation." },
        ],
        results: [{ stat: "12hrs", label: "Saved per rep weekly" }, { stat: "4x", label: "Lead throughput" }],
    },
    "home-services": {
        name: "Home Services",
        industry_slug: "home-services",
        headline: "24/7 Booking & Dispatch",
        subhead: "Never miss a service call again. AI agents answer, book, and dispatch — even after hours.",
        problem: "Missed calls mean missed revenue. Customers call competitors when you don't answer the phone.",
        features: ["After-hours answering", "Appointment booking", "Emergency dispatch routing", "Service type classification", "Customer callback scheduling"],
        flow: [
            { step: "Customer Calls", desc: "A homeowner calls your business line for plumbing, HVAC, or electrical work." },
            { step: "AI Answers", desc: "The voice agent picks up 24/7, identifies the service needed." },
            { step: "Booking", desc: "The agent books the appointment based on crew availability." },
            { step: "Dispatch", desc: "Emergency calls are flagged and dispatched immediately." },
        ],
        results: [{ stat: "40%", label: "More bookings captured" }, { stat: "24/7", label: "Availability" }],
    },
    "consulting": {
        name: "Consulting & Agencies",
        industry_slug: "consulting",
        headline: "Client Intake Automation",
        subhead: "Streamline your client onboarding with AI-powered discovery calls and intake automation.",
        problem: "Manual intake processes slow down onboarding and frustrate potential clients who want to get started quickly.",
        features: ["Automated discovery calls", "Smart intake forms via voice", "CRM auto-sync", "Project scope estimation", "Meeting scheduling"],
        flow: [
            { step: "Lead Inquires", desc: "A potential client reaches out via your website or referral." },
            { step: "AI Discovery Call", desc: "The AI agent conducts a structured discovery conversation." },
            { step: "Intake Captured", desc: "All requirements, budget, and timeline data are captured automatically." },
            { step: "Handoff to Team", desc: "A fully briefed summary is delivered to your consulting team." },
        ],
        results: [{ stat: "60%", label: "Faster client onboarding" }, { stat: "3x", label: "More discovery calls" }],
    },
    "finance": {
        name: "Finance & Insurance",
        industry_slug: "finance",
        headline: "Compliance-Ready Outreach",
        subhead: "AI agents that handle regulated outreach with built-in compliance guardrails and audit trails.",
        problem: "Regulatory requirements make manual outreach slow and risky. One wrong word can mean costly fines.",
        features: ["Scripted compliance calls", "Consent management", "Audit trail recording", "Do-not-call list integration", "Regulatory script adherence"],
        flow: [
            { step: "Campaign Setup", desc: "Configure compliant scripts and targeting parameters." },
            { step: "AI Outreach", desc: "The agent makes calls following strict regulatory guidelines." },
            { step: "Consent Captured", desc: "All consent and opt-in/opt-out decisions are recorded." },
            { step: "Audit Ready", desc: "Complete call recordings and transcripts are stored for audit." },
        ],
        results: [{ stat: "99%", label: "Compliance adherence" }, { stat: "50%", label: "Cost reduction" }],
    },
    "customer-support": {
        name: "Customer Support",
        industry_slug: "customer-support",
        headline: "Tier-1 Support Automation",
        subhead: "Resolve common support tickets instantly with AI voice agents, and seamlessly hand off complex issues to humans.",
        problem: "Support teams are overwhelmed with repetitive tickets that don't need human agents, causing long wait times for everyone.",
        features: ["FAQ resolution via voice", "Smart ticket creation", "Seamless human handoff", "Sentiment analysis", "Multi-language support"],
        flow: [
            { step: "Customer Calls", desc: "A customer calls your support line with an issue." },
            { step: "AI Triages", desc: "The agent identifies the issue type and attempts resolution." },
            { step: "Auto-Resolve", desc: "Common issues like password resets or billing questions are handled instantly." },
            { step: "Human Handoff", desc: "Complex issues are seamlessly transferred to a live agent with full context." },
        ],
        results: [{ stat: "70%", label: "Tickets auto-resolved" }, { stat: "< 30s", label: "Average resolution time" }],
    },
};

export default async function IndustryPage({ params }: { params: Promise<{ industry: string }> }) {
    const { industry } = await params;
    
    // Fetch dynamic data from DB
    const { data: useCase, error } = await getUseCaseBySlug(industry);

    // Fall back to hardcoded data if DB is empty
    const fallback = fallbackUseCases[industry];
    
    if ((error || !useCase) && !fallback) {
        notFound();
    }

    const data = useCase || fallback;

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

                <div className="max-w-4xl mb-20 relative">
                    <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-600/20 blur-[50px] rounded-full" />
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight relative z-10">
                        {data.headline}
                    </h1>
                    <p className="text-xl text-gray-400 leading-relaxed">
                        {data.subhead}
                    </p>
                </div>

                {/* content grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left Column (Info) */}
                    <div className="lg:col-span-2 space-y-16">

                        {/* Problem */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 border-b border-white/10 pb-2">The Challenge</h2>
                            <p className="text-gray-300 text-lg leading-relaxed">{data.problem}</p>
                        </section>

                        {/* Features */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-2">What The AI Does</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {data.features?.map((feature: string, i: number) => (
                                    <div key={i} className="flex items-start">
                                        <CheckCircle2 className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-300">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Conversation Flow */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-2">Conversation Flow Logic</h2>
                            <div className="space-y-4">
                                {data.flow?.map((step: any, i: number) => (
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
                        </section>

                    </div>

                    {/* Right Column (Demo & Results) */}
                    <div className="space-y-8">
                        {/* Demo Card */}
                        <div className="glass-panel border-blue-500/30 p-8 sticky top-24">
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
                        </div>

                        {/* Results */}
                        <div className="grid grid-cols-1 gap-4">
                            <h3 className="text-lg font-semibold text-white mb-2">Expected Results</h3>
                            {data.results?.map((result: any, i: number) => (
                                <div key={i} className="bg-zinc-900 border border-white/5 rounded-xl p-4 flex flex-col items-center text-center">
                                    <span className="text-3xl font-black text-white text-gradient mb-1">{result.stat}</span>
                                    <span className="text-xs text-gray-400 uppercase tracking-wider">{result.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Final CTA */}
                <div className="mt-24 text-center glass-panel p-12 border-blue-500/20">
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
                </div>
            </div>
        </div>
    );
}
