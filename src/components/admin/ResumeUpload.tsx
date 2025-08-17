
import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, Download, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { usePortfolioData } from "@/hooks/usePortfolioData";

const ResumeUpload = () => {
  const { profile, refetch } = usePortfolioData();
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file only.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('File size must be less than 5MB.');
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `resume-${Date.now()}.${fileExt}`;

      console.log('Starting file upload:', fileName);

      // Upload file to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      console.log('File uploaded successfully:', uploadData);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('resumes')
        .getPublicUrl(fileName);

      console.log('Generated public URL:', publicUrl);

      // Update profile with resume URL and filename
      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
          name: profile?.name || 'Admin',
          title: profile?.title || 'Administrator',
          bio: profile?.bio || '',
          email: profile?.email || '',
          phone: profile?.phone || '',
          location: profile?.location || '',
          github_url: profile?.github_url || '',
          linkedin_url: profile?.linkedin_url || '',
          twitter_url: profile?.twitter_url || '',
          instagram_url: profile?.instagram_url || '',
          user_id: null, // Make it public
          resume_url: fileName // Store the filename instead of full URL
        });

      if (updateError) {
        console.error('Profile update error:', updateError);
        throw updateError;
      }

      console.log('Profile updated successfully');
      alert('Resume uploaded successfully!');
      refetch();
    } catch (error: any) {
      console.error('Error uploading resume:', error);
      alert(`Error uploading resume: ${error.message || 'Please try again.'}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async () => {
    if (!profile?.resume_url) return;

    try {
      // Download the file using the filename
      const { data, error } = await supabase.storage
        .from('resumes')
        .download(profile.resume_url);

      if (error) throw error;

      // Create a blob URL and trigger download
      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading resume:', error);
      alert('Error downloading resume.');
    }
  };

  const handleDelete = async () => {
    if (!profile?.resume_url || !confirm('Are you sure you want to delete the resume?')) return;

    try {
      console.log('Deleting file:', profile.resume_url);
      
      // Delete file from storage using the filename
      const { error: deleteError } = await supabase.storage
        .from('resumes')
        .remove([profile.resume_url]);

      if (deleteError) {
        console.warn('Error deleting file from storage:', deleteError);
      } else {
        console.log('File deleted from storage successfully');
      }

      // Update profile to remove resume URL
      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
          name: profile?.name || 'Admin',
          title: profile?.title || 'Administrator',
          bio: profile?.bio || '',
          email: profile?.email || '',
          phone: profile?.phone || '',
          location: profile?.location || '',
          github_url: profile?.github_url || '',
          linkedin_url: profile?.linkedin_url || '',
          twitter_url: profile?.twitter_url || '',
          instagram_url: profile?.instagram_url || '',
          user_id: null, // Make it public
          resume_url: null
        });

      if (updateError) throw updateError;

      alert('Resume deleted successfully!');
      refetch();
    } catch (error: any) {
      console.error('Error deleting resume:', error);
      alert('Error deleting resume. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">Resume Management</h3>

      {profile?.resume_url ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-700 rounded-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <FileText className="text-blue-400" size={24} />
              </div>
              <div>
                <h4 className="font-semibold">Current Resume</h4>
                <p className="text-slate-300 text-sm">PDF Document</p>
              </div>
            </div>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <Download size={16} />
                Download
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                <Trash2 size={16} />
                Delete
              </motion.button>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center"
        >
          <Upload className="mx-auto mb-4 text-slate-400" size={48} />
          <h4 className="text-lg font-semibold mb-2">Upload Resume</h4>
          <p className="text-slate-300 mb-4">Upload your resume in PDF format (max 5MB)</p>
          
          <label className="inline-block">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
            <motion.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg transition-colors"
            >
              <Upload size={20} />
              {uploading ? 'Uploading...' : 'Choose File'}
            </motion.span>
          </label>

          {uploading && (
            <div className="mt-4">
              <div className="w-full bg-slate-600 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300 animate-pulse"
                  style={{ width: '70%' }}
                ></div>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default ResumeUpload;
