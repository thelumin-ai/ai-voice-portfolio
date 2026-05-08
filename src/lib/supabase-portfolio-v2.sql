-- 1. Create the new portfolio_projects table
CREATE TABLE IF NOT EXISTS public.portfolio_projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    industry_tag TEXT NOT NULL,
    short_description TEXT NOT NULL,
    case_study_body TEXT, -- Rich HTML content
    metrics JSONB NOT NULL DEFAULT '[]', -- Array of { label: string, value: string }
    integrations JSONB NOT NULL DEFAULT '[]', -- Array of string tags
    demo_link TEXT,
    cover_image_url TEXT,
    status TEXT NOT NULL DEFAULT 'published', -- 'published', 'draft', 'archived'
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Set up RLS (Row Level Security) policies
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;

-- Allow public read access to portfolio_projects
CREATE POLICY "Allow public read access to portfolio_projects" 
ON public.portfolio_projects FOR SELECT 
USING (true);

-- (Note: Insert/Update/Delete operations will be done server-side using the Service Role Key or handled securely via API route, so we don't need public insert policies here)

-- Note: We will keep the old `portfolios` table for now as a fallback, but the frontend will query `portfolio_projects`.
