
-- Create RLS policies for the resumes storage bucket to allow file operations
-- First, create policies for the storage.objects table to handle resume files

-- Policy to allow anyone to insert files into the resumes bucket
CREATE POLICY "Anyone can upload resumes" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'resumes');

-- Policy to allow anyone to view files in the resumes bucket
CREATE POLICY "Anyone can view resumes" ON storage.objects
  FOR SELECT USING (bucket_id = 'resumes');

-- Policy to allow anyone to update files in the resumes bucket
CREATE POLICY "Anyone can update resumes" ON storage.objects
  FOR UPDATE USING (bucket_id = 'resumes');

-- Policy to allow anyone to delete files from the resumes bucket
CREATE POLICY "Anyone can delete resumes" ON storage.objects
  FOR DELETE USING (bucket_id = 'resumes');
