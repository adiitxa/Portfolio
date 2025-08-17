
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface EducationEntry {
  degree: string;
  institution: string;
  location: string;
  duration: string;
  grade: string;
  description: string;
  achievements: string[];
}

const EducationForm = () => {
  const [educationEntries, setEducationEntries] = useState<EducationEntry[]>([
    {
      degree: "",
      institution: "",
      location: "",
      duration: "",
      grade: "",
      description: "",
      achievements: [""]
    }
  ]);
  const [loading, setLoading] = useState(false);

  // Load existing education data
  useEffect(() => {
    const loadEducation = async () => {
      try {
        const { data, error } = await supabase
          .from('education')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          const formattedData = data.map(edu => ({
            degree: edu.degree,
            institution: edu.institution,
            location: edu.location || "",
            duration: edu.duration,
            grade: edu.grade || "",
            description: edu.description || "",
            achievements: edu.achievements?.length > 0 ? edu.achievements : [""]
          }));
          setEducationEntries(formattedData);
        }
      } catch (error) {
        console.error('Error loading education:', error);
      }
    };

    loadEducation();
  }, []);

  const addEducation = () => {
    setEducationEntries([...educationEntries, {
      degree: "",
      institution: "",
      location: "",
      duration: "",
      grade: "",
      description: "",
      achievements: [""]
    }]);
  };

  const removeEducation = (index: number) => {
    setEducationEntries(educationEntries.filter((_, i) => i !== index));
  };

  const updateEducation = (index: number, field: keyof EducationEntry, value: string) => {
    const updated = [...educationEntries];
    if (field === 'achievements') {
      return; // Handle achievements separately
    }
    (updated[index] as any)[field] = value;
    setEducationEntries(updated);
  };

  const addAchievement = (educationIndex: number) => {
    const updated = [...educationEntries];
    updated[educationIndex].achievements.push("");
    setEducationEntries(updated);
  };

  const removeAchievement = (educationIndex: number, achievementIndex: number) => {
    const updated = [...educationEntries];
    updated[educationIndex].achievements = updated[educationIndex].achievements.filter((_, i) => i !== achievementIndex);
    setEducationEntries(updated);
  };

  const updateAchievement = (educationIndex: number, achievementIndex: number, value: string) => {
    const updated = [...educationEntries];
    updated[educationIndex].achievements[achievementIndex] = value;
    setEducationEntries(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Clear existing education
      await supabase.from('education').delete().gte('id', '00000000-0000-0000-0000-000000000000');

      // Insert new education entries
      const educationToInsert = educationEntries
        .filter(edu => edu.degree && edu.institution)
        .map(edu => ({
          user_id: null, // Make it public
          degree: edu.degree,
          institution: edu.institution,
          location: edu.location || null,
          duration: edu.duration,
          grade: edu.grade || null,
          description: edu.description || null,
          achievements: edu.achievements.filter(achievement => achievement.trim())
        }));

      if (educationToInsert.length > 0) {
        const { error } = await supabase.from('education').insert(educationToInsert);
        if (error) throw error;
      }

      alert('Education saved successfully!');
    } catch (error) {
      console.error('Error saving education:', error);
      alert('Error saving education. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">Education Management</h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {educationEntries.map((edu, eduIndex) => (
          <motion.div
            key={eduIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-700 rounded-lg p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold">Education Entry {eduIndex + 1}</h4>
              <button
                type="button"
                onClick={() => removeEducation(eduIndex)}
                className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                disabled={educationEntries.length === 1}
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Degree"
                value={edu.degree}
                onChange={(e) => updateEducation(eduIndex, 'degree', e.target.value)}
                className="px-4 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Institution"
                value={edu.institution}
                onChange={(e) => updateEducation(eduIndex, 'institution', e.target.value)}
                className="px-4 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Location"
                value={edu.location}
                onChange={(e) => updateEducation(eduIndex, 'location', e.target.value)}
                className="px-4 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Duration (e.g., 2020-2024)"
                value={edu.duration}
                onChange={(e) => updateEducation(eduIndex, 'duration', e.target.value)}
                className="px-4 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Grade/GPA (optional)"
                value={edu.grade}
                onChange={(e) => updateEducation(eduIndex, 'grade', e.target.value)}
                className="px-4 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <textarea
              placeholder="Description"
              value={edu.description}
              onChange={(e) => updateEducation(eduIndex, 'description', e.target.value)}
              rows={3}
              className="w-full px-4 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="space-y-2">
              <h5 className="text-sm font-semibold text-slate-300">Achievements:</h5>
              {edu.achievements.map((achievement, achievementIndex) => (
                <div key={achievementIndex} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Achievement"
                    value={achievement}
                    onChange={(e) => updateAchievement(eduIndex, achievementIndex, e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeAchievement(eduIndex, achievementIndex)}
                    className="p-2 bg-red-600 hover:bg-red-700 rounded transition-colors"
                    disabled={edu.achievements.length === 1}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addAchievement(eduIndex)}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors text-sm"
              >
                <Plus size={14} />
                Add Achievement
              </button>
            </div>
          </motion.div>
        ))}

        <div className="flex gap-4">
          <button
            type="button"
            onClick={addEducation}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
          >
            <Plus size={16} />
            Add Education
          </button>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg transition-colors"
          >
            <Save size={16} />
            {loading ? 'Saving...' : 'Save Education'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EducationForm;
