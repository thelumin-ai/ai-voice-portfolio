-- SQL script to add layout configuration columns to saas_tenants table

ALTER TABLE public.saas_tenants 
ADD COLUMN IF NOT EXISTS template_id TEXT NOT NULL DEFAULT 'agency_automation_cyber',
ADD COLUMN IF NOT EXISTS layout_structure TEXT[] NOT NULL DEFAULT '{"hero", "services", "about", "consultation", "footer"}',
ADD COLUMN IF NOT EXISTS visible_sections TEXT[] NOT NULL DEFAULT '{"hero", "services", "about", "consultation"}';
