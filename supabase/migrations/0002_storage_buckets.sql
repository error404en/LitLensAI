-- Enable Storage
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('papers', 'papers', false),
  ('avatars', 'avatars', true),
  ('exports', 'exports', false),
  ('temp', 'temp', false)
ON CONFLICT (id) DO NOTHING;

-- RLS for papers bucket
CREATE POLICY "Users can upload papers"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'papers' AND (auth.jwt()->>'sub') IS NOT NULL);

CREATE POLICY "Users can view their own papers"
ON storage.objects FOR SELECT
USING (bucket_id = 'papers' AND (auth.jwt()->>'sub') IS NOT NULL);

-- RLS for avatars bucket
CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatars"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'avatars' AND (auth.jwt()->>'sub') IS NOT NULL);

-- RLS for exports bucket
CREATE POLICY "Users can access their own exports"
ON storage.objects FOR ALL
USING (bucket_id = 'exports' AND (auth.jwt()->>'sub') IS NOT NULL);

-- RLS for temp bucket
CREATE POLICY "Users can use temp storage"
ON storage.objects FOR ALL
USING (bucket_id = 'temp' AND (auth.jwt()->>'sub') IS NOT NULL);
