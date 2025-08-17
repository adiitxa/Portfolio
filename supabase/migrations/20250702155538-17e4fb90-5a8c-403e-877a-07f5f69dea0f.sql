
-- Update RLS policies for all tables to allow public access for admin operations

-- Skills table
DROP POLICY IF EXISTS "Users can insert their own skills" ON public.skills;
DROP POLICY IF EXISTS "Users can update their own skills" ON public.skills;
DROP POLICY IF EXISTS "Users can delete their own skills" ON public.skills;

CREATE POLICY "Anyone can insert skills" ON public.skills FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update skills" ON public.skills FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete skills" ON public.skills FOR DELETE USING (true);

-- Education table
DROP POLICY IF EXISTS "Users can insert their own education" ON public.education;
DROP POLICY IF EXISTS "Users can update their own education" ON public.education;
DROP POLICY IF EXISTS "Users can delete their own education" ON public.education;

CREATE POLICY "Anyone can insert education" ON public.education FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update education" ON public.education FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete education" ON public.education FOR DELETE USING (true);

-- Certificates table
DROP POLICY IF EXISTS "Users can insert their own certificates" ON public.certificates;
DROP POLICY IF EXISTS "Users can update their own certificates" ON public.certificates;
DROP POLICY IF EXISTS "Users can delete their own certificates" ON public.certificates;

CREATE POLICY "Anyone can insert certificates" ON public.certificates FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update certificates" ON public.certificates FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete certificates" ON public.certificates FOR DELETE USING (true);

-- Experiences table
DROP POLICY IF EXISTS "Users can insert their own experiences" ON public.experiences;
DROP POLICY IF EXISTS "Users can update their own experiences" ON public.experiences;
DROP POLICY IF EXISTS "Users can delete their own experiences" ON public.experiences;

CREATE POLICY "Anyone can insert experiences" ON public.experiences FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update experiences" ON public.experiences FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete experiences" ON public.experiences FOR DELETE USING (true);

-- Projects table
DROP POLICY IF EXISTS "Users can insert their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can update their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can delete their own projects" ON public.projects;

CREATE POLICY "Anyone can insert projects" ON public.projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update projects" ON public.projects FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete projects" ON public.projects FOR DELETE USING (true);

-- Profiles table
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Anyone can insert profiles" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update profiles" ON public.profiles FOR UPDATE USING (true);
