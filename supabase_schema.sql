-- 1. Create profiles table (Drop first if it exists to cleanly apply new schema)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP TABLE IF EXISTS public.profiles;

CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  first_name TEXT,
  github_username TEXT,
  education_level TEXT,
  field_of_study TEXT,
  current_status TEXT,
  career_stage TEXT,
  skills TEXT[] DEFAULT '{}',
  interests TEXT[] DEFAULT '{}',
  goal TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies
-- Allow users to read their own data
CREATE POLICY "Users can view own profile" 
  ON public.profiles 
  FOR SELECT 
  TO authenticated 
  USING (auth.uid() = id);

-- Allow users to insert their own data
CREATE POLICY "Users can insert own profile" 
  ON public.profiles 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = id);

-- Allow users to update their own data
CREATE POLICY "Users can update own profile" 
  ON public.profiles 
  FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 4. Create a function that copies the auth data over safely
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$;

-- 5. Create a trigger that runs the function every time someone signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
