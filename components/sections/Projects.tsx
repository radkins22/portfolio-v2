"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Github, ExternalLink, Code, Eye, Star, GitBranch, Play, Lock, Globe, X } from "lucide-react";

const projects = [
  {
    id: 1,
    title: "HRPR - AI Event Assistant",
    description:
      "Developed an AI-powered Human-like, Responsive, Personal Representative for conferences and festivals. Features voice-driven natural conversation to help attendees find sessions, explore sponsors, and navigate venues in real-time.",
    image: "/images/projects/hrpr.png",
    tech: [
      "AI/ML",
      "Voice Recognition",
      "React",
      "TypeScript",
      "Real-time Data",
    ],
    github: "https://github.com/radkins22",
    demoVideo: "https://youtu.be/fHWqxVuYxAU",
    liveLink: "https://hrpr.banyanlabs.io",
    isCodePrivate: true,
    categories: ["Web Apps", "AI/ML"],
    stats: { stars: 89, forks: 21, views: "1.8k" },
    gradient: "from-purple-500 to-pink-500",
  },
  {
    id: 2,
    title: "Assessment Pathways Chrome Extension",
    description:
      "Created an AI-powered Chrome extension for automated grading that integrates seamlessly with educational platforms, enabling teachers to provide instant feedback and assessment on student submissions.",
    image: "/images/projects/chrome-extension.png",
    tech: ["Chrome Extension", "JavaScript", "AI/ML", "OpenAI API", "React"],
    github: "https://github.com/radkins22",
    demoVideo: "https://www.youtube.com/watch?v=F9DXRbqZGXU&t=2s",
    liveLink: "https://chromewebstore.google.com/detail/assessment-pathways-gradi/lahdiobkjmcmiommmfhafgebjlnaggmo",
    isCodePrivate: true,
    categories: ["AI/ML"],
    stats: { stars: 203, forks: 56, views: "4.2k" },
    gradient: "from-blue-500 to-purple-500",
  },
  {
    id: 3,
    title: "Reuben Adkins - Musician Portfolio",
    description:
      "Designed and developed a professional portfolio website for a guitarist, featuring music samples, tour dates, and booking functionality with a focus on artistic presentation and user engagement.",
    image: "/images/projects/reuben-adkins.png",
    tech: [
      "React",
      "JavaScript",
      "Responsive Design",
      "Audio Integration",
      "CSS",
    ],
    github: "https://github.com/radkins22/Musician-landing-page",
    demoVideo: "", // You'll need to add demo video URL
    liveLink: "https://reubenadkins.com",
    isCodePrivate: false,
    categories: ["Web Apps", "Open Source"],
    stats: { stars: 92, forks: 18, views: "1.5k" },
    gradient: "from-pink-500 to-rose-500",
  },
  {
    id: 4,
    title: "Willy's Philly's Food Truck Website",
    description:
      "Collaborated on building a responsive frontend for a local Arizona-based food truck using React and Tailwind CSS, emphasizing mobile-first design and brand consistency.",
    image: "/images/projects/willys-phillys.png",
    tech: ["React", "Tailwind CSS", "JavaScript", "Responsive Design"],
    github: "https://github.com/radkins22",
    demoVideo: "", // You'll need to add demo video URL
    liveLink: "https://willysphillys.com/",
    isCodePrivate: true,
    categories: ["Web Apps"],
    stats: { stars: 128, forks: 34, views: "2.4k" },
    gradient: "from-orange-500 to-red-500",
  },
  {
    id: 5,
    title: "Rachael Higgins Portfolio",
    description:
      "Designed and developed a personal tech portfolio using React to highlight project experience, frontend proficiency, and visual design skills.",
    image: "/images/projects/portfolio.png",
    tech: ["React", "Tailwind CSS", "Typescript", "Three.js", "Next.js"],
    github: "https://github.com/radkins22/Portfolio",
    demoVideo: "", // You'll need to add demo video URL
    liveLink: "https://not-your-avg-nerd.dev/",
    isCodePrivate: false,
    categories: ["Web Apps", "Open Source"],
    stats: { stars: 67, forks: 12, views: "900" },
    gradient: "from-teal-500 to-green-500",
  },
];

const categories = ["All", "Web Apps", "AI/ML", "Open Source"];

export default function Projects() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState("");
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Function to convert YouTube URL to embed URL
  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return "";
    
    // Extract video ID from various YouTube URL formats
    const videoIdMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    if (!videoIdMatch) return "";
    
    const videoId = videoIdMatch[1];
    // Extract timestamp if present
    const timeMatch = url.match(/[?&]t=(\d+)/);
    const startTime = timeMatch ? `&start=${timeMatch[1]}` : "";
    
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0${startTime}`;
  };

  const openVideoModal = (videoUrl: string) => {
    setCurrentVideoUrl(getYouTubeEmbedUrl(videoUrl));
    setShowVideoModal(true);
  };

  const closeVideoModal = () => {
    setShowVideoModal(false);
    setCurrentVideoUrl("");
  };

  // Filter projects based on selected category
  const filteredProjects = projects.filter(project => {
    if (selectedCategory === "All") return true;
    return project.categories.includes(selectedCategory);
  });

  return (
    <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-white">Featured </span>
            <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Explore my latest work and open-source contributions
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 cursor-pointer ${
                selectedCategory === category
                  ? "bg-gradient-to-r from-green-500 to-cyan-500 text-white"
                  : "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <div ref={ref} className="grid md:grid-cols-2 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                onHoverStart={() => setHoveredProject(project.id)}
                onHoverEnd={() => setHoveredProject(null)}
                className="relative group"
              >
                {/* Glow Effect - moved to the back with pointer-events-none */}
                <div
                  className={`absolute -inset-1 bg-gradient-to-r ${project.gradient} rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300 pointer-events-none`}
                />
                
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-800 hover:border-green-500/50 transition-all duration-300 relative z-10">
                  {/* Project Image with Overlay */}
                  <div className="relative aspect-[16/10] overflow-hidden group bg-gray-800">
                    {/* Project Image */}
                    {project.image && project.image !== '/api/placeholder/600/400' ? (
                      <img 
                        src={project.image} 
                        alt={project.title}
                        className={`absolute inset-0 w-full h-full transition-all duration-500 group-hover:scale-105 group-hover:brightness-110 ${
                          project.id === 4 
                            ? 'object-contain' 
                            : 'object-cover object-center'
                        }`}
                        style={{
                          objectPosition: 
                            project.id === 2 ? 'center center' : // Chrome Extension
                            project.id === 4 ? 'center center' : // Willy's Philly's
                            'center top'
                        }}
                      />
                    ) : (
                      <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient}`} />
                    )}
                    
                    {/* Overlay gradient for better text contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
                    

                    {/* Stats Overlay */}
                    <div className="absolute top-4 right-4 flex gap-3">
                      <div className="flex items-center gap-1 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full text-white text-sm">
                        <Star className="w-4 h-4" />
                        {project.stats.stars}
                      </div>
                      <div className="flex items-center gap-1 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full text-white text-sm">
                        <GitBranch className="w-4 h-4" />
                        {project.stats.forks}
                      </div>
                    </div>
                  </div>

                  {/* Project Content */}
                  <div className="p-6 space-y-4">
                    <h3 className="text-2xl font-bold text-white group-hover:text-green-400 transition-colors">
                      {project.title}
                    </h3>

                    <p className="text-gray-400 line-clamp-2">
                      {project.description}
                    </p>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      {/* Demo Video Button - only show for private code projects that have demo videos */}
                      {project.isCodePrivate && project.demoVideo && (
                        <button
                          onClick={() => openVideoModal(project.demoVideo)}
                          className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"
                        >
                          <Play className="w-4 h-4" />
                          Demo
                        </button>
                      )}
                      
                      {/* Live Site Button */}
                      <button
                        onClick={() => window.open(project.liveLink, '_blank')}
                        className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"
                      >
                        <Globe className="w-4 h-4" />
                        Live Site
                      </button>
                      
                      {/* Code Button */}
                      <button
                        onClick={() => !project.isCodePrivate && window.open(project.github, '_blank')}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          project.isCodePrivate
                            ? 'bg-gray-700 text-gray-300 cursor-not-allowed'
                            : 'bg-gray-800 hover:bg-gray-700 text-white cursor-pointer'
                        }`}
                        disabled={project.isCodePrivate}
                      >
                        {project.isCodePrivate ? <Lock className="w-4 h-4" /> : <Github className="w-4 h-4" />}
                        {project.isCodePrivate ? 'Private' : 'Code'}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* View More Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <button className="group relative px-8 py-3 overflow-hidden rounded-lg border-2 border-green-500/50 text-green-400 font-semibold hover:border-green-500 transition-all duration-300 cursor-pointer">
            <span className="relative z-10 flex items-center gap-2">
              View All Projects
              <Eye className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </motion.div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {showVideoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeVideoModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative bg-gray-900 rounded-xl overflow-hidden max-w-4xl w-full aspect-video"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeVideoModal}
                className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              {/* Video Iframe */}
              {currentVideoUrl && (
                <iframe
                  src={currentVideoUrl}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Project Demo Video"
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
