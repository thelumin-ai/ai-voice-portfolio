import { getUseCases } from "@/app/admin/(protected)/use-cases/actions";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import * as LucideIcons from "lucide-react";

export const metadata = {
    title: "AI Voice Agent Use Cases | Abimbola.AI",
    description: "Explore industry-specific AI voice agent deployments across Real Estate, Solar, Home Services, Consulting, Finance, and Customer Support.",
};

const defaultUseCases = [
    {
        id: "default-1",
        name: "Real Estate",
        icon_name: "Home",
        industry_slug: "real-estate",
        cover_image_url: "https://images.unsplash.com/photo-1560184897-ae75f418493e?q=80&w=1000&auto=format&fit=crop",
        headline: "Speed-to-Lead AI Calling",
        problem: "Leads go cold in minutes. AI agents call instantly, qualify prospects, and book showings on autopilot.",
        features: ["Instant callback < 5s", "Live transfers to agents", "Smart showing scheduler"],
        results: [{ stat: "300%", label: "Increase in connect rate" }],
        status: "published",
    },
    {
        id: "default-2",
        name: "Solar & Energy",
        icon_name: "Sun",
        industry_slug: "solar",
        cover_image_url: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=1000&auto=format&fit=crop",
        headline: "High-Volume Pre-Qualification",
        problem: "Sales reps waste hours dialing un-qualified homeowners or renters.",
        features: ["Utility bill size filtering", "Homeowner verification", "Virtual consultation booking"],
        results: [{ stat: "12hrs", label: "Saved per rep weekly" }],
        status: "published",
    },
    {
        id: "default-3",
        name: "Home Services",
        icon_name: "Hammer",
        industry_slug: "home-services",
        cover_image_url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1000&auto=format&fit=crop",
        headline: "24/7 Booking & Dispatch",
        problem: "Missed calls mean missed revenue. Customers call competitors when you don't answer.",
        features: ["After-hours answering", "Appointment booking", "Emergency dispatch routing"],
        results: [{ stat: "40%", label: "More bookings captured" }],
        status: "published",
    },
    {
        id: "default-4",
        name: "Consulting & Agencies",
        icon_name: "Briefcase",
        industry_slug: "consulting",
        cover_image_url: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1000&auto=format&fit=crop",
        headline: "Client Intake Automation",
        problem: "Manual intake processes slow down onboarding and frustrate potential clients.",
        features: ["Automated discovery calls", "Smart intake forms via voice", "CRM auto-sync"],
        results: [{ stat: "60%", label: "Faster client onboarding" }],
        status: "published",
    },
    {
        id: "default-5",
        name: "Finance & Insurance",
        icon_name: "BarChart",
        industry_slug: "finance",
        cover_image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop",
        headline: "Compliance-Ready Outreach",
        problem: "Regulatory requirements make manual outreach slow and risky.",
        features: ["Scripted compliance calls", "Consent management", "Audit trail recording"],
        results: [{ stat: "99%", label: "Compliance adherence" }],
        status: "published",
    },
    {
        id: "default-6",
        name: "Customer Support",
        icon_name: "Headphones",
        industry_slug: "customer-support",
        cover_image_url: "https://images.unsplash.com/photo-1596524430615-b46475ddff6e?q=80&w=1000&auto=format&fit=crop",
        headline: "Tier-1 Support Automation",
        problem: "Support teams are overwhelmed with repetitive tickets that don't need human agents.",
        features: ["FAQ resolution via voice", "Smart ticket creation", "Seamless human handoff"],
        results: [{ stat: "70%", label: "Tickets auto-resolved" }],
        status: "published",
    },
    {
        id: "default-7",
        name: "Sales Automation",
        icon_name: "PhoneOutgoing",
        industry_slug: "sales",
        cover_image_url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1000&auto=format&fit=crop",
        headline: "AI-Powered Sales Outreach",
        problem: "Sales teams burn hours manually dialing cold leads while hot prospects go unanswered.",
        features: ["Instant lead callback", "Intelligent objection handling", "CRM deal stage updates"],
        results: [{ stat: "5x", label: "More leads contacted" }],
        status: "published",
    },
    {
        id: "default-8",
        name: "Interactive Voice Response",
        icon_name: "MessageSquare",
        industry_slug: "ivr",
        cover_image_url: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?q=80&w=1000&auto=format&fit=crop",
        headline: "Conversational IVR 2.0",
        problem: "Traditional IVR systems frustrate callers with rigid menus and long hold times.",
        features: ["Natural language understanding", "Intent-based routing", "Self-service resolution"],
        results: [{ stat: "80%", label: "Self-service rate" }],
        status: "published",
    },
    {
        id: "default-9",
        name: "Appointment Scheduling",
        icon_name: "Calendar",
        industry_slug: "scheduling",
        cover_image_url: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=1000&auto=format&fit=crop",
        headline: "AI-Driven Appointment Setting",
        problem: "Scheduling manually wastes hours of back-and-forth and leads to no-shows.",
        features: ["Calendar integration", "Automated reminders", "No-show follow-ups"],
        results: [{ stat: "45%", label: "More appointments booked" }],
        status: "published",
    },
    {
        id: "default-10",
        name: "CRM & ERP Integration",
        icon_name: "Database",
        industry_slug: "crm-integration",
        cover_image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop",
        headline: "Seamless CRM & ERP Connectivity",
        problem: "Disconnected systems create data silos and waste hours on manual data entry.",
        features: ["HubSpot & Salesforce sync", "Real-time deal updates", "Custom webhooks"],
        results: [{ stat: "100%", label: "Data logged automatically" }],
        status: "published",
    },
    {
        id: "default-11",
        name: "Multi-Language Support",
        icon_name: "Globe",
        industry_slug: "multi-language",
        cover_image_url: "https://images.unsplash.com/photo-1526280760714-f9e8b26f318f?q=80&w=1000&auto=format&fit=crop",
        headline: "Global AI Voice Agents",
        problem: "Hiring multilingual support staff is expensive and doesn't scale.",
        features: ["30+ languages", "Real-time detection", "Accent-aware recognition"],
        results: [{ stat: "30+", label: "Languages supported" }],
        status: "published",
    },
    {
        id: "default-12",
        name: "Custom AI Dashboards",
        icon_name: "BarChart3",
        industry_slug: "custom-dashboards",
        cover_image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop",
        headline: "Real-Time AI Analytics",
        problem: "Without proper analytics, you can't optimize AI agent performance.",
        features: ["Real-time monitoring", "Sentiment analysis", "Conversion tracking"],
        results: [{ stat: "360°", label: "Performance visibility" }],
        status: "published",
    },
];

// Dynamic icon resolver - works with any Lucide icon name from the DB
const getIcon = (iconName: string) => {
    return (LucideIcons as any)[iconName] || LucideIcons.Briefcase;
};

export default async function UseCasesIndexPage() {
    const { data } = await getUseCases();

    // Use DB data if available, otherwise fall back to defaults
    let useCases = defaultUseCases;
    if (data && data.length > 0) {
        const published = data.filter((u: any) => u.status === "published");
        if (published.length > 0) {
            useCases = published;
        }
    }

    return (
        <div className="bg-white dark:bg-black min-h-screen pt-24 pb-16 transition-colors duration-300">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero Header */}
                <div className="max-w-3xl mb-16">
                    <div className="relative">
                        <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-600/20 blur-[50px] rounded-full" />
                        <h1 className="text-4xl md:text-6xl font-extrabold text-black dark:text-white mb-6 leading-tight relative z-10 transition-colors duration-300">
                            Industry-Specific{" "}
                            <span className="text-gray-500">AI Deployments</span>
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed transition-colors duration-300">
                            Discover how our AI voice agents are transforming operations
                            across multiple industries with tailored solutions.
                        </p>
                    </div>
                </div>

                {/* Use Cases Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {useCases.map((useCase: any) => {
                        const IconComponent = getIcon(useCase.icon_name || 'Briefcase');
                        return (
                            <Link
                                key={useCase.id || useCase.name}
                                href={`/use-cases/${useCase.industry_slug}`}
                                className="block group"
                            >
                                <div className="relative overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 aspect-[4/3] flex flex-col justify-end p-6 shadow-md dark:shadow-none hover:shadow-xl transition-all duration-500">
                                    {/* Background Image */}
                                    <div className="absolute inset-0 z-0">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20 z-10" />
                                        <img
                                            src={
                                                useCase.cover_image_url ||
                                                "https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=1000&auto=format&fit=crop"
                                            }
                                            alt={useCase.name}
                                            className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-700"
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="relative z-20 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                        <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-4 border border-white/20 transition-all duration-500 group-hover:bg-blue-600 group-hover:border-blue-500/50">
                                            <IconComponent className="h-6 w-6 text-white transition-colors duration-500" />
                                        </div>
                                        <h2 className="text-2xl font-semibold text-white mb-1">
                                            {useCase.name}
                                        </h2>
                                        <p className="text-sm text-gray-300 mb-2 line-clamp-2">
                                            {useCase.headline}
                                        </p>
                                        <div className="flex items-center text-sm font-medium text-gray-300 opacity-0 transform translate-y-4 group-hover:text-blue-300 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                                            Explore{" "}
                                            <ArrowRight className="ml-2 h-3 w-3" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
