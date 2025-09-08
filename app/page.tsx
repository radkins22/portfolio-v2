'use client';

import dynamic from 'next/dynamic';
import Navigation from '@/components/ui/Navigation';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Projects from '@/components/sections/Projects';
import Skills from '@/components/sections/Skills';
import Interactive from '@/components/sections/Interactive';
import Experience from '@/components/sections/Experience';
import Contact from '@/components/sections/Contact';
import AIChat from '@/components/ui/AIChat';

// Dynamically import the interactive background to avoid SSR issues
const InteractiveBackground = dynamic(
  () => import('@/components/background/InteractiveBackground'),
  { ssr: false }
);

export default function Home() {
  return (
    <main className="relative min-h-screen bg-black">
      {/* Interactive Background */}
      <InteractiveBackground />
      
      {/* Navigation */}
      <Navigation />
      
      {/* Sections */}
      <div id="home">
        <Hero />
      </div>
      
      <About />
      <Projects />
      <Skills />
      <Interactive />
      <Experience />
      <Contact />
      
      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-500">
            © {new Date().getFullYear()} Rachael Higgins. Built with Next.js, TypeScript, and Three.js | Powered by AI
          </p>
        </div>
      </footer>
      
      {/* AI Chat */}
      <AIChat />
    </main>
  );
}
