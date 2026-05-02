import React from 'react';
import { motion } from 'motion/react';
import { SectionHeader } from './CommonUI';
import { GenericItem } from '../types';
import { CheckCircle2, Terminal as TerminalIcon } from 'lucide-react';

export const InfoSection: React.FC<{ items: GenericItem[]; label: string; title: string; id: string; wide?: boolean }> = ({ items, label, title, id, wide }) => (
  <section id={id} className="section-container">
    <SectionHeader label={label} title={title} />
    <div className={`grid gap-8 ${wide ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
      {items.map((item, i) => (
        <motion.div 
          key={i}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className={`glass-card p-8 rounded-[32px] relative group overflow-hidden ${wide ? 'hover:border-brand-accent/30' : ''}`}
        >
          <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
            <TerminalIcon size={120} />
          </div>
          <div className="relative z-10">
            <div className={`flex items-start gap-4 ${wide ? 'flex-col' : 'flex-row'}`}>
              {!wide && (
                <div className="mt-1 flex-shrink-0">
                  <CheckCircle2 size={20} className="text-brand-accent" />
                </div>
              )}
              <div className="space-y-4 w-full">
                {wide && item.Title && (
                  <h4 className="text-2xl font-bold dark:text-white mb-4">
                    {item.Title}
                  </h4>
                )}
                <div className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg whitespace-pre-line">
                  {item.Description.includes('\n') || item.Description.length > 100 ? (
                    <ul className="space-y-4">
                      {item.Description.split('\n').filter(line => line.trim()).map((line, idx) => {
                        const isKeyExpertise = line.toLowerCase().includes('key expertise');
                        const cleanLine = line.replace(/^[•\-\*]\s*/, '').trim();
                        return (
                          <li key={idx} className="flex items-start gap-3">
                            <div className="mt-2 w-1.5 h-1.5 rounded-full bg-brand-accent flex-shrink-0" />
                            <span className={isKeyExpertise ? 'font-bold text-gray-900 dark:text-white' : ''}>
                              {cleanLine}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p>{item.Description}</p>
                  )}
                </div>
                {!wide && item.Title && (
                  <h4 className="text-sm font-mono text-brand-accent uppercase tracking-widest font-bold">
                    {item.Title}
                  </h4>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </section>
);

export const Timeline: React.FC<{ items: any[]; label: string; title: string; id: string }> = ({ items, label, title, id }) => (
  <section id={id} className="section-container">
    <SectionHeader label={label} title={title} />
    <div className="space-y-12 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100 dark:before:bg-white/5">
      {items.map((item, i) => (
        <motion.div 
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative pl-12"
        >
          <div className="absolute left-0 top-1 w-9 h-9 rounded-full bg-white dark:bg-brand-primary border-4 border-white dark:border-brand-primary shadow-sm flex items-center justify-center z-10">
            <div className="w-3 h-3 rounded-full bg-brand-accent" />
          </div>
          
          <div className="glass-card p-8 rounded-[32px] hover:border-brand-accent/30 transition-colors">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
              <div className="flex-1 text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                {item.Description.split('\n').map((line, idx) => {
                  const isCompany = line.toLowerCase().startsWith('company name:');
                  if (isCompany) {
                    return (
                      <div key={idx} className="text-2xl text-blue-600 dark:text-blue-400 leading-tight mb-2">
                        {line}
                      </div>
                    );
                  }
                  return (
                    <div key={idx} className="mb-1">
                      {line}
                    </div>
                  );
                })}
              </div>
              <div className="md:text-right flex flex-col md:items-end">
                <div className="inline-block px-4 py-2 rounded-xl bg-brand-accent/5 border border-brand-accent/10 text-brand-accent text-xs font-mono font-bold mb-2">
                  {item.Period || item.Date}
                </div>
                {item.Location && (
                  <p className="text-[10px] uppercase tracking-[0.2em] opacity-50 font-bold">
                    Location: <span className="text-gray-900 dark:text-white">{item.Location}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </section>
);
