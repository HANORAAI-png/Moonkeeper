/**
 * MoonKeeper - Lunar Mission Intelligence
 * Independent lunar mission exploration and planning web application
 */

import React, { useState, useMemo } from 'react';
import { LUNAR_MISSIONS } from './data/missions';
import { LunarMission } from './types/mission';
import { calculateLunarEphemeris, calculateLocalConditions } from './utils/lunarCalculations';
import { Navbar, NavTab } from './components/Navbar';
import { HomeHeroView } from './components/HomeHeroView';
import { MissionBrowserView } from './components/MissionBrowserView';
import { LunarGlobeCanvas } from './components/LunarGlobeCanvas';
import { SunAnalysisPanel } from './components/SunAnalysisPanel';
import { EarthVisibilityPanel } from './components/EarthVisibilityPanel';
import { IlluminationTimeline } from './components/IlluminationTimeline';
import { MissionTimelineView } from './components/MissionTimelineView';
import { SiteComparisonView } from './components/SiteComparisonView';
import { DateTimeExplorer } from './components/DateTimeExplorer';
import { DataSourcesView } from './components/DataSourcesView';
import { AboutView } from './components/AboutView';
import { CalculationExplainerModal, CalculationTopic } from './components/CalculationExplainerModal';
import { Compass, Clock, MapPin, Orbit, HelpCircle, Layers, ArrowRight } from 'lucide-react';

export default function App() {
  // Navigation State
  const [currentTab, setCurrentTab] = useState<NavTab>('explore');

  // Active Mission State (default to IM-1 Odysseus)
  const [activeMission, setActiveMission] = useState<LunarMission>(LUNAR_MISSIONS[0]);

  // Simulation Ephemeris Date State (default to IM-1 landing date or current time)
  const [currentDate, setCurrentDate] = useState<Date>(
    new Date(LUNAR_MISSIONS[0].landingDate || '2024-02-22T23:23:00Z')
  );

  // Active Explainer Modal State
  const [activeExplainerTopic, setActiveExplainerTopic] = useState<CalculationTopic | null>(null);

  // Calculate live ephemeris and topocentric environment conditions
  const ephemeris = useMemo(() => {
    return calculateLunarEphemeris(currentDate);
  }, [currentDate]);

  const conditions = useMemo(() => {
    return calculateLocalConditions(activeMission.landingSite, currentDate, ephemeris);
  }, [activeMission, currentDate, ephemeris]);

  // Handler when mission is selected
  const handleSelectMission = (mission: LunarMission) => {
    setActiveMission(mission);
    // If the mission has a specific landing date, jump to it
    if (mission.landingDate) {
      setCurrentDate(new Date(mission.landingDate));
    }
  };

  const handleAnalyzeMission = (mission: LunarMission) => {
    setActiveMission(mission);
    if (mission.landingDate) {
      setCurrentDate(new Date(mission.landingDate));
    }
    setCurrentTab('analysis');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#05070B] text-slate-100 flex flex-col font-sans">
      {/* Top Bar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        missions={LUNAR_MISSIONS}
        activeMission={activeMission}
        onSelectMission={handleSelectMission}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* VIEW 1: HOME / EXPLORE */}
        {currentTab === 'explore' && (
          <HomeHeroView
            onExploreMissions={() => setCurrentTab('missions')}
            onRunAnalysis={() => setCurrentTab('analysis')}
            featuredMission={activeMission}
            onSelectMission={handleSelectMission}
          />
        )}

        {/* VIEW 2: MISSIONS BROWSER */}
        {currentTab === 'missions' && (
          <MissionBrowserView
            missions={LUNAR_MISSIONS}
            selectedMissionId={activeMission.id}
            onSelectMission={handleSelectMission}
            onAnalyzeMission={handleAnalyzeMission}
          />
        )}

        {/* VIEW 3: MISSION ANALYSIS */}
        {currentTab === 'analysis' && (
          <div className="space-y-6">
            {/* Mission Overview Header */}
            <div className="p-5 bg-[#090D16] border border-slate-800 rounded-xl space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <div className="text-xs uppercase font-mono tracking-wider text-cyan-400">
                    Mission Analysis Console
                  </div>
                  <h2 className="text-2xl font-bold text-white font-display mt-0.5">
                    {activeMission.name}
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono text-slate-400">
                    Program: <span className="text-slate-200">{activeMission.program}</span> ({activeMission.taskOrder})
                  </span>
                  <span className="text-slate-600">·</span>
                  <span className="text-xs font-mono text-cyan-300">
                    Status: {activeMission.status}
                  </span>
                </div>
              </div>

              {/* Specification Attributes */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
                <div className="p-2.5 bg-[#05070B] border border-slate-800 rounded-lg">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">Lander</span>
                  <span className="text-slate-200 font-semibold">{activeMission.lander}</span>
                  <div className="text-[11px] text-slate-400">{activeMission.contractor}</div>
                </div>

                <div className="p-2.5 bg-[#05070B] border border-slate-800 rounded-lg">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">Landing Site</span>
                  <span className="text-slate-200 font-semibold">{activeMission.landingSite.name}</span>
                  <div className="text-[11px] font-mono text-cyan-400">
                    {activeMission.landingSite.latitude.toFixed(2)}°, {activeMission.landingSite.longitude.toFixed(2)}°
                  </div>
                </div>

                <div className="p-2.5 bg-[#05070B] border border-slate-800 rounded-lg">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">Region / Elevation</span>
                  <span className="text-slate-200 font-semibold">{activeMission.landingSite.region}</span>
                  <div className="text-[11px] font-mono text-slate-400">
                    {activeMission.landingSite.elevationKm > 0 ? `+${activeMission.landingSite.elevationKm}` : activeMission.landingSite.elevationKm} km MSL
                  </div>
                </div>

                <div className="p-2.5 bg-[#05070B] border border-slate-800 rounded-lg">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">Local Lunar Time</span>
                  <span className="text-amber-300 font-mono font-bold text-sm tabular-nums">
                    {Math.floor(conditions.localLunarTimeHours).toString().padStart(2, '0')}:
                    {Math.floor((conditions.localLunarTimeHours % 1) * 60).toString().padStart(2, '0')}
                  </span>
                  <button
                    onClick={() => setActiveExplainerTopic('local-lunar-time')}
                    className="text-[10px] text-cyan-400 hover:underline block text-left"
                  >
                    Lunar Solar Time info
                  </button>
                </div>

                <div className="p-2.5 bg-[#05070B] border border-slate-800 rounded-lg">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">Comm Architecture</span>
                  <span className="text-slate-200 font-semibold truncate block" title={activeMission.commArchitecture}>
                    {activeMission.commArchitecture}
                  </span>
                  <div className="text-[11px] font-mono text-slate-400">
                    DTE: {conditions.earthVisibilityState}
                  </div>
                </div>
              </div>
            </div>

            {/* Date / Time Simulation Controller */}
            <DateTimeExplorer
              currentDate={currentDate}
              onDateChange={setCurrentDate}
              activeMission={activeMission}
            />

            {/* Large Interactive Lunar Visualization */}
            <LunarGlobeCanvas
              site={activeMission.landingSite}
              conditions={conditions}
              ephemeris={ephemeris}
              missionName={activeMission.name}
            />

            {/* Dual Geometry Telemetry Panels: Sun Analysis + Earth Visibility */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SunAnalysisPanel
                conditions={conditions}
                onOpenExplainer={setActiveExplainerTopic}
              />
              <EarthVisibilityPanel
                conditions={conditions}
                onOpenExplainer={setActiveExplainerTopic}
                commArchitecture={activeMission.commArchitecture}
              />
            </div>

            {/* Illumination & Comm Window Timeline */}
            <IlluminationTimeline
              site={activeMission.landingSite}
              currentDate={currentDate}
              onSelectDate={setCurrentDate}
            />

            {/* Mission Flight Phases Timeline */}
            <MissionTimelineView
              mission={activeMission}
              currentDate={currentDate}
              onSelectMilestoneDate={setCurrentDate}
            />
          </div>
        )}

        {/* VIEW 4: LANDING SITE COMPARISON */}
        {currentTab === 'compare' && (
          <SiteComparisonView
            missions={LUNAR_MISSIONS}
            currentDate={currentDate}
            onSelectMission={handleAnalyzeMission}
            onOpenExplainer={setActiveExplainerTopic}
          />
        )}

        {/* VIEW 5: MISSION TIMELINE FOCUS */}
        {currentTab === 'timeline' && (
          <div className="space-y-6">
            <div className="p-5 bg-[#090D16] border border-slate-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div className="text-xs uppercase font-mono tracking-wider text-cyan-400">Temporal Geometry & Operations</div>
                <h2 className="text-xl font-bold text-white font-display">Mission Environmental Timelines</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Analyzing temporal variations for <span className="text-cyan-300 font-semibold">{activeMission.name}</span> at {activeMission.landingSite.name}
                </p>
              </div>

              {/* Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-500">Change Mission:</span>
                <select
                  value={activeMission.id}
                  onChange={e => {
                    const found = LUNAR_MISSIONS.find(m => m.id === e.target.value);
                    if (found) handleSelectMission(found);
                  }}
                  className="bg-[#05070B] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                >
                  {LUNAR_MISSIONS.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Time controller */}
            <DateTimeExplorer
              currentDate={currentDate}
              onDateChange={setCurrentDate}
              activeMission={activeMission}
            />

            {/* Flight Milestones */}
            <MissionTimelineView
              mission={activeMission}
              currentDate={currentDate}
              onSelectMilestoneDate={setCurrentDate}
            />

            {/* 24h & 30d environmental curves */}
            <IlluminationTimeline
              site={activeMission.landingSite}
              currentDate={currentDate}
              onSelectDate={setCurrentDate}
            />
          </div>
        )}

        {/* VIEW 6: DATA & SOURCES */}
        {currentTab === 'sources' && <DataSourcesView />}

        {/* VIEW 7: ABOUT MOONKEEPER */}
        {currentTab === 'about' && <AboutView />}
      </main>

      {/* Scientific Explainer Modal */}
      <CalculationExplainerModal
        topic={activeExplainerTopic}
        onClose={() => setActiveExplainerTopic(null)}
      />

      {/* Professional Footer */}
      <footer className="w-full bg-[#05070B] border-t border-slate-800/80 py-8 px-4 sm:px-6 lg:px-8 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-center md:items-start gap-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-300 font-display">MOONKEEPER</span>
              <span>·</span>
              <span>Lunar Mission Intelligence</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Independent lunar mission exploration and planning application based on public planetary data.
            </p>
          </div>

          <div className="flex items-center gap-6 text-[11px]">
            <button
              onClick={() => setCurrentTab('sources')}
              className="hover:text-slate-300 transition-colors"
            >
              Data & Sources
            </button>
            <button
              onClick={() => setCurrentTab('about')}
              className="hover:text-slate-300 transition-colors"
            >
              About
            </button>
            <button
              onClick={() => setActiveExplainerTopic('sun-elevation')}
              className="hover:text-slate-300 transition-colors"
            >
              Methodology
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
