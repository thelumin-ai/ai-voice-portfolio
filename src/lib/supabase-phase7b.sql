-- Phase 7b Migration: Add cover_image_url and icon_name to use_cases table
-- Run this in your Supabase SQL Editor

ALTER TABLE public.use_cases ADD COLUMN IF NOT EXISTS cover_image_url TEXT;
ALTER TABLE public.use_cases ADD COLUMN IF NOT EXISTS icon_name TEXT NOT NULL DEFAULT 'Briefcase';

-- Update existing rows with industry-relevant images and icons
UPDATE public.use_cases SET 
    cover_image_url = 'https://images.unsplash.com/photo-1560184897-ae75f418493e?q=80&w=1000&auto=format&fit=crop',
    icon_name = 'Home'
WHERE industry_slug = 'real-estate';

UPDATE public.use_cases SET 
    cover_image_url = 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=1000&auto=format&fit=crop',
    icon_name = 'Sun'
WHERE industry_slug = 'solar';

UPDATE public.use_cases SET 
    cover_image_url = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1000&auto=format&fit=crop',
    icon_name = 'Hammer'
WHERE industry_slug = 'home-services';

UPDATE public.use_cases SET 
    cover_image_url = 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1000&auto=format&fit=crop',
    icon_name = 'Briefcase'
WHERE industry_slug = 'consulting';

UPDATE public.use_cases SET 
    cover_image_url = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop',
    icon_name = 'BarChart'
WHERE industry_slug = 'finance';

UPDATE public.use_cases SET 
    cover_image_url = 'https://images.unsplash.com/photo-1596524430615-b46475ddff6e?q=80&w=1000&auto=format&fit=crop',
    icon_name = 'Headphones'
WHERE industry_slug = 'customer-support';
