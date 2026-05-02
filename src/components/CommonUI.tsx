import React from 'react';
import { motion } from 'motion/react';
import { getDriveImageUrl } from '../services/dataService';
import { GenericItem } from '../types';

export const SectionHeader: React.FC<{ label: string; title: string; subtitle?: string }> = ({ label, title, subtitle }) => (
  <div className="mb-8">
    <motion.span 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="section-label"
    >
      {label}
    </motion.span>
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 }}
      className="text-4xl md:text-5xl font-bold mb-4 tracking-tight"
    >
      {title}
    </motion.h2>
    {subtitle && (
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl leading-relaxed"
      >
        {subtitle}
      </motion.p>
    )}
    <motion.div 
      initial={{ width: 0 }}
      whileInView={{ width: 64 }}
      viewport={{ once: true }}
      className="h-1 bg-brand-accent mt-6 rounded-full"
    />
  </div>
);

export const MediaGrid: React.FC<{ items: GenericItem[]; label: string; title: string; id: string }> = ({ items, label, title, id }) => (
  <section id={id} className="section-container">
    <SectionHeader label={label} title={title} />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {items.map((item, i) => {
        const rawImageUrl = item.ImageID || item.Image || item.URL || item.Link || '';
        const hasImage = !!rawImageUrl;
        const imageUrl = hasImage ? getDriveImageUrl(rawImageUrl) : `https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=400`;

        return (
          <motion.div 
            key={i}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "500px" }}
            transition={{ delay: (i % 4) * 0.05 }}
            whileHover={{ y: -4 }}
            className="group relative aspect-[4/3] rounded-[24px] overflow-hidden bg-white dark:bg-brand-secondary border border-gray-100 dark:border-white/5 shadow-sm p-1 cursor-zoom-in z-0 hover:z-10"
          >
            <div className="w-full h-full rounded-[22px] overflow-hidden relative bg-gray-100 dark:bg-white/5">
              <img 
                src={imageUrl} 
                alt={item.Title || title} 
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=400';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6">
                <span className="text-[10px] uppercase tracking-widest text-brand-accent font-bold mb-1">{label}</span>
                <p className="text-white font-bold text-lg leading-tight line-clamp-2">{item.Title || item.Description || 'Untitled'}</p>
                {item.Date && <p className="text-white/60 text-xs mt-2 font-mono">{item.Date}</p>}
              </div>
            </div>
          </motion.div>
        );
      })}
      {items.length === 0 && (
        <div className="col-span-full py-20 text-center glass-card rounded-[32px] border-dashed">
          <p className="font-mono text-sm opacity-30 italic">Collection "{(title).toUpperCase()}" is currently synchronization...</p>
        </div>
      )}
    </div>
  </section>
);
