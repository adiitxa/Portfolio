
import { motion } from "framer-motion";
import { GraduationCap, Calendar, MapPin } from "lucide-react";
import { usePortfolioData } from "@/hooks/usePortfolioData";

const Education = () => {
  const { education, loading } = usePortfolioData();

  if (loading) {
    return (
      <section id="education" className="py-20">
        <div className="container mx-auto px-6">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-400"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="education" className="py-20">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center mb-16"
          >
                        
             <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Educational{" "}
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">Qualifications


              </span>
            </h2>
            
          </motion.h2>

          {education.length === 0 ? (
            <div className="text-center text-slate-400">
              <p>No education data available yet.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {education.map((edu, index) => (
                <motion.div
                  key={edu.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-2xl p-8 backdrop-blur-sm border border-slate-600/50 shadow-xl hover:border-blue-500/50 transition-all duration-300"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    <div className="flex-shrink-0">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg"
                      >
                        <GraduationCap size={32} className="text-white" />
                      </motion.div>
                    </div>

                    <div className="flex-grow space-y-4">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">{edu.degree}</h3>
                        <h4 className="text-xl text-blue-400 font-semibold mb-3">{edu.institution}</h4>
                      </div>

                      <div className="flex flex-wrap gap-4 text-slate-300">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-blue-400" />
                          <span>{edu.duration}</span>
                        </div>
                        {edu.location && (
                          <div className="flex items-center gap-2">
                            <MapPin size={16} className="text-purple-400" />
                            <span>{edu.location}</span>
                          </div>
                        )}
                        {edu.grade && (
                          <div className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold">
                            {edu.grade}
                          </div>
                        )}
                      </div>

                      <p className="text-slate-300 leading-relaxed">{edu.description}</p>
                      
                      {edu.achievements && edu.achievements.length > 0 && (
                        <div className="mt-4">
                          <h5 className="text-lg font-semibold text-white mb-2">Achievements:</h5>
                          <ul className="space-y-2">
                            {edu.achievements.map((achievement, achIndex) => (
                              <li key={achIndex} className="flex items-start gap-2 text-slate-300">
                                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                                {achievement}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
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

export default Education;
