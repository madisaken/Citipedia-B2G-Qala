import React from 'react';
import { useApp } from '../context';
import { TRANSLATIONS, MOCK_USER } from '../constants';
import { 
  Search, 
  Bell, 
  Moon, 
  Sun, 
  Globe,
  ChevronDown,
  User
} from 'lucide-react';
import { cn } from '../utils';

const TopNav: React.FC = () => {
  const { language, setLanguage, theme, setTheme } = useApp();
  const t = TRANSLATIONS[language];

  return (
    <header className={cn(
      "h-16 border-b flex items-center justify-between px-6 sticky top-0 z-50 transition-colors duration-200",
      theme === 'dark' 
        ? "bg-[#0A0A0B]/80 border-white/10 backdrop-blur-md" 
        : "bg-white/80 border-black/5 backdrop-blur-md"
    )}>
      <div className="flex-1 max-w-2xl">
        <div className={cn(
          "relative flex items-center rounded-full px-4 py-1.5 border transition-all duration-200",
          theme === 'dark' 
            ? "bg-white/5 border-white/10 focus-within:border-cyan-500/50" 
            : "bg-black/5 border-black/5 focus-within:border-cyan-500/50"
        )}>
          <Search size={16} className="text-muted-foreground mr-2" />
          <input 
            type="text" 
            placeholder={t.searchPlaceholder}
            className="bg-transparent border-none outline-none text-sm w-full py-1"
          />
          <div className="flex items-center gap-1 ml-2">
            <kbd className="px-1.5 py-0.5 rounded border border-inherit text-[10px] opacity-50">⌘</kbd>
            <kbd className="px-1.5 py-0.5 rounded border border-inherit text-[10px] opacity-50">K</kbd>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Language Switcher */}
        <div className="flex items-center bg-inherit border border-inherit rounded-lg p-0.5">
          <button 
            onClick={() => setLanguage('en')}
            className={cn(
              "px-2 py-1 text-[10px] font-bold rounded transition-all",
              language === 'en' 
                ? "bg-cyan-500 text-white" 
                : "hover:bg-white/5 opacity-50"
            )}
          >
            EN
          </button>
          <button 
            onClick={() => setLanguage('ru')}
            className={cn(
              "px-2 py-1 text-[10px] font-bold rounded transition-all",
              language === 'ru' 
                ? "bg-cyan-500 text-white" 
                : "hover:bg-white/5 opacity-50"
            )}
          >
            RU
          </button>
        </div>

        {/* Theme Toggle */}
        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-lg hover:bg-white/5 border border-inherit transition-colors"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button className="p-2 rounded-lg hover:bg-white/5 border border-inherit transition-colors relative">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-inherit"></span>
        </button>

        <div className="h-8 w-[1px] bg-inherit mx-2"></div>

        <button className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full hover:bg-white/5 transition-colors">
          <div className="text-right hidden sm:block">
            <div className={cn("text-xs font-bold", theme === 'dark' ? "text-white" : "text-black")}>{MOCK_USER.name}</div>
            <div className="text-[10px] opacity-50">{MOCK_USER.role}</div>
          </div>
          <img 
            src={MOCK_USER.avatar} 
            alt="Avatar" 
            className="w-8 h-8 rounded-full border border-inherit"
            referrerPolicy="no-referrer"
          />
          <ChevronDown size={14} className="opacity-50" />
        </button>
      </div>
    </header>
  );
};

export default TopNav;
