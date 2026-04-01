import React, { useState } from 'react';
import { useApp } from '../context';
import { TRANSLATIONS, MOCK_USER, DATASETS } from '../constants';
import { 
  Folder, 
  FileText, 
  Users, 
  Clock, 
  Plus, 
  MoreVertical, 
  Search, 
  Filter, 
  ChevronRight, 
  LayoutGrid, 
  List,
  Share2,
  Trash2,
  Download,
  Star,
  Settings,
  ShieldCheck,
  Briefcase
} from 'lucide-react';
import { cn, formatDate } from '../utils';
import { motion, AnimatePresence } from 'motion/react';

const Workspace: React.FC = () => {
  const { language, theme } = useApp();
  const t = TRANSLATIONS[language];
  const [activeTab, setActiveTab] = useState<'files' | 'projects' | 'team' | 'activity'>('files');

  const projects = [
    { id: 'p1', name: 'Master Plan 2025 Update', status: 'Active', members: 12, updated: '2024-03-01' },
    { id: 'p2', name: 'Green Infrastructure Audit', status: 'Active', members: 5, updated: '2024-02-28' },
    { id: 'p3', name: 'District Resilience Strategy', status: 'Archived', members: 8, updated: '2024-01-15' },
  ];

  const teamMembers = [
    { name: 'Alisher Yerzhanov', role: 'Head of Department', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alisher' },
    { name: 'Sanzhar K.', role: 'Senior Analyst', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sanzhar' },
    { name: 'Elena M.', role: 'GIS Specialist', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena' },
    { name: 'Dmitry V.', role: 'Data Engineer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dmitry' },
  ];

  const activityFeed = [
    { user: 'Sanzhar K.', action: 'uploaded', item: 'Building Permits Q4.csv', time: '2h ago' },
    { user: 'Elena M.', action: 'edited', item: 'Green Zones Map', time: '5h ago' },
    { user: 'Alisher Y.', action: 'shared', item: 'Master Plan Draft', time: '1d ago' },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className={cn(
        "p-8 border-b space-y-8",
        theme === 'dark' ? "bg-[#0A0A0B]" : "bg-white"
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-2xl font-bold text-white shadow-xl shadow-cyan-500/20">
              UP
            </div>
            <div>
              <h1 className={cn("text-3xl font-bold", theme === 'dark' ? "text-white" : "text-black")}>
                {MOCK_USER.department}
              </h1>
              <div className="flex items-center gap-4 text-sm opacity-50 mt-1">
                <span className="flex items-center gap-1.5"><Users size={14} /> 24 {t.members}</span>
                <span className="flex items-center gap-1.5"><Folder size={14} /> 156 {t.files}</span>
                <span className="flex items-center gap-1.5"><Briefcase size={14} /> 8 {t.activeProjects}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className={cn(
              "p-2 rounded-lg border border-inherit hover:bg-white/5 transition-all",
              theme === 'dark' ? "border-white/10" : "border-black/5"
            )}>
              <Settings size={20} />
            </button>
            <button className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white flex items-center gap-2 text-sm font-bold shadow-lg shadow-cyan-500/20 transition-all">
              <Plus size={18} /> {t.newProject}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-8">
          {[
            { id: 'files', label: t.myFiles, icon: Folder },
            { id: 'projects', label: t.projects, icon: Briefcase },
            { id: 'team', label: t.team, icon: Users },
            { id: 'activity', label: t.activity, icon: Clock },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "pb-4 text-sm font-bold flex items-center gap-2 transition-all relative",
                activeTab === tab.id 
                  ? (theme === 'dark' ? "text-white" : "text-black")
                  : "opacity-40 hover:opacity-100"
              )}
            >
              <tab.icon size={16} /> {tab.label}
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="workspace-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500 rounded-full"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <AnimatePresence mode="wait">
          {activeTab === 'files' && (
            <motion.div 
              key="files"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "relative flex items-center rounded-lg px-3 py-1.5 border",
                    theme === 'dark' ? "bg-white/5 border-white/10" : "bg-black/5 border-black/5"
                  )}>
                    <Search size={14} className="opacity-40 mr-2" />
                    <input type="text" placeholder={t.searchFiles} className="bg-transparent border-none outline-none text-xs w-48" />
                  </div>
                  <button className="p-2 rounded-lg border border-inherit opacity-50 hover:opacity-100 transition-opacity"><Filter size={16} /></button>
                </div>
                <div className="flex items-center bg-inherit border border-inherit rounded-lg p-1">
                  <button className="p-1.5 rounded bg-cyan-500/10 text-cyan-500"><List size={18} /></button>
                  <button className="p-1.5 rounded opacity-40"><LayoutGrid size={18} /></button>
                </div>
              </div>

              <div className="space-y-1">
                {DATASETS.filter(d => d.isPrivate).map(file => (
                  <div 
                    key={file.id}
                    className={cn(
                      "p-4 rounded-xl border flex items-center gap-4 cursor-pointer transition-all group",
                      theme === 'dark' ? "bg-[#121214] border-white/10 hover:bg-white/5" : "bg-white border-black/5 hover:bg-black/5"
                    )}
                  >
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                      <FileText size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={cn("text-sm font-bold truncate", theme === 'dark' ? "text-white" : "text-black")}>{file.name[language]}</div>
                      <div className="text-[10px] opacity-40 uppercase tracking-wider">{t.updated} {formatDate(file.lastUpdated, language)} • {file.format}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 rounded-lg hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-all"><Share2 size={16} /></button>
                      <button className="p-2 rounded-lg hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-all"><Download size={16} /></button>
                      <button className="p-2 rounded-lg hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-all"><MoreVertical size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'projects' && (
            <motion.div 
              key="projects"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {projects.map(project => (
                <div 
                  key={project.id}
                  className={cn(
                    "p-6 rounded-2xl border space-y-6 cursor-pointer transition-all group",
                    theme === 'dark' ? "bg-[#121214] border-white/10 hover:border-cyan-500/30" : "bg-white border-black/5 hover:border-cyan-500/30"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
                      <Briefcase size={20} />
                    </div>
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                      project.status === 'Active' ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                    )}>
                      {project.status === 'Active' ? t.inWork : t.completed}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <h3 className={cn("text-lg font-bold", theme === 'dark' ? "text-white" : "text-black")}>{project.name}</h3>
                    <p className="text-xs opacity-50">{t.lastUpdated} {formatDate(project.updated, language)}</p>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-inherit">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="w-6 h-6 rounded-full border-2 border-inherit bg-inherit flex items-center justify-center text-[8px] font-bold overflow-hidden">
                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="Avatar" />
                        </div>
                      ))}
                      <div className="w-6 h-6 rounded-full border-2 border-inherit bg-white/10 flex items-center justify-center text-[8px] font-bold text-white">
                        +{project.members - 3}
                      </div>
                    </div>
                    <ChevronRight size={16} className="opacity-30 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'team' && (
            <motion.div 
              key="team"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {teamMembers.map(member => (
                <div 
                  key={member.name}
                  className={cn(
                    "p-6 rounded-2xl border flex flex-col items-center text-center space-y-4",
                    theme === 'dark' ? "bg-[#121214] border-white/10" : "bg-white border-black/5"
                  )}
                >
                  <img src={member.avatar} alt={member.name} className="w-20 h-20 rounded-full border-4 border-inherit shadow-xl" />
                  <div>
                    <h3 className={cn("text-sm font-bold", theme === 'dark' ? "text-white" : "text-black")}>{member.name}</h3>
                    <p className="text-[10px] opacity-50 uppercase tracking-widest mt-1">{member.role}</p>
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <button className="p-2 rounded-lg border border-inherit hover:bg-white/5 transition-all opacity-50"><FileText size={14} /></button>
                    <button className="p-2 rounded-lg border border-inherit hover:bg-white/5 transition-all opacity-50"><Share2 size={14} /></button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'activity' && (
            <motion.div 
              key="activity"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {activityFeed.map((activity, i) => (
                <div 
                  key={i}
                  className={cn(
                    "p-4 rounded-xl border flex items-center gap-4 transition-all",
                    theme === 'dark' ? "bg-[#121214] border-white/10 hover:bg-white/5" : "bg-white border-black/5 hover:bg-black/5"
                  )}
                >
                  <div className="w-10 h-10 rounded-full bg-cyan-500/10 text-cyan-500 flex items-center justify-center font-bold text-xs">
                    {activity.user.split(' ')[0][0]}
                  </div>
                  <div className="flex-1 text-sm">
                    <span className={cn("font-bold", theme === 'dark' ? "text-white" : "text-black")}>{activity.user}</span>
                    <span className="opacity-50 mx-1.5">{t[activity.action as keyof typeof t] || activity.action}</span>
                    <span className={cn("font-bold text-cyan-500")}>{activity.item}</span>
                  </div>
                  <div className="text-[10px] opacity-40">{activity.time}</div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Workspace;
