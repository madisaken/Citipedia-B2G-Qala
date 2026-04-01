import React, { useState } from 'react';
import { useApp } from '../context';
import { TRANSLATIONS, DATASETS, DEPARTMENTS, DOMAINS } from '../constants';
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  ShieldCheck, 
  Clock, 
  Database, 
  Info,
  Table,
  Map as MapIcon,
  History,
  Users,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  Star,
  Lock,
  Unlock,
  FileCode,
  Globe,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ArrowRight,
  User,
  Shield,
  MessageSquare,
  Zap,
  Cpu,
  UserCheck,
  Award
} from 'lucide-react';
import { cn, formatDate, getFormatBadgeClass } from '../utils';
import { motion, AnimatePresence } from 'motion/react';
import { RoleBadge } from '../components/RoleBadge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const Passport: React.FC = () => {
  const { language, theme, setActivePage, selectedDatasetId, user } = useApp();
  const t = TRANSLATIONS[language];
  const [activeTab, setActiveTab] = useState<'overview' | 'metadata' | 'quality' | 'lineage' | 'preview' | 'access' | 'activity'>('overview');

  const dataset = DATASETS.find(d => d.id === selectedDatasetId) || DATASETS.find(d => d.id === '10.1') || DATASETS[0];
  const domain = DOMAINS.find(d => d.id === dataset.domainId);
  const category = domain?.categories.find(c => c.id === dataset.categoryId);
  const department = DEPARTMENTS.find(dept => dept.id === dataset.departmentId);

  const qualityData = [
    { name: t.completeness, score: dataset.qualityScore },
    { name: t.accuracy, score: dataset.qualityScore - 5 },
    { name: t.timeliness, score: 100 },
    { name: t.consistency, score: dataset.qualityScore - 2 },
  ];

  const tabs = [
    { id: 'overview', label: t.overview, icon: Info },
    { id: 'metadata', label: t.metadata, icon: Database },
    { id: 'quality', label: t.quality, icon: ShieldCheck },
    { id: 'lineage', label: t.lineage, icon: History },
    { id: 'access', label: t.access, icon: Users },
    { id: 'activity', label: t.activity, icon: Clock },
  ];

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className={cn(
        "p-6 border-b space-y-4 shrink-0",
        theme === 'dark' ? "bg-[#0A0A0B] border-white/10" : "bg-white border-black/5"
      )}>
        <div className="flex flex-col gap-2">
          <button 
            onClick={() => setActivePage('catalog')}
            className="flex items-center gap-2 text-xs font-bold opacity-50 hover:opacity-100 transition-opacity w-fit"
          >
            <ArrowLeft size={14} /> {t.backToCatalog}
          </button>
          
          <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider opacity-40">
            <button onClick={() => setActivePage('catalog')} className="hover:text-cyan-500 transition-colors">{t.catalog}</button>
            <ChevronRight size={10} />
            <span className="hover:text-cyan-500 cursor-pointer">{domain?.name[language]}</span>
            <ChevronRight size={10} />
            <span className="hover:text-cyan-500 cursor-pointer">{category?.name[language]}</span>
            <ChevronRight size={10} />
            <span className="text-cyan-500/80">{dataset.name[language]}</span>
          </nav>
        </div>

        <div className="flex items-start justify-between gap-8">
          <div className="space-y-3 flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className={cn("text-3xl font-bold truncate", theme === 'dark' ? "text-white" : "text-black")}>
                {dataset.name[language]}
              </h1>
              <span className={cn(
                "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                dataset.status === 'active' ? "bg-emerald-500/10 text-emerald-500" : 
                dataset.status === 'archived' ? "bg-gray-500/10 text-gray-500" : "bg-amber-500/10 text-amber-500"
              )}>
                {dataset.status === 'active' ? (language === 'en' ? 'ACTIVE' : 'АКТИВЕН') : 
                 dataset.status === 'archived' ? (language === 'en' ? 'ARCHIVED' : 'АРХИВ') : 
                 (language === 'en' ? 'DRAFT' : 'ЧЕРНОВИК')}
              </span>
            </div>
            
            <div className="flex items-center gap-x-4 gap-y-2 text-[11px] font-medium opacity-60 flex-wrap">
              <span className="flex items-center gap-1.5"><Globe size={14} className="text-cyan-500" /> {department?.name[language]}</span>
              <span className="flex items-center gap-1.5"><Clock size={14} className="text-cyan-500" /> {t.updated}: {formatDate(dataset.lastUpdated, language)}</span>
              <span className="flex items-center gap-1.5"><RefreshCw size={14} className="text-cyan-500" /> {t[dataset.frequency.toLowerCase() as keyof typeof t] || dataset.frequency}</span>
              <span className="flex items-center gap-1.5"><MapIcon size={14} className="text-cyan-500" /> GIS ({dataset.format})</span>
              <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-cyan-500" /> {dataset.qualityScore}% {t.quality}</span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-3 shrink-0">
            <div className="flex items-center gap-4 mb-1">
              <div className="flex flex-col items-end">
                <span className="text-xs font-bold">{user.name}</span>
                <RoleBadge role={user.userRole} />
              </div>
              <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full border border-white/10" />
            </div>

            <div className="flex items-center gap-2">
              {user.userRole === 'steward' && (
                <button className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white flex items-center gap-2 text-sm font-bold shadow-lg shadow-amber-500/20 transition-all">
                  <Shield size={16} /> {language === 'ru' ? 'Управление' : 'Manage'}
                </button>
              )}
              {user.userRole === 'owner' && dataset.ownerName === user.name && (
                <button className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white flex items-center gap-2 text-sm font-bold shadow-lg shadow-cyan-500/20 transition-all">
                  <FileText size={16} /> {language === 'ru' ? 'Редактировать' : 'Edit'}
                </button>
              )}
              <button className={cn(
                "p-2 rounded-lg border transition-all",
                theme === 'dark' ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-black/5 border-black/5 hover:bg-black/10"
              )}>
                <Star size={18} className="text-yellow-500" />
              </button>
              <button className={cn(
                "px-4 py-2 rounded-lg border flex items-center gap-2 text-sm font-bold transition-all",
                theme === 'dark' ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-black/5 border-black/5 hover:bg-black/10"
              )}>
                <Share2 size={16} /> {t.share}
              </button>
              {dataset.access === 'Open' ? (
                <button className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white flex items-center gap-2 text-sm font-bold shadow-lg shadow-cyan-500/20 transition-all">
                  <Download size={16} /> {t.download}
                </button>
              ) : (
                <button className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white flex items-center gap-2 text-sm font-bold shadow-lg shadow-cyan-500/20 transition-all">
                  <AlertCircle size={16} /> {t.requestAccess}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pt-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap",
                activeTab === tab.id 
                  ? (theme === 'dark' ? "bg-white/10 text-white" : "bg-black/5 text-black")
                  : "opacity-40 hover:opacity-100"
              )}
            >
              <tab.icon size={14} /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div 
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              <div className="lg:col-span-2 space-y-8">
                <section className="space-y-4">
                  <h3 className={cn("text-lg font-bold", theme === 'dark' ? "text-white" : "text-black")}>{t.description}</h3>
                  <p className="text-sm opacity-70 leading-relaxed">
                    {dataset.description[language]}
                  </p>
                </section>

                <section className="space-y-4">
                  <h3 className={cn("text-lg font-bold", theme === 'dark' ? "text-white" : "text-black")}>{t.coverageArea}</h3>
                  <div className={cn(
                    "aspect-video rounded-2xl border relative overflow-hidden",
                    theme === 'dark' ? "bg-[#121214] border-white/10" : "bg-white border-black/5"
                  )}>
                    {/* Mock Map for Astana */}
                    <div className="absolute inset-0 opacity-40 grayscale pointer-events-none">
                      <img 
                        src="https://picsum.photos/seed/astana-map/1200/800" 
                        alt="Astana Map" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="px-4 py-2 rounded-full bg-cyan-500/20 border border-cyan-500/50 text-cyan-500 text-xs font-bold backdrop-blur-sm shadow-xl">
                        {language === 'en' ? 'Astana City Boundary' : 'Граница города Астана'}
                      </div>
                    </div>
                    {/* District labels overlay */}
                    <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                      {['Есиль', 'Алматы', 'Сарыарка', 'Байконыр', 'Нұра'].map(d => (
                        <span key={d} className="px-2 py-1 rounded bg-black/50 text-[10px] text-white/80 backdrop-blur-sm border border-white/10">
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                </section>

                <section className="space-y-4">
                  <h3 className={cn("text-lg font-bold", theme === 'dark' ? "text-white" : "text-black")}>{t.keyAttributes}</h3>
                  <div className={cn(
                    "rounded-xl border overflow-hidden",
                    theme === 'dark' ? "bg-[#121214] border-white/10" : "bg-white border-black/5"
                  )}>
                    <table className="w-full text-left text-xs">
                      <thead className={cn(
                        "border-b text-[10px] font-bold uppercase tracking-widest opacity-40",
                        theme === 'dark' ? "bg-white/5 border-white/10" : "bg-black/5 border-black/5"
                      )}>
                        <tr>
                          <th className="px-4 py-3">{t.field}</th>
                          <th className="px-4 py-3">{t.type}</th>
                          <th className="px-4 py-3">{t.description}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-inherit">
                        {(dataset.schema?.slice(0, 6) || []).map((field) => (
                          <tr key={field.id} className="hover:bg-white/5 transition-colors">
                            <td className="px-4 py-3 font-mono font-bold text-cyan-500">{field.name}</td>
                            <td className="px-4 py-3 opacity-60">{field.type}</td>
                            <td className="px-4 py-3 opacity-80">{field.description[language]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>

              <div className="space-y-6">
                {/* Community Rating Block */}
                <div className={cn(
                  "p-6 rounded-2xl border space-y-4",
                  theme === 'dark' ? "bg-[#121214] border-white/10" : "bg-white border-black/5"
                )}>
                  <div className="flex items-center justify-between">
                    <h3 className={cn("text-sm font-bold uppercase tracking-wider opacity-40", theme === 'dark' ? "text-white" : "text-black")}>{t.communityRating}</h3>
                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star size={14} fill="currentColor" />
                      <span>{dataset.userRating || '4.8'}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="opacity-60">{t.userReviews}</span>
                      <span className="font-bold">{dataset.userReviewsCount || 0}</span>
                    </div>
                    <div className="flex -space-x-2 overflow-hidden">
                      {[1, 2, 3, 4].map(i => (
                        <img 
                          key={i}
                          className="inline-block h-6 w-6 rounded-full ring-2 ring-white/10"
                          src={`https://i.pravatar.cc/150?u=${i + 10}`}
                          alt=""
                        />
                      ))}
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-white/5 text-[8px] font-bold ring-2 ring-white/10">+12</div>
                    </div>
                    <button className="w-full py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-wider hover:bg-white/10 transition-all">
                      {t.writeReview}
                    </button>
                  </div>
                </div>

                {/* Expert Assessment Block */}
                {dataset.expertAssessment && (
                  <div className={cn(
                    "p-6 rounded-2xl border space-y-4 relative overflow-hidden",
                    theme === 'dark' ? "bg-emerald-500/5 border-emerald-500/20" : "bg-emerald-50 border-emerald-500/20"
                  )}>
                    <div className="absolute top-0 right-0 p-2">
                      <Award size={24} className="text-emerald-500 opacity-20" />
                    </div>
                    <h3 className="text-sm font-bold text-emerald-500 uppercase tracking-wider">{t.expertAssessment}</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <UserCheck size={14} className="text-emerald-500" />
                        <span className="text-xs font-bold">{dataset.expertAssessment.expertName}</span>
                      </div>
                      <p className="text-[11px] opacity-70 italic leading-relaxed">
                        "{dataset.expertAssessment.comment[language]}"
                      </p>
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-[10px] opacity-40">{formatDate(dataset.expertAssessment.date, language)}</span>
                        <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">{t.verified}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className={cn(
                  "p-6 rounded-2xl border space-y-4",
                  theme === 'dark' ? "bg-[#121214] border-white/10" : "bg-white border-black/5"
                )}>
                  <h3 className={cn("text-sm font-bold uppercase tracking-wider opacity-40", theme === 'dark' ? "text-white" : "text-black")}>{t.details}</h3>
                  <div className="space-y-3">
                    {[
                      { label: t.owner, value: department?.name[language] },
                      { label: t.authorRole, value: dataset.ownerName || 'Admin' },
                      { label: t.steward, value: dataset.steward?.[language], subValue: dataset.steward?.role[language], isLink: true },
                      { label: t.format, value: dataset.format },
                      { label: t.volume, value: dataset.volume || '124 MB' },
                      { label: t.crs, value: dataset.crs || 'EPSG:4326' },
                      { label: t.source, value: dataset.source?.[language] },
                      { label: t.publishedDate, value: dataset.publishedDate ? formatDate(dataset.publishedDate, language) : '10.03.2024' },
                      { label: t.license, value: dataset.license?.[language] },
                    ].map((item, idx) => (
                      <div key={idx} className="flex flex-col gap-1 border-b border-inherit pb-2 last:border-0 last:pb-0">
                        <span className="text-[10px] opacity-50 uppercase tracking-wider">{item.label}</span>
                        <div className="flex flex-col">
                          <span className={cn("text-xs font-bold", item.isLink && "text-cyan-500 cursor-pointer hover:underline")}>
                            {item.value}
                          </span>
                          {item.subValue && <span className="text-[10px] opacity-40 italic">{item.subValue}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={cn(
                  "p-6 rounded-2xl border space-y-4",
                  theme === 'dark' ? "bg-[#121214] border-white/10" : "bg-white border-black/5"
                )}>
                  <h3 className={cn("text-sm font-bold uppercase tracking-wider opacity-40", theme === 'dark' ? "text-white" : "text-black")}>{t.tags}</h3>
                  <div className="flex flex-wrap gap-2">
                    {dataset.tags.map(tag => (
                      <button key={tag} className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-bold opacity-60 hover:opacity-100 hover:border-cyan-500/50 transition-all">
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className={cn("text-sm font-bold uppercase tracking-wider opacity-40", theme === 'dark' ? "text-white" : "text-black")}>{t.relatedDatasets}</h3>
                  <div className="space-y-3">
                    {DATASETS.filter(d => d.id !== dataset.id && d.domainId === dataset.domainId).slice(0, 3).map(related => (
                      <div 
                        key={related.id}
                        className={cn(
                          "p-3 rounded-xl border cursor-pointer group transition-all",
                          theme === 'dark' ? "bg-[#121214] border-white/10 hover:border-cyan-500/30" : "bg-white border-black/5 hover:border-cyan-500/30"
                        )}
                      >
                        <div className="text-xs font-bold mb-1 group-hover:text-cyan-500 transition-colors">{related.name[language]}</div>
                        <div className="flex items-center justify-between text-[10px] opacity-50">
                          <span>{DEPARTMENTS.find(dept => dept.id === related.departmentId)?.name[language]}</span>
                          <span className="text-cyan-500 font-bold">{related.qualityScore}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'quality' && (
            <motion.div 
              key="quality"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className={cn(
                  "lg:col-span-1 p-8 rounded-2xl border flex flex-col items-center justify-center text-center space-y-6",
                  theme === 'dark' ? "bg-[#121214] border-white/10" : "bg-white border-black/5"
                )}>
                  <h3 className="text-sm font-bold uppercase tracking-wider opacity-40">{t.overallQuality}</h3>
                  <div className="relative w-48 h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Score', value: dataset.qualityScore },
                            { name: 'Remaining', value: 100 - dataset.qualityScore },
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={0}
                          dataKey="value"
                          startAngle={90}
                          endAngle={-270}
                        >
                          <Cell fill="#06b6d4" />
                          <Cell fill={theme === 'dark' ? '#ffffff05' : '#00000005'} />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-bold text-cyan-500">{dataset.qualityScore}%</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">
                        {dataset.qualityScore >= 85 ? t.highQuality : dataset.qualityScore >= 60 ? t.mediumQuality : t.lowQuality}
                      </span>
                    </div>
                  </div>
                  
                  <div className="w-full grid grid-cols-2 gap-2 pt-2">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Cpu size={12} className="text-cyan-500" />
                        <span className="text-[8px] font-bold uppercase opacity-40">{t.machineScore}</span>
                      </div>
                      <div className="text-lg font-bold">92%</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-1.5 mb-1">
                        <UserCheck size={12} className="text-amber-500" />
                        <span className="text-[8px] font-bold uppercase opacity-40">{t.expertScore}</span>
                      </div>
                      <div className="text-lg font-bold">88%</div>
                    </div>
                  </div>

                  <p className="text-xs opacity-50 px-4">
                    {language === 'en' ? 'Based on 12 automated validation rules and manual stewardship review.' : 'На основе 12 автоматических правил валидации и ручной проверки.'}
                  </p>
                </div>

                <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                  {qualityData.map((item) => (
                    <div key={item.name} className={cn(
                      "p-6 rounded-2xl border space-y-3",
                      theme === 'dark' ? "bg-[#121214] border-white/10" : "bg-white border-black/5"
                    )}>
                      <div className="flex items-center justify-between">
                        <span className="text-xs opacity-50 font-bold uppercase tracking-wider">{item.name}</span>
                        <span className="text-lg font-bold text-cyan-500">{item.score}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-inherit rounded-full overflow-hidden border border-inherit">
                        <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${item.score}%` }}></div>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] opacity-40">
                        <CheckCircle2 size={12} className="text-emerald-500" />
                        {language === 'en' ? 'Last check: Today, 09:15' : 'Последняя проверка: Сегодня, 09:15'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className={cn("text-lg font-bold", theme === 'dark' ? "text-white" : "text-black")}>{t.validationDetails}</h3>
                <div className={cn(
                  "rounded-2xl border overflow-hidden",
                  theme === 'dark' ? "bg-[#121214] border-white/10" : "bg-white border-black/5"
                )}>
                  <table className="w-full text-left text-xs">
                    <thead className={cn(
                      "border-b text-[10px] font-bold uppercase tracking-widest opacity-40",
                      theme === 'dark' ? "bg-white/5 border-white/10" : "bg-black/5 border-black/5"
                    )}>
                      <tr>
                        <th className="px-6 py-4">{t.check}</th>
                        <th className="px-6 py-4">{t.result}</th>
                        <th className="px-6 py-4">{t.date}</th>
                        <th className="px-6 py-4">{t.details}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-inherit">
                      {[
                        { check: { ru: 'Проверка типов данных', en: 'Data Type Validation' }, result: 'passed', date: '2024-03-01', details: { ru: 'Все поля соответствуют схеме', en: 'All fields match schema' } },
                        { check: { ru: 'Проверка на пустые значения', en: 'Null Value Check' }, result: 'warning', date: '2024-03-01', details: { ru: 'Поле population_male имеет 6% пропусков', en: 'Field population_male has 6% nulls' } },
                        { check: { ru: 'Валидация геометрии', en: 'Geometry Validation' }, result: 'passed', date: '2024-03-01', details: { ru: 'Ошибок топологии не обнаружено', en: 'No topology errors found' } },
                        { check: { ru: 'Проверка уникальности ID', en: 'Unique ID Check' }, result: 'passed', date: '2024-03-01', details: { ru: 'Дубликаты отсутствуют', en: 'No duplicates found' } },
                      ].map((row, idx) => (
                        <tr key={idx} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 font-bold">{row.check[language]}</td>
                          <td className="px-6 py-4">
                            <span className={cn(
                              "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                              row.result === 'passed' ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                            )}>
                              {t[row.result as keyof typeof t] || row.result}
                            </span>
                          </td>
                          <td className="px-6 py-4 opacity-40">{formatDate(row.date, language)}</td>
                          <td className="px-6 py-4 opacity-70">{row.details[language]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
          {activeTab === 'metadata' && (
            <motion.div 
              key="metadata"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <h3 className={cn("text-lg font-bold", theme === 'dark' ? "text-white" : "text-black")}>{t.dataSchema}</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30" size={14} />
                  <input 
                    type="text" 
                    placeholder={language === 'en' ? "Search fields..." : "Поиск по полям..."}
                    className={cn(
                      "pl-9 pr-4 py-2 rounded-lg border text-xs outline-none focus:border-cyan-500/50 transition-all",
                      theme === 'dark' ? "bg-white/5 border-white/10" : "bg-black/5 border-black/5"
                    )}
                  />
                </div>
              </div>

              <div className={cn(
                "rounded-2xl border overflow-hidden",
                theme === 'dark' ? "bg-[#121214] border-white/10" : "bg-white border-black/5"
              )}>
                <table className="w-full text-left text-xs">
                  <thead className={cn(
                    "border-b text-[10px] font-bold uppercase tracking-widest opacity-40",
                    theme === 'dark' ? "bg-white/5 border-white/10" : "bg-black/5 border-black/5"
                  )}>
                    <tr>
                      <th className="px-6 py-4">#</th>
                      <th className="px-6 py-4">{t.field}</th>
                      <th className="px-6 py-4">{t.type}</th>
                      <th className="px-6 py-4">{t.description}</th>
                      <th className="px-6 py-4">{language === 'en' ? 'Source' : 'Источник'}</th>
                      <th className="px-6 py-4">{language === 'en' ? 'Fill' : 'Заполн.'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-inherit">
                    {(dataset.schema || []).map((field, idx) => (
                      <tr key={field.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 opacity-40">{idx + 1}</td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-mono font-bold text-cyan-500">{field.name}</span>
                            {field.required && <span className="text-[8px] text-amber-500 font-bold uppercase tracking-tighter">{language === 'en' ? 'Required' : 'Обязательно'}</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4 opacity-60">{field.type}</td>
                        <td className="px-6 py-4 opacity-80">{field.description[language]}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5">
                            {field.source === 'system' ? <Cpu size={12} className="text-purple-500" /> : <User size={12} className="text-cyan-500" />}
                            <span className="text-[10px] opacity-60">{field.source === 'system' ? (language === 'en' ? 'System' : 'Система') : (language === 'en' ? 'Manual' : 'Ручной')}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-12 h-1 bg-inherit rounded-full overflow-hidden border border-inherit">
                              <div className={cn(
                                "h-full rounded-full",
                                field.completeness && field.completeness > 90 ? "bg-emerald-500" : "bg-amber-500"
                              )} style={{ width: `${field.completeness || 0}%` }}></div>
                            </div>
                            <span className="text-[10px] opacity-60">{field.completeness || 0}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className={cn(
                  "p-6 rounded-2xl border space-y-4",
                  theme === 'dark' ? "bg-[#121214] border-white/10" : "bg-white border-black/5"
                )}>
                  <h3 className={cn("text-sm font-bold uppercase tracking-wider opacity-40", theme === 'dark' ? "text-white" : "text-black")}>{t.technicalDetails}</h3>
                  <div className="space-y-3">
                    {[
                      { label: language === 'en' ? 'File Format' : 'Формат файла', value: 'ESRI Shapefile (.shp, .dbf, .shx, .prj)' },
                      { label: language === 'en' ? 'Encoding' : 'Кодировка', value: 'UTF-8' },
                      { label: language === 'en' ? 'CRS' : 'Система координат', value: dataset.crs || 'EPSG:4326 (WGS 84)' },
                      { label: language === 'en' ? 'Geometry Type' : 'Тип геометрии', value: 'MultiPolygon' },
                      { label: language === 'en' ? 'Records Count' : 'Количество записей', value: dataset.statistics?.totalRecords || 8 },
                      { label: language === 'en' ? 'File Size' : 'Размер файла', value: dataset.volume || '124 MB' },
                      { label: 'API endpoint', value: '—' },
                      { label: language === 'en' ? 'Source System' : 'Исходная система', value: 'ГБД "Адресный регистр", Бюро нац. статистики' },
                    ].map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center border-b border-inherit pb-2 last:border-0 last:pb-0">
                        <span className="text-xs opacity-50">{item.label}</span>
                        <span className="text-xs font-bold">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={cn(
                  "p-6 rounded-2xl border space-y-4",
                  theme === 'dark' ? "bg-[#121214] border-white/10" : "bg-white border-black/5"
                )}>
                  <h3 className={cn("text-sm font-bold uppercase tracking-wider opacity-40", theme === 'dark' ? "text-white" : "text-black")}>{t.classifications}</h3>
                  <div className="space-y-3">
                    {[
                      { label: language === 'en' ? 'Domain' : 'Домен', value: domain?.name[language] },
                      { label: language === 'en' ? 'Category' : 'Категория', value: category?.name[language] },
                      { label: language === 'en' ? 'INSPIRE Topic' : 'Тематика INSPIRE', value: 'Statistical units, Population distribution' },
                      { label: language === 'en' ? 'ISO Standard' : 'Стандарт ISO', value: 'ISO 19115 (Metadata)' },
                    ].map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center border-b border-inherit pb-2 last:border-0 last:pb-0">
                        <span className="text-xs opacity-50">{item.label}</span>
                        <span className="text-xs font-bold">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'lineage' && (
            <motion.div 
              key="lineage"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className={cn(
                "p-8 rounded-2xl border relative overflow-hidden",
                theme === 'dark' ? "bg-[#121214] border-white/10" : "bg-white border-black/5"
              )}>
                <div className="flex items-center justify-between mb-12">
                  <h3 className="text-lg font-bold">{language === 'en' ? 'Data Flow Diagram' : 'Диаграмма потоков данных'}</h3>
                  <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-wider opacity-40">
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-500" /> {language === 'en' ? 'External' : 'Внешний'}</div>
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-cyan-500" /> {language === 'en' ? 'Internal' : 'Внутренний'}</div>
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-purple-500" /> {language === 'en' ? 'System' : 'Системный'}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between relative px-12">
                  {/* Upstream */}
                  <div className="space-y-4 z-10">
                    {(dataset.lineage?.sources || []).map((src, idx) => (
                      <div key={src.id} className={cn(
                        "p-3 rounded-xl border flex items-center gap-3 w-48 shadow-lg transition-all hover:scale-105",
                        theme === 'dark' ? "bg-[#1A1A1C] border-white/10" : "bg-gray-50 border-black/5"
                      )}>
                        <div className={cn(
                          "w-2 h-8 rounded-full shrink-0",
                          src.type === 'external' ? "bg-amber-500" : src.type === 'system' ? "bg-purple-500" : "bg-cyan-500"
                        )} />
                        <div className="min-w-0">
                          <div className="text-[10px] font-bold truncate">{src.name[language]}</div>
                          <div className="text-[8px] opacity-40 truncate">{src.owner[language]}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Lines (SVG) */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" preserveAspectRatio="none">
                    <path d="M 200 100 L 400 150" stroke="currentColor" fill="none" strokeWidth="1" />
                    <path d="M 200 200 L 400 150" stroke="currentColor" fill="none" strokeWidth="1" />
                    <path d="M 600 150 L 800 100" stroke="currentColor" fill="none" strokeWidth="1" />
                    <path d="M 600 150 L 800 180" stroke="currentColor" fill="none" strokeWidth="1" />
                    <path d="M 600 150 L 800 260" stroke="currentColor" fill="none" strokeWidth="1" />
                  </svg>

                  {/* Current Dataset */}
                  <div className={cn(
                    "p-6 rounded-2xl border-2 border-cyan-500 bg-cyan-500/5 shadow-[0_0_30px_rgba(6,182,212,0.2)] z-10 w-64 text-center",
                    theme === 'dark' ? "bg-[#1A1A1C]" : "bg-white"
                  )}>
                    <div className="text-xs font-bold text-cyan-500 mb-1 uppercase tracking-widest">{language === 'en' ? 'Current Asset' : 'Текущий актив'}</div>
                    <div className="text-sm font-bold">{dataset.name[language]}</div>
                    <div className="mt-4 pt-4 border-t border-cyan-500/20 flex justify-center gap-4">
                      <div className="text-center">
                        <div className="text-[8px] opacity-40 uppercase">{language === 'en' ? 'Format' : 'Формат'}</div>
                        <div className="text-[10px] font-bold">{dataset.format}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-[8px] opacity-40 uppercase">{language === 'en' ? 'Quality' : 'Качество'}</div>
                        <div className="text-[10px] font-bold text-emerald-500">{dataset.qualityScore}%</div>
                      </div>
                    </div>
                  </div>

                  {/* Downstream */}
                  <div className="space-y-4 z-10">
                    {(dataset.lineage?.consumers || []).map((cons, idx) => (
                      <div key={cons.id} className={cn(
                        "p-3 rounded-xl border flex items-center gap-3 w-48 shadow-lg transition-all hover:scale-105",
                        theme === 'dark' ? "bg-[#1A1A1C] border-white/10" : "bg-gray-50 border-black/5"
                      )}>
                        <div className="min-w-0 flex-1">
                          <div className="text-[10px] font-bold truncate">{cons.name[language]}</div>
                          <div className="text-[8px] opacity-40 truncate">{cons.owner[language]}</div>
                        </div>
                        <div className={cn(
                          "w-2 h-8 rounded-full shrink-0",
                          cons.type === 'analysis' ? "bg-indigo-500" : cons.type === 'report' ? "bg-emerald-500" : "bg-cyan-500"
                        )} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider opacity-40">{t.upstreamSources}</h3>
                  <div className={cn(
                    "rounded-xl border overflow-hidden",
                    theme === 'dark' ? "bg-[#121214] border-white/10" : "bg-white border-black/5"
                  )}>
                    <table className="w-full text-left text-[10px]">
                      <thead className="border-b opacity-40">
                        <tr>
                          <th className="px-4 py-2">{language === 'en' ? 'Source' : 'Источник'}</th>
                          <th className="px-4 py-2">{language === 'en' ? 'Method' : 'Метод'}</th>
                          <th className="px-4 py-2">{language === 'en' ? 'Freq.' : 'Частота'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-inherit">
                        {(dataset.lineage?.sources || []).map(src => (
                          <tr key={src.id}>
                            <td className="px-4 py-2 font-bold">{src.name[language]}</td>
                            <td className="px-4 py-2 opacity-60">{src.method?.[language]}</td>
                            <td className="px-4 py-2 opacity-60">{src.frequency?.[language]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider opacity-40">{t.historyTransformations}</h3>
                  <div className={cn(
                    "rounded-xl border overflow-hidden",
                    theme === 'dark' ? "bg-[#121214] border-white/10" : "bg-white border-black/5"
                  )}>
                    <div className="p-4 space-y-4">
                      {[
                        { date: '2024-03-01', action: { ru: 'Очистка и валидация', en: 'Cleaning & Validation' }, desc: { ru: 'Удаление дубликатов, проверка геометрии', en: 'Duplicate removal, geometry check' } },
                        { date: '2024-02-15', action: { ru: 'Обогащение данными', en: 'Data Enrichment' }, desc: { ru: 'Привязка к кодам КАТО 2023', en: 'Linking to 2023 KATO codes' } },
                        { date: '2024-01-10', action: { ru: 'Импорт из Адресного регистра', en: 'Import from Address Register' }, desc: { ru: 'Первичная загрузка данных', en: 'Initial data load' } },
                      ].map((item, idx) => (
                        <div key={idx} className="flex gap-4 relative">
                          {idx !== 2 && <div className="absolute left-1.5 top-4 bottom-0 w-px bg-inherit opacity-20" />}
                          <div className="w-3 h-3 rounded-full bg-cyan-500 shrink-0 mt-1" />
                          <div className="space-y-1">
                            <div className="text-[10px] opacity-40">{formatDate(item.date, language)}</div>
                            <div className="text-xs font-bold">{item.action[language]}</div>
                            <div className="text-[10px] opacity-60">{item.desc[language]}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}


          {activeTab === 'access' && (
            <motion.div 
              key="access"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <div className={cn(
                    "p-8 rounded-2xl border space-y-6",
                    theme === 'dark' ? "bg-[#121214] border-white/10" : "bg-white border-black/5"
                  )}>
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center",
                        dataset.access === 'Open' ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                      )}>
                        {dataset.access === 'Open' ? <Unlock size={24} /> : <Lock size={24} />}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">{t[dataset.access.toLowerCase().replace(' ', '') as keyof typeof t] || dataset.access}</h3>
                        <p className="text-xs opacity-50">
                          {dataset.access === 'Open' ? 
                            (language === 'en' ? 'This dataset is public and can be downloaded by any authorized user.' : 'Этот набор данных является общедоступным и может быть загружен любым авторизованным пользователем.') :
                            (language === 'en' ? 'Access to this dataset requires approval from the data steward.' : 'Доступ к этому набору данных требует одобрения ответственного за данные.')
                          }
                        </p>
                      </div>
                    </div>

                    {dataset.access !== 'Open' && (
                      <div className="pt-6 border-t border-inherit space-y-4">
                        <h4 className="text-sm font-bold">{t.requestAccess}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase opacity-40">{t.purpose}</label>
                            <select className={cn(
                              "w-full px-4 py-2 rounded-lg border text-xs outline-none focus:border-cyan-500/50 transition-all",
                              theme === 'dark' ? "bg-white/5 border-white/10" : "bg-black/5 border-black/5"
                            )}>
                              <option>{language === 'en' ? 'Research' : 'Исследование'}</option>
                              <option>{language === 'en' ? 'Urban Planning' : 'Городское планирование'}</option>
                              <option>{language === 'en' ? 'Infrastructure Analysis' : 'Анализ инфраструктуры'}</option>
                              <option>{language === 'en' ? 'Other' : 'Другое'}</option>
                            </select>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase opacity-40">{t.periodAccess}</label>
                            <select className={cn(
                              "w-full px-4 py-2 rounded-lg border text-xs outline-none focus:border-cyan-500/50 transition-all",
                              theme === 'dark' ? "bg-white/5 border-white/10" : "bg-black/5 border-black/5"
                            )}>
                              <option>{language === 'en' ? '1 Month' : '1 месяц'}</option>
                              <option>{language === 'en' ? '3 Months' : '3 месяца'}</option>
                              <option>{language === 'en' ? '6 Months' : '6 месяцев'}</option>
                              <option>{language === 'en' ? 'Permanent' : 'Постоянно'}</option>
                            </select>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase opacity-40">{t.details}</label>
                          <textarea 
                            rows={3}
                            placeholder={language === 'en' ? 'Describe why you need access to this data...' : 'Опишите, почему вам нужен доступ к этим данным...'}
                            className={cn(
                              "w-full px-4 py-2 rounded-lg border text-xs outline-none focus:border-cyan-500/50 transition-all resize-none",
                              theme === 'dark' ? "bg-white/5 border-white/10" : "bg-black/5 border-black/5"
                            )}
                          />
                        </div>
                        <button className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-bold shadow-lg shadow-cyan-500/20 transition-all">
                          {t.sendRequest}
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider opacity-40">{t.whoHasAccess}</h3>
                    <div className={cn(
                      "rounded-2xl border overflow-hidden",
                      theme === 'dark' ? "bg-[#121214] border-white/10" : "bg-white border-black/5"
                    )}>
                      <table className="w-full text-left text-xs">
                        <thead className={cn(
                          "border-b text-[10px] font-bold uppercase tracking-widest opacity-40",
                          theme === 'dark' ? "bg-white/5 border-white/10" : "bg-black/5 border-black/5"
                        )}>
                          <tr>
                            <th className="px-6 py-4">{t.user}</th>
                            <th className="px-6 py-4">{t.role}</th>
                            <th className="px-6 py-4">{t.accessFrom}</th>
                            <th className="px-6 py-4">{t.expires}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-inherit">
                          {[
                            { name: 'Sanzhar K.', role: { ru: 'Владелец', en: 'Owner' }, from: '2023-01-01', to: '—' },
                            { name: 'Aigerim M.', role: { ru: 'Аналитик', en: 'Analyst' }, from: '2024-01-15', to: '2025-01-15' },
                            { name: 'Daniyar B.', role: { ru: 'Разработчик', en: 'Developer' }, from: '2024-02-10', to: '2024-08-10' },
                          ].map((user, idx) => (
                            <tr key={idx} className="hover:bg-white/5 transition-colors">
                              <td className="px-6 py-4 flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center text-[10px] font-bold text-cyan-500">
                                  {user.name[0]}
                                </div>
                                <span className="font-bold">{user.name}</span>
                              </td>
                              <td className="px-6 py-4 opacity-60">{user.role[language]}</td>
                              <td className="px-6 py-4 opacity-40">{formatDate(user.from, language)}</td>
                              <td className="px-6 py-4 opacity-40">{user.to}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider opacity-40">{t.recentRequests}</h3>
                  <div className="space-y-3">
                    {[
                      { name: 'Kairat S.', date: '2024-03-05', status: 'pending' },
                      { name: 'Elena V.', date: '2024-03-02', status: 'approved' },
                      { name: 'Arman T.', date: '2024-02-28', status: 'rejected' },
                    ].map((req, idx) => (
                      <div key={idx} className={cn(
                        "p-4 rounded-xl border flex items-center justify-between",
                        theme === 'dark' ? "bg-[#121214] border-white/10" : "bg-white border-black/5"
                      )}>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center opacity-40"><User size={16} /></div>
                          <div>
                            <div className="text-xs font-bold">{req.name}</div>
                            <div className="text-[10px] opacity-40">{formatDate(req.date, language)}</div>
                          </div>
                        </div>
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider",
                          req.status === 'approved' ? "bg-emerald-500/10 text-emerald-500" :
                          req.status === 'pending' ? "bg-amber-500/10 text-amber-500" :
                          "bg-red-500/10 text-red-500"
                        )}>
                          {req.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          {activeTab === 'activity' && (
            <motion.div 
              key="activity"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold uppercase tracking-wider opacity-40">{t.activityLog}</h3>
                    <div className="flex gap-2">
                      <button className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-bold border transition-all",
                        theme === 'dark' ? "bg-white/5 border-white/10" : "bg-black/5 border-black/5"
                      )}>{language === 'en' ? 'All' : 'Все'}</button>
                      <button className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-bold border opacity-40 hover:opacity-100 transition-all",
                        theme === 'dark' ? "border-white/10" : "border-black/5"
                      )}>{language === 'en' ? 'Updates' : 'Обновления'}</button>
                      <button className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-bold border opacity-40 hover:opacity-100 transition-all",
                        theme === 'dark' ? "border-white/10" : "border-black/5"
                      )}>{language === 'en' ? 'Access' : 'Доступ'}</button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      { date: '2024-03-05 14:20', user: 'Sanzhar K.', action: { ru: 'Обновление данных', en: 'Data Update' }, desc: { ru: 'Загружен новый файл за февраль 2024', en: 'New file for February 2024 uploaded' }, type: 'update' },
                      { date: '2024-03-05 10:15', user: 'System', action: { ru: 'Автоматическая валидация', en: 'Auto Validation' }, desc: { ru: 'Проверка качества пройдена (98%)', en: 'Quality check passed (98%)' }, type: 'system' },
                      { date: '2024-03-02 16:45', user: 'Aigerim M.', action: { ru: 'Запрос доступа', en: 'Access Request' }, desc: { ru: 'Одобрен доступ для департамента транспорта', en: 'Access approved for transport department' }, type: 'access' },
                      { date: '2024-02-28 09:00', user: 'Sanzhar K.', action: { ru: 'Изменение метаданных', en: 'Metadata Change' }, desc: { ru: 'Обновлено описание и теги', en: 'Description and tags updated' }, type: 'metadata' },
                      { date: '2024-02-15 11:30', user: 'System', action: { ru: 'Плановое обновление', en: 'Scheduled Update' }, desc: { ru: 'Данные синхронизированы с Адресным регистром', en: 'Data synced with Address Register' }, type: 'update' },
                    ].map((item, idx) => (
                      <div key={idx} className={cn(
                        "p-4 rounded-xl border flex gap-4 relative",
                        theme === 'dark' ? "bg-[#121214] border-white/10" : "bg-white border-black/5"
                      )}>
                        <div className="shrink-0 mt-1">
                          <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center",
                            item.type === 'update' ? "bg-cyan-500/10 text-cyan-500" :
                            item.type === 'access' ? "bg-emerald-500/10 text-emerald-500" :
                            item.type === 'system' ? "bg-purple-500/10 text-purple-500" :
                            "bg-amber-500/10 text-amber-500"
                          )}>
                            {item.type === 'update' ? <RefreshCw size={14} /> :
                             item.type === 'access' ? <Unlock size={14} /> :
                             item.type === 'system' ? <ShieldCheck size={14} /> :
                             <FileText size={14} />}
                          </div>
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold">{item.action[language]}</span>
                            <span className="text-[10px] opacity-40">{item.date}</span>
                          </div>
                          <p className="text-[10px] opacity-60">{item.desc[language]}</p>
                          <div className="pt-2 flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-white/5 flex items-center justify-center opacity-40"><User size={10} /></div>
                            <span className="text-[10px] font-bold opacity-40">{item.user}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <button className="w-full py-3 rounded-xl border border-dashed border-inherit opacity-40 hover:opacity-100 transition-all text-[10px] font-bold uppercase tracking-widest">
                    {language === 'en' ? 'Load More Activity' : 'Загрузить еще'}
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider opacity-40">{t.versionHistory}</h3>
                    <div className={cn(
                      "p-6 rounded-2xl border space-y-4",
                      theme === 'dark' ? "bg-[#121214] border-white/10" : "bg-white border-black/5"
                    )}>
                      {[
                        { ver: 'v2.4', date: '2024-03-05', size: '124 MB', current: true },
                        { ver: 'v2.3', date: '2024-02-15', size: '122 MB', current: false },
                        { ver: 'v2.2', date: '2024-01-10', size: '118 MB', current: false },
                      ].map((v, idx) => (
                        <div key={idx} className="flex items-center justify-between group">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-2 h-2 rounded-full",
                              v.current ? "bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]" : "bg-white/20"
                            )} />
                            <div>
                              <div className="text-xs font-bold">{v.ver} {v.current && <span className="ml-2 text-[8px] text-cyan-500 uppercase tracking-widest">Current</span>}</div>
                              <div className="text-[10px] opacity-40">{formatDate(v.date, language)}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-[10px] opacity-40">{v.size}</span>
                            <button className="p-1.5 rounded bg-white/5 opacity-0 group-hover:opacity-100 transition-all hover:text-cyan-500">
                              <Download size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={cn(
                    "p-6 rounded-2xl border space-y-4",
                    theme === 'dark' ? "bg-cyan-500/5 border-cyan-500/20" : "bg-cyan-50 border-cyan-500/10"
                  )}>
                    <div className="flex items-center gap-3 text-cyan-500">
                      <Clock size={20} />
                      <h4 className="text-sm font-bold">{language === 'en' ? 'Retention Policy' : 'Политика хранения'}</h4>
                    </div>
                    <p className="text-[10px] opacity-60 leading-relaxed">
                      {language === 'en' ? 
                        'Data versions are stored for 24 months. Audit logs are kept permanently according to city data governance standards.' :
                        'Версии данных хранятся 24 месяца. Журналы аудита хранятся постоянно в соответствии со стандартами управления данными города.'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Passport;
