-- Create live_lectures table to store live lecture data
CREATE TABLE public.live_lectures (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  batch_id UUID REFERENCES public.batches(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  meeting_url TEXT NOT NULL,
  live_date DATE NOT NULL,
  live_time TIME NOT NULL,
  subject TEXT,
  topic TEXT,
  platform TEXT DEFAULT 'YouTube Live',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.live_lectures ENABLE ROW LEVEL SECURITY;

-- Create policies for live lectures access
CREATE POLICY "Allow public read access to live lectures" 
ON public.live_lectures 
FOR SELECT 
USING (true);

CREATE POLICY "Allow admin full access to live lectures" 
ON public.live_lectures 
FOR ALL 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_live_lectures_updated_at
BEFORE UPDATE ON public.live_lectures
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();