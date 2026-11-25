-- ============================================================================
-- Security & Data Integrity Hardening Migration (Run in Supabase SQL Editor)
-- ============================================================================

-- 1. Add missing write RLS policies for portfolio_projects so authenticated
--    admins can create, update, delete, and reorder portfolio items cleanly.
DROP POLICY IF EXISTS "Allow authenticated insert portfolio_projects" ON public.portfolio_projects;
DROP POLICY IF EXISTS "Allow authenticated update portfolio_projects" ON public.portfolio_projects;
DROP POLICY IF EXISTS "Allow authenticated delete portfolio_projects" ON public.portfolio_projects;

CREATE POLICY "Allow authenticated insert portfolio_projects"
  ON public.portfolio_projects FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated update portfolio_projects"
  ON public.portfolio_projects FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated delete portfolio_projects"
  ON public.portfolio_projects FOR DELETE TO authenticated USING (true);

-- 2. Restrict public read on site_settings so private API keys and webhook URLs
--    are NEVER readable by the anon key via PostgREST.
DROP POLICY IF EXISTS "Allow public read site_settings" ON public.site_settings;

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

-- 3. Restrict public read on portfolio_projects to published items only.
DROP POLICY IF EXISTS "Allow public read access to portfolio_projects" ON public.portfolio_projects;

CREATE POLICY "Allow public read published portfolio_projects"
  ON public.portfolio_projects FOR SELECT TO anon
  USING (status = 'published');

CREATE POLICY "Allow authenticated read all portfolio_projects"
  ON public.portfolio_projects FOR SELECT TO authenticated
  USING (true);

-- 4. Lock down portfolio_media storage bucket so public visitors can read assets
--    while only authenticated admins can upload, update, or delete files.
--    Keep bucket max size at 52428800 bytes (50 MB) for demo audio/video/JSON alongside 5 MB images.
UPDATE storage.buckets
SET file_size_limit = 52428800
WHERE id = 'portfolio_media';

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

-- 5. Drop deprecated multi-tenant tables if no longer needed (uncomment manually):
-- DROP TABLE IF EXISTS public.saas_leads;
-- DROP TABLE IF EXISTS public.saas_tenants;
