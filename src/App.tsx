import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { fetchSheetData, fetchFolderFiles, getDriveImageUrl } from './services/dataService';
import { Sidebar } from './components/Sidebar';
import { SectionHeader, MediaGrid } from './components/CommonUI';
import { InfoSection, Timeline } from './components/TextSections';
import AIChatBot from './components/AIChatBot';
import { HeroData, GenericItem, ExperienceItem } from './types';
import { ChevronRight, ExternalLink, Github, Linkedin, Mail, ArrowUpRight } from 'lucide-react';

// --- Hero Section ---
const Hero: React.FC<{ data: HeroData | null }> = ({ data }) => {
  if (!data) return <div className="h-[80vh] flex items-center justify-center shimmer rounded-[40px] m-6" />;

  const stats = [
    { label: 'Years Exp', value: '20+' },
    { label: 'Apps Cloud Transformation', value: '100+' },
    { label: 'AI Tools', value: '30+' },
    { label: 'Awards', value: '20+' },
    { label: 'Certifications', value: '15+' },
  ];

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center p-6 md:p-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-accent/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />
      
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
        <motion.div
           initial={{ opacity: 0, x: -50 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-xs font-bold uppercase tracking-widest mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse" />
            Empowering Quality Engineering with AI
          </motion.div>
          
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-8 tracking-tighter">
            <span className="premium-gradient-text whitespace-nowrap inline-block pb-1 pr-8">I am Ilayaraja M</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-500 dark:text-gray-400 font-medium max-w-2xl leading-relaxed mb-10">
            {data.tagline}
          </p>

          <div className="flex flex-wrap gap-4 mb-12">
            <a 
              href="#contact" 
              className="px-8 py-4 bg-brand-accent text-white rounded-2xl font-bold flex items-center gap-3 shadow-xl shadow-brand-accent/25 hover:shadow-brand-accent/40 hover:-translate-y-1 transition-all"
            >
              Start Collaboration
              <ArrowUpRight size={20} />
            </a>
            <a 
              href="#experience" 
              className="px-8 py-4 glass-card rounded-2xl font-bold flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-white/10 transition-all"
            >
              View Track Record
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-6 pt-8 border-t border-gray-100 dark:border-white/5">
            {stats.map((stat, i) => (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + (i * 0.1) }}
              >
                <div className="text-3xl font-bold text-brand-accent mb-1">{stat.value}</div>
                <div className="text-[10px] uppercase tracking-widest opacity-40 font-bold">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-brand-accent/20 blur-3xl rounded-full scale-90 group-hover:scale-110 transition-transform duration-1000" />
          <div className="relative aspect-[4/5] rounded-[40px] overflow-hidden border-8 border-white dark:border-brand-secondary shadow-2xl">
            <img 
              src={data.ProfileID ? getDriveImageUrl(data.ProfileID) : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800"} 
              alt={data.name} 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/60 via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8 p-6 glass-card rounded-2xl border-white/20 backdrop-blur-md">
              <p className="text-white font-bold">{data.title}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default function App() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Data State
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  const [about, setAbout] = useState<GenericItem[]>([]);
  const [skills, setSkills] = useState<GenericItem[]>([]);
  const [experience, setExperience] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [volunteering, setVolunteering] = useState<any[]>([]);
  const [education, setEducation] = useState<any[]>([]);
  const [certs, setCerts] = useState<any[]>([]);
  const [workshop, setWorkshop] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [awards, setAwards] = useState<any[]>([]);
  const [mentorship, setMentorship] = useState<any[]>([]);
  const [socials, setSocials] = useState<any>(null);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    const loadAllData = async () => {
      const [
        hero, aboutList, skillList, expList, projectList, 
        socialList, volunteerList, edList, certList, 
        workshopList, galleryList, awardList, mentorshipList
      ] = await Promise.all([
        fetchSheetData('Hero'),
        fetchSheetData('About'),
        fetchSheetData('Skills'),
        fetchSheetData('Experience'),
        fetchSheetData('Projects'),
        fetchSheetData('Social media links'),
        fetchSheetData('Volunteering'),
        fetchSheetData('Education'),
        fetchSheetData('Certifications'),
        fetchSheetData('AI Workshop'),
        fetchSheetData('Gallery'),
        fetchSheetData('Honors & Awards'),
        fetchSheetData('Mentorship'),
      ]);

      // Set Profile Photo if sheet is missing it
      if (hero.length) {
        let heroItem = hero[0];
        if (!heroItem.ProfileID) {
          const profileFiles = await fetchFolderFiles('1mv_LaBzMr7qACsF_o5T14AscZuqvTkjv');
          if (profileFiles.length) heroItem.ProfileID = profileFiles[0].id;
        }
        setHeroData(heroItem);
      }

      const parseItems = (data: any[]) => {
        if (!data.length || !data[0].Description) return data;
        return data[0].Description.split(/\n\s*•|\n\s*-|(?=\n[A-Z][^a-z]{5,})/)
          .map((d: string) => ({ Description: d.trim() }))
          .filter((d: any) => d.Description.length > 5);
      };

      setAbout(parseItems(aboutList));
      setSkills(parseItems(skillList));
      setExperience(expList);
      setProjects(projectList);
      setVolunteering(volunteerList);
      setEducation(edList);

      const loadMedia = async (sheetData: any[], folderId: string) => {
        if (sheetData.length > 0 && sheetData[0].ImageID) return sheetData;
        const files = await fetchFolderFiles(folderId);
        return files.map((f: any) => ({
          Title: f.name.replace(/\.[^/.]+$/, "").replace(/^\d+\./, ""),
          ImageID: f.id,
          Description: f.name
        }));
      };

      setCerts(await loadMedia(certList, '1l8J5ar6wutlwK-X5YitM-NMRICP9E7HD'));
      setWorkshop(await loadMedia(workshopList, '1ACMO84W0hrM0rPSFpQK3x4bM6cGaSk_a'));
      setGallery(await loadMedia(galleryList, '1MCySophYB0HhdVURAPuw4dZBy9mBncG2'));
      setAwards(await loadMedia(awardList, '1SleaXQp8ke46ln7myYK6H3orm6qsQeqQ'));
      setMentorship(await loadMedia(mentorshipList, '13vvq8DceWThER0q8liDQ8dYU6Ug-wfS2'));

      if (socialList.length) setSocials(socialList[0]);
      setIsLoaded(true);
    };

    loadAllData();
  }, []);

  return (
    <div className="relative md:flex min-h-screen selection:bg-brand-accent selection:text-white bg-white dark:bg-brand-primary text-gray-900 dark:text-gray-100 transition-colors duration-500">
      <Sidebar isDark={isDark} toggleDarkMode={() => setIsDark(!isDark)} />
      
      <main className="flex-1 xl:ml-72 transition-all duration-500">
        <Hero data={heroData} />
        
        <div id="about-expertise">
          <InfoSection label="Profile" title="About Expertise" id="about-expertise" items={about} wide />
        </div>

        <div id="education">
          <InfoSection label="Academic" title="Education" id="education" items={education} wide />
        </div>

        <div id="skills">
          <InfoSection label="Stacks" title="Core Capabilities" id="skills" items={skills} wide />
        </div>

        <div id="experience">
          <Timeline label="Journey" title="Professional Track" id="experience" items={experience} />
        </div>

        <div id="projects">
          <Timeline label="Portfolio" title="Strategic Projects" id="projects" items={projects} />
        </div>

        <div id="certifications">
          <MediaGrid label="Validation" title="Certifications" id="certifications" items={certs} />
        </div>

        <div id="ai-workshop">
          <MediaGrid label="Innovation" title="AI Workshop" id="ai-workshop" items={workshop} />
        </div>

        <div id="honors">
          <MediaGrid label="Recognition" title="Honors & Awards" id="honors" items={awards} />
        </div>

        <div id="gallery">
          <MediaGrid label="Moments" title="Gallery" id="gallery" items={gallery} />
        </div>

        <div id="mentorship">
          <MediaGrid label="Legacy" title="Mentorship" id="mentorship" items={mentorship} />
        </div>

        <div id="volunteering">
          <InfoSection label="Impact" title="Volunteering" id="volunteering" items={volunteering} wide />
        </div>

        {/* Contact Section */}
        <section id="contact" className="section-container relative">
          <div className="absolute inset-0 bg-brand-accent/5 blur-[120px] rounded-full" />
          <div className="glass-card p-12 md:p-20 rounded-[48px] relative z-10 text-center">
            <SectionHeader label="Connect" title="Start a Conversation" />
            <p className="text-2xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-12">
              Interested in AI-led automation or quality engineering transformation? Let's discuss how we can drive excellence together.
            </p>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <a 
                href={`mailto:chat.ilayaraja@gmail.com`}
                className="w-full md:w-auto px-10 py-5 bg-brand-primary dark:bg-white text-white dark:text-brand-primary rounded-[24px] font-bold text-xl flex items-center justify-center gap-4 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Mail size={24} />
                Send Email
              </a>
              <div className="flex gap-4">
                {socials?.LinkedIn && (
                  <a href={socials.LinkedIn} target="_blank" rel="noreferrer" className="w-16 h-16 glass-card rounded-[24px] flex items-center justify-center hover:text-brand-accent transition-colors">
                    <Linkedin size={28} />
                  </a>
                )}
                {socials?.GitHub && (
                  <a href={socials.GitHub} target="_blank" rel="noreferrer" className="w-16 h-16 glass-card rounded-[24px] flex items-center justify-center hover:text-brand-accent transition-colors">
                    <Github size={28} />
                  </a>
                )}
              </div>
            </div>
            <div className="mt-10 pt-8 border-t border-gray-100 dark:border-white/5 inline-block">
              <p className="text-gray-500 dark:text-gray-400 font-medium flex items-center justify-center gap-2">
                <span className="opacity-50">Email:</span>
                <span className="text-brand-primary dark:text-white font-bold select-all">chat.ilayaraja@gmail.com</span>
              </p>
            </div>
          </div>
        </section>

        <footer className="py-12 px-6 opacity-30 text-center xl:text-left">
          <div className="max-w-7xl mx-auto flex flex-col xl:flex-row justify-between items-center gap-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em]">
              &copy; {new Date().getFullYear()} ILAYARAJA M / ARCHITECT.QE
            </p>
            <div className="flex gap-8 font-mono text-[10px] uppercase tracking-[0.2em]">
              <span className="hover:text-brand-accent cursor-wait">SECURED PORTAL</span>
              <span className="opacity-50">V2.4.0-STABLE</span>
            </div>
          </div>
        </footer>
      </main>

      <AIChatBot />
    </div>
  );
}
