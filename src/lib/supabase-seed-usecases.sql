-- Seed Script: Populate the use_cases table with default industry data
-- Run this in your Supabase SQL Editor to populate the use cases

INSERT INTO public.use_cases (industry_slug, name, headline, subhead, problem, features, flow, results, status, display_order)
VALUES 
(
    'real-estate',
    'Real Estate',
    'Instant Lead Calling',
    'AI voice agents that call leads within seconds, qualify prospects, and book showings — automatically.',
    'Online leads convert best when called within 5 minutes. Most agents take hours or even days to respond, losing the deal before it even starts.',
    '["Speed to lead < 5s", "Live hot-transfers to agents", "Automated showing scheduling", "Lead qualification scoring", "CRM auto-sync"]'::jsonb,
    '[{"step": "Lead Captured", "desc": "A new lead submits a form on your website or landing page."}, {"step": "AI Calls Instantly", "desc": "Within seconds, the AI agent calls the lead to qualify them."}, {"step": "Qualification", "desc": "The AI asks budget, timeline, and location preference questions."}, {"step": "Hot Transfer", "desc": "Qualified leads are instantly transferred to your best available agent."}]'::jsonb,
    '[{"stat": "300%", "label": "Increase in connect rate"}, {"stat": "<5s", "label": "Speed to lead"}]'::jsonb,
    'published',
    1
),
(
    'solar',
    'Solar & Energy',
    'High-Volume Pre-Qualification',
    'AI agents that pre-qualify solar leads at scale, filtering by homeownership, utility costs, and roof eligibility.',
    'Sales reps waste hours dialing un-qualified homeowners or renters. Manual dialing can''t keep up with lead volume.',
    '["Utility bill size filtering", "Homeowner verification", "Virtual consultation booking", "Roof eligibility screening", "Automated follow-ups"]'::jsonb,
    '[{"step": "Lead Ingested", "desc": "Leads arrive from Facebook ads, Google, or purchased lists."}, {"step": "AI Pre-Screen", "desc": "The agent verifies homeownership and asks about utility costs."}, {"step": "Qualification", "desc": "Eligible leads are scored and prioritized."}, {"step": "Consultation Booked", "desc": "Qualified homeowners are booked for a virtual or in-person consultation."}]'::jsonb,
    '[{"stat": "12hrs", "label": "Saved per rep weekly"}, {"stat": "4x", "label": "Lead throughput"}]'::jsonb,
    'published',
    2
),
(
    'home-services',
    'Home Services',
    '24/7 Booking & Dispatch',
    'Never miss a service call again. AI agents answer, book, and dispatch — even after hours.',
    'Missed calls mean missed revenue. Customers call competitors when you don''t answer the phone.',
    '["After-hours answering", "Appointment booking", "Emergency dispatch routing", "Service type classification", "Customer callback scheduling"]'::jsonb,
    '[{"step": "Customer Calls", "desc": "A homeowner calls your business line for plumbing, HVAC, or electrical work."}, {"step": "AI Answers", "desc": "The voice agent picks up 24/7, identifies the service needed."}, {"step": "Booking", "desc": "The agent books the appointment based on crew availability."}, {"step": "Dispatch", "desc": "Emergency calls are flagged and dispatched immediately."}]'::jsonb,
    '[{"stat": "40%", "label": "More bookings captured"}, {"stat": "24/7", "label": "Availability"}]'::jsonb,
    'published',
    3
),
(
    'consulting',
    'Consulting & Agencies',
    'Client Intake Automation',
    'Streamline your client onboarding with AI-powered discovery calls and intake automation.',
    'Manual intake processes slow down onboarding and frustrate potential clients who want to get started quickly.',
    '["Automated discovery calls", "Smart intake forms via voice", "CRM auto-sync", "Project scope estimation", "Meeting scheduling"]'::jsonb,
    '[{"step": "Lead Inquires", "desc": "A potential client reaches out via your website or referral."}, {"step": "AI Discovery Call", "desc": "The AI agent conducts a structured discovery conversation."}, {"step": "Intake Captured", "desc": "All requirements, budget, and timeline data are captured automatically."}, {"step": "Handoff to Team", "desc": "A fully briefed summary is delivered to your consulting team."}]'::jsonb,
    '[{"stat": "60%", "label": "Faster client onboarding"}, {"stat": "3x", "label": "More discovery calls"}]'::jsonb,
    'published',
    4
),
(
    'finance',
    'Finance & Insurance',
    'Compliance-Ready Outreach',
    'AI agents that handle regulated outreach with built-in compliance guardrails and audit trails.',
    'Regulatory requirements make manual outreach slow and risky. One wrong word can mean costly fines.',
    '["Scripted compliance calls", "Consent management", "Audit trail recording", "Do-not-call list integration", "Regulatory script adherence"]'::jsonb,
    '[{"step": "Campaign Setup", "desc": "Configure compliant scripts and targeting parameters."}, {"step": "AI Outreach", "desc": "The agent makes calls following strict regulatory guidelines."}, {"step": "Consent Captured", "desc": "All consent and opt-in/opt-out decisions are recorded."}, {"step": "Audit Ready", "desc": "Complete call recordings and transcripts are stored for audit."}]'::jsonb,
    '[{"stat": "99%", "label": "Compliance adherence"}, {"stat": "50%", "label": "Cost reduction"}]'::jsonb,
    'published',
    5
),
(
    'customer-support',
    'Customer Support',
    'Tier-1 Support Automation',
    'Resolve common support tickets instantly with AI voice agents, and seamlessly hand off complex issues to humans.',
    'Support teams are overwhelmed with repetitive tickets that don''t need human agents, causing long wait times for everyone.',
    '["FAQ resolution via voice", "Smart ticket creation", "Seamless human handoff", "Sentiment analysis", "Multi-language support"]'::jsonb,
    '[{"step": "Customer Calls", "desc": "A customer calls your support line with an issue."}, {"step": "AI Triages", "desc": "The agent identifies the issue type and attempts resolution."}, {"step": "Auto-Resolve", "desc": "Common issues like password resets or billing questions are handled instantly."}, {"step": "Human Handoff", "desc": "Complex issues are seamlessly transferred to a live agent with full context."}]'::jsonb,
    '[{"stat": "70%", "label": "Tickets auto-resolved"}, {"stat": "< 30s", "label": "Average resolution time"}]'::jsonb,
    'published',
    6
)
ON CONFLICT (industry_slug) DO NOTHING;
