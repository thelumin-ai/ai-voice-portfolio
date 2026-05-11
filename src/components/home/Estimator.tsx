"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ChevronRight, Loader2, Zap, Clock, DollarSign, Mic, Bot, GitBranch, Phone } from "lucide-react";
import Link from "next/link";

const steps = [
    { id: 1, title: "Use Case", desc: "What do you need the AI to do?" },
    { id: 2, title: "Features", desc: "Select key capabilities" },
    { id: 3, title: "Timeline", desc: "How soon do you need it?" },
    { id: 4, title: "Your Quote", desc: "Get your estimate" },
];

const useCases = [
    { id: "inbound", label: "Inbound AI Receptionist", icon: Phone, desc: "Answer calls 24/7, book appointments, handle FAQs", base: 500 },
    { id: "outbound", label: "Outbound Lead Calling", icon: Mic, desc: "Auto-call leads, qualify, set meetings", base: 800 },
    { id: "support", label: "Customer Support AI", icon: Bot, desc: "Resolve tickets, escalate complex issues", base: 600 },
    { id: "automation", label: "Workflow Automation", icon: GitBranch, desc: "CRM sync, n8n flows, API integrations", base: 700 },
];

const features = [
    { id: "crm", label: "CRM Integration", desc: "Sync with HubSpot, Salesforce, GoHighLevel", cost: 200 },
    { id: "calendar", label: "Calendar Booking", desc: "Calendly, Google Calendar, automated scheduling", cost: 150 },
    { id: "sms", label: "SMS Follow-up", desc: "Automated text sequences after calls", cost: 100 },
    { id: "multilang", label: "Multi-Language", desc: "Support in Spanish, French, or other languages", cost: 250 },
    { id: "dashboard", label: "Analytics Dashboard", desc: "Live call stats and conversion tracking", cost: 300 },
    { id: "hotTransfer", label: "Live Agent Transfer", desc: "Hot-transfer qualified leads to your team", cost: 150 },
];

const timelines = [
    { id: "rush", label: "ASAP (1–2 weeks)", multiplier: 1.4, icon: Zap, color: "text-orange-400 border-orange-400/30 bg-orange-400/10" },
    { id: "normal", label: "Standard (3–4 weeks)", multiplier: 1.0, icon: Clock, color: "text-blue-400 border-blue-400/30 bg-blue-400/10" },
    { id: "flexible", label: "Flexible (5–8 weeks)", multiplier: 0.85, icon: DollarSign, color: "text-green-400 border-green-400/30 bg-green-400/10" },
];

export default function Estimator() {
    const [step, setStep] = useState(1);
    const [selectedUseCase, setSelectedUseCase] = useState<string | null>(null);
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
    const [selectedTimeline, setSelectedTimeline] = useState<string | null>(null);
    const [formData, setFormData] = useState({ name: "", email: "", business: "" });
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const getBase = () => useCases.find(u => u.id === selectedUseCase)?.base || 0;
    const getFeatureCost = () => selectedFeatures.reduce((acc, fId) => acc + (features.find(f => f.id === fId)?.cost || 0), 0);
    const getMultiplier = () => timelines.find(t => t.id === selectedTimeline)?.multiplier || 1;
    const totalEstimate = Math.round((getBase() + getFeatureCost()) * getMultiplier());

    const toggleFeature = (id: string) => {
        setSelectedFeatures(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        // Simulate a short delay then show success
        await new Promise(res => setTimeout(res, 1500));
        setSubmitting(false);
        setSubmitted(true);
    };

    const canProceed = () => {
        if (step === 1) return !!selectedUseCase;
        if (step === 2) return true; // features are optional
        if (step === 3) return !!selectedTimeline;
        if (step === 4) return formData.name && formData.email;
        return false;
    };

    return (
        <section className="py-24 bg-gray-50 dark:bg-zinc-950 border-t border-black/5 dark:border-white/5" id="estimator">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
                <div className="text-center mb-12">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold tracking-tight text-black dark:text-white mb-4"
                    >
                        Get Your <span className="text-blue-600 dark:text-blue-500">Project Estimate</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-gray-600 dark:text-gray-400"
                    >
                        Answer 3 quick questions to get a ballpark cost for your AI automation system.
                    </motion.p>
                </div>

                {/* Step Indicators */}
                <div className="flex items-center justify-center mb-10 gap-2">
                    {steps.map((s, i) => (
                        <div key={s.id} className="flex items-center">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300
                                    ${step > s.id ? 'bg-blue-600 border-blue-600 text-white' :
                                    step === s.id ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-600/10' :
                                    'border-gray-300 dark:border-zinc-600 text-gray-400'}`}
                            >
                                {step > s.id ? <CheckCircle2 className="w-4 h-4" /> : s.id}
                            </div>
                            <span className={`hidden sm:block ml-2 text-sm font-medium mr-4 ${step === s.id ? 'text-black dark:text-white' : 'text-gray-400'}`}>
                                {s.title}
                            </span>
                            {i < steps.length - 1 && <ChevronRight className="w-4 h-4 text-gray-300 dark:text-zinc-600 mr-2" />}
                        </div>
                    ))}
                </div>

                {/* Card */}
                <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border border-black/5 dark:border-white/5 overflow-hidden">
                    <AnimatePresence mode="wait">
                        {/* Step 1 - Use Case */}
                        {step === 1 && (
                            <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="p-8 md:p-12">
                                <h3 className="text-2xl font-bold text-black dark:text-white mb-2">What do you need the AI to do?</h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-8">Choose the primary use case for your AI system.</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {useCases.map(uc => {
                                        const Icon = uc.icon;
                                        return (
                                            <button
                                                key={uc.id}
                                                onClick={() => setSelectedUseCase(uc.id)}
                                                className={`p-6 rounded-2xl border-2 text-left transition-all duration-200 ${
                                                    selectedUseCase === uc.id
                                                        ? 'border-blue-600 bg-blue-600/5 dark:bg-blue-600/10'
                                                        : 'border-gray-200 dark:border-zinc-700 hover:border-blue-300 dark:hover:border-blue-700'
                                                }`}
                                            >
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${selectedUseCase === uc.id ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400'}`}>
                                                    <Icon className="w-5 h-5" />
                                                </div>
                                                <div className="font-bold text-black dark:text-white mb-1">{uc.label}</div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">{uc.desc}</div>
                                                <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold mt-3">From ${uc.base}</div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}

                        {/* Step 2 - Features */}
                        {step === 2 && (
                            <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="p-8 md:p-12">
                                <h3 className="text-2xl font-bold text-black dark:text-white mb-2">Select additional features</h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-8">Choose any integrations or capabilities. You can skip this step.</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {features.map(f => (
                                        <button
                                            key={f.id}
                                            onClick={() => toggleFeature(f.id)}
                                            className={`p-5 rounded-2xl border-2 text-left transition-all duration-200 relative ${
                                                selectedFeatures.includes(f.id)
                                                    ? 'border-blue-600 bg-blue-600/5 dark:bg-blue-600/10'
                                                    : 'border-gray-200 dark:border-zinc-700 hover:border-blue-300 dark:hover:border-blue-700'
                                            }`}
                                        >
                                            {selectedFeatures.includes(f.id) && (
                                                <div className="absolute top-3 right-3">
                                                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                                                </div>
                                            )}
                                            <div className="font-semibold text-black dark:text-white mb-1 pr-6">{f.label}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">{f.desc}</div>
                                            <div className="text-xs text-blue-600 dark:text-blue-400 font-bold">+${f.cost}</div>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3 - Timeline */}
                        {step === 3 && (
                            <motion.div key="step3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="p-8 md:p-12">
                                <h3 className="text-2xl font-bold text-black dark:text-white mb-2">What's your timeline?</h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-8">Timeline affects the final price.</p>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {timelines.map(t => {
                                        const Icon = t.icon;
                                        return (
                                            <button
                                                key={t.id}
                                                onClick={() => setSelectedTimeline(t.id)}
                                                className={`p-6 rounded-2xl border-2 text-left transition-all duration-200 ${
                                                    selectedTimeline === t.id
                                                        ? 'border-blue-600 bg-blue-600/5 dark:bg-blue-600/10'
                                                        : 'border-gray-200 dark:border-zinc-700 hover:border-blue-300 dark:hover:border-blue-700'
                                                }`}
                                            >
                                                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl border mb-4 ${t.color}`}>
                                                    <Icon className="w-5 h-5" />
                                                </div>
                                                <div className="font-bold text-black dark:text-white">{t.label}</div>
                                                {t.multiplier > 1 && <div className="text-xs text-orange-500 mt-1">+Rush fee</div>}
                                                {t.multiplier < 1 && <div className="text-xs text-green-500 mt-1">Discount applies</div>}
                                            </button>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}

                        {/* Step 4 - Quote */}
                        {step === 4 && !submitted && (
                            <motion.div key="step4" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="p-8 md:p-12">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                    {/* Estimate Summary */}
                                    <div>
                                        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-white mb-6">
                                            <div className="text-sm font-semibold opacity-70 uppercase tracking-wider mb-2">Your Estimated Investment</div>
                                            <div className="text-5xl font-black mb-1">${totalEstimate.toLocaleString()}</div>
                                            <div className="text-blue-200 text-sm">One-time project fee</div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                                                <span>Base: {useCases.find(u => u.id === selectedUseCase)?.label}</span>
                                                <span className="font-semibold text-black dark:text-white">${getBase()}</span>
                                            </div>
                                            {selectedFeatures.map(fId => {
                                                const f = features.find(f => f.id === fId);
                                                return f ? (
                                                    <div key={fId} className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                                                        <span>+ {f.label}</span>
                                                        <span className="font-semibold text-black dark:text-white">+${f.cost}</span>
                                                    </div>
                                                ) : null;
                                            })}
                                            {selectedTimeline && timelines.find(t => t.id === selectedTimeline)?.multiplier !== 1 && (
                                                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                                                    <span>Timeline adjustment</span>
                                                    <span className={`font-semibold ${getMultiplier() > 1 ? 'text-orange-500' : 'text-green-500'}`}>
                                                        {getMultiplier() > 1 ? `+${Math.round((getMultiplier() - 1) * 100)}%` : `-${Math.round((1 - getMultiplier()) * 100)}%`}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Contact Form */}
                                    <div>
                                        <h3 className="text-xl font-bold text-black dark:text-white mb-2">Get your detailed quote</h3>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">I'll review your requirements and send a detailed proposal within 24 hours.</p>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Your Name *</label>
                                                <input
                                                    type="text"
                                                    value={formData.name}
                                                    onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                                                    placeholder="John Smith"
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Email Address *</label>
                                                <input
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                                                    placeholder="john@company.com"
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Business / Company</label>
                                                <input
                                                    type="text"
                                                    value={formData.business}
                                                    onChange={e => setFormData(p => ({ ...p, business: e.target.value }))}
                                                    placeholder="Your company name"
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Submitted */}
                        {submitted && (
                            <motion.div key="submitted" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-12 text-center">
                                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                                </div>
                                <h3 className="text-3xl font-bold text-black dark:text-white mb-3">You're all set!</h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-2">Your estimate has been received.</p>
                                <p className="text-gray-500 dark:text-gray-400 mb-8">I'll review your requirements and send a detailed proposal to <span className="text-blue-600 dark:text-blue-400 font-semibold">{formData.email}</span> within 24 hours.</p>
                                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6 max-w-sm mx-auto">
                                    <div className="text-3xl font-black text-blue-600 dark:text-blue-400 mb-1">${totalEstimate.toLocaleString()}</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">Estimated project investment</div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Navigation Footer */}
                    {!submitted && (
                        <div className="px-8 md:px-12 pb-8 flex items-center justify-between border-t border-black/5 dark:border-white/5 pt-6">
                            <button
                                onClick={() => setStep(s => Math.max(1, s - 1))}
                                disabled={step === 1}
                                className="px-6 py-2.5 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white disabled:opacity-30 transition-colors"
                            >
                                ← Back
                            </button>

                            <div className="text-sm text-gray-400">Step {step} of {steps.length}</div>

                            {step < 4 ? (
                                <button
                                    onClick={() => setStep(s => s + 1)}
                                    disabled={!canProceed()}
                                    className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                >
                                    Continue →
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    disabled={!canProceed() || submitting}
                                    className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                                >
                                    {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : 'Get My Proposal →'}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
