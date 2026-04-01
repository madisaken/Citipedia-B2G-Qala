import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context';
import { TRANSLATIONS, DATASETS } from '../constants';
import { 
  Search, 
  Sparkles, 
  Layers, 
  MousePointer2, 
  Square, 
  Circle, 
  Filter, 
  ChevronRight, 
  Send,
  Maximize2,
  Minimize2,
  Settings,
  Info,
  History,
  Download,
  Share2,
  Plus,
  X
} from 'lucide-react';
import { cn } from '../utils';
import { motion, AnimatePresence } from 'motion/react';

const GeoAnalytics: React.FC = () => {
  const { language, theme } = useApp();
  const t = TRANSLATIONS[language];
  const [isCopilotOpen, setIsCopilotOpen] = useState(true);
  const [activeLayers, setActiveLayers] = useState<string[]>(['1']);
  const [chatMessages, setChatMessages] = useState([
    { role: 'ai', text: language === 'en' ? 'Hello! I am your urban data copilot. How can I help you analyze Astana today?' : 'Здравствуйте! Я ваш ИИ-копилот по городским данным. Чем я могу помочь вам в анализе Астаны сегодня?' }
  ]);
  const [inputValue, setInputValue] = useState('');

  const mapRef = useRef<HTMLDivElement>(null);

  const toggleLayer = (id: string) => {
    setActiveLayers(prev => prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    setChatMessages(prev => [...prev, { role: 'user', text: inputValue }]);
    setInputValue('');
    
    // Mock AI Response
    setTimeout(() => {
      setChatMessages(prev => [...prev, { 
        role: 'ai', 
        text: language === 'en' 
          ? `I've analyzed the population density and found that Medeu district has the highest growth rate. I've highlighted the affected areas on the map.` 
          : `Я проанализировал плотность населения и обнаружил, что в Медеуском районе самый высокий темп роста. Я выделил затронутые области на карте.` 
      }]);
    }, 1000);
  };

  return (
    <div className="h-full flex relative overflow-hidden">
      {/* Map Canvas */}
      <div className="flex-1 relative bg-[#121214]">
        <div className="absolute inset-0 opacity-60 pointer-events-none">
          <img 
            src="https://picsum.photos/seed/astana-map/1920/1080" 
            alt="Astana Map" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Map Overlays (Mock Data) */}
        <div className="absolute inset-0 pointer-events-none">
          {activeLayers.includes('1') && (
            <div className="absolute inset-0 bg-cyan-500/10 mix-blend-overlay"></div>
          )}
          {/* Mock Heatmap Points */}
          <div className="absolute top-1/3 left-1/2 w-32 h-32 bg-cyan-500/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        {/* Map Controls */}
        <div className="absolute top-6 left-6 flex flex-col gap-2 z-10">
          <div className={cn(
            "p-1 rounded-xl border flex flex-col gap-1 shadow-2xl backdrop-blur-md",
            theme === 'dark' ? "bg-[#121214]/80 border-white/10" : "bg-white/80 border-black/5"
          )}>
            <button className="p-2 rounded-lg hover:bg-white/10 transition-colors text-cyan-500"><MousePointer2 size={20} /></button>
            <button className="p-2 rounded-lg hover:bg-white/10 transition-colors opacity-50"><Square size={20} /></button>
            <button className="p-2 rounded-lg hover:bg-white/10 transition-colors opacity-50"><Circle size={20} /></button>
            <div className="h-[1px] bg-inherit mx-2"></div>
            <button className="p-2 rounded-lg hover:bg-white/10 transition-colors opacity-50"><Maximize2 size={20} /></button>
          </div>
        </div>

        {/* Layer Panel */}
        <div className="absolute bottom-6 left-6 z-10">
          <div className={cn(
            "p-4 rounded-2xl border shadow-2xl backdrop-blur-md w-64 space-y-4",
            theme === 'dark' ? "bg-[#121214]/80 border-white/10" : "bg-white/80 border-black/5"
          )}>
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-widest opacity-50 flex items-center gap-2">
                <Layers size={14} /> Layers
              </h3>
              <button className="p-1 rounded hover:bg-white/10"><Plus size={14} /></button>
            </div>
            <div className="space-y-2">
              {DATASETS.slice(0, 3).map(d => (
                <button 
                  key={d.id}
                  onClick={() => toggleLayer(d.id)}
                  className={cn(
                    "w-full flex items-center justify-between p-2 rounded-lg text-xs transition-all",
                    activeLayers.includes(d.id) 
                      ? "bg-cyan-500/10 text-cyan-500 border border-cyan-500/30" 
                      : "hover:bg-white/5 opacity-60"
                  )}
                >
                  <span className="truncate">{d.name[language]}</span>
                  <div className={cn(
                    "w-3 h-3 rounded-full border border-inherit",
                    activeLayers.includes(d.id) ? "bg-cyan-500" : ""
                  )}></div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Map Legend / Stats */}
        <div className="absolute top-6 right-6 z-10 flex flex-col gap-4">
          <div className={cn(
            "p-4 rounded-2xl border shadow-2xl backdrop-blur-md w-48 space-y-3",
            theme === 'dark' ? "bg-[#121214]/80 border-white/10" : "bg-white/80 border-black/5"
          )}>
            <div className="text-[10px] font-bold uppercase tracking-widest opacity-50">Composite Index</div>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-emerald-500">8.4</span>
              <span className="text-[10px] opacity-50 pb-1">/ 10.0</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="opacity-50">Resilience</span>
                <span className="font-bold">7.2</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: '72%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Copilot Panel */}
      <motion.aside
        initial={false}
        animate={{ width: isCopilotOpen ? 400 : 0 }}
        className={cn(
          "h-full border-l flex flex-col transition-all duration-300 relative",
          theme === 'dark' ? "bg-[#0A0A0B] border-white/10" : "bg-[#F9F9F8] border-black/5"
        )}
      >
        <button 
          onClick={() => setIsCopilotOpen(!isCopilotOpen)}
          className={cn(
            "absolute top-1/2 -left-4 -translate-y-1/2 w-8 h-8 rounded-full border flex items-center justify-center shadow-xl z-20 transition-colors",
            theme === 'dark' ? "bg-[#121214] border-white/10 hover:bg-white/10" : "bg-white border-black/5 hover:bg-black/5"
          )}
        >
          {isCopilotOpen ? <ChevronRight size={16} /> : <Sparkles size={16} className="text-cyan-500" />}
        </button>

        <div className="flex-1 flex flex-col min-w-[400px]">
          <div className="p-6 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-500">
                <Sparkles size={18} />
              </div>
              <h2 className="font-bold">{t.aiCopilot}</h2>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg hover:bg-white/5 opacity-50"><History size={16} /></button>
              <button className="p-2 rounded-lg hover:bg-white/5 opacity-50"><Settings size={16} /></button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {chatMessages.map((msg, i) => (
              <div key={i} className={cn(
                "flex gap-3",
                msg.role === 'user' ? "flex-row-reverse" : ""
              )}>
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                  msg.role === 'ai' ? "bg-cyan-500/10 text-cyan-500" : "bg-white/10 text-white"
                )}>
                  {msg.role === 'ai' ? <Sparkles size={16} /> : <div className="text-[10px] font-bold">AZ</div>}
                </div>
                <div className={cn(
                  "p-4 rounded-2xl text-sm leading-relaxed",
                  msg.role === 'ai' 
                    ? (theme === 'dark' ? "bg-white/5" : "bg-black/5")
                    : "bg-cyan-500 text-white"
                )}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 border-t">
            <div className={cn(
              "relative flex items-center rounded-2xl border px-4 py-2 transition-all",
              theme === 'dark' ? "bg-white/5 border-white/10 focus-within:border-cyan-500/50" : "bg-black/5 border-black/5 focus-within:border-cyan-500/50"
            )}>
              <textarea 
                placeholder={t.searchPlaceholder}
                rows={1}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                className="flex-1 bg-transparent border-none outline-none text-sm py-2 resize-none no-scrollbar"
              />
              <button 
                onClick={handleSendMessage}
                className="p-2 rounded-xl bg-cyan-500 text-white hover:bg-cyan-600 transition-colors ml-2"
              >
                <Send size={16} />
              </button>
            </div>
            <div className="flex items-center gap-2 mt-3 opacity-40 text-[10px] font-bold uppercase tracking-widest px-1">
              <Info size={10} /> AI can make mistakes. Verify critical data.
            </div>
          </div>
        </div>
      </motion.aside>
    </div>
  );
};

export default GeoAnalytics;
