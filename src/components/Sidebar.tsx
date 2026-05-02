import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal, Sun, Moon, Menu, X, 
  User, Cpu, Briefcase, Award, Mail, 
  Image as ImageIcon, BookOpen, GraduationCap, 
  Heart, Star, Users
} from 'lucide-react';

interface SidebarProps {
  isDark: boolean;
  toggleDarkMode: () => void;
}

const navLinks = [
  { name: 'About', href: '#hero', icon: User },
  { name: 'Education', href: '#education', icon: GraduationCap },
  { name: 'Skills', href: '#skills', icon: Cpu },
  { name: 'Experience', href: '#experience', icon: Briefcase },
  { name: 'Projects', href: '#projects', icon: Terminal },
  { name: 'Certifications', href: '#certifications', icon: Award },
  { name: 'AI Workshop', href: '#ai-workshop', icon: Cpu },
  { name: 'Honors', href: '#honors', icon: Star },
  { name: 'Gallery', href: '#gallery', icon: ImageIcon },
  { name: 'Mentorship', href: '#mentorship', icon: Users },
  { name: 'Volunteering', href: '#volunteering', icon: Heart },
  { name: 'Contact', href: '#contact', icon: Mail },
];

export const Sidebar: React.FC<SidebarProps> = ({ isDark, toggleDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.2, rootMargin: '-10% 0px -70% 0px' }
    );

    document.querySelectorAll('section[id]').forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden xl:flex fixed top-0 left-0 h-screen w-72 flex-col bg-white dark:bg-brand-primary border-r border-gray-100 dark:border-white/10 z-50 p-8 shadow-[10px_0_30px_rgba(0,0,0,0.02)]">
        <div className="mb-12">
          <motion.a 
            href="#" 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-mono font-bold text-xl tracking-tighter flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-brand-accent rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-accent/20">
              <Terminal size={20} />
            </div>
            <span className="dark:text-white text-gray-900 group">
              ARCHITECT<span className="text-brand-accent text-xs font-mono ml-1">.QE</span>
            </span>
          </motion.a>
        </div>

        <div className="flex-1 space-y-1 overflow-y-auto pr-2 custom-scrollbar">
          {navLinks.map((link, i) => {
            const isActive = activeSection === (link.href.replace('#', '') || 'hero');
            return (
              <motion.a 
                key={link.name} 
                href={link.href} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`group flex items-center gap-4 py-3 px-4 rounded-xl text-sm font-medium transition-all hover:bg-gray-50 dark:hover:bg-white/5 ${
                  isActive 
                    ? 'bg-brand-accent/10 text-brand-accent opacity-100' 
                    : 'opacity-60 hover:opacity-100 hover:text-brand-accent'
                }`}
              >
                <link.icon size={18} className={`transition-transform ${isActive ? 'scale-110 text-brand-accent' : 'text-brand-accent/50 group-hover:text-brand-accent'}`} />
                {link.name}
              </motion.a>
            );
          })}
        </div>

        <div className="mt-8 pt-8 border-t border-gray-100 dark:border-white/5 space-y-4">
          <button 
            onClick={toggleDarkMode} 
            className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-white/5 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="flex items-center gap-3 text-sm font-medium opacity-70">
              {isDark ? <Moon size={18} className="text-brand-accent" /> : <Sun size={18} className="text-orange-400" />}
              <span>{isDark ? 'Dark' : 'Light'} Mode</span>
            </div>
            <div className={`w-8 h-4 rounded-full relative transition-colors ${isDark ? 'bg-brand-accent' : 'bg-gray-300'}`}>
              <div className={`absolute top-1 w-2 h-2 bg-white rounded-full transition-all ${isDark ? 'right-1' : 'left-1'}`} />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Nav */}
      <nav className="xl:hidden fixed top-0 w-full z-50 glass-card py-4 px-6 flex justify-between items-center h-16 border-b dark:border-white/5">
        <a href="#" className="font-mono font-bold text-lg flex items-center gap-2">
          <Terminal size={20} className="text-brand-accent" />
          <span>DEV.PORTFOLIO</span>
        </a>
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="p-2 rounded-xl bg-gray-50 dark:bg-white/10"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              className="fixed inset-0 bg-white dark:bg-brand-primary z-[60] p-8 flex flex-col"
            >
              <div className="flex justify-between items-center mb-12">
                <Terminal size={24} className="text-brand-accent" />
                <button onClick={() => setIsOpen(false)} className="p-3 bg-gray-50 dark:bg-white/10 rounded-2xl">
                  <X size={24} />
                </button>
              </div>
              <div className="flex-1 space-y-6 overflow-y-auto">
                {navLinks.map((link, i) => (
                  <motion.a 
                    key={link.name} 
                    href={link.href} 
                    onClick={() => setIsOpen(false)} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="text-2xl font-bold flex items-center gap-6"
                  >
                    <link.icon size={28} className="text-brand-accent/40" />
                    {link.name}
                  </motion.a>
                ))}
              </div>
              <div className="mt-auto pt-8 border-t border-gray-100 dark:border-white/10 flex justify-between">
                <button onClick={toggleDarkMode} className="flex items-center gap-3 font-bold text-lg">
                  {isDark ? <Moon size={24} className="text-brand-accent" /> : <Sun size={24} className="text-orange-400" />}
                  {isDark ? 'Dark' : 'Light'} Mode
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};
