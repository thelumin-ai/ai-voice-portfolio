-- Run this in your Supabase SQL Editor to ensure the portfolio_media bucket is correctly configured
-- This makes the bucket public and allows anyone to read files from it.

-- 1. Create the bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio_media', 'portfolio_media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Enable public access to files in the bucket
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT USING (bucket_id = 'portfolio_media');

-- 3. Allow authenticated users to upload files (Admin Panel)
CREATE POLICY "Authenticated Upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'portfolio_media' AND auth.role() = 'authenticated');

-- 4. Allow authenticated users to update/delete their files
CREATE POLICY "Authenticated Update" ON storage.objects
  FOR UPDATE WITH CHECK (bucket_id = 'portfolio_media' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated Delete" ON storage.objects
  FOR DELETE WITH CHECK (bucket_id = 'portfolio_media' AND auth.role() = 'authenticated');
