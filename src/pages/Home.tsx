import React from 'react';
import { useApp } from '../context';
import { TRANSLATIONS, DATASETS, DEPARTMENTS } from '../constants';
import { 
  Search, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  Star, 
  Info,
  ChevronRight,
  Database,
  FileText,
  Map as MapIcon
} from 'lucide-react';
import { cn, formatDate } from '../utils';
import { motion } from 'motion/react';

const Home: React.FC = () => {
  const { language, theme, setActivePage, setSelectedDatasetId } = useApp();
  const t = TRANSLATIONS[language];

  const recentActivity = [
    { id: '1', type: 'view', datasetId: '1', time: '2024-03-01T10:30:00Z' },
    { id: '2', type: 'upload', datasetId: '4', time: '2024-02-28T15:45:00Z' },
    { id: '3', type: 'view', datasetId: '2', time: '2024-02-28T09:00:00Z' },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-12">
      {/* Hero / AI Search */}
      <section className="text-center space-y-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h1 className={cn(
            "text-5xl font-bold tracking-tight",
            theme === 'dark' ? "text-white" : "text-black"
          )}>
            {t.findCityData}
          </h1>
          <p className="text-lg opacity-60 max-w-2xl mx-auto">
            {t.citipediaConnects}
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className={cn(
            "relative max-w-3xl mx-auto p-2 rounded-2xl border shadow-2xl transition-all duration-300",
            theme === 'dark' 
              ? "bg-[#121214] border-white/10 focus-within:border-cyan-500/50 shadow-cyan-500/5" 
              : "bg-white border-black/5 focus-within:border-cyan-500/50 shadow-black/5"
          )}
        >
          <div className="flex items-center gap-4 px-4">
            <Sparkles className="text-cyan-500 shrink-0" size={24} />
            <input 
              type="text" 
              placeholder={t.searchPlaceholder}
              className="flex-1 bg-transparent border-none outline-none text-lg py-4 placeholder:opacity-30"
            />
            <button className="bg-cyan-500 hover:bg-cyan-600 text-white p-3 rounded-xl transition-colors">
              <ArrowRight size={20} />
            </button>
          </div>
          
          <div className="flex items-center gap-2 px-4 pb-2 pt-1 overflow-x-auto no-scrollbar">
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-40 mr-2 shrink-0">{t.suggestions}:</span>
            {[t.populationDensity, t.transportReports, t.aqiSensors, t.buildingPermits].map((s) => (
              <button key={s} className="px-3 py-1 rounded-full bg-inherit border border-inherit text-xs hover:bg-white/5 transition-colors shrink-0">
                {s}
              </button>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Catalog Browser Card */}
        <motion.div 
          whileHover={{ y: -4 }}
          onClick={() => setActivePage('catalog')}
          className={cn(
            "p-6 rounded-2xl border cursor-pointer group transition-all",
            theme === 'dark' ? "bg-[#121214] border-white/10 hover:border-cyan-500/30" : "bg-white border-black/5 hover:border-cyan-500/30"
          )}
        >
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-500 mb-4 group-hover:scale-110 transition-transform">
            <Database size={24} />
          </div>
          <h3 className={cn("text-lg font-bold mb-2", theme === 'dark' ? "text-white" : "text-black")}>{t.catalog}</h3>
          <p className="text-sm opacity-50 mb-4">{language === 'en' ? 'Browse structured city data hierarchy by department and category.' : 'Просматривайте структурированную иерархию городских данных по управлениям и категориям.'}</p>
          <div className="flex items-center text-xs font-bold text-cyan-500">
            {t.exploreCatalog} <ChevronRight size={14} className="ml-1" />
          </div>
        </motion.div>

        {/* GeoAnalytics Card */}
        <motion.div 
          whileHover={{ y: -4 }}
          onClick={() => window.open('https://rcp.qala-ai.com/login', '_blank')}
          className={cn(
            "p-6 rounded-2xl border cursor-pointer group transition-all",
            theme === 'dark' ? "bg-[#121214] border-white/10 hover:border-purple-500/30" : "bg-white border-black/5 hover:border-purple-500/30"
          )}
        >
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 mb-4 group-hover:scale-110 transition-transform">
            <MapIcon size={24} />
          </div>
          <h3 className={cn("text-lg font-bold mb-2", theme === 'dark' ? "text-white" : "text-black")}>{t.geoAnalytics}</h3>
          <p className="text-sm opacity-50 mb-4">{t.analyzeSpatial}</p>
          <div className="flex items-center text-xs font-bold text-purple-500">
            {t.openMap} <ChevronRight size={14} className="ml-1" />
          </div>
        </motion.div>

        {/* Documents Card */}
        <motion.div 
          whileHover={{ y: -4 }}
          onClick={() => setActivePage('docs')}
          className={cn(
            "p-6 rounded-2xl border cursor-pointer group transition-all",
            theme === 'dark' ? "bg-[#121214] border-white/10 hover:border-emerald-500/30" : "bg-white border-black/5 hover:border-emerald-500/30"
          )}
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4 group-hover:scale-110 transition-transform">
            <FileText size={24} />
          </div>
          <h3 className={cn("text-lg font-bold mb-2", theme === 'dark' ? "text-white" : "text-black")}>{t.documents}</h3>
          <p className="text-sm opacity-50 mb-4">{t.generateAnalytical}</p>
          <div className="flex items-center text-xs font-bold text-emerald-500">
            {t.createReport} <ChevronRight size={14} className="ml-1" />
          </div>
        </motion.div>
      </div>

      {/* Recent Activity & Pinned */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className={cn("text-xl font-bold flex items-center gap-2", theme === 'dark' ? "text-white" : "text-black")}>
              <Clock size={20} className="text-cyan-500" />
              {t.recentActivity}
            </h2>
            <button className="text-xs font-bold text-cyan-500 hover:underline">{t.viewAll}</button>
          </div>
          <div className="space-y-2">
            {recentActivity.map((activity) => {
              const dataset = DATASETS.find(d => d.id === activity.datasetId);
              if (!dataset) return null;
              return (
                <div 
                  key={activity.id}
                  onClick={() => {
                    setSelectedDatasetId(dataset.id);
                    setActivePage('passport');
                  }}
                  className={cn(
                    "p-4 rounded-xl border flex items-center gap-4 cursor-pointer transition-all",
                    theme === 'dark' ? "bg-[#121214] border-white/10 hover:bg-white/5" : "bg-white border-black/5 hover:bg-black/5"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    activity.type === 'view' ? "bg-blue-500/10 text-blue-500" : "bg-emerald-500/10 text-emerald-500"
                  )}>
                    {activity.type === 'view' ? <Clock size={18} /> : <ArrowRight size={18} className="-rotate-45" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={cn("text-sm font-bold truncate", theme === 'dark' ? "text-white" : "text-black")}>
                      {dataset.name[language]}
                    </div>
                    <div className="text-[10px] opacity-50 uppercase tracking-wider">
                      {DEPARTMENTS.find(dept => dept.id === dataset.departmentId)?.name[language]} • {formatDate(activity.time, language)}
                    </div>
                  </div>
                  <ChevronRight size={16} className="opacity-30" />
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className={cn("text-xl font-bold flex items-center gap-2", theme === 'dark' ? "text-white" : "text-black")}>
              <Star size={20} className="text-yellow-500" />
              {t.pinned}
            </h2>
            <button className="text-xs font-bold text-cyan-500 hover:underline">{t.manage}</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {DATASETS.slice(0, 2).map((dataset) => (
              <div 
                key={dataset.id}
                onClick={() => {
                  setSelectedDatasetId(dataset.id);
                  setActivePage('passport');
                }}
                className={cn(
                  "p-4 rounded-xl border space-y-3 cursor-pointer transition-all",
                  theme === 'dark' ? "bg-[#121214] border-white/10 hover:bg-white/5" : "bg-white border-black/5 hover:bg-black/5"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-500 text-[10px] font-bold uppercase tracking-wider">
                    {dataset.format}
                  </span>
                  <Star size={14} className="text-yellow-500 fill-yellow-500" />
                </div>
                <div className={cn("text-sm font-bold line-clamp-2", theme === 'dark' ? "text-white" : "text-black")}>
                  {dataset.name[language]}
                </div>
                <div className="flex items-center justify-between text-[10px] opacity-50">
                  <span>{DEPARTMENTS.find(dept => dept.id === dataset.departmentId)?.name[language]}</span>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                    <span>{dataset.qualityScore}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Announcement */}
          <div className={cn(
            "p-4 rounded-xl border border-cyan-500/20 bg-cyan-500/5 flex gap-4",
          )}>
            <Info size={20} className="text-cyan-500 shrink-0" />
            <div className="space-y-1">
              <div className={cn("text-xs font-bold", theme === 'dark' ? "text-white" : "text-black")}>{t.platformUpdate}</div>
              <p className="text-[10px] opacity-70">{t.newDatasetsAdded}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
