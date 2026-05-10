-- Phase 7 Migration: Services, Use Cases, and Extended Settings

-- 1. Create Services Table
CREATE TABLE IF NOT EXISTS public.services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon_name TEXT NOT NULL, -- Name of the Lucide icon, e.g., 'PhoneIncoming'
    status TEXT NOT NULL DEFAULT 'published', -- 'published', 'draft', 'archived'
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Allow admin all services" ON public.services FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 2. Create Use Cases Table
CREATE TABLE IF NOT EXISTS public.use_cases (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    industry_slug TEXT NOT NULL UNIQUE, -- e.g., 'real-estate'
    name TEXT NOT NULL, -- e.g., 'Real Estate'
    headline TEXT NOT NULL,
    subhead TEXT NOT NULL,
    problem TEXT NOT NULL,
    features JSONB NOT NULL DEFAULT '[]', -- Array of strings
    flow JSONB NOT NULL DEFAULT '[]', -- Array of { step: string, desc: string }
    results JSONB NOT NULL DEFAULT '[]', -- Array of { stat: string, label: string }
    status TEXT NOT NULL DEFAULT 'published', -- 'published', 'draft', 'archived'
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.use_cases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read use_cases" ON public.use_cases FOR SELECT USING (true);
CREATE POLICY "Allow admin all use_cases" ON public.use_cases FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 3. Extend Site Settings with New Keys
INSERT INTO public.site_settings (setting_key, setting_value)
VALUES 
    ('profile_image_url', '""'),
    ('consultation_provider', '"upwork"'), -- 'upwork', 'fiverr', or 'calendly'
    ('consultation_link_upwork', '"https://www.upwork.com/services/product/development-it-abimbola-1889268991195383021"'),
    ('consultation_link_fiverr', '""'),
    ('consultation_link_calendly', '""'),
    ('openai_api_key', '""'),
    ('anthropic_api_key', '""'),
    ('gemini_api_key', '""')
ON CONFLICT (setting_key) DO NOTHING;
