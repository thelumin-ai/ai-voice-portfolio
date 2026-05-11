-- 1. Create the bucket if it doesn't exist
-- We use a DO block to ensure we don't error if the bucket exists or if we lack certain permissions
DO $$
BEGIN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('portfolio_media', 'portfolio_media', true)
    ON CONFLICT (id) DO UPDATE SET public = true;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Bucket setup error (likely already exists): %', SQLERRM;
END $$;

-- 2. Cleanup existing policies to avoid "policy already exists" errors
-- We name them specifically for the portfolio bucket to avoid clashing with other buckets
DROP POLICY IF EXISTS "Portfolio Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Portfolio Authenticated Upload" ON storage.objects;
DROP POLICY IF EXISTS "Portfolio Authenticated Update" ON storage.objects;
DROP POLICY IF EXISTS "Portfolio Authenticated Delete" ON storage.objects;

-- 3. Enable public access to files in the portfolio_media bucket
CREATE POLICY "Portfolio Public Access" ON storage.objects
  FOR SELECT USING (bucket_id = 'portfolio_media');

-- 4. Allow authenticated users to upload files (Admin Panel)
CREATE POLICY "Portfolio Authenticated Upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'portfolio_media' AND auth.role() = 'authenticated');

-- 5. Allow authenticated users to update/delete their files
CREATE POLICY "Portfolio Authenticated Update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'portfolio_media' AND auth.role() = 'authenticated');

CREATE POLICY "Portfolio Authenticated Delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'portfolio_media' AND auth.role() = 'authenticated');
