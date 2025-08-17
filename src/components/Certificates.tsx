
import { motion } from "framer-motion";
import { ExternalLink, Award } from "lucide-react";
import { usePortfolioData } from "@/hooks/usePortfolioData";

const Certificates = () => {
  const { certificates, loading } = usePortfolioData();

  if (loading) {
    return (
      <section id="certificates" className="py-20">
        <div className="container mx-auto px-6">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-400"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="certificates" className="py-20">
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
              Certifications{" "}
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">& Achievements


              </span>
            </h2>
          </motion.h2>

          {certificates.length === 0 ? (
            <div className="text-center text-slate-400">
              <p>No certificates available yet.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificates.map((cert, index) => (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  viewport={{ once: true }}
                  className="bg-slate-800/50 rounded-xl p-6 backdrop-blur-sm border border-slate-700 hover:border-blue-500/50 transition-all duration-300 group"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
                      <Award className="text-white" size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                        {cert.name}
                      </h3>
                      <p className="text-slate-400 text-sm">{cert.date_issued}</p>
                    </div>
                  </div>

                  <p className="text-blue-400 font-semibold mb-2">{cert.issuer}</p>
                  <p className="text-slate-300 text-sm mb-4 leading-relaxed">{cert.description}</p>

                  {cert.certificate_url && (
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      href={cert.certificate_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium"
                    >
                      View Certificate
                      <ExternalLink size={14} />
                    </motion.a>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Certificates;
