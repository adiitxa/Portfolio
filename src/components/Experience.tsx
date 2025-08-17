
import { motion } from "framer-motion";
import { usePortfolioData } from "@/hooks/usePortfolioData";

const Experience = () => {
  const { experiences, loading } = usePortfolioData();

  if (loading) {
    return (
      <section id="experience" className="py-20 bg-gradient-to-b from-slate-900/50 to-slate-800/30">
        <div className="container mx-auto px-6">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-400"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="experience" className="py-20 bg-gradient-to-b from-slate-900/50 to-slate-800/30">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center mb-16"
          >
            
             <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Work{" "}
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Experience
              </span>
            </h2>
            
            
          </motion.h2>

          {experiences.length === 0 ? (
            <div className="text-center text-slate-400">
              <p>No experience data available yet.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {experiences.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  className="group"
                >
                  <div className="relative bg-gradient-to-r from-slate-800/60 to-slate-700/40 backdrop-blur-sm border border-slate-600/50 rounded-2xl p-8 hover:border-blue-400/50 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-blue-500/10">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="relative z-10">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                        <div className="mb-4 md:mb-0">
                          <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors duration-300">
                            {exp.title}
                          </h3>
                          <p className="text-xl text-blue-400 font-semibold mb-1">{exp.company}</p>
                          <p className="text-slate-400 font-medium">{exp.duration}</p>
                        </div>
                        
                        <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full px-4 py-2 border border-blue-400/30">
                          <span className="text-blue-300 text-sm font-medium">
                            {exp.duration.includes('Present') ? 'Current Role' : 'Previous Role'}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-slate-300 leading-relaxed mb-4">{exp.description}</p>
                      
                      {exp.technologies && exp.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {exp.technologies.map((tech, techIndex) => (
                            <span 
                              key={techIndex}
                              className="px-3 py-1 bg-blue-500/20 text-blue-400 text-sm rounded-full border border-blue-500/30"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent"></div>
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

export default Experience;
