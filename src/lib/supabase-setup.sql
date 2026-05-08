-- Run this SQL in your Supabase SQL Editor to set up the portfolios table and storage bucket

-- 1. Create the portfolios table
CREATE TABLE IF NOT EXISTS public.portfolios (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    metrics JSONB NOT NULL DEFAULT '[]', -- Array of strings
    type TEXT NOT NULL, -- 'voice', 'image', 'video', 'pdf'
    media_url TEXT, -- URL to the uploaded file (or playground link for voice)
    color TEXT NOT NULL, -- e.g., 'from-blue-500/20 to-indigo-500/20'
    border_color TEXT NOT NULL, -- e.g., 'border-blue-500/30'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create the storage bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('portfolio_media', 'portfolio_media', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Set up RLS (Row Level Security) policies
-- Allow public read access to portfolios
CREATE POLICY "Allow public read access to portfolios" 
ON public.portfolios FOR SELECT 
USING (true);

-- Allow public read access to storage bucket
CREATE POLICY "Allow public read access to portfolio_media bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio_media');

-- (Note: Insert/Update/Delete operations will be done server-side using the Service Role Key or handled securely via API route, so we don't need public insert policies here)
