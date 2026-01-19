-- Add verification fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_verified_student BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS college_id_url TEXT;

-- Create storage bucket for student IDs if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('student-ids', 'student-ids', false)
ON CONFLICT (id) DO NOTHING;

-- Policy to allow authenticated users to upload their own ID
CREATE POLICY "Users can upload their own student ID"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'student-ids' AND auth.uid() = owner);

-- Policy to allow admins to view student IDs (Assuming admin role exists or using service_role)
-- For now, allow owner to view
CREATE POLICY "Users can view their own student ID"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'student-ids' AND auth.uid() = owner);
