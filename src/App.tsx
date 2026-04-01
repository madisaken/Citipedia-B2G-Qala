import React from 'react';
import { useApp, AppProvider } from './context';
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Passport from './pages/Passport';
import GeoAnalytics from './pages/GeoAnalytics';
import Documents from './pages/Documents';
import Governance from './pages/Governance';
import Workspace from './pages/Workspace';
import { cn } from './utils';
import { AnimatePresence, motion } from 'motion/react';

const AppContent: React.FC = () => {
  const { activePage, theme } = useApp();

  const renderPage = () => {
    switch (activePage) {
      case 'home': return <Home />;
      case 'catalog': return <Catalog />;
      case 'passport': return <Passport />;
      case 'geo': return <GeoAnalytics />;
      case 'docs': return <Documents />;
      case 'governance': return <Governance />;
      case 'workspace': return <Workspace />;
      default: return <Home />;
    }
  };

  return (
    <div className={cn(
      "flex h-screen w-full overflow-hidden transition-colors duration-300",
      theme === 'dark' ? "bg-[#0A0A0B] text-white" : "bg-[#F9F9F8] text-black"
    )}>
      <Sidebar />
      <div className="flex-1 flex flex-col relative overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full w-full overflow-y-auto"
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
