-- Phase 8 Migration: Add image_url to testimonials
-- Run this in your Supabase SQL Editor

ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS image_url TEXT;
