-- ============================================================================
-- Consolidated Idempotent Supabase Schema & Security RLS Setup
-- Run this single script in your Supabase SQL Editor to ensure ALL admin tables,
-- columns, storage buckets, and RLS policies exist cleanly without conflicts.
-- ============================================================================

-- 1. Portfolio Projects
CREATE TABLE IF NOT EXISTS public.portfolio_projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    industry_tag TEXT NOT NULL,
    short_description TEXT NOT NULL,
    case_study_body TEXT,
    metrics JSONB NOT NULL DEFAULT '[]',
    integrations JSONB NOT NULL DEFAULT '[]',
    media_files JSONB NOT NULL DEFAULT '[]',
    project_type TEXT NOT NULL DEFAULT 'webrtc',
    media_url TEXT,
    api_key TEXT,
    cover_image_url TEXT,
    voice_platform TEXT DEFAULT 'vapi',
    status TEXT NOT NULL DEFAULT 'published',
    is_featured BOOLEAN DEFAULT false,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.portfolio_projects ADD COLUMN IF NOT EXISTS media_files JSONB NOT NULL DEFAULT '[]';
ALTER TABLE public.portfolio_projects ADD COLUMN IF NOT EXISTS project_type TEXT NOT NULL DEFAULT 'webrtc';
ALTER TABLE public.portfolio_projects ADD COLUMN IF NOT EXISTS media_url TEXT;
ALTER TABLE public.portfolio_projects ADD COLUMN IF NOT EXISTS api_key TEXT;
ALTER TABLE public.portfolio_projects ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE public.portfolio_projects ADD COLUMN IF NOT EXISTS voice_platform TEXT DEFAULT 'vapi';

ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to portfolio_projects" ON public.portfolio_projects;
DROP POLICY IF EXISTS "Allow public read published portfolio_projects" ON public.portfolio_projects;
DROP POLICY IF EXISTS "Allow authenticated read all portfolio_projects" ON public.portfolio_projects;
DROP POLICY IF EXISTS "Allow authenticated insert portfolio_projects" ON public.portfolio_projects;
DROP POLICY IF EXISTS "Allow authenticated update portfolio_projects" ON public.portfolio_projects;
DROP POLICY IF EXISTS "Allow authenticated delete portfolio_projects" ON public.portfolio_projects;

CREATE POLICY "Allow public read published portfolio_projects"
  ON public.portfolio_projects FOR SELECT TO anon
  USING (status = 'published');

CREATE POLICY "Allow authenticated read all portfolio_projects"
  ON public.portfolio_projects FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated insert portfolio_projects"
  ON public.portfolio_projects FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update portfolio_projects"
  ON public.portfolio_projects FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated delete portfolio_projects"
  ON public.portfolio_projects FOR DELETE TO authenticated
  USING (true);

-- 2. Testimonials
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_name TEXT NOT NULL,
    company TEXT,
    content TEXT NOT NULL,
    image_url TEXT,
    video_url TEXT,
    rating INTEGER DEFAULT 5,
    status TEXT NOT NULL DEFAULT 'published',
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS image_url TEXT;

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Allow admin insert testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Allow admin update testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Allow admin delete testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Allow admin all testimonials" ON public.testimonials;

CREATE POLICY "Allow public read testimonials"
  ON public.testimonials FOR SELECT
  USING (true);

CREATE POLICY "Allow admin all testimonials"
  ON public.testimonials FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- 3. Tech Stack
CREATE TABLE IF NOT EXISTS public.tech_stack (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    icon_url TEXT,
    status TEXT NOT NULL DEFAULT 'published',
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.tech_stack ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read tech_stack" ON public.tech_stack;
DROP POLICY IF EXISTS "Allow admin insert tech_stack" ON public.tech_stack;
DROP POLICY IF EXISTS "Allow admin update tech_stack" ON public.tech_stack;
DROP POLICY IF EXISTS "Allow admin delete tech_stack" ON public.tech_stack;
DROP POLICY IF EXISTS "Allow admin all tech_stack" ON public.tech_stack;

CREATE POLICY "Allow public read tech_stack"
  ON public.tech_stack FOR SELECT
  USING (true);

CREATE POLICY "Allow admin all tech_stack"
  ON public.tech_stack FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- 4. Process Steps
CREATE TABLE IF NOT EXISTS public.process_steps (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon_url TEXT,
    status TEXT NOT NULL DEFAULT 'published',
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.process_steps ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read process_steps" ON public.process_steps;
DROP POLICY IF EXISTS "Allow admin insert process_steps" ON public.process_steps;
DROP POLICY IF EXISTS "Allow admin update process_steps" ON public.process_steps;
DROP POLICY IF EXISTS "Allow admin delete process_steps" ON public.process_steps;
DROP POLICY IF EXISTS "Allow admin all process_steps" ON public.process_steps;

CREATE POLICY "Allow public read process_steps"
  ON public.process_steps FOR SELECT
  USING (true);

CREATE POLICY "Allow admin all process_steps"
  ON public.process_steps FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- 5. Leads
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert leads" ON public.leads;
DROP POLICY IF EXISTS "Allow admin read leads" ON public.leads;
DROP POLICY IF EXISTS "Allow admin update leads" ON public.leads;
DROP POLICY IF EXISTS "Allow admin delete leads" ON public.leads;

CREATE POLICY "Allow public insert leads"
  ON public.leads FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow admin read leads"
  ON public.leads FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Allow admin update leads"
  ON public.leads FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Allow admin delete leads"
  ON public.leads FOR DELETE TO authenticated
  USING (true);

-- 6. Playground Apps
CREATE TABLE IF NOT EXISTS public.playground_apps (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    embed_url TEXT,
    status TEXT NOT NULL DEFAULT 'published',
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.playground_apps ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read playground_apps" ON public.playground_apps;
DROP POLICY IF EXISTS "Allow admin insert playground_apps" ON public.playground_apps;
DROP POLICY IF EXISTS "Allow admin update playground_apps" ON public.playground_apps;
DROP POLICY IF EXISTS "Allow admin delete playground_apps" ON public.playground_apps;
DROP POLICY IF EXISTS "Allow admin all playground_apps" ON public.playground_apps;

CREATE POLICY "Allow public read playground_apps"
  ON public.playground_apps FOR SELECT
  USING (true);

CREATE POLICY "Allow admin all playground_apps"
  ON public.playground_apps FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- 7. Blog Posts
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT NOT NULL,
    cover_image_url TEXT,
    author TEXT DEFAULT 'Admin',
    status TEXT NOT NULL DEFAULT 'draft',
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read published blog_posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Allow admin read all blog_posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Allow admin insert blog_posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Allow admin update blog_posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Allow admin delete blog_posts" ON public.blog_posts;

CREATE POLICY "Allow public read published blog_posts"
  ON public.blog_posts FOR SELECT TO anon
  USING (status = 'published');

CREATE POLICY "Allow admin read all blog_posts"
  ON public.blog_posts FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Allow admin insert blog_posts"
  ON public.blog_posts FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow admin update blog_posts"
  ON public.blog_posts FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Allow admin delete blog_posts"
  ON public.blog_posts FOR DELETE TO authenticated
  USING (true);

-- 8. SEO Settings
CREATE TABLE IF NOT EXISTS public.seo_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    page_path TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    keywords TEXT,
    og_image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.seo_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read seo_settings" ON public.seo_settings;
DROP POLICY IF EXISTS "Allow admin insert seo_settings" ON public.seo_settings;
DROP POLICY IF EXISTS "Allow admin update seo_settings" ON public.seo_settings;
DROP POLICY IF EXISTS "Allow admin delete seo_settings" ON public.seo_settings;
DROP POLICY IF EXISTS "Allow admin all seo_settings" ON public.seo_settings;

CREATE POLICY "Allow public read seo_settings"
  ON public.seo_settings FOR SELECT
  USING (true);

CREATE POLICY "Allow admin all seo_settings"
  ON public.seo_settings FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

INSERT INTO public.seo_settings (page_path, title, description)
VALUES
    ('/', 'AI Voice Portfolio', 'Welcome to my AI Voice Portfolio'),
    ('/playground', 'AI Voice Playground', 'Try out interactive AI voice demos'),
    ('/blog', 'Insights & Articles', 'Read the latest thoughts on AI voice technology')
ON CONFLICT (page_path) DO NOTHING;

-- 9. Site Settings
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    setting_key TEXT NOT NULL UNIQUE,
    setting_value JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Allow public read non-secret site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Allow authenticated read all site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Allow admin insert site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Allow admin update site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Allow admin delete site_settings" ON public.site_settings;

CREATE POLICY "Allow public read non-secret site_settings"
  ON public.site_settings FOR SELECT
  USING (
    setting_key NOT IN (
      'openai_api_key',
      'anthropic_api_key',
      'gemini_api_key',
      'webhooks'
    )
  );

CREATE POLICY "Allow authenticated read all site_settings"
  ON public.site_settings FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Allow admin insert site_settings"
  ON public.site_settings FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow admin update site_settings"
  ON public.site_settings FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Allow admin delete site_settings"
  ON public.site_settings FOR DELETE TO authenticated
  USING (true);

INSERT INTO public.site_settings (setting_key, setting_value)
VALUES
    ('contact_email', '"contact@example.com"'),
    ('social_links', '{"twitter": "", "linkedin": "", "github": ""}'),
    ('footer_text', '"© 2026 AI Voice Portfolio. All rights reserved."'),
    ('admin_brand_name', '"Admin Panel"'),
    ('admin_brand_subtitle', '"Dashboard Console"'),
    ('admin_logo_url', '""')
ON CONFLICT (setting_key) DO NOTHING;

-- 10. Services
CREATE TABLE IF NOT EXISTS public.services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon_name TEXT NOT NULL,
    link TEXT,
    status TEXT NOT NULL DEFAULT 'published',
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.services ADD COLUMN IF NOT EXISTS link TEXT;

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read services" ON public.services;
DROP POLICY IF EXISTS "Allow admin all services" ON public.services;

CREATE POLICY "Allow public read services"
  ON public.services FOR SELECT
  USING (true);

CREATE POLICY "Allow admin all services"
  ON public.services FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- 11. Use Cases
CREATE TABLE IF NOT EXISTS public.use_cases (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    industry_slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    headline TEXT NOT NULL,
    subhead TEXT NOT NULL,
    problem TEXT NOT NULL,
    features JSONB NOT NULL DEFAULT '[]',
    flow JSONB NOT NULL DEFAULT '[]',
    results JSONB NOT NULL DEFAULT '[]',
    cover_image_url TEXT,
    icon_name TEXT NOT NULL DEFAULT 'Briefcase',
    status TEXT NOT NULL DEFAULT 'published',
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.use_cases ADD COLUMN IF NOT EXISTS cover_image_url TEXT;
ALTER TABLE public.use_cases ADD COLUMN IF NOT EXISTS icon_name TEXT NOT NULL DEFAULT 'Briefcase';

ALTER TABLE public.use_cases ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read use_cases" ON public.use_cases;
DROP POLICY IF EXISTS "Allow admin all use_cases" ON public.use_cases;

CREATE POLICY "Allow public read use_cases"
  ON public.use_cases FOR SELECT
  USING (true);

CREATE POLICY "Allow admin all use_cases"
  ON public.use_cases FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- 12. Storage Bucket & Policies
DO $$
BEGIN
    INSERT INTO storage.buckets (id, name, public, file_size_limit)
    VALUES ('portfolio_media', 'portfolio_media', true, 52428800)
    ON CONFLICT (id) DO UPDATE SET public = true, file_size_limit = 52428800;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Bucket setup notice: %', SQLERRM;
END $$;

DROP POLICY IF EXISTS "Allow public read portfolio_media" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated upload portfolio_media" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated update portfolio_media" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated delete portfolio_media" ON storage.objects;

CREATE POLICY "Allow public read portfolio_media"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'portfolio_media');

CREATE POLICY "Allow authenticated upload portfolio_media"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'portfolio_media');

CREATE POLICY "Allow authenticated update portfolio_media"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'portfolio_media')
  WITH CHECK (bucket_id = 'portfolio_media');

CREATE POLICY "Allow authenticated delete portfolio_media"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'portfolio_media');
