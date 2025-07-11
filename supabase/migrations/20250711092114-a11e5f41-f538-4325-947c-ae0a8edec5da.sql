
-- First, let's ensure we have proper tables for lectures with all required fields
-- Update the lectures table to include all necessary fields
ALTER TABLE public.lectures 
ADD COLUMN IF NOT EXISTS topic text,
ADD COLUMN IF NOT EXISTS course_id text;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_lectures_batch_id ON public.lectures(batch_id);
CREATE INDEX IF NOT EXISTS idx_lectures_subject ON public.lectures(subject);
CREATE INDEX IF NOT EXISTS idx_lectures_created_at ON public.lectures(created_at);

-- Update the batches table to ensure it has course_id if missing
ALTER TABLE public.batches 
ADD COLUMN IF NOT EXISTS course_id text DEFAULT 'pw-courses';

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
DROP TRIGGER IF EXISTS update_lectures_updated_at ON public.lectures;
CREATE TRIGGER update_lectures_updated_at
    BEFORE UPDATE ON public.lectures
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_batches_updated_at ON public.batches;
CREATE TRIGGER update_batches_updated_at
    BEFORE UPDATE ON public.batches
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Ensure RLS policies allow proper access
DROP POLICY IF EXISTS "Allow admin full access to lectures" ON public.lectures;
CREATE POLICY "Allow admin full access to lectures" 
ON public.lectures FOR ALL 
USING (true);

DROP POLICY IF EXISTS "Allow public read access to lectures" ON public.lectures;
CREATE POLICY "Allow public read access to lectures" 
ON public.lectures FOR SELECT 
USING (true);

-- Similar policies for batches
DROP POLICY IF EXISTS "Allow admin full access to batches" ON public.batches;
CREATE POLICY "Allow admin full access to batches" 
ON public.batches FOR ALL 
USING (true);

DROP POLICY IF EXISTS "Allow public read access to batches" ON public.batches;
CREATE POLICY "Allow public read access to batches" 
ON public.batches FOR SELECT 
USING (true);
