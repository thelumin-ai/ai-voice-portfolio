-- Phase 7c Migration: Portfolio Media Handling
-- Run this in your Supabase SQL Editor

-- Add project_type and media_url columns
ALTER TABLE public.portfolio_projects ADD COLUMN IF NOT EXISTS project_type TEXT NOT NULL DEFAULT 'webrtc'; -- 'webrtc', 'audio', 'video'
ALTER TABLE public.portfolio_projects ADD COLUMN IF NOT EXISTS media_url TEXT; -- Vapi ID, Audio URL, or YouTube/Video URL

-- Update existing rows (if any) to have a type
UPDATE public.portfolio_projects SET project_type = 'webrtc' WHERE project_type IS NULL;
