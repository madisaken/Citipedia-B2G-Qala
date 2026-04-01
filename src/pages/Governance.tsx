import React, { useState } from 'react';
import { useApp } from '../context';
import { TRANSLATIONS, GOVERNANCE_TASKS, DATASETS } from '../constants';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  Kanban, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Filter, 
  MoreVertical,
  Plus,
  Search,
  User,
  Calendar,
  Database,
  X
} from 'lucide-react';
import { cn, formatDate } from '../utils';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';

const Governance: React.FC = () => {
  const { language, theme } = useApp();
  const t = TRANSLATIONS[language];
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tasks' | 'review'>('dashboard');

  const avgQualityScore = Math.round(DATASETS.reduce((acc, d) => acc + d.qualityScore, 0) / DATASETS.length);
  const activeTasksCount = GOVERNANCE_TASKS.filter(t => t.status !== 'done').length;
  const verifiedAssetsCount = DATASETS.filter(d => !!d.expertAssessment).length;
  const flaggedDatasetsCount = DATASETS.filter(d => d.qualityScore < 70).length;

  const pendingReviews = DATASETS.filter(d => d.expertAssessment?.stewardReview === 'pending');

  const stats = [
    { label: t.avgQualityIndex, value: `${avgQualityScore}%`, trend: '+2.4%', icon: ShieldCheck, color: 'text-cyan-500' },
    { label: t.activeQualityTasks, value: activeTasksCount.toString(), trend: '-5', icon: Kanban, color: 'text-amber-500' },
    { label: t.objectsNeedAttention, value: flaggedDatasetsCount.toString(), trend: '+1', icon: AlertCircle, color: 'text-red-500' },
    { label: t.verified, value: verifiedAssetsCount.toString(), trend: '+12', icon: CheckCircle2, color: 'text-emerald-500' },
  ];

  const pieData = [
    { name: t.highQuality, value: DATASETS.filter(d => d.qualityScore >= 85).length, color: '#10b981' },
    { name: t.mediumQuality, value: DATASETS.filter(d => d.qualityScore >= 60 && d.qualityScore < 85).length, color: '#f59e0b' },
    { name: t.lowQuality, value: DATASETS.filter(d => d.qualityScore < 60).length, color: '#ef4444' },
  ];

  const columns = [
    { id: 'backlog', label: t.backlog },
    { id: 'in-progress', label: t.inProgress },
    { id: 'review', label: t.review },
    { id: 'done', label: t.done },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className={cn(
        "p-6 border-b space-y-6",
        theme === 'dark' ? "bg-[#0A0A0B]" : "bg-white"
      )}>
        <div className="flex items-center justify-between">
          <h1 className={cn("text-2xl font-bold", theme === 'dark' ? "text-white" : "text-black")}>
            {t.governance}
          </h1>
          <div className="flex items-center gap-2 bg-inherit border border-inherit rounded-lg p-1">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={cn(
                "px-4 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-2",
                activeTab === 'dashboard' ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20" : "opacity-50 hover:opacity-100"
              )}
            >
              <LayoutDashboard size={14} /> {t.governanceDashboard}
            </button>
            <button 
              onClick={() => setActiveTab('tasks')}
              className={cn(
                "px-4 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-2",
                activeTab === 'tasks' ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20" : "opacity-50 hover:opacity-100"
              )}
            >
              <Kanban size={14} /> {t.taskBoard}
            </button>
            <button 
              onClick={() => setActiveTab('review')}
              className={cn(
                "px-4 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-2 relative",
                activeTab === 'review' ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20" : "opacity-50 hover:opacity-100"
              )}
            >
              <ShieldCheck size={14} /> {t.stewardReviewTab}
              {pendingReviews.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[8px] flex items-center justify-center rounded-full border-2 border-inherit">
                  {pendingReviews.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' ? (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((s) => (
                  <div key={s.label} className={cn(
                    "p-6 rounded-2xl border space-y-3",
                    theme === 'dark' ? "bg-[#121214] border-white/10" : "bg-white border-black/5"
                  )}>
                    <div className="flex items-center justify-between">
                      <div className={cn("w-10 h-10 rounded-xl bg-inherit border border-inherit flex items-center justify-center", s.color)}>
                        <s.icon size={20} />
                      </div>
                      <div className={cn(
                        "text-[10px] font-bold px-1.5 py-0.5 rounded-md",
                        s.trend.startsWith('+') ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                      )}>
                        {s.trend}
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{s.value}</div>
                      <div className="text-xs opacity-50">{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Quality by Category */}
                <div className={cn(
                  "lg:col-span-2 p-8 rounded-2xl border space-y-6",
                  theme === 'dark' ? "bg-[#121214] border-white/10" : "bg-white border-black/5"
                )}>
                  <h3 className="text-lg font-bold">{t.qualityByDept}</h3>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={[
                        { date: 'Feb 1', score: 82 },
                        { date: 'Feb 7', score: 84 },
                        { date: 'Feb 14', score: 83 },
                        { date: 'Feb 21', score: 87 },
                        { date: 'Feb 28', score: 88 },
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#ffffff10' : '#00000010'} vertical={false} />
                        <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: theme === 'dark' ? '#121214' : '#ffffff',
                            borderColor: theme === 'dark' ? '#ffffff10' : '#00000010',
                            borderRadius: '12px',
                            fontSize: '12px'
                          }} 
                        />
                        <Line type="monotone" dataKey="score" stroke="#06b6d4" strokeWidth={3} dot={{ fill: '#06b6d4', r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Distribution */}
                <div className={cn(
                  "p-8 rounded-2xl border space-y-6",
                  theme === 'dark' ? "bg-[#121214] border-white/10" : "bg-white border-black/5"
                )}>
                  <h3 className="text-lg font-bold">{t.qualityStatus}</h3>
                  <div className="h-[200px] w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold">{avgQualityScore}%</span>
                      <span className="text-[10px] opacity-40 uppercase">{t.combinedIndex}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {pieData.map(item => (
                      <div key={item.name} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                          <span className="opacity-60">{item.name}</span>
                        </div>
                        <span className="font-bold">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : activeTab === 'tasks' ? (
            <motion.div 
              key="tasks"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full flex flex-col space-y-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "relative flex items-center rounded-lg px-3 py-1.5 border",
                    theme === 'dark' ? "bg-white/5 border-white/10" : "bg-black/5 border-black/5"
                  )}>
                    <Search size={14} className="opacity-40 mr-2" />
                    <input type="text" placeholder={t.search} className="bg-transparent border-none outline-none text-xs w-48" />
                  </div>
                  <button className="p-2 rounded-lg border border-inherit opacity-50 hover:opacity-100 transition-opacity"><Filter size={16} /></button>
                </div>
                <button className="px-4 py-2 rounded-lg bg-cyan-500 text-white text-xs font-bold flex items-center gap-2 hover:bg-cyan-600 transition-all">
                  <Plus size={16} /> {t.publishNew}
                </button>
              </div>

              <div className="flex-1 flex gap-6 overflow-x-auto pb-4 no-scrollbar">
                {columns.map(col => (
                  <div key={col.id} className="w-80 shrink-0 flex flex-col gap-4">
                    <div className="flex items-center justify-between px-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs font-bold uppercase tracking-widest opacity-50">{col.label}</h3>
                        <span className={cn(
                          "px-1.5 py-0.5 rounded-full text-[10px] font-bold",
                          theme === 'dark' ? "bg-white/10 text-white/50" : "bg-black/5 text-black/50"
                        )}>
                          {GOVERNANCE_TASKS.filter(t => t.status === col.id).length}
                        </span>
                      </div>
                      <button className="p-1 rounded hover:bg-white/5 opacity-30"><MoreVertical size={14} /></button>
                    </div>

                    <div className="flex-1 space-y-3">
                      {GOVERNANCE_TASKS.filter(t => t.status === col.id).map(task => {
                        const dataset = DATASETS.find(d => d.id === task.datasetId);
                        return (
                          <motion.div 
                            key={task.id}
                            layoutId={task.id}
                            className={cn(
                              "p-4 rounded-xl border space-y-4 cursor-grab active:cursor-grabbing transition-all",
                              theme === 'dark' ? "bg-[#121214] border-white/10 hover:border-cyan-500/30" : "bg-white border-black/5 hover:border-cyan-500/30"
                            )}
                          >
                            <div className="flex items-center justify-between">
                              <span className={cn(
                                "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                                task.priority === 'high' ? "bg-red-500/10 text-red-500" : (task.priority === 'medium' ? "bg-amber-500/10 text-amber-500" : "bg-blue-500/10 text-blue-500")
                              )}>
                                {t[task.priority as keyof typeof t] || task.priority}
                              </span>
                              <button className="p-1 rounded hover:bg-white/5 opacity-30"><MoreVertical size={14} /></button>
                            </div>
                            <div className={cn("text-sm font-bold leading-snug", theme === 'dark' ? "text-white" : "text-black")}>
                              {task.title[language]}
                            </div>
                            {dataset && (
                              <div className="flex items-center gap-2 text-[10px] opacity-40">
                                <Database size={10} /> {dataset.name[language]}
                              </div>
                            )}
                            <div className="pt-3 border-t border-inherit flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center text-[8px] font-bold text-cyan-500">
                                  {task.assignee.split(' ')[0][0]}{task.assignee.split(' ')[1]?.[0] || ''}
                                </div>
                                <span className="text-[10px] opacity-50">{task.assignee}</span>
                              </div>
                              <div className="flex items-center gap-1 text-[10px] opacity-40">
                                <Calendar size={10} /> {formatDate(task.dueDate, language)}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                      <button className={cn(
                        "w-full py-3 rounded-xl border border-dashed border-inherit flex items-center justify-center gap-2 text-xs font-bold opacity-30 hover:opacity-100 hover:bg-white/5 transition-all",
                      )}>
                        <Plus size={14} /> Add Task
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="review"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">{t.expertAssessments}</h2>
                <div className="text-xs opacity-50">{pendingReviews.length} {t.pending}</div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {pendingReviews.map(dataset => (
                  <div key={dataset.id} className={cn(
                    "p-6 rounded-2xl border flex flex-col md:flex-row gap-6",
                    theme === 'dark' ? "bg-[#121214] border-white/10" : "bg-white border-black/5"
                  )}>
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-500">
                          <Database size={20} />
                        </div>
                        <div>
                          <h3 className="font-bold">{dataset.name[language]}</h3>
                          <p className="text-xs opacity-50">{dataset.ownerName} • {formatDate(dataset.expertAssessment?.date || '', language)}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <div className="text-[10px] uppercase opacity-40 font-bold tracking-wider">{t.accuracyScore}</div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-inherit border border-inherit rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-500" style={{ width: `${dataset.expertAssessment?.accuracy}%` }}></div>
                            </div>
                            <span className="text-xs font-bold">{dataset.expertAssessment?.accuracy}%</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[10px] uppercase opacity-40 font-bold tracking-wider">{t.relevanceScore}</div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-inherit border border-inherit rounded-full overflow-hidden">
                              <div className="h-full bg-cyan-500" style={{ width: `${dataset.expertAssessment?.relevance}%` }}></div>
                            </div>
                            <span className="text-xs font-bold">{dataset.expertAssessment?.relevance}%</span>
                          </div>
                        </div>
                      </div>

                      <div className={cn(
                        "p-4 rounded-xl text-xs italic",
                        theme === 'dark' ? "bg-white/5" : "bg-black/5"
                      )}>
                        "{dataset.expertAssessment?.comment[language]}"
                      </div>
                    </div>

                    <div className="flex flex-row md:flex-col gap-2 justify-center">
                      <button className="px-6 py-2 rounded-xl bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 transition-all flex items-center gap-2">
                        <CheckCircle2 size={14} /> {t.approve}
                      </button>
                      <button className="px-6 py-2 rounded-xl bg-amber-500/10 text-amber-500 text-xs font-bold hover:bg-amber-500/20 transition-all flex items-center gap-2">
                        <AlertCircle size={14} /> {t.clarify}
                      </button>
                      <button className="px-6 py-2 rounded-xl bg-red-500/10 text-red-500 text-xs font-bold hover:bg-red-500/20 transition-all flex items-center gap-2">
                        <X size={14} /> {t.reject}
                      </button>
                    </div>
                  </div>
                ))}

                {pendingReviews.length === 0 && (
                  <div className="py-20 flex flex-col items-center justify-center opacity-30 space-y-4">
                    <ShieldCheck size={48} />
                    <p className="text-sm font-bold">{t.noResults}</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Governance;
