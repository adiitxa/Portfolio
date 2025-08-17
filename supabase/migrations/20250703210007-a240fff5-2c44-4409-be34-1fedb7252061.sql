
-- First, let's check if there are any restrictive RLS policies preventing message retrieval
-- and update them to allow proper access for admin functionality

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Anyone can insert contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Authenticated users can view contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Authenticated users can update contact messages" ON public.contact_messages;

-- Create new policies that allow proper access
-- Allow anyone to insert contact messages (for the contact form)
CREATE POLICY "Enable insert for anyone" ON public.contact_messages
  FOR INSERT WITH CHECK (true);

-- Allow anyone to read contact messages (for admin panel)
CREATE POLICY "Enable read for everyone" ON public.contact_messages
  FOR SELECT USING (true);

-- Allow anyone to update contact messages (for marking as read)
CREATE POLICY "Enable update for everyone" ON public.contact_messages
  FOR UPDATE USING (true);

-- Allow anyone to delete contact messages (for admin cleanup)
CREATE POLICY "Enable delete for everyone" ON public.contact_messages
  FOR DELETE USING (true);
