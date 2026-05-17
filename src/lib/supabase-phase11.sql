-- Phase 11 Migration: Add voice_platform to portfolio_projects
-- Run this in your Supabase SQL Editor

ALTER TABLE public.portfolio_projects ADD COLUMN IF NOT EXISTS voice_platform TEXT DEFAULT 'vapi';
