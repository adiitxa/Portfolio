
import { motion } from "framer-motion";
import { Github, Linkedin, Twitter, Instagram, Code, Zap, Users, Award } from "lucide-react";
import { usePortfolioData } from "@/hooks/usePortfolioData";

const About = () => {
  const { profile, loading } = usePortfolioData();

  if (loading) {
    return (
      <section id="about" className="py-20">
        <div className="container mx-auto px-6">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-400"></div>
          </div>
        </div>
      </section>
    );
  }

  const socialLinks = [
    { icon: Github, href: profile?.github_url || "#", label: "GitHub" },
    { icon: Linkedin, href: profile?.linkedin_url || "#", label: "LinkedIn" },
    { icon: Twitter, href: profile?.twitter_url || "#", label: "Twitter" },
    { icon: Instagram, href: profile?.instagram_url || "#", label: "Instagram" },
  ];

  const highlights = [
    { icon: Code, title: "Clean Code", description: "Writing maintainable and scalable solutions" },
    { icon: Zap, title: "Fast Delivery", description: "Quick turnaround without compromising quality" },
    { icon: Users, title: "Team Player", description: "Collaborative approach to problem-solving" },
    { icon: Award, title: "Quality Focus", description: "Attention to detail in every project" },
  ];

  return (
    <section id="about" className="py-20 bg-slate-800/20">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
         {/* <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center mb-16 text-white"
          >
            About <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Me</span>
          </motion.h2>*/}

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Who I Am Card */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/50 shadow-xl h-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <h3 className="text-2xl font-bold text-white">Pixels & Purpose</h3>
                </div>
                <p className="text-slate-300 leading-relaxed text-lg mb-6">
                  {profile?.bio || " bbb"}
                </p>
                <div className="flex flex-wrap gap-3">
                  {['Web Development', 'AI Agents', 'Machine Learning', 'Networking',].map((tech) => (
                    <span key={tech} className="px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-full text-sm font-medium text-slate-200">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Social Links Card */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 shadow-lg h-full">
                <h4 className="text-lg font-semibold text-white mb-4 text-center">Connect With Me</h4>
                <div className="grid grid-cols-2 gap-3">
                  {socialLinks.map((social) => (
                    <motion.a
                      key={social.label}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 p-3 bg-slate-700/50 hover:bg-gradient-to-br hover:from-blue-500 hover:to-purple-600 rounded-xl transition-all duration-300 group"
                    >
                      <social.icon size={18} className="text-slate-300 group-hover:text-white" />
                      <span className="text-xs font-medium text-slate-300 group-hover:text-white">{social.label}</span>
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Professional Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {highlights.map((highlight, index) => (
              <motion.div
                key={highlight.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 shadow-lg text-center group hover:shadow-xl transition-all duration-300"
              >
                <div className="w-12 h-12 bg-slate-700/50 border border-slate-600/50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <highlight.icon size={24} className="text-blue-400" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">{highlight.title}</h4>
                <p className="text-sm text-slate-300">{highlight.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
