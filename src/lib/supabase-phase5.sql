-- PHASE 5: Database Schema for Playground, Blog, SEO, and Settings

-- 1. Playground Apps
CREATE TABLE IF NOT EXISTS public.playground_apps (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    embed_url TEXT, -- iframe URL or custom embed code
    status TEXT NOT NULL DEFAULT 'published',
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.playground_apps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read playground_apps" ON public.playground_apps FOR SELECT USING (true);
CREATE POLICY "Allow admin insert playground_apps" ON public.playground_apps FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow admin update playground_apps" ON public.playground_apps FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow admin delete playground_apps" ON public.playground_apps FOR DELETE TO authenticated USING (true);

-- 2. Blog Posts
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
CREATE POLICY "Allow public read published blog_posts" ON public.blog_posts FOR SELECT USING (status = 'published');
CREATE POLICY "Allow admin read all blog_posts" ON public.blog_posts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow admin insert blog_posts" ON public.blog_posts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow admin update blog_posts" ON public.blog_posts FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow admin delete blog_posts" ON public.blog_posts FOR DELETE TO authenticated USING (true);

-- 3. SEO Settings
CREATE TABLE IF NOT EXISTS public.seo_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    page_path TEXT NOT NULL UNIQUE, -- e.g., '/', '/about', '/portfolio'
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    keywords TEXT,
    og_image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.seo_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read seo_settings" ON public.seo_settings FOR SELECT USING (true);
CREATE POLICY "Allow admin insert seo_settings" ON public.seo_settings FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow admin update seo_settings" ON public.seo_settings FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow admin delete seo_settings" ON public.seo_settings FOR DELETE TO authenticated USING (true);

-- Seed basic SEO routes
INSERT INTO public.seo_settings (page_path, title, description)
VALUES 
    ('/', 'AI Voice Portfolio', 'Welcome to my AI Voice Portfolio'),
    ('/playground', 'AI Voice Playground', 'Try out interactive AI voice demos'),
    ('/blog', 'Insights & Articles', 'Read the latest thoughts on AI voice technology')
ON CONFLICT (page_path) DO NOTHING;

-- 4. Site Settings (Key-Value Store)
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    setting_key TEXT NOT NULL UNIQUE,
    setting_value JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read site_settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Allow admin insert site_settings" ON public.site_settings FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow admin update site_settings" ON public.site_settings FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow admin delete site_settings" ON public.site_settings FOR DELETE TO authenticated USING (true);

-- Seed basic site settings
INSERT INTO public.site_settings (setting_key, setting_value)
VALUES 
    ('contact_email', '"contact@example.com"'),
    ('social_links', '{"twitter": "https://twitter.com", "linkedin": "https://linkedin.com", "github": "https://github.com"}'),
    ('footer_text', '"© 2026 AI Voice Portfolio. All rights reserved."')
ON CONFLICT (setting_key) DO NOTHING;
