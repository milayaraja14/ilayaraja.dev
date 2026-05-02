import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { getAIChatResponse } from '../services/dataService';

const SYSTEM_PROMPT = `You are the AI Assistant for Ilayaraja M, a Senior Delivery Manager specializing in Quality Engineering and AI-Led Automation.
Answer questions based on his expertise: Quality Engineering, AI-Led Automation, and Cloud Transformation (Azure, AWS, GCP).
Be professional, concise, and helpful. If asked about personal contact info, mention chat.ilayaraja@gmail.com.

Expertise areas:
- AI-driven test automation (GitHub Copilot, Amazon Q, Gemini)
- Cloud Migration (AWS, Azure)
- Digital Transformation in BFSI, Insurance, and Telecom
- Scaled Agile Delivery`;

const FALLBACK_ANSWERS: Record<string, string> = {
  "quality engineering": "Ilayaraja specializes in modern QE transformation, moving from traditional testing to AI-led automation and continuous quality models.",
  "automation": "His focus is on AI-powered automation using tools like GenAI, Playwright, and Selenium to accelerate delivery and reduce manual effort.",
  "cloud": "He has extensive experience in cloud transformation, notably leading a major migration of 100+ applications to Azure for AXA XL.",
  "default": "I'm sorry I can't provide dynamic details right now, but Ilayaraja is an expert in QE and AI Automation. Feel free to reach out via LinkedIn!"
};

export default function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([
    { role: 'model', text: 'Hi! I am Ilayaraja\'s AI assistant. Ready to talk about QE, AI Automation, or Cloud Transformation?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const response = await getAIChatResponse([...messages, { role: 'user', text: userMsg }], SYSTEM_PROMPT);
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
      console.error("AI Error:", error);
      // Fallback logic
      const lowerMsg = userMsg.toLowerCase();
      let fallback = FALLBACK_ANSWERS.default;
      if (lowerMsg.includes('quality') || lowerMsg.includes('qe')) fallback = FALLBACK_ANSWERS['quality engineering'];
      else if (lowerMsg.includes('auto')) fallback = FALLBACK_ANSWERS.automation;
      else if (lowerMsg.includes('cloud') || lowerMsg.includes('azure') || lowerMsg.includes('aws')) fallback = FALLBACK_ANSWERS.cloud;

      setMessages(prev => [...prev, { role: 'model', text: fallback }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 50, scale: 0.8 }}
            className="mb-6 w-[380px] h-[550px] glass-card rounded-[32px] flex flex-col shadow-2xl overflow-hidden border-brand-accent/20"
          >
            {/* Header */}
            <div className="bg-brand-accent p-6 text-white flex justify-between items-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12 pointer-events-none text-white">
                <Sparkles size={100} />
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
                  <Bot size={22} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold">Portfolio AI</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-[10px] opacity-70 uppercase tracking-widest font-bold">Online</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50 dark:bg-transparent">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.role === 'user' ? 'bg-brand-accent text-white' : 'bg-gray-200 dark:bg-white/10'
                    }`}>
                      {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                    </div>
                    <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                      msg.role === 'user' 
                        ? 'bg-brand-accent text-white rounded-tr-none' 
                        : 'bg-white dark:bg-white/5 dark:text-gray-200 rounded-tl-none border border-gray-100 dark:border-white/10'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-3 items-center text-gray-400">
                    <Loader2 size={18} className="animate-spin" />
                    <span className="text-xs font-mono">Synthesizing response...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t dark:border-white/10 bg-white dark:bg-brand-secondary">
              <div className="flex gap-2 p-2 bg-gray-50 dark:bg-white/5 rounded-2xl">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about my AI strategies..."
                  className="flex-1 bg-transparent border-none outline-none px-4 py-2 text-sm"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading}
                   className="p-2 bg-brand-accent hover:opacity-90 disabled:opacity-50 text-white rounded-xl transition-all shadow-lg shadow-brand-accent/20"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-brand-accent rounded-full flex items-center justify-center text-white shadow-2xl shadow-brand-accent/40 relative group"
      >
        <div className="absolute inset-0 rounded-full bg-brand-accent animate-ping opacity-20" />
        <MessageSquare size={28} className="group-hover:rotate-12 transition-transform" />
      </motion.button>
    </div>
  );
}
