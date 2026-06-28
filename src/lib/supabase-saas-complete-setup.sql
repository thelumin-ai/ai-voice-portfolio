-- ========================================================
-- UNIFIED SUPABASE SCHEMA SETUP FOR SAAS WEBSITE BUILDER
-- Run this complete script in your Supabase SQL Editor
-- ========================================================

-- 1. Create Tenant Profile table (with layout columns included)
CREATE TABLE IF NOT EXISTS public.saas_tenants (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    subdomain TEXT UNIQUE NOT NULL,
    custom_domain TEXT UNIQUE,
    company_name TEXT NOT NULL,
    title TEXT NOT NULL,
    bio TEXT[] NOT NULL DEFAULT '{}',
    skills TEXT[] NOT NULL DEFAULT '{}',
    cta_text TEXT DEFAULT 'Book Consultation',
    linkedin_url TEXT,
    github_url TEXT,
    twitter_url TEXT,
    profile_image_url TEXT,
    footer_text TEXT,
    consultation_provider TEXT DEFAULT 'calendly',
    consultation_link TEXT,
    template_id TEXT NOT NULL DEFAULT 'agency_automation_cyber',
    layout_structure TEXT[] NOT NULL DEFAULT '{"hero", "services", "about", "consultation", "footer"}',
    visible_sections TEXT[] NOT NULL DEFAULT '{"hero", "services", "about", "consultation"}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on Tenants
ALTER TABLE public.saas_tenants ENABLE ROW LEVEL SECURITY;

-- Drop policies if they already exist to prevent duplicate errors
DROP POLICY IF EXISTS "Public read access for saas_tenants" ON public.saas_tenants;
DROP POLICY IF EXISTS "Tenants can manage their own profile" ON public.saas_tenants;

CREATE POLICY "Public read access for saas_tenants" ON public.saas_tenants FOR SELECT USING (true);
CREATE POLICY "Tenants can manage their own profile" ON public.saas_tenants FOR ALL TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- 2. Create SaaS Services table
CREATE TABLE IF NOT EXISTS public.saas_services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID REFERENCES public.saas_tenants(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT, -- Lucide icon name
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on Services
ALTER TABLE public.saas_services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access for saas_services" ON public.saas_services;
DROP POLICY IF EXISTS "Tenants can manage their own services" ON public.saas_services;

CREATE POLICY "Public read access for saas_services" ON public.saas_services FOR SELECT USING (true);
CREATE POLICY "Tenants can manage their own services" ON public.saas_services FOR ALL TO authenticated USING (auth.uid() = tenant_id) WITH CHECK (auth.uid() = tenant_id);

-- 3. Create SaaS Testimonials table
CREATE TABLE IF NOT EXISTS public.saas_testimonials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID REFERENCES public.saas_tenants(id) ON DELETE CASCADE NOT NULL,
    client_name TEXT NOT NULL,
    company TEXT,
    content TEXT NOT NULL,
    video_url TEXT,
    rating INTEGER DEFAULT 5,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on Testimonials
ALTER TABLE public.saas_testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access for saas_testimonials" ON public.saas_testimonials;
DROP POLICY IF EXISTS "Tenants can manage their own testimonials" ON public.saas_testimonials;

CREATE POLICY "Public read access for saas_testimonials" ON public.saas_testimonials FOR SELECT USING (true);
CREATE POLICY "Tenants can manage their own testimonials" ON public.saas_testimonials FOR ALL TO authenticated USING (auth.uid() = tenant_id) WITH CHECK (auth.uid() = tenant_id);

-- 4. Create SaaS Projects table
CREATE TABLE IF NOT EXISTS public.saas_projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID REFERENCES public.saas_tenants(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    industry_tag TEXT NOT NULL,
    short_description TEXT NOT NULL,
    case_study_body TEXT,
    metrics JSONB NOT NULL DEFAULT '[]', -- [{label, value}]
    integrations JSONB NOT NULL DEFAULT '[]', -- [string]
    demo_link TEXT,
    cover_image_url TEXT,
    status TEXT NOT NULL DEFAULT 'published',
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on Projects
ALTER TABLE public.saas_projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access for saas_projects" ON public.saas_projects;
DROP POLICY IF EXISTS "Tenants can manage their own projects" ON public.saas_projects;

CREATE POLICY "Public read access for saas_projects" ON public.saas_projects FOR SELECT USING (true);
CREATE POLICY "Tenants can manage their own projects" ON public.saas_projects FOR ALL TO authenticated USING (auth.uid() = tenant_id) WITH CHECK (auth.uid() = tenant_id);

-- 5. Create SaaS Leads table
CREATE TABLE IF NOT EXISTS public.saas_leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID REFERENCES public.saas_tenants(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'new', -- new, contacted, closed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on Leads
ALTER TABLE public.saas_leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit leads to a tenant" ON public.saas_leads;
DROP POLICY IF EXISTS "Tenants can manage their own leads" ON public.saas_leads;

CREATE POLICY "Anyone can submit leads to a tenant" ON public.saas_leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Tenants can manage their own leads" ON public.saas_leads FOR ALL TO authenticated USING (auth.uid() = tenant_id) WITH CHECK (auth.uid() = tenant_id);
