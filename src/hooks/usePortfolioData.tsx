
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  name: string;
  title: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  github_url: string;
  linkedin_url: string;
  twitter_url: string;
  instagram_url: string;
  resume_url: string;
}

interface Experience {
  id: string;
  title: string;
  company: string;
  duration: string;
  description: string;
  technologies: string[];
}

interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string;
  tech_stack: string[];
  category: string;
  github_url: string;
  demo_url: string;
}

interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  duration: string;
  grade: string;
  description: string;
  achievements: string[];
}

interface Skill {
  id: string;
  category: string;
  skills_list: string[];
}

interface Certificate {
  id: string;
  name: string;
  issuer: string;
  date_issued: string;
  certificate_url: string;
  description: string;
}

export const usePortfolioData = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      console.log('Fetching portfolio data...');
      
      const [
        { data: profileData, error: profileError },
        { data: experiencesData, error: experiencesError },
        { data: projectsData, error: projectsError },
        { data: educationData, error: educationError },
        { data: skillsData, error: skillsError },
        { data: certificatesData, error: certificatesError }
      ] = await Promise.all([
        supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(1).maybeSingle(),
        supabase.from('experiences').select('*').order('created_at', { ascending: false }),
        supabase.from('projects').select('*').order('created_at', { ascending: false }),
        supabase.from('education').select('*').order('created_at', { ascending: false }),
        supabase.from('skills').select('*').order('category'),
        supabase.from('certificates').select('*').order('date_issued', { ascending: false })
      ]);

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Profile error:', profileError);
      }
      if (experiencesError) console.error('Experiences error:', experiencesError);
      if (projectsError) console.error('Projects error:', projectsError);
      if (educationError) console.error('Education error:', educationError);
      if (skillsError) console.error('Skills error:', skillsError);
      if (certificatesError) console.error('Certificates error:', certificatesError);

      setProfile(profileData);
      setExperiences(experiencesData || []);
      setProjects(projectsData || []);
      setEducation(educationData || []);
      setSkills(skillsData || []);
      setCertificates(certificatesData || []);
      
      console.log('Data fetched successfully:', {
        profile: profileData,
        experiences: experiencesData?.length || 0,
        projects: projectsData?.length || 0,
        education: educationData?.length || 0,
        skills: skillsData?.length || 0,
        certificates: certificatesData?.length || 0
      });
    } catch (error) {
      console.error('Error fetching portfolio data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Set up real-time subscriptions
    const profileChannel = supabase
      .channel('profiles_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'profiles' }, 
        (payload) => {
          console.log('Profiles changed:', payload);
          fetchData();
        }
      )
      .subscribe();

    const experiencesChannel = supabase
      .channel('experiences_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'experiences' }, 
        (payload) => {
          console.log('Experiences changed:', payload);
          fetchData();
        }
      )
      .subscribe();

    const projectsChannel = supabase
      .channel('projects_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'projects' }, 
        (payload) => {
          console.log('Projects changed:', payload);
          fetchData();
        }
      )
      .subscribe();

    const educationChannel = supabase
      .channel('education_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'education' }, 
        (payload) => {
          console.log('Education changed:', payload);
          fetchData();
        }
      )
      .subscribe();

    const skillsChannel = supabase
      .channel('skills_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'skills' }, 
        (payload) => {
          console.log('Skills changed:', payload);
          fetchData();
        }
      )
      .subscribe();

    const certificatesChannel = supabase
      .channel('certificates_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'certificates' }, 
        (payload) => {
          console.log('Certificates changed:', payload);
          fetchData();
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up subscriptions');
      supabase.removeChannel(profileChannel);
      supabase.removeChannel(experiencesChannel);
      supabase.removeChannel(projectsChannel);
      supabase.removeChannel(educationChannel);
      supabase.removeChannel(skillsChannel);
      supabase.removeChannel(certificatesChannel);
    };
  }, []);

  return {
    profile,
    experiences,
    projects,
    education,
    skills,
    certificates,
    loading,
    refetch: fetchData
  };
};
