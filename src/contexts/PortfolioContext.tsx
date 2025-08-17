import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ProfileData {
  name: string;
  title: string;
  bio: string;
  photo: string;
}

interface ExperienceData {
  id: string;
  title: string;
  company: string;
  duration: string;
  description: string;
  technologies: string[];
}

interface ProjectData {
  id: string;
  title: string;
  description: string;
  image: string;
  tech: string[];
  category: string;
  github: string;
  demo: string;
}

interface EducationData {
  id: string;
  degree: string;
  institution: string;
  location: string;
  duration: string;
  grade: string;
  description: string;
  achievements: string[];
}

interface SkillCategory {
  title: string;
  skills: string[];
}

interface PortfolioData {
  profile: ProfileData;
  experiences: ExperienceData[];
  projects: ProjectData[];
  education: EducationData[];
  skills: SkillCategory[];
}

interface PortfolioContextType {
  data: PortfolioData;
  updateProfile: (profile: ProfileData) => void;
  addExperience: (experience: ExperienceData) => void;
  updateExperience: (id: string, experience: ExperienceData) => void;
  deleteExperience: (id: string) => void;
  addProject: (project: ProjectData) => void;
  updateProject: (id: string, project: ProjectData) => void;
  deleteProject: (id: string) => void;
  addEducation: (education: EducationData) => void;
  updateEducation: (id: string, education: EducationData) => void;
  deleteEducation: (id: string) => void;
  updateSkills: (skills: SkillCategory[]) => void;
}

const defaultData: PortfolioData = {
  profile: {
    name: "Aditya Gaikwad",
    title: "Full Stack Developer",
    bio: "I'm a passionate full-stack developer with over 3 years of experience building modern web applications. I specialize in creating scalable, user-friendly solutions that solve real-world problems.",
    photo: "👨‍💻"
  },
  experiences: [
    {
      id: "1",
      title: "Senior Full Stack Developer",
      company: "Tech Solutions Inc.",
      duration: "2022 - Present",
      description: "Led development of enterprise web applications using React, Node.js, and cloud technologies.",
      technologies: ["React", "Node.js", "AWS", "MongoDB"]
    },
    {
      id: "2",
      title: "Full Stack Developer",
      company: "Digital Innovations Ltd.",
      duration: "2020 - 2022",
      description: "Developed and maintained multiple client projects, focusing on performance optimization and user experience.",
      technologies: ["Vue.js", "Express.js", "PostgreSQL", "Docker"]
    }
  ],
  projects: [
    {
      id: "1",
      title: "E-Commerce Platform",
      description: "Full-stack e-commerce solution with payment integration, inventory management, and admin dashboard.",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=80",
      tech: ["React", "Node.js", "MongoDB", "Stripe"],
      category: "Full Stack",
      github: "#",
      demo: "#"
    }
  ],
  education: [
    {
      id: "1",
      degree: "Bachelor of Technology in Computer Science",
      institution: "Indian Institute of Technology",
      location: "Mumbai, India",
      duration: "2018 - 2022",
      grade: "8.5 CGPA",
      description: "Specialized in Software Engineering and Data Structures.",
      achievements: ["Dean's List for 3 consecutive semesters", "Winner of Inter-college Programming Contest"]
    }
  ],
  skills: [
    {
      title: "Languages",
      skills: ["C/C++", "Java", "Python", "JavaScript", "TypeScript"]
    },
    {
      title: "Frontend",
      skills: ["HTML", "CSS", "Next.js", "React", "Tailwind CSS", "Redux Toolkit", "Shadcn UI", "Clerk Authentication"]
    },
    {
      title: "Backend",
      skills: ["Node.js", "Express.js", "PHP", "Supabase", "JWT Tokens", "Docker", "Socket.io"]
    },
    {
      title: "Database",
      skills: ["MongoDB", "MySQL"]
    }
  ]
};

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<PortfolioData>(defaultData);

  const updateProfile = (profile: ProfileData) => {
    setData(prev => ({ ...prev, profile }));
  };

  const addExperience = (experience: ExperienceData) => {
    setData(prev => ({
      ...prev,
      experiences: [...prev.experiences, experience]
    }));
  };

  const updateExperience = (id: string, experience: ExperienceData) => {
    setData(prev => ({
      ...prev,
      experiences: prev.experiences.map(exp => exp.id === id ? experience : exp)
    }));
  };

  const deleteExperience = (id: string) => {
    setData(prev => ({
      ...prev,
      experiences: prev.experiences.filter(exp => exp.id !== id)
    }));
  };

  const addProject = (project: ProjectData) => {
    setData(prev => ({
      ...prev,
      projects: [...prev.projects, project]
    }));
  };

  const updateProject = (id: string, project: ProjectData) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.map(proj => proj.id === id ? project : proj)
    }));
  };

  const deleteProject = (id: string) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.filter(proj => proj.id !== id)
    }));
  };

  const addEducation = (education: EducationData) => {
    setData(prev => ({
      ...prev,
      education: [...prev.education, education]
    }));
  };

  const updateEducation = (id: string, education: EducationData) => {
    setData(prev => ({
      ...prev,
      education: prev.education.map(edu => edu.id === id ? education : edu)
    }));
  };

  const deleteEducation = (id: string) => {
    setData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  const updateSkills = (skills: SkillCategory[]) => {
    setData(prev => ({ ...prev, skills }));
  };

  return (
    <PortfolioContext.Provider value={{
      data,
      updateProfile,
      addExperience,
      updateExperience,
      deleteExperience,
      addProject,
      updateProject,
      deleteProject,
      addEducation,
      updateEducation,
      deleteEducation,
      updateSkills
    }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
