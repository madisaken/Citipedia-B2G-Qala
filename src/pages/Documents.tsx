import React, { useState } from 'react';
import { useApp } from '../context';
import { TRANSLATIONS } from '../constants';
import { 
  Plus, 
  FileText, 
  Layout, 
  Sparkles, 
  Save, 
  Download, 
  Share2, 
  MoreVertical, 
  Type, 
  Image as ImageIcon, 
  Table as TableIcon, 
  Map as MapIcon, 
  ChevronRight, 
  Clock, 
  Search,
  LineChart,
  ShieldCheck as ShieldCheckIcon
} from 'lucide-react';
import { cn } from '../utils';
import { motion } from 'motion/react';

const Documents: React.FC = () => {
  const { language, theme } = useApp();
  const t = TRANSLATIONS[language];
  const [activeDoc, setActiveDoc] = useState<string | null>(null);

  const templates = [
    { id: '1', name: t.analyticalBrief, icon: FileText, color: 'text-blue-500' },
    { id: '2', name: t.districtReport, icon: MapIcon, color: 'text-purple-500' },
    { id: '3', name: t.riskAssessment, icon: ShieldCheck, color: 'text-red-500' },
    { id: '4', name: t.budgetJustification, icon: Layout, color: 'text-emerald-500' },
  ];

  const recentDocs = [
    { id: 'd1', name: 'Astana Master Plan 2025 - Draft', updated: '2024-03-01', author: 'Alisher Y.' },
    { id: 'd2', name: 'Transport Infrastructure Audit Q1', updated: '2024-02-25', author: 'Sanzhar K.' },
    { id: 'd3', name: 'Housing Affordability Analysis', updated: '2024-02-20', author: 'Elena M.' },
  ];

  if (activeDoc) {
    return (
      <div className="h-full flex flex-col">
        {/* Editor Toolbar */}
        <div className={cn(
          "h-14 border-b flex items-center justify-between px-6",
          theme === 'dark' ? "bg-[#0A0A0B]" : "bg-white"
        )}>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setActiveDoc(null)}
              className="p-2 rounded-lg hover:bg-white/5 opacity-50"
            >
              <ChevronRight size={18} className="rotate-180" />
            </button>
            <div className="h-6 w-[1px] bg-inherit"></div>
            <h2 className="text-sm font-bold">Astana Master Plan 2025 - Draft</h2>
            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 text-[10px] font-bold uppercase">{t.draft}</span>
          </div>

          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-lg border border-inherit text-xs font-bold flex items-center gap-2 hover:bg-white/5 transition-all">
              <Save size={14} /> {t.save}
            </button>
            <button className="px-3 py-1.5 rounded-lg border border-inherit text-xs font-bold flex items-center gap-2 hover:bg-white/5 transition-all">
              <Share2 size={14} /> {t.share}
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-cyan-500 text-white text-xs font-bold flex items-center gap-2 hover:bg-cyan-600 transition-all">
              <Download size={14} /> {t.export}
            </button>
          </div>
        </div>

        {/* Editor Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Blocks Sidebar */}
          <div className={cn(
            "w-64 border-r p-6 space-y-8 overflow-y-auto",
            theme === 'dark' ? "bg-[#0A0A0B]" : "bg-[#F9F9F8]"
          )}>
            <div className="space-y-4">
              <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-40">{t.insertBlocks}</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: Type, label: t.text },
                  { icon: ImageIcon, label: t.image },
                  { icon: TableIcon, label: t.table },
                  { icon: MapIcon, label: t.map },
                  { icon: LineChart, label: t.chart },
                  { icon: Sparkles, label: t.aiBlock },
                ].map(b => (
                  <button key={b.label} className={cn(
                    "flex flex-col items-center justify-center p-3 rounded-xl border border-inherit gap-2 hover:bg-white/5 transition-all group",
                  )}>
                    <b.icon size={20} className="opacity-50 group-hover:opacity-100 group-hover:text-cyan-500" />
                    <span className="text-[10px] font-bold opacity-50 group-hover:opacity-100">{b.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-40">{t.aiAssistant}</h3>
              <div className={cn(
                "p-4 rounded-xl border border-cyan-500/20 bg-cyan-500/5 space-y-3",
              )}>
                <div className="flex items-center gap-2 text-cyan-500">
                  <Sparkles size={14} />
                  <span className="text-[10px] font-bold uppercase">{t.writingAssistant}</span>
                </div>
                <p className="text-[10px] opacity-70 leading-relaxed">
                  {t.aiWritingNote}
                </p>
                <button className="w-full py-2 rounded-lg bg-cyan-500 text-white text-[10px] font-bold">{t.generateNarrative}</button>
              </div>
            </div>
          </div>

          {/* Main Canvas */}
          <div className="flex-1 overflow-y-auto p-12 bg-inherit">
            <div className={cn(
              "max-w-3xl mx-auto min-h-full p-16 shadow-2xl rounded-sm",
              theme === 'dark' ? "bg-[#121214] text-white/90" : "bg-white text-black/90"
            )}>
              <h1 className="text-4xl font-bold mb-8">Astana Master Plan 2025</h1>
              <div className="flex items-center gap-4 mb-12 opacity-50 text-sm">
                <span>{t.authorName}</span>
                <span>•</span>
                <span>{t.dateLabel}</span>
              </div>
              
              <div className="space-y-8">
                <p className="text-lg leading-relaxed">
                  {language === 'en' 
                    ? 'This report outlines the strategic development goals for Astana City for the period 2024-2025, focusing on sustainable urban growth, transport efficiency, and environmental resilience.'
                    : 'В данном отчете изложены стратегические цели развития города Астаны на период 2024-2025 годов, ориентированные на устойчивый городской рост, эффективность транспорта и экологическую устойчивость.'}
                </p>
                
                <div className={cn(
                  "p-8 rounded-2xl border border-dashed border-inherit flex flex-col items-center justify-center gap-4 opacity-30",
                )}>
                  <Plus size={32} />
                  <span className="text-sm font-bold">{t.dragBlocksNote}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-12">
      <div className="flex items-center justify-between">
        <h1 className={cn("text-3xl font-bold", theme === 'dark' ? "text-white" : "text-black")}>
          {t.documentsTitle}
        </h1>
        <button 
          onClick={() => setActiveDoc('new')}
          className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white flex items-center gap-2 text-sm font-bold shadow-lg shadow-cyan-500/20 transition-all"
        >
          <Plus size={18} /> {t.newDocument}
        </button>
      </div>

      <section className="space-y-6">
        <h2 className="text-sm font-bold uppercase tracking-widest opacity-40">{t.startWithTemplate}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {templates.map(template => (
            <motion.div 
              key={template.id}
              whileHover={{ y: -4 }}
              onClick={() => setActiveDoc(template.id)}
              className={cn(
                "p-6 rounded-2xl border cursor-pointer group transition-all",
                theme === 'dark' ? "bg-[#121214] border-white/10 hover:border-cyan-500/30" : "bg-white border-black/5 hover:border-cyan-500/30"
              )}
            >
              <div className={cn("w-12 h-12 rounded-xl bg-inherit border border-inherit flex items-center justify-center mb-4 group-hover:scale-110 transition-transform", template.color)}>
                <template.icon size={24} />
              </div>
              <h3 className={cn("text-sm font-bold", theme === 'dark' ? "text-white" : "text-black")}>{template.name}</h3>
              <p className="text-[10px] opacity-40 mt-1">{t.aiTemplateNote}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-widest opacity-40">{t.recentDocuments}</h2>
          <div className={cn(
            "relative flex items-center rounded-lg px-3 py-1.5 border",
            theme === 'dark' ? "bg-white/5 border-white/10" : "bg-black/5 border-black/5"
          )}>
            <Search size={14} className="opacity-40 mr-2" />
            <input type="text" placeholder={t.searchDocuments} className="bg-transparent border-none outline-none text-xs w-48" />
          </div>
        </div>

        <div className="space-y-2">
          {recentDocs.map(doc => (
            <div 
              key={doc.id}
              onClick={() => setActiveDoc(doc.id)}
              className={cn(
                "p-4 rounded-xl border flex items-center gap-4 cursor-pointer transition-all group",
                theme === 'dark' ? "bg-[#121214] border-white/10 hover:bg-white/5" : "bg-white border-black/5 hover:bg-black/5"
              )}
            >
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                <FileText size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <div className={cn("text-sm font-bold truncate", theme === 'dark' ? "text-white" : "text-black")}>{doc.name}</div>
                <div className="text-[10px] opacity-40 uppercase tracking-wider">Updated {doc.updated} • By {doc.author}</div>
              </div>
              <div className="flex items-center gap-4">
                <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 text-[10px] font-bold uppercase">{t.draft}</span>
                <button className="p-2 rounded-lg hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-all">
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

// Mock ShieldCheck for templates
const ShieldCheck = ({ size, className }: { size: number, className?: string }) => <FileText size={size} className={className} />;

export default Documents;
