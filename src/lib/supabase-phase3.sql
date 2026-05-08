-- PHASE 3: Storage RLS & Database Extensions

-- 1. Storage RLS Policies for portfolio_media
-- Note: 'storage.objects' policies govern who can upload/modify files in the bucket.
CREATE POLICY "Allow authenticated insert to portfolio_media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'portfolio_media');

CREATE POLICY "Allow authenticated update to portfolio_media"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'portfolio_media');

CREATE POLICY "Allow authenticated delete from portfolio_media"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'portfolio_media');

-- 2. Add media_files to portfolio_projects
ALTER TABLE public.portfolio_projects 
ADD COLUMN IF NOT EXISTS media_files JSONB NOT NULL DEFAULT '[]';

-- 3. Create placeholder tables for the other modules (Basic Scaffolding)
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_name TEXT NOT NULL,
    company TEXT,
    content TEXT NOT NULL,
    video_url TEXT,
    rating INTEGER DEFAULT 5,
    status TEXT NOT NULL DEFAULT 'published',
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read testimonials" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Allow admin insert testimonials" ON public.testimonials FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow admin update testimonials" ON public.testimonials FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow admin delete testimonials" ON public.testimonials FOR DELETE TO authenticated USING (true);

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
CREATE POLICY "Allow public read tech_stack" ON public.tech_stack FOR SELECT USING (true);
CREATE POLICY "Allow admin insert tech_stack" ON public.tech_stack FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow admin update tech_stack" ON public.tech_stack FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow admin delete tech_stack" ON public.tech_stack FOR DELETE TO authenticated USING (true);

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
CREATE POLICY "Allow public read process_steps" ON public.process_steps FOR SELECT USING (true);
CREATE POLICY "Allow admin insert process_steps" ON public.process_steps FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow admin update process_steps" ON public.process_steps FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow admin delete process_steps" ON public.process_steps FOR DELETE TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS public.leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'new', -- new, contacted, closed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
-- Public can INSERT (submit form), but only admin can SELECT/UPDATE/DELETE
CREATE POLICY "Allow public insert leads" ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin read leads" ON public.leads FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow admin update leads" ON public.leads FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow admin delete leads" ON public.leads FOR DELETE TO authenticated USING (true);
