
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const SkillsForm = () => {
  const [categories, setCategories] = useState([
    { category: "", skills: [""] }
  ]);
  const [loading, setLoading] = useState(false);

  // Load existing skills data
  useEffect(() => {
    const loadSkills = async () => {
      try {
        const { data, error } = await supabase
          .from('skills')
          .select('*')
          .order('category');
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          const formattedData = data.map(skill => ({
            category: skill.category,
            skills: skill.skills_list || [""]
          }));
          setCategories(formattedData);
        }
      } catch (error) {
        console.error('Error loading skills:', error);
      }
    };

    loadSkills();
  }, []);

  const addCategory = () => {
    setCategories([...categories, { category: "", skills: [""] }]);
  };

  const removeCategory = (index: number) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  const updateCategory = (index: number, category: string) => {
    const updated = [...categories];
    updated[index].category = category;
    setCategories(updated);
  };

  const addSkill = (categoryIndex: number) => {
    const updated = [...categories];
    updated[categoryIndex].skills.push("");
    setCategories(updated);
  };

  const removeSkill = (categoryIndex: number, skillIndex: number) => {
    const updated = [...categories];
    updated[categoryIndex].skills = updated[categoryIndex].skills.filter((_, i) => i !== skillIndex);
    setCategories(updated);
  };

  const updateSkill = (categoryIndex: number, skillIndex: number, skill: string) => {
    const updated = [...categories];
    updated[categoryIndex].skills[skillIndex] = skill;
    setCategories(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Clear existing skills
      await supabase.from('skills').delete().gte('id', '00000000-0000-0000-0000-000000000000');

      // Insert new skills
      const skillsToInsert = categories
        .filter(cat => cat.category && cat.skills.some(skill => skill.trim()))
        .map(cat => ({
          user_id: null, // Make it public
          category: cat.category,
          skills_list: cat.skills.filter(skill => skill.trim())
        }));

      if (skillsToInsert.length > 0) {
        const { error } = await supabase.from('skills').insert(skillsToInsert);
        if (error) throw error;
      }

      alert('Skills saved successfully!');
    } catch (error) {
      console.error('Error saving skills:', error);
      alert('Error saving skills. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">Skills Management</h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {categories.map((category, categoryIndex) => (
          <motion.div
            key={categoryIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-700 rounded-lg p-6 space-y-4"
          >
            <div className="flex items-center gap-4">
              <input
                type="text"
                placeholder="Category name (e.g., Frontend)"
                value={category.category}
                onChange={(e) => updateCategory(categoryIndex, e.target.value)}
                className="flex-1 px-4 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => removeCategory(categoryIndex)}
                className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                disabled={categories.length === 1}
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-slate-300">Skills:</h4>
              {category.skills.map((skill, skillIndex) => (
                <div key={skillIndex} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Skill name"
                    value={skill}
                    onChange={(e) => updateSkill(categoryIndex, skillIndex, e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeSkill(categoryIndex, skillIndex)}
                    className="p-2 bg-red-600 hover:bg-red-700 rounded transition-colors"
                    disabled={category.skills.length === 1}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addSkill(categoryIndex)}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors text-sm"
              >
                <Plus size={14} />
                Add Skill
              </button>
            </div>
          </motion.div>
        ))}

        <div className="flex gap-4">
          <button
            type="button"
            onClick={addCategory}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
          >
            <Plus size={16} />
            Add Category
          </button>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg transition-colors"
          >
            <Save size={16} />
            {loading ? 'Saving...' : 'Save Skills'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SkillsForm;
