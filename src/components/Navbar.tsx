import React, { useState } from 'react';
import { LunarMission } from '../types/mission';
import { Menu, X, Rocket, Orbit } from 'lucide-react';

export type NavTab = 'explore' | 'missions' | 'analysis' | 'compare' | 'timeline' | 'sources' | 'about';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  missions: LunarMission[];
  activeMission: LunarMission;
  onSelectMission: (mission: LunarMission) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  missions,
  activeMission,
  onSelectMission,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const navLinks: Array<{ tab: NavTab; label: string }> = [
    { tab: 'explore', label: 'Explore' },
    { tab: 'missions', label: 'Missions' },
    { tab: 'analysis', label: 'Analysis' },
    { tab: 'compare', label: 'Compare' },
    { tab: 'timeline', label: 'Timeline' },
    { tab: 'sources', label: 'Data & Sources' },
    { tab: 'about', label: 'About' },
  ];

  const handleNavClick = (tab: NavTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#05070B]/90 border-b border-slate-800/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex flex-col justify-center">
          <button
            onClick={() => handleNavClick('explore')}
            className="text-left group flex flex-col"
          >
            <span className="text-lg md:text-xl font-bold tracking-tight text-white font-display leading-tight group-hover:text-cyan-400 transition-colors">
              MOONKEEPER
            </span>
            <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 group-hover:text-slate-300 transition-colors">
              Lunar Mission Intelligence
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-300">
          {navLinks.map(({ tab, label }) => {
            const isActive = currentTab === tab;
            return (
              <button
                key={tab}
                onClick={() => handleNavClick(tab)}
                className={`py-1 transition-colors whitespace-nowrap ${
                  isActive
                    ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400 -mb-[2px]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Active Mission Quick Selector */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-[#090D16] border border-slate-800 rounded-lg px-2.5 py-1">
            <span className="text-[10px] font-mono uppercase text-slate-500">Mission:</span>
            <select
              value={activeMission.id}
              onChange={e => {
                const found = missions.find(m => m.id === e.target.value);
                if (found) onSelectMission(found);
              }}
              aria-label="Active Lunar Mission Selector"
              className="bg-transparent text-xs text-cyan-300 font-medium focus:outline-none cursor-pointer max-w-[170px] truncate"
            >
              {missions.map(m => (
                <option key={m.id} value={m.id} className="bg-[#090D16] text-white">
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-[#070A10] px-4 pt-3 pb-5 space-y-3">
          <div className="flex flex-col space-y-2 text-sm font-medium">
            {navLinks.map(({ tab, label }) => (
              <button
                key={tab}
                onClick={() => handleNavClick(tab)}
                className={`text-left py-2 px-3 rounded-lg transition-colors ${
                  currentTab === tab
                    ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800">
            <label className="text-[10px] uppercase font-mono text-slate-500 block mb-1">
              Active Mission:
            </label>
            <select
              value={activeMission.id}
              onChange={e => {
                const found = missions.find(m => m.id === e.target.value);
                if (found) onSelectMission(found);
              }}
              className="w-full bg-[#05070B] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
            >
              {missions.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.landingSite.name})
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </header>
  );
};
