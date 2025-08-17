
import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ExperienceFormProps {
  experience?: any;
  onSubmit: () => void;
  onCancel: () => void;
}

const ExperienceForm = ({ experience, onSubmit, onCancel }: ExperienceFormProps) => {
  const [formData, setFormData] = useState({
    title: experience?.title || "",
    company: experience?.company || "",
    duration: experience?.duration || "",
    description: experience?.description || "",
    technologies: experience?.technologies || []
  });
  const [newTech, setNewTech] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    try {
      const data = {
        ...formData,
        user_id: null // Make it public
      };

      if (experience) {
        const { error } = await supabase
          .from('experiences')
          .update(data)
          .eq('id', experience.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('experiences')
          .insert([data]);
        if (error) throw error;
      }

      onSubmit();
    } catch (error) {
      console.error('Error saving experience:', error);
      alert('Error saving experience. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTechnology = () => {
    if (newTech.trim() && !formData.technologies.includes(newTech.trim())) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, newTech.trim()]
      });
      setNewTech("");
    }
  };

  const removeTechnology = (tech: string) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter(t => t !== tech)
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <div className="bg-slate-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">
            {experience ? 'Edit Experience' : 'Add Experience'}
          </h3>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Job Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 bg-slate-700 rounded-lg border border-slate-600 focus:border-blue-400 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Company</label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full px-3 py-2 bg-slate-700 rounded-lg border border-slate-600 focus:border-blue-400 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Duration</label>
            <input
              type="text"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              placeholder="e.g., 2020 - Present"
              className="w-full px-3 py-2 bg-slate-700 rounded-lg border border-slate-600 focus:border-blue-400 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 bg-slate-700 rounded-lg border border-slate-600 focus:border-blue-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Technologies</label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newTech}
                onChange={(e) => setNewTech(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                placeholder="Add technology"
                className="flex-1 px-3 py-2 bg-slate-700 rounded-lg border border-slate-600 focus:border-blue-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={addTechnology}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm flex items-center gap-2"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => removeTechnology(tech)}
                    className="hover:text-red-400 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg transition-colors"
            >
              {isSubmitting ? 'Saving...' : (experience ? 'Update' : 'Create')}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-slate-600 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default ExperienceForm;
