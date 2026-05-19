import { getUseCaseBySlug } from "@/app/admin/(protected)/use-cases/actions";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, CheckCircle2 } from "lucide-react";
import WebRTCVoiceDemo from "@/components/WebRTCVoiceDemo";

// Fallback data for when the database is empty
const fallbackUseCases: Record<string, any> = {
    "real-estate": {
        name: "Real Estate",
        industry_slug: "real-estate",
        headline: "Speed-to-Lead AI Calling",
        subhead: "AI voice agents that call new leads within seconds, qualify buyers and sellers, and book showings — all on autopilot, 24/7.",
        problem: "In real estate, the first agent to call wins the deal. Studies show leads contacted within 5 minutes are 21x more likely to convert — yet the average agent response time is over 2 hours. By then, the lead has already spoken to your competitor.",
        features: ["Instant callback in under 5 seconds", "Intelligent buyer/seller qualification", "Automated showing & open house scheduling", "Live hot-transfer to your top agents", "CRM auto-sync with lead scoring", "Multi-language support for diverse markets"],
        flow: [
            { step: "Lead Captured", desc: "A new buyer or seller submits a form on Zillow, Realtor.com, or your website." },
            { step: "AI Calls in Seconds", desc: "The AI agent calls the lead within 5 seconds, introduces itself, and begins qualifying." },
            { step: "Smart Qualification", desc: "The agent asks about budget, timeline, preferred neighborhoods, and financing status." },
            { step: "Hot Transfer or Booking", desc: "Qualified leads are instantly transferred to your best agent, or a showing is booked directly on your calendar." },
        ],
        results: [{ stat: "300%", label: "Increase in connect rate" }, { stat: "<5s", label: "Speed to lead" }, { stat: "21x", label: "Higher conversion odds" }],
        vapiAgentId: "087efbdc-3fcf-4329-a12e-819eb64d3882",
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
    "sales": {
        name: "Sales Automation",
        industry_slug: "sales",
        headline: "AI-Powered Sales Outreach",
        subhead: "High-volume AI dialers that call leads within seconds of form submission, qualify them against your criteria, and book appointments — turning cold lists into warm pipelines.",
        problem: "Sales teams burn hours manually dialing cold leads, leaving hot prospects waiting. By the time a rep gets to a new lead, competitors have already made contact. Manual outreach simply can't scale.",
        features: ["Instant lead callback in under 5 seconds", "Intelligent objection handling", "Real-time CRM deal stage updates", "Automated follow-up sequences", "Live hot-transfer to closers", "Custom qualification scripts"],
        flow: [
            { step: "Lead Captured", desc: "A prospect fills out a form, clicks an ad, or enters your funnel from any source." },
            { step: "AI Calls Instantly", desc: "The AI sales agent calls within 5 seconds, introduces itself, and begins the pitch." },
            { step: "Smart Qualification", desc: "The agent qualifies the lead based on budget, authority, need, and timeline (BANT)." },
            { step: "Book or Transfer", desc: "Qualified leads are booked for a demo or hot-transferred to your best closer." },
        ],
        results: [{ stat: "5x", label: "More leads contacted" }, { stat: "<5s", label: "Speed to lead" }, { stat: "32%", label: "Meeting set rate" }],
    },
    "ivr": {
        name: "Interactive Voice Response",
        industry_slug: "ivr",
        headline: "Conversational IVR 2.0",
        subhead: "Replace frustrating phone menus with conversational AI that understands natural language and solves problems instantly — no more 'Press 1 for Sales'.",
        problem: "Traditional IVR systems frustrate callers with rigid menus and long hold times. Customers abandon calls, satisfaction scores drop, and your team wastes resources handling misdirected calls.",
        features: ["Natural language understanding", "Intent-based routing", "Self-service resolution for common queries", "Seamless handoff to live agents with context", "Multi-language voice recognition", "Real-time analytics dashboard"],
        flow: [
            { step: "Caller Dials In", desc: "A customer calls your business line and is greeted by a conversational AI agent." },
            { step: "Natural Conversation", desc: "Instead of pressing buttons, the caller simply states their need in plain language." },
            { step: "Instant Resolution", desc: "The AI resolves the issue directly — checking order status, resetting passwords, or answering FAQs." },
            { step: "Smart Routing", desc: "Complex issues are routed to the right department with full conversation context attached." },
        ],
        results: [{ stat: "80%", label: "Self-service rate" }, { stat: "60%", label: "Reduced call transfers" }, { stat: "4.8★", label: "Caller satisfaction" }],
    },
    "scheduling": {
        name: "Appointment Scheduling",
        industry_slug: "scheduling",
        headline: "AI-Driven Appointment Setting",
        subhead: "AI agents that call prospects, find a time that works for everyone, and book directly into your calendar system — eliminating scheduling friction entirely.",
        problem: "Scheduling appointments manually wastes hours of back-and-forth. No-shows cost revenue, double-bookings create chaos, and after-hours inquiries go unanswered until the next business day.",
        features: ["Direct Google Calendar & Calendly integration", "Automated reminder calls & SMS", "No-show follow-up sequences", "Multi-timezone support", "Rescheduling & cancellation handling", "Waitlist management"],
        flow: [
            { step: "Lead Engaged", desc: "A prospect expresses interest via your website, ad, or existing customer list." },
            { step: "AI Calls to Book", desc: "The AI agent calls the prospect and proposes available time slots from your calendar." },
            { step: "Appointment Confirmed", desc: "The booking is confirmed and synced to your calendar with all lead details attached." },
            { step: "Reminders Sent", desc: "Automated reminder calls and texts are sent 24 hours and 1 hour before the appointment." },
        ],
        results: [{ stat: "45%", label: "More appointments booked" }, { stat: "70%", label: "No-show reduction" }, { stat: "24/7", label: "Booking availability" }],
    },
    "crm-integration": {
        name: "CRM & ERP Integration",
        industry_slug: "crm-integration",
        headline: "Seamless CRM & ERP Connectivity",
        subhead: "Connect AI voice agents to your existing CRM, ERP, or helpdesk systems for real-time data synchronization, automated workflows, and zero manual data entry.",
        problem: "Disconnected systems create data silos. Sales reps spend 30% of their time on manual data entry instead of selling. Leads fall through the cracks when information doesn't flow between platforms.",
        features: ["Native HubSpot & Salesforce integration", "GoHighLevel two-way sync", "Real-time deal stage updates", "Automated contact creation & enrichment", "Custom webhook pipelines", "ERP data push (SAP, Oracle, NetSuite)"],
        flow: [
            { step: "Call Completed", desc: "An AI voice agent finishes a call with a prospect or customer." },
            { step: "Data Extracted", desc: "Key information (name, email, intent, qualification status) is automatically parsed from the transcript." },
            { step: "CRM Updated", desc: "Contact records, deal stages, and notes are created or updated in your CRM in real-time." },
            { step: "Workflows Triggered", desc: "Downstream automations fire — email sequences, Slack alerts, task assignments — all automatically." },
        ],
        results: [{ stat: "100%", label: "Data logged automatically" }, { stat: "95%", label: "Data accuracy" }, { stat: "10hrs", label: "Saved per rep weekly" }],
    },
    "multi-language": {
        name: "Multi-Language Support",
        industry_slug: "multi-language",
        headline: "Global AI Voice Agents",
        subhead: "Communicate with your global audience effortlessly. Our AI agents fluidly switch between 30+ languages in real-time, breaking down language barriers at scale.",
        problem: "Hiring multilingual support staff is expensive and hard to scale. International customers get frustrated when they can't communicate in their preferred language, leading to lost deals and poor satisfaction scores.",
        features: ["Real-time language detection", "30+ language support", "Accent-aware speech recognition", "Cultural context adaptation", "Seamless mid-call language switching", "Localized response generation"],
        flow: [
            { step: "Caller Connects", desc: "An international customer calls your business line from anywhere in the world." },
            { step: "Language Detected", desc: "The AI instantly detects the caller's language and switches to match within the first sentence." },
            { step: "Native Conversation", desc: "The full conversation happens in the caller's preferred language with natural fluency." },
            { step: "Data Synced", desc: "Call notes and CRM data are captured in both the original language and English translation." },
        ],
        results: [{ stat: "30+", label: "Languages supported" }, { stat: "98%", label: "Detection accuracy" }, { stat: "3x", label: "International lead capture" }],
    },
    "custom-dashboards": {
        name: "Custom AI Dashboards",
        industry_slug: "custom-dashboards",
        headline: "Real-Time AI Analytics",
        subhead: "Get complete visibility into your AI agent performance with custom dashboards showing call transcripts, sentiment analysis, conversion metrics, and actionable insights.",
        problem: "Without proper analytics, you're flying blind. You can't optimize what you can't measure. Generic reporting tools don't capture the nuances of AI voice agent performance.",
        features: ["Real-time call monitoring", "Sentiment analysis heatmaps", "Conversion funnel tracking", "Agent performance scoring", "Custom KPI dashboards", "Automated weekly reports"],
        flow: [
            { step: "Calls Processed", desc: "Every AI voice agent call is automatically transcribed, analyzed, and scored." },
            { step: "Metrics Computed", desc: "Key metrics — conversion rate, sentiment score, call duration, objection frequency — are calculated in real-time." },
            { step: "Dashboard Updated", desc: "Your custom dashboard refreshes with live data, charts, and trend analysis." },
            { step: "Insights Delivered", desc: "Automated alerts and weekly digest reports highlight opportunities for optimization." },
        ],
        results: [{ stat: "360°", label: "Performance visibility" }, { stat: "15%", label: "Conversion improvement" }, { stat: "Real-time", label: "Data refresh" }],
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

                            {data.vapiAgentId ? (
                                <div className="mb-6">
                                    <WebRTCVoiceDemo
                                        agentRole={data.name}
                                        vapiAgentId={(() => {
                                            const urlOrId = data.vapiAgentId;
                                            if (urlOrId.includes('vapi.ai') && urlOrId.includes('assistantId=')) {
                                                try {
                                                    const urlObj = new URL(urlOrId);
                                                    const assistantId = urlObj.searchParams.get('assistantId');
                                                    if (assistantId) return assistantId;
                                                } catch(e) {}
                                            }
                                            return urlOrId;
                                        })()}
                                    />
                                </div>
                            ) : (
                                <div className="bg-black rounded-lg border border-white/10 p-4 mb-6 text-center">
                                    <div className="w-16 h-16 bg-blue-500/10 rounded-full mx-auto flex items-center justify-center mb-3">
                                        <div className="w-8 h-8 bg-blue-500 rounded-full animate-pulse" />
                                    </div>
                                    <p className="text-sm text-gray-500 italic">No agent configured for this use case.</p>
                                </div>
                            )}

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
