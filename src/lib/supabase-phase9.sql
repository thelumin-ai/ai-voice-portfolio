-- Phase 9 Migration: Add api_key to portfolio_projects
-- Run this in your Supabase SQL Editor

ALTER TABLE public.portfolio_projects ADD COLUMN IF NOT EXISTS api_key TEXT;
