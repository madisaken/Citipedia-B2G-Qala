import React, { useState, useMemo } from 'react';
import { useApp } from '../context';
import { DATASETS, TRANSLATIONS, DEPARTMENTS, DOMAINS, MOCK_USER } from '../constants';
import { 
  Search, 
  Filter, 
  LayoutGrid, 
  List, 
  ChevronDown, 
  ChevronRight, 
  MoreVertical,
  Database,
  MapPin,
  Table as TableIcon,
  FileText,
  Zap,
  Lock,
  Unlock,
  ClipboardList,
  Building2,
  Users,
  Car,
  Leaf,
  Wrench,
  Coins,
  Shield,
  X,
  Network,
  Layers,
  CheckCircle
} from 'lucide-react';
import { cn, formatDate } from '../utils';
import { motion, AnimatePresence } from 'motion/react';
import { DataType, DataFormat, AccessLevel, UpdateFrequency, UserRole } from '../types';
import { RoleBadge } from '../components/RoleBadge';

const Catalog: React.FC = () => {
  const { language, theme, setSelectedDatasetId, setActivePage, user } = useApp();
  const t = TRANSLATIONS[language];
  
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'tree'>('list');
  const [activeTab, setActiveTab] = useState<'library' | 'department' | 'files'>('library');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedDomains, setExpandedDomains] = useState<string[]>(DOMAINS.map(d => d.id));
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'quality' | 'popularity'>('date');
  
  // Advanced Filters
  const [filterDepts, setFilterDepts] = useState<string[]>([]);
  const [filterTypes, setFilterTypes] = useState<DataType[]>([]);
  const [filterFormats, setFilterFormats] = useState<DataFormat[]>([]);
  const [filterFrequencies, setFilterFrequencies] = useState<UpdateFrequency[]>([]);
  const [filterQuality, setFilterQuality] = useState<string[]>([]);
  const [filterAccess, setFilterAccess] = useState<AccessLevel[]>([]);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  const toggleDomain = (id: string) => {
    setExpandedDomains(prev => 
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  const getDomainIcon = (iconName: string) => {
    switch (iconName) {
      case 'Building2': return <Building2 size={18} />;
      case 'Users': return <Users size={18} />;
      case 'Car': return <Car size={18} />;
      case 'Leaf': return <Leaf size={18} />;
      case 'Wrench': return <Wrench size={18} />;
      case 'Coins': return <Coins size={18} />;
      case 'Shield': return <Shield size={18} />;
      default: return <Database size={18} />;
    }
  };

  const getTypeIcon = (type: DataType) => {
    switch (type) {
      case 'Geodata': return <MapPin size={16} />;
      case 'Table': return <TableIcon size={16} />;
      case 'Document': return <FileText size={16} />;
      case 'Raster': return <Layers size={16} />;
      case 'Stream': return <Zap size={16} />;
    }
  };

  const getAccessIcon = (access: AccessLevel) => {
    switch (access) {
      case 'Open': return <Unlock size={14} className="text-emerald-500" />;
      case 'By Request': return <ClipboardList size={14} className="text-amber-500" />;
      case 'Restricted': return <Lock size={14} className="text-red-500" />;
    }
  };

  const getQualityColor = (score: number) => {
    if (score > 85) return 'bg-emerald-500';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getFormatBadgeClass = (format: DataFormat) => {
    const geo = ['SHP', 'GeoJSON', 'GeoTIFF', 'PostGIS', 'GTFS'];
    const tab = ['CSV', 'Excel', 'JSON'];
    const doc = ['PDF'];
    const api = ['API'];

    if (geo.includes(format)) return 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20';
    if (tab.includes(format)) return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    if (doc.includes(format)) return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    if (api.includes(format)) return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
    return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  };

  const filteredDatasets = useMemo(() => {
    let result = DATASETS;

    // Scope Tabs
    if (activeTab === 'department') {
      const userDept = DEPARTMENTS.find(d => d.name.en === MOCK_USER.department);
      if (userDept) result = result.filter(d => d.departmentId === userDept.id);
    } else if (activeTab === 'files') {
      result = result.filter(d => d.isPrivate);
    } else {
      result = result.filter(d => !d.isPrivate);
    }

    // Tree Selection
    if (selectedDomain) result = result.filter(d => d.domainId === selectedDomain);
    if (selectedCategory) result = result.filter(d => d.categoryId === selectedCategory);

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(d => 
        d.name.ru.toLowerCase().includes(q) || 
        d.name.en.toLowerCase().includes(q) ||
        d.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    // Advanced Filters
    if (filterDepts.length > 0) result = result.filter(d => filterDepts.includes(d.departmentId));
    if (filterTypes.length > 0) result = result.filter(d => filterTypes.includes(d.type));
    if (filterFormats.length > 0) result = result.filter(d => filterFormats.includes(d.format));
    if (filterFrequencies.length > 0) result = result.filter(d => filterFrequencies.includes(d.frequency));
    if (filterAccess.length > 0) result = result.filter(d => filterAccess.includes(d.access));
    if (filterQuality.length > 0) {
      result = result.filter(d => {
        if (filterQuality.includes('high') && d.qualityScore > 85) return true;
        if (filterQuality.includes('medium') && d.qualityScore >= 60 && d.qualityScore <= 85) return true;
        if (filterQuality.includes('low') && d.qualityScore < 60) return true;
        return false;
      });
    }

    // Sorting
    result = [...result].sort((a, b) => {
      if (sortBy === 'date') return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      if (sortBy === 'name') return a.name[language].localeCompare(b.name[language]);
      if (sortBy === 'quality') return b.qualityScore - a.qualityScore;
      if (sortBy === 'popularity') return (b.popularity || 0) - (a.popularity || 0);
      return 0;
    });

    return result;
  }, [activeTab, selectedDomain, selectedCategory, searchQuery, filterDepts, filterTypes, filterFormats, filterFrequencies, filterAccess, filterQuality, sortBy, language]);

  const getCount = (domainId?: string, categoryId?: string) => {
    let base = DATASETS;
    if (activeTab === 'department') {
      const userDept = DEPARTMENTS.find(d => d.name.en === MOCK_USER.department);
      if (userDept) base = base.filter(d => d.departmentId === userDept.id);
    } else if (activeTab === 'files') {
      base = base.filter(d => d.isPrivate);
    } else {
      base = base.filter(d => !d.isPrivate);
    }

    if (domainId) base = base.filter(d => d.domainId === domainId);
    if (categoryId) base = base.filter(d => d.categoryId === categoryId);
    return base.length;
  };

  const resetFilters = () => {
    setFilterDepts([]);
    setFilterTypes([]);
    setFilterFormats([]);
    setFilterFrequencies([]);
    setFilterQuality([]);
    setFilterAccess([]);
    setSearchQuery('');
    setSelectedDomain(null);
    setSelectedCategory(null);
  };

  const handleDatasetClick = (dataset: any) => {
    setSelectedDatasetId(dataset.id);
    setActivePage('passport');
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Top Scope Tabs */}
      <div className={cn(
        "h-14 border-b flex items-center px-6 gap-8 shrink-0",
        theme === 'dark' ? "bg-[#0A0A0B] border-white/5" : "bg-white border-black/5"
      )}>
        <div className="flex items-center gap-8 flex-1">
          {[
            { id: 'library', label: t.cityLibrary },
            { id: 'department', label: t.myDepartment },
            { id: 'files', label: t.myFiles },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id === 'library' ? 'library' : tab.id === 'department' ? 'department' : 'files');
                setSelectedDomain(null);
                setSelectedCategory(null);
              }}
              className={cn(
                "h-full px-2 text-sm font-bold relative transition-all",
                (activeTab === 'library' && tab.id === 'library') || 
                (activeTab === 'department' && tab.id === 'department') || 
                (activeTab === 'files' && tab.id === 'files')
                  ? "text-cyan-500" 
                  : "text-inherit opacity-40 hover:opacity-100"
              )}
            >
              {tab.label}
              {((activeTab === 'library' && tab.id === 'library') || 
                (activeTab === 'department' && tab.id === 'department') || 
                (activeTab === 'files' && tab.id === 'files')) && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500"
                />
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-xs font-bold">{user.name}</span>
            <RoleBadge role={user.userRole} />
          </div>
          <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full border border-white/10" />
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Tree Sidebar */}
        <aside className={cn(
          "w-72 border-r flex flex-col shrink-0 overflow-y-auto",
          theme === 'dark' ? "bg-[#0A0A0B] border-white/5" : "bg-[#F9F9F8] border-black/5"
        )}>
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-40">{t.domains}</h3>
              <div className="space-y-1">
                {DOMAINS.map(domain => {
                  const count = getCount(domain.id);
                  if (activeTab === 'department' && count === 0) return null;
                  
                  return (
                    <div key={domain.id} className="space-y-1">
                      <button
                        onClick={() => {
                          toggleDomain(domain.id);
                          setSelectedDomain(domain.id);
                          setSelectedCategory(null);
                        }}
                        className={cn(
                          "w-full flex items-center gap-3 p-2 rounded-lg text-xs font-bold transition-all group",
                          selectedDomain === domain.id && !selectedCategory
                            ? "bg-cyan-500/10 text-cyan-500"
                            : "hover:bg-white/5"
                        )}
                      >
                        <span className={cn(
                          "transition-transform",
                          expandedDomains.includes(domain.id) ? "rotate-90" : ""
                        )}>
                          <ChevronRight size={14} className="opacity-40" />
                        </span>
                        <div className={cn(
                          "p-1.5 rounded-md bg-inherit border border-inherit",
                          selectedDomain === domain.id ? "text-cyan-500" : "opacity-60 group-hover:opacity-100"
                        )}>
                          {getDomainIcon(domain.icon)}
                        </div>
                        <span className="flex-1 text-left truncate">{domain.name[language]}</span>
                        <span className="text-[10px] opacity-40">({count})</span>
                      </button>
                      
                      <AnimatePresence>
                        {expandedDomains.includes(domain.id) && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden pl-9 space-y-1"
                          >
                            {domain.categories.map(cat => {
                              const catCount = getCount(domain.id, cat.id);
                              if (activeTab === 'department' && catCount === 0) return null;

                              return (
                                <button
                                  key={cat.id}
                                  onClick={() => {
                                    setSelectedDomain(domain.id);
                                    setSelectedCategory(cat.id);
                                  }}
                                  className={cn(
                                    "w-full flex items-center justify-between p-2 rounded-lg text-[11px] transition-all",
                                    selectedCategory === cat.id
                                      ? "text-cyan-500 font-bold"
                                      : "opacity-60 hover:opacity-100 hover:bg-white/5"
                                  )}
                                >
                                  <span className="truncate">{cat.name[language]}</span>
                                  <span className="text-[9px] opacity-40">({catCount})</span>
                                </button>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden bg-inherit">
          {/* Toolbar & Filters */}
          <div className={cn(
            "p-6 border-b space-y-4 shrink-0",
            theme === 'dark' ? "border-white/5" : "border-black/5"
          )}>
            {activeTab === 'department' && user.userRole === 'steward' && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-between mb-4"
              >
                <div className="flex items-center gap-3">
                  <Shield size={18} className="text-cyan-500" />
                  <span className="text-xs font-medium">
                    {language === 'ru' ? 'Вы — Стюард данных.' : 'You are a Data Steward.'} 
                    <span className="opacity-60 ml-2">
                      {language === 'ru' ? 'Ожидают ревью: 3 объекта · Задачи по качеству: 7 активных' : 'Pending review: 3 objects · Quality tasks: 7 active'}
                    </span>
                  </span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setActivePage('governance')} className="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg bg-cyan-500 text-white hover:bg-cyan-600 transition-colors">
                    {t.governanceDashboard}
                  </button>
                </div>
              </motion.div>
            )}

            <div className="flex items-center justify-between gap-4">
              <div className={cn(
                "flex-1 max-w-xl flex items-center px-4 py-2 rounded-xl border transition-all",
                theme === 'dark' ? "bg-white/5 border-white/10 focus-within:border-cyan-500/50" : "bg-black/5 border-black/10 focus-within:border-cyan-500/50"
              )}>
                <Search size={18} className="opacity-40 mr-3" />
                <input 
                  type="text" 
                  placeholder={t.catalogSearchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-sm w-full"
                />
              </div>

              <div className="flex items-center gap-2">
                {activeTab === 'files' && (
                  <button className="px-4 py-2 rounded-xl bg-cyan-500 text-white flex items-center gap-2 text-sm font-bold hover:bg-cyan-600 transition-all">
                    <Database size={18} />
                    {t.publishNew}
                  </button>
                )}
                <button 
                  onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
                  className={cn(
                    "px-4 py-2 rounded-xl border flex items-center gap-2 text-sm font-bold transition-all",
                    isFilterPanelOpen || filterDepts.length + filterTypes.length + filterFormats.length > 0
                      ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-500"
                      : "bg-inherit border-inherit opacity-60 hover:opacity-100"
                  )}
                >
                  <Filter size={18} />
                  {t.filters}
                  {(filterDepts.length + filterTypes.length + filterFormats.length + filterFrequencies.length + filterQuality.length + filterAccess.length) > 0 && (
                    <span className="w-5 h-5 rounded-full bg-cyan-500 text-white text-[10px] flex items-center justify-center">
                      {filterDepts.length + filterTypes.length + filterFormats.length + filterFrequencies.length + filterQuality.length + filterAccess.length}
                    </span>
                  )}
                </button>

                <div className="h-8 w-[1px] bg-inherit mx-2 opacity-20"></div>

                <div className={cn(
                  "flex items-center p-1 rounded-xl border",
                  theme === 'dark' ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"
                )}>
                  {[
                    { id: 'list', icon: List },
                    { id: 'grid', icon: LayoutGrid },
                    { id: 'tree', icon: Network },
                  ].map(mode => (
                    <button
                      key={mode.id}
                      onClick={() => setViewMode(mode.id as any)}
                      className={cn(
                        "p-1.5 rounded-lg transition-all",
                        viewMode === mode.id ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20" : "opacity-40 hover:opacity-100"
                      )}
                    >
                      <mode.icon size={16} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Active Filter Chips */}
            <AnimatePresence>
              {(filterDepts.length + filterTypes.length + filterFormats.length + filterFrequencies.length + filterQuality.length + filterAccess.length > 0 || selectedDomain || selectedCategory) && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="flex flex-wrap gap-2 pt-2"
                >
                  {selectedDomain && (
                    <div className="px-2 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 text-[10px] font-bold flex items-center gap-1">
                      {DOMAINS.find(d => d.id === selectedDomain)?.name[language]}
                      <button onClick={() => { setSelectedDomain(null); setSelectedCategory(null); }}><X size={12} /></button>
                    </div>
                  )}
                  {selectedCategory && (
                    <div className="px-2 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 text-[10px] font-bold flex items-center gap-1">
                      {DOMAINS.find(d => d.id === selectedDomain)?.categories.find(c => c.id === selectedCategory)?.name[language]}
                      <button onClick={() => setSelectedCategory(null)}><X size={12} /></button>
                    </div>
                  )}
                  {filterDepts.map(id => (
                    <div key={id} className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold flex items-center gap-1">
                      {DEPARTMENTS.find(d => d.id === id)?.name[language]}
                      <button onClick={() => setFilterDepts(prev => prev.filter(p => p !== id))}><X size={12} /></button>
                    </div>
                  ))}
                  <button onClick={resetFilters} className="text-[10px] font-bold text-cyan-500 hover:underline ml-2">{t.reset}</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Results Header */}
          <div className="px-6 py-4 flex items-center justify-between shrink-0">
            <div className="text-xs opacity-50">
              {t.found}: <span className="font-bold text-inherit opacity-100">{filteredDatasets.length}</span> {t.dataObjects}
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-40">{t.sortBy}:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent border-none outline-none text-xs font-bold text-cyan-500 cursor-pointer"
                >
                  <option value="date">{t.updateDate}</option>
                  <option value="name">{t.name}</option>
                  <option value="quality">{t.quality}</option>
                  <option value="popularity">{t.popularity}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Area */}
          <div className="flex-1 overflow-y-auto p-6 pt-0">
            {filteredDatasets.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30">
                <Database size={64} strokeWidth={1} />
                <div className="space-y-1">
                  <p className="text-lg font-bold">{t.noResults}</p>
                  <p className="text-sm">{t.tryReset}</p>
                </div>
                <button 
                  onClick={resetFilters}
                  className="px-6 py-2 rounded-xl bg-cyan-500 text-white font-bold text-sm"
                >
                  {t.reset}
                </button>
              </div>
            ) : viewMode === 'list' ? (
              <div className="space-y-2">
                {filteredDatasets.map(dataset => (
                  <div 
                    key={dataset.id}
                    onClick={() => handleDatasetClick(dataset)}
                    className={cn(
                      "group flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all",
                      theme === 'dark' ? "bg-[#121214] border-white/5 hover:bg-white/5 hover:border-cyan-500/30" : "bg-white border-black/5 hover:bg-black/5 hover:border-cyan-500/30"
                    )}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
                      getFormatBadgeClass(dataset.format).split(' ')[0]
                    )}>
                      {getTypeIcon(dataset.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className={cn("text-sm font-bold truncate", theme === 'dark' ? "text-white" : "text-black")}>
                          {dataset.name[language]}
                        </h3>
                        {dataset.expertAssessment && (
                          <div className="flex items-center gap-1 text-emerald-500" title={t.verified}>
                            <CheckCircle size={12} fill="currentColor" className="fill-emerald-500/20" />
                          </div>
                        )}
                        {dataset.userRating && (
                          <div className="flex items-center gap-1 text-amber-500 text-[10px] font-bold">
                            <span>★</span>
                            <span>{dataset.userRating}</span>
                            <span className="opacity-40 text-inherit">({dataset.userReviewsCount || 0})</span>
                          </div>
                        )}
                        <div className={cn(
                          "px-2 py-0.5 rounded text-[9px] font-bold border",
                          getFormatBadgeClass(dataset.format)
                        )}>
                          {dataset.format}
                        </div>
                        {activeTab === 'department' && dataset.ownerName === user.name && (
                          <div className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 text-[9px] font-bold">
                            {language === 'ru' ? 'Мой объект' : 'My Object'}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] opacity-40">
                        <span className="truncate">
                          {DOMAINS.find(d => d.id === dataset.domainId)?.name[language]} &gt; {DOMAINS.find(d => d.id === dataset.domainId)?.categories.find(c => c.id === dataset.categoryId)?.name[language]}
                        </span>
                        <span>•</span>
                        <span className="truncate">{DEPARTMENTS.find(d => d.id === dataset.departmentId)?.name[language]}</span>
                        {dataset.ownerName && (
                          <>
                            <span>•</span>
                            <span className="truncate">{t.authorRole}: {dataset.ownerName}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="w-32 hidden md:block">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] opacity-40 font-bold uppercase tracking-wider">{t.quality}</span>
                        <span className="text-[10px] font-bold">{dataset.qualityScore}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className={cn("h-full rounded-full", getQualityColor(dataset.qualityScore))}
                          style={{ width: `${dataset.qualityScore}%` }}
                        />
                      </div>
                    </div>

                    <div className="w-24 hidden lg:flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1.5">
                        {getAccessIcon(dataset.access)}
                        <span className="text-[10px] font-bold opacity-60">
                          {dataset.access === 'Open' ? t.open : dataset.access === 'By Request' ? t.byRequest : t.restricted}
                        </span>
                      </div>
                      <div className="text-[9px] opacity-40 uppercase font-bold tracking-wider">
                        {dataset.frequency === 'Realtime' ? t.realtime : 
                         dataset.frequency === 'Monthly' ? t.monthly : 
                         dataset.frequency === 'Annually' ? t.annually : dataset.frequency}
                      </div>
                    </div>

                    <div className="w-24 text-right shrink-0">
                      <div className="text-[10px] font-bold opacity-60">{formatDate(dataset.lastUpdated, language)}</div>
                      <div className="text-[9px] opacity-40 uppercase tracking-widest">{t.updated}</div>
                    </div>

                    <button className="p-2 rounded-lg hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-all">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                ))}
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDatasets.map(dataset => (
                  <div 
                    key={dataset.id}
                    onClick={() => handleDatasetClick(dataset)}
                    className={cn(
                      "group rounded-2xl border cursor-pointer transition-all flex flex-col overflow-hidden",
                      theme === 'dark' ? "bg-[#121214] border-white/5 hover:border-cyan-500/30" : "bg-white border-black/5 hover:border-cyan-500/30"
                    )}
                  >
                    <div className="h-32 bg-white/5 relative flex items-center justify-center overflow-hidden">
                      {dataset.type === 'Geodata' ? (
                        <div className="absolute inset-0 opacity-20 bg-[url('https://picsum.photos/seed/map/400/200')] bg-cover bg-center" />
                      ) : (
                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/20 via-transparent to-transparent" />
                      )}
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center z-10 shadow-xl",
                        getFormatBadgeClass(dataset.format).split(' ')[0]
                      )}>
                        {getTypeIcon(dataset.type)}
                      </div>
                      <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-black/40 backdrop-blur-md text-[9px] font-bold text-white flex items-center gap-1.5">
                        {getAccessIcon(dataset.access)}
                        {dataset.access === 'Open' ? t.open : dataset.access === 'By Request' ? t.byRequest : t.restricted}
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className={cn("text-sm font-bold leading-tight line-clamp-2", theme === 'dark' ? "text-white" : "text-black")}>
                            {dataset.name[language]}
                          </h3>
                          {dataset.expertAssessment && (
                            <div className="flex items-center gap-1 text-emerald-500 mt-1" title={t.verified}>
                              <CheckCircle size={12} fill="currentColor" className="fill-emerald-500/20" />
                              <span className="text-[9px] font-bold uppercase tracking-wider">{t.verified}</span>
                            </div>
                          )}
                          {dataset.userRating && (
                            <div className="flex items-center gap-1 text-amber-500 text-[10px] font-bold mt-1">
                              <span>★</span>
                              <span>{dataset.userRating}</span>
                              <span className="opacity-40 text-inherit">({dataset.userReviewsCount || 0})</span>
                            </div>
                          )}
                        </div>
                        <div className={cn(
                          "px-2 py-0.5 rounded text-[9px] font-bold border shrink-0",
                          getFormatBadgeClass(dataset.format)
                        )}>
                          {dataset.format}
                        </div>
                      </div>

                      <div className="text-[10px] opacity-40 mb-1 line-clamp-1">
                        {DOMAINS.find(d => d.id === dataset.domainId)?.name[language]} &gt; {DOMAINS.find(d => d.id === dataset.domainId)?.categories.find(c => c.id === dataset.categoryId)?.name[language]}
                      </div>
                      {dataset.ownerName && (
                        <div className="text-[10px] opacity-40 mb-4 truncate italic">
                          {t.authorRole}: {dataset.ownerName}
                        </div>
                      )}

                      <div className="mt-auto space-y-4">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="opacity-40">{DEPARTMENTS.find(d => d.id === dataset.departmentId)?.name[language]}</span>
                          <span className="font-bold opacity-60">{formatDate(dataset.lastUpdated, language)}</span>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-bold uppercase tracking-wider opacity-40">{t.quality}</span>
                            <span className="text-[10px] font-bold">{dataset.qualityScore}%</span>
                          </div>
                          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                            <div 
                              className={cn("h-full rounded-full", getQualityColor(dataset.qualityScore))}
                              style={{ width: `${dataset.qualityScore}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Tree View for Results
              <div className="space-y-6">
                {DOMAINS.map(domain => {
                  const domainDatasets = filteredDatasets.filter(d => d.domainId === domain.id);
                  if (domainDatasets.length === 0) return null;

                  return (
                    <div key={domain.id} className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
                          {getDomainIcon(domain.icon)}
                        </div>
                        <h2 className="text-lg font-bold">{domain.name[language]}</h2>
                        <span className="px-2 py-0.5 rounded-full bg-white/5 text-[10px] font-bold opacity-40">{domainDatasets.length}</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-12">
                        {domain.categories.map(cat => {
                          const catDatasets = domainDatasets.filter(d => d.categoryId === cat.id);
                          if (catDatasets.length === 0) return null;

                          return (
                            <div key={cat.id} className="space-y-3">
                              <h3 className="text-xs font-bold opacity-40 uppercase tracking-widest flex items-center gap-2">
                                <ChevronDown size={14} />
                                {cat.name[language]}
                                <span className="text-[10px] opacity-40">({catDatasets.length})</span>
                              </h3>
                              <div className="space-y-2">
                                {catDatasets.map(dataset => (
                                  <div 
                                    key={dataset.id}
                                    onClick={() => handleDatasetClick(dataset)}
                                    className={cn(
                                      "p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all group",
                                      theme === 'dark' ? "bg-[#121214] border-white/5 hover:bg-white/5" : "bg-white border-black/5 hover:bg-black/5"
                                    )}
                                  >
                                    <div className={cn(
                                      "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                                      getFormatBadgeClass(dataset.format).split(' ')[0]
                                    )}>
                                      {getTypeIcon(dataset.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="text-xs font-bold truncate group-hover:text-cyan-500 transition-colors">{dataset.name[language]}</div>
                                      <div className="text-[9px] opacity-40 flex items-center gap-2">
                                        <span>{dataset.format}</span>
                                        <span>•</span>
                                        <span>{dataset.qualityScore}% {t.quality}</span>
                                      </div>
                                    </div>
                                    {getAccessIcon(dataset.access)}
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>

        {/* Right Filter Sidebar (Collapsible) */}
        <AnimatePresence>
          {isFilterPanelOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className={cn(
                "border-l flex flex-col shrink-0 overflow-hidden",
                theme === 'dark' ? "bg-[#0A0A0B] border-white/5" : "bg-[#F9F9F8] border-black/5"
              )}
            >
              <div className="p-6 flex flex-col h-full">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-sm font-bold uppercase tracking-widest">{t.filters}</h3>
                  <button 
                    onClick={() => setIsFilterPanelOpen(false)}
                    className="p-2 rounded-lg hover:bg-white/5 opacity-40 hover:opacity-100"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-8 pr-2 custom-scrollbar">
                  {/* Departments Filter */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-40">{t.owner}</h4>
                    <div className="space-y-2">
                      {DEPARTMENTS.map(dept => (
                        <label key={dept.id} className="flex items-center gap-3 cursor-pointer group">
                          <input 
                            type="checkbox" 
                            checked={filterDepts.includes(dept.id)}
                            onChange={() => setFilterDepts(prev => prev.includes(dept.id) ? prev.filter(p => p !== dept.id) : [...prev, dept.id])}
                            className="w-4 h-4 rounded border-white/10 bg-white/5 text-cyan-500 focus:ring-cyan-500/50"
                          />
                          <span className="text-xs opacity-60 group-hover:opacity-100 transition-opacity truncate">{dept.name[language]}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Data Type Filter */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-40">{t.dataType}</h4>
                    <div className="flex flex-wrap gap-2">
                      {['Geodata', 'Table', 'Document', 'Raster', 'Stream'].map(type => (
                        <button
                          key={type}
                          onClick={() => setFilterTypes(prev => prev.includes(type as any) ? prev.filter(p => p !== type) : [...prev, type as any])}
                          className={cn(
                            "px-3 py-1.5 rounded-lg border text-[10px] font-bold transition-all",
                            filterTypes.includes(type as any)
                              ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-500"
                              : "bg-white/5 border-white/10 opacity-60 hover:opacity-100"
                          )}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Format Filter */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-40">{t.format}</h4>
                    <div className="flex flex-wrap gap-2">
                      {['SHP', 'GeoJSON', 'GeoTIFF', 'CSV', 'Excel', 'PDF', 'JSON', 'GTFS', 'API'].map(format => (
                        <button
                          key={format}
                          onClick={() => setFilterFormats(prev => prev.includes(format as any) ? prev.filter(p => p !== format) : [...prev, format as any])}
                          className={cn(
                            "px-3 py-1.5 rounded-lg border text-[10px] font-bold transition-all",
                            filterFormats.includes(format as any)
                              ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-500"
                              : "bg-white/5 border-white/10 opacity-60 hover:opacity-100"
                          )}
                        >
                          {format}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Frequency Filter */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-40">{t.frequency}</h4>
                    <div className="space-y-2">
                      {['Realtime', 'Daily', 'Weekly', 'Monthly', 'Quarterly', 'Annually', 'Once'].map(freq => (
                        <label key={freq} className="flex items-center gap-3 cursor-pointer group">
                          <input 
                            type="checkbox" 
                            checked={filterFrequencies.includes(freq as any)}
                            onChange={() => setFilterFrequencies(prev => prev.includes(freq as any) ? prev.filter(p => p !== freq) : [...prev, freq as any])}
                            className="w-4 h-4 rounded border-white/10 bg-white/5 text-cyan-500 focus:ring-cyan-500/50"
                          />
                          <span className="text-xs opacity-60 group-hover:opacity-100 transition-opacity">
                            {freq === 'Realtime' ? t.realtime : freq === 'Monthly' ? t.monthly : freq === 'Annually' ? t.annually : freq}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Quality Filter */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-40">{t.qualityStatus}</h4>
                    <div className="space-y-2">
                      {[
                        { id: 'high', label: t.highQuality, color: 'bg-emerald-500' },
                        { id: 'medium', label: t.mediumQuality, color: 'bg-amber-500' },
                        { id: 'low', label: t.lowQuality, color: 'bg-red-500' },
                      ].map(q => (
                        <label key={q.id} className="flex items-center gap-3 cursor-pointer group">
                          <input 
                            type="checkbox" 
                            checked={filterQuality.includes(q.id)}
                            onChange={() => setFilterQuality(prev => prev.includes(q.id) ? prev.filter(p => p !== q.id) : [...prev, q.id])}
                            className="w-4 h-4 rounded border-white/10 bg-white/5 text-cyan-500 focus:ring-cyan-500/50"
                          />
                          <div className={cn("w-2 h-2 rounded-full", q.color)}></div>
                          <span className="text-xs opacity-60 group-hover:opacity-100 transition-opacity">{q.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Access Filter */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-40">{t.accessLevel}</h4>
                    <div className="space-y-2">
                      {[
                        { id: 'Open', label: t.open, icon: Unlock },
                        { id: 'By Request', label: t.byRequest, icon: ClipboardList },
                        { id: 'Restricted', label: t.restricted, icon: Lock },
                      ].map(a => (
                        <label key={a.id} className="flex items-center gap-3 cursor-pointer group">
                          <input 
                            type="checkbox" 
                            checked={filterAccess.includes(a.id as any)}
                            onChange={() => setFilterAccess(prev => prev.includes(a.id as any) ? prev.filter(p => p !== a.id) : [...prev, a.id as any])}
                            className="w-4 h-4 rounded border-white/10 bg-white/5 text-cyan-500 focus:ring-cyan-500/50"
                          />
                          <a.icon size={14} className="opacity-40" />
                          <span className="text-xs opacity-60 group-hover:opacity-100 transition-opacity">{a.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-auto border-t border-white/5 flex gap-2">
                  <button 
                    onClick={resetFilters}
                    className="flex-1 py-2 rounded-xl border border-white/10 text-xs font-bold hover:bg-white/5 transition-all"
                  >
                    {t.reset}
                  </button>
                  <button 
                    onClick={() => setIsFilterPanelOpen(false)}
                    className="flex-1 py-2 rounded-xl bg-cyan-500 text-white text-xs font-bold hover:bg-cyan-600 transition-all"
                  >
                    {t.apply}
                  </button>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Catalog;
