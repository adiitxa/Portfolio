
import { useState } from "react";
import { motion } from "framer-motion";
import { X, Plus, Edit, Trash2, User, GraduationCap, Mail, FileText, Star, Atom, Power, Zap} from "lucide-react";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import ContactMessages from "./ContactMessages";
import ExperienceForm from "./forms/ExperienceForm";
import ProjectForm from "./forms/ProjectForm";
import SkillsForm from "./forms/SkillsForm";
import EducationForm from "./forms/EducationForm";
import CertificatesForm from "./forms/CertificatesForm";
import ResumeUpload from "./ResumeUpload";
import AdminPasswordForm from "./AdminPasswordForm";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
  const navigate = useNavigate();
  const { experiences, projects, education, skills, certificates, profile, refetch } = usePortfolioData();
  const [activeTab, setActiveTab] = useState("profile");
  const [showForm, setShowForm] = useState<{ type: string; item?: any } | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <AdminPasswordForm onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "experience", label: "Experience", icon: Power},
    { id: "projects", label: "Projects", icon : Atom},
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "skills", label: "Skills", icon : Star},
    { id: "certificates", label: "Certificates" , icon: Zap},
    { id: "messages", label: "Messages", icon: Mail },
    { id: "resume", label: "Resume", icon: FileText },
  ];

  const handleDelete = async (tableName: 'experiences' | 'projects' | 'education' | 'skills' | 'certificates', id: string) => {
    if (!confirm(`Are you sure you want to delete this item?`)) return;

    try {
      const { error } = await supabase.from(tableName).delete().eq('id', id);
      if (error) throw error;
      refetch();
    } catch (error) {
      console.error(`Error deleting item:`, error);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileManager profile={profile} refetch={refetch} />;
      case "experience":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">Experience Management</h3>
              <button
                onClick={() => setShowForm({ type: "experience" })}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <Plus size={20} />
                Add Experience
              </button>
            </div>
            {experiences.map((exp) => (
              <div key={exp.id} className="bg-slate-700 p-4 rounded-lg flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">{exp.title}</h4>
                  <p className="text-slate-300">{exp.company} • {exp.duration}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowForm({ type: "experience", item: exp })}
                    className="p-2 text-blue-400 hover:bg-slate-600 rounded"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete("experiences", exp.id)}
                    className="p-2 text-red-400 hover:bg-slate-600 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        );
      case "projects":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">Projects Management</h3>
              <button
                onClick={() => setShowForm({ type: "project" })}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <Plus size={20} />
                Add Project
              </button>
            </div>
            {projects.map((project) => (
              <div key={project.id} className="bg-slate-700 p-4 rounded-lg flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">{project.title}</h4>
                  <p className="text-slate-300">{project.category}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowForm({ type: "project", item: project })}
                    className="p-2 text-blue-400 hover:bg-slate-600 rounded"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete("projects", project.id)}
                    className="p-2 text-red-400 hover:bg-slate-600 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        );
      case "education":
        return <EducationForm />;
      case "skills":
        return <SkillsForm />;
      case "certificates":
        return <CertificatesForm />;
      case "messages":
        return <ContactMessages />;
      case "resume":
        return <ResumeUpload />;
      default:
        return <div className="text-center py-8 text-slate-400">Content coming soon...</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-slate-800 border-b border-slate-700 p-6"
      >
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">🤖</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
          >
            <X size={20} />
            Back to Portfolio
          </motion.button>
        </div>
      </motion.header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          <motion.nav
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="lg:col-span-1"
          >
            <div className="bg-slate-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">Content Management</h2>
              <div className="space-y-2">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full text-left p-3 rounded-lg transition-colors flex items-center gap-3 ${
                        activeTab === tab.id
                          ? "bg-blue-600 text-white"
                          : "hover:bg-slate-700 text-slate-300"
                      }`}
                    >
                      {IconComponent && <IconComponent size={18} />}
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.nav>

          <motion.main
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-3"
          >
            <div className="bg-slate-800 rounded-xl p-6">
              {renderContent()}
            </div>
          </motion.main>
        </div>
      </div>

      {/* Forms */}
      {showForm && showForm.type === "experience" && (
        <ExperienceForm
          experience={showForm.item}
          onSubmit={() => {
            setShowForm(null);
            refetch();
          }}
          onCancel={() => setShowForm(null)}
        />
      )}

      {showForm && showForm.type === "project" && (
        <ProjectForm
          project={showForm.item}
          onSubmit={() => {
            setShowForm(null);
            refetch();
          }}
          onCancel={() => setShowForm(null)}
        />
      )}
    </div>
  );
};

const ProfileManager = ({ profile, refetch }: { profile: any; refetch: () => void }) => {
  const [formData, setFormData] = useState({
    name: profile?.name || "",
    title: profile?.title || "",
    bio: profile?.bio || "",
    email: profile?.email || "",
    phone: profile?.phone || "",
    location: profile?.location || "",
    github_url: profile?.github_url || "",
    linkedin_url: profile?.linkedin_url || "",
    twitter_url: profile?.twitter_url || "",
    instagram_url: profile?.instagram_url || ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          ...formData,
          user_id: null // Make it public
        });

      if (error) throw error;
      alert('Profile updated successfully!');
      refetch();
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-xl font-bold">Profile Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Full Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 bg-slate-700 rounded-lg border border-slate-600 focus:border-blue-400 focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Professional Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 bg-slate-700 rounded-lg border border-slate-600 focus:border-blue-400 focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3 py-2 bg-slate-700 rounded-lg border border-slate-600 focus:border-blue-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Phone</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-3 py-2 bg-slate-700 rounded-lg border border-slate-600 focus:border-blue-400 focus:outline-none"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">Location</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full px-3 py-2 bg-slate-700 rounded-lg border border-slate-600 focus:border-blue-400 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Bio</label>
        <textarea
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          rows={4}
          className="w-full px-3 py-2 bg-slate-700 rounded-lg border border-slate-600 focus:border-blue-400 focus:outline-none"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">GitHub URL</label>
          <input
            type="url"
            value={formData.github_url}
            onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
            className="w-full px-3 py-2 bg-slate-700 rounded-lg border border-slate-600 focus:border-blue-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">LinkedIn URL</label>
          <input
            type="url"
            value={formData.linkedin_url}
            onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
            className="w-full px-3 py-2 bg-slate-700 rounded-lg border border-slate-600 focus:border-blue-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Twitter URL</label>
          <input
            type="url"
            value={formData.twitter_url}
            onChange={(e) => setFormData({ ...formData, twitter_url: e.target.value })}
            className="w-full px-3 py-2 bg-slate-700 rounded-lg border border-slate-600 focus:border-blue-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Instagram URL</label>
          <input
            type="url"
            value={formData.instagram_url}
            onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
            className="w-full px-3 py-2 bg-slate-700 rounded-lg border border-slate-600 focus:border-blue-400 focus:outline-none"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg transition-colors"
      >
        {isSubmitting ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
};

export default AdminPanel;
