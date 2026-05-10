import { getUseCaseBySlug } from "@/app/admin/(protected)/use-cases/actions";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, CheckCircle2 } from "lucide-react";

export default async function IndustryPage({ params }: { params: Promise<{ industry: string }> }) {
    const { industry } = await params;
    
    // Fetch dynamic data
    const { data: useCase, error } = await getUseCaseBySlug(industry);

    if (error || !useCase) {
        notFound();
    }

    const data = useCase;

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
