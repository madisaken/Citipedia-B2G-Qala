import React from 'react';
import { useApp } from '../context';
import { TRANSLATIONS } from '../constants';
import { 
  Home, 
  Database, 
  Map as MapIcon, 
  FileText, 
  ShieldCheck, 
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  Search
} from 'lucide-react';
import { cn } from '../utils';
import { motion } from 'motion/react';

const Sidebar: React.FC = () => {
  const { language, activePage, setActivePage, theme } = useApp();
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const t = TRANSLATIONS[language];

  const navItems = [
    { id: 'home', label: t.home, icon: Home },
    { id: 'catalog', label: t.catalog, icon: Database },
    { id: 'geo', label: t.geoAnalytics, icon: MapIcon },
    { id: 'docs', label: t.sidebarDocuments, icon: FileText },
    { id: 'governance', label: t.governance, icon: ShieldCheck },
    { id: 'workspace', label: t.workspace, icon: LayoutDashboard },
  ];

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 64 : 240 }}
      className={cn(
        "h-screen flex flex-col border-r transition-colors duration-200",
        theme === 'dark' 
          ? "bg-[#0A0A0B] border-white/10 text-white/70" 
          : "bg-[#F9F9F8] border-black/5 text-black/60"
      )}
    >
      <div className="p-4 flex items-center justify-between h-16 border-b border-inherit">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center text-white font-bold">C</div>
            <span className={cn("font-bold text-lg tracking-tight", theme === 'dark' ? "text-white" : "text-black")}>
              Citipedia
            </span>
          </div>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-md hover:bg-white/5 transition-colors"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map((item) => {
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'geo') {
                  window.open('https://rcp.qala-ai.com/login', '_blank');
                } else {
                  setActivePage(item.id);
                }
              }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group",
                isActive 
                  ? (theme === 'dark' ? "bg-cyan-500/10 text-cyan-400" : "bg-cyan-500/10 text-cyan-600")
                  : "hover:bg-white/5"
              )}
            >
              <item.icon size={20} className={cn(isActive ? "text-cyan-400" : "group-hover:text-inherit")} />
              {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
              {isActive && !isCollapsed && (
                <motion.div 
                  layoutId="active-pill"
                  className="ml-auto w-1 h-4 bg-cyan-500 rounded-full"
                />
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-inherit">
        <div className={cn(
          "flex items-center gap-3",
          isCollapsed ? "justify-center" : ""
        )}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-[10px] font-bold text-white">
            AZ
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className={cn("text-xs font-semibold truncate", theme === 'dark' ? "text-white" : "text-black")}>
                {language === 'ru' ? 'Акимат Астаны' : 'Astana Gov'}
              </span>
              <span className="text-[10px] opacity-50 truncate">
                {language === 'ru' ? 'УАГЗО' : 'Urban Planning Dep'}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
