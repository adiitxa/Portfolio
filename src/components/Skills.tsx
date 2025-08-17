
import { motion } from "framer-motion";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { Code2, Sparkles } from "lucide-react";

const Skills = () => {
  const { skills, loading } = usePortfolioData();

  if (loading) {
    return (
      <section id="skills" className="py-20 bg-slate-800/20">
        <div className="container mx-auto px-6">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-400"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="skills" className="py-16 bg-gradient-to-br from-slate-900/50 via-slate-800/30 to-slate-900/50 relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-purple-400 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-1/3 w-1 h-1 bg-pink-400 rounded-full animate-pulse delay-2000"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-400/20">
                <Code2 className="w-5 h-5 text-blue-400" />
              </div>
              <Sparkles className="w-4 h-4 text-purple-400" />
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Tech{" "}
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Stack
              </span>
            </h2>
            
            <p className="text-base text-slate-400 max-w-xl mx-auto">
              Technologies I use to build amazing digital experiences
            </p>
          </motion.div>

          {skills.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-12 border border-slate-700/30 max-w-md mx-auto">
                <div className="w-16 h-16 bg-slate-700/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Code2 className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-400 text-lg">No skills data available yet.</p>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-8">
              {skills.map((category, categoryIndex) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: categoryIndex * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  {/* Category Header */}
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-white mb-2 flex items-center gap-3">
                      <div className="w-1 h-5 bg-gradient-to-b from-blue-400 to-purple-500 rounded-full"></div>
                      {category.category}
                    </h3>
                    <div className="h-px bg-gradient-to-r from-slate-600/50 to-transparent"></div>
                  </div>
                  
                  {/* Skills Grid */}
                  <div className="flex flex-wrap gap-3">
                    {category.skills_list?.map((skill, skillIndex) => (
                      <motion.div
                        key={skill}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ 
                          delay: categoryIndex * 0.1 + skillIndex * 0.02,
                          type: "spring",
                          stiffness: 300,
                          damping: 20
                        }}
                        viewport={{ once: true }}
                        whileHover={{ 
                          scale: 1.05,
                          y: -2,
                          transition: { type: "spring", stiffness: 400, damping: 25 }
                        }}
                        className="group cursor-default"
                      >
                        <div className="relative bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-lg px-4 py-2 hover:bg-slate-700/40 hover:border-slate-600/70 transition-all duration-300 shadow-sm hover:shadow-lg">
                          {/* Skill Name */}
                          <span className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors duration-300">
                            {skill}
                          </span>
                          
                          {/* Hover Glow Effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
