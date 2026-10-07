CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL DEFAULT 'Đầu bếp',
  avatar_url text,
  bio text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.profiles TO anon;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles are public" ON public.profiles FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1), 'Đầu bếp'),
    NEW.raw_user_meta_data->>'avatar_url')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TABLE public.user_recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  intro text NOT NULL DEFAULT '',
  time text NOT NULL DEFAULT '',
  servings text NOT NULL DEFAULT '',
  ingredients jsonb NOT NULL DEFAULT '[]'::jsonb,
  steps jsonb NOT NULL DEFAULT '[]'::jsonb,
  tips text,
  image_path text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.user_recipes TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_recipes TO authenticated;
GRANT ALL ON public.user_recipes TO service_role;
ALTER TABLE public.user_recipes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Recipes are public" ON public.user_recipes FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Authors insert" ON public.user_recipes FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors update" ON public.user_recipes FOR UPDATE TO authenticated USING (auth.uid() = author_id);
CREATE POLICY "Authors delete" ON public.user_recipes FOR DELETE TO authenticated USING (auth.uid() = author_id);

CREATE POLICY "Recipe images readable" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'recipe-images');
CREATE POLICY "Users upload own recipe images" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'recipe-images' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users delete own recipe images" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'recipe-images' AND (storage.foldername(name))[1] = auth.uid()::text);