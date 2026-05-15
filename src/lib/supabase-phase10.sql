-- Phase 10 Migration: Add is_featured to portfolio_projects
-- Run this in your Supabase SQL Editor

ALTER TABLE public.portfolio_projects ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
