/**
 * MoonKeeper - Lunar Mission Intelligence
 * Independent lunar mission exploration and planning web application
 */

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { LUNAR_MISSIONS } from './data/missions';
import { LunarMission, SolarPanelConfiguration } from './types/mission';
import { calculateLunarEphemeris, calculateLocalConditions } from './utils/lunarCalculations';
import { formatCoordinates } from './utils/coordinateFormatting';
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
import { CustomLandingSiteModal } from './components/CustomLandingSiteModal';
import { Compass, Clock, MapPin, Orbit, HelpCircle, Layers, ArrowRight, Mountain, Share2, Check } from 'lucide-react';

export default function App() {
  // Parse initial state from URL query parameters (supports shareable links & persistence)
  const getInitialState = () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab') as NavTab | null;
      const missionId = params.get('mission');
      const dateParam = params.get('date');
      const panelParam = params.get('panel') as SolarPanelConfiguration | null;
      const latParam = params.get('lat');
      const lonParam = params.get('lon');

      let initialTab: NavTab = 'explore';
      if (tabParam && ['explore', 'missions', 'analysis', 'compare', 'timeline', 'sources', 'about'].includes(tabParam)) {
        initialTab = tabParam;
      }

      let initialMission = LUNAR_MISSIONS[0];
      if (missionId) {
        const found = LUNAR_MISSIONS.find(m => m.id === missionId);
        if (found) initialMission = found;
      } else if (latParam && lonParam) {
        const lat = parseFloat(latParam);
        const lon = parseFloat(lonParam);
        if (!isNaN(lat) && !isNaN(lon)) {
          initialMission = {
            id: 'custom-url-site',
            name: 'Shared Custom Site',
            lander: 'Custom Lunar Lander',
            contractor: 'Mission Planner Specification',
            program: 'Custom Mission',
            taskOrder: 'Shared Selenographic Coordinates',
            landingSite: {
              name: 'Custom Selenographic Target',
              targetFeature: `${formatCoordinates(lat, lon)}`,
              latitude: lat,
              longitude: lon,
              region: Math.abs(lat) >= 75 ? 'South Pole' : Math.abs(lon) > 90 ? 'Far Side' : 'Near Side Mare',
              elevationKm: 0.0,
              terrainDescription: 'User-specified coordinates shared via URL query parameters.',
              geologicalSignificance: 'Custom evaluated lunar location.',
              isCustomSite: true,
            },
            status: 'Planned',
            launchDate: null,
            landingDate: null,
            nominalDurationDays: 14,
            description: `Evaluated at ${formatCoordinates(lat, lon)} with LOLA topographic profiling.`,
            commArchitecture: Math.abs(lon) > 85 ? 'Orbital Relay Required (No Direct DTE)' : 'Direct-to-Earth (DTE)',
            payloads: [],
            officialSource: {
              title: 'MoonKeeper URL Parameters',
              url: 'https://ssd.jpl.nasa.gov/horizons/',
              organization: 'Custom Query',
              accessionType: 'URL Share'
            },
            milestones: [],
            missionHighlights: [`Target: ${formatCoordinates(lat, lon)}`]
          };
        }
      }

      let initialDate = new Date(initialMission.landingDate || '2024-02-22T23:23:00Z');
      if (dateParam) {
        const parsed = new Date(dateParam);
        if (!isNaN(parsed.getTime())) initialDate = parsed;
      }

      const initialPanel: SolarPanelConfiguration = panelParam && ['horizontal', 'vertical-sun-facing', 'vertical-omni', 'tilted-lander'].includes(panelParam)
        ? panelParam
        : Math.abs(initialMission.landingSite.latitude) >= 60 ? 'vertical-sun-facing' : 'horizontal';

      return { initialTab, initialMission, initialDate, initialPanel };
    } catch {
      return {
        initialTab: 'explore' as NavTab,
        initialMission: LUNAR_MISSIONS[0],
        initialDate: new Date('2024-02-22T23:23:00Z'),
        initialPanel: 'vertical-sun-facing' as SolarPanelConfiguration
      };
    }
  };

  const initial = useMemo(() => getInitialState(), []);

  // Application State
  const [currentTab, setCurrentTab] = useState<NavTab>(initial.initialTab);
  const [missionsList, setMissionsList] = useState<LunarMission[]>(() => {
    if (initial.initialMission.landingSite.isCustomSite) {
      return [initial.initialMission, ...LUNAR_MISSIONS];
    }
    return LUNAR_MISSIONS;
  });
  const [activeMission, setActiveMission] = useState<LunarMission>(initial.initialMission);
  const [currentDate, setCurrentDate] = useState<Date>(initial.initialDate);
  const [panelConfig, setPanelConfig] = useState<SolarPanelConfiguration>(initial.initialPanel);
  const [activeExplainerTopic, setActiveExplainerTopic] = useState<CalculationTopic | null>(null);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Sync state changes with URL query parameters for sharing
  useEffect(() => {
    const params = new URLSearchParams();
    params.set('tab', currentTab);
    if (activeMission.landingSite.isCustomSite) {
      params.set('lat', activeMission.landingSite.latitude.toString());
      params.set('lon', activeMission.landingSite.longitude.toString());
    } else {
      params.set('mission', activeMission.id);
    }
    params.set('date', currentDate.toISOString());
    params.set('panel', panelConfig);

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, '', newUrl);
  }, [currentTab, activeMission, currentDate, panelConfig]);

  // Share link handler
  const handleShareLink = useCallback(() => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    });
  }, []);

  // Compute live ephemeris and local environment conditions
  const ephemeris = useMemo(() => {
    return calculateLunarEphemeris(currentDate);
  }, [currentDate]);

  const conditions = useMemo(() => {
    return calculateLocalConditions(activeMission.landingSite, currentDate, ephemeris, panelConfig);
  }, [activeMission, currentDate, ephemeris, panelConfig]);

  const handleSelectMission = (mission: LunarMission) => {
    setActiveMission(mission);
    if (mission.landingDate) {
      setCurrentDate(new Date(mission.landingDate));
    }
    // Set appropriate default solar panel configuration for latitude
    if (Math.abs(mission.landingSite.latitude) >= 60) {
      setPanelConfig('vertical-sun-facing');
    } else {
      setPanelConfig('horizontal');
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

  const handleSaveCustomSite = (customMission: LunarMission) => {
    setMissionsList(prev => [customMission, ...prev.filter(m => m.id !== customMission.id)]);
    setActiveMission(customMission);
    if (Math.abs(customMission.landingSite.latitude) >= 60) {
      setPanelConfig('vertical-sun-facing');
    } else {
      setPanelConfig('horizontal');
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
        missions={missionsList}
        activeMission={activeMission}
        onSelectMission={handleSelectMission}
        onOpenCustomModal={() => setIsCustomModalOpen(true)}
        onShareLink={handleShareLink}
        isCopied={isCopied}
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
            missions={missionsList}
            selectedMissionId={activeMission.id}
            onSelectMission={handleSelectMission}
            onAnalyzeMission={handleAnalyzeMission}
            onOpenCustomModal={() => setIsCustomModalOpen(true)}
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
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">Landing Location</span>
                  <span className="text-slate-200 font-semibold">{activeMission.landingSite.name}</span>
                  <div className="text-[11px] font-mono text-cyan-400">
                    {formatCoordinates(activeMission.landingSite.latitude, activeMission.landingSite.longitude)}
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

            {/* Large Interactive Lunar Visualization with LOLA Silhouette */}
            <LunarGlobeCanvas
              site={activeMission.landingSite}
              conditions={conditions}
              ephemeris={ephemeris}
              missionName={activeMission.name}
              onOpenCustomModal={() => setIsCustomModalOpen(true)}
            />

            {/* Dual Geometry Telemetry Panels: Sun Analysis + Earth Visibility */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SunAnalysisPanel
                conditions={conditions}
                onOpenExplainer={setActiveExplainerTopic}
                onSelectPanelType={setPanelConfig}
              />
              <EarthVisibilityPanel
                conditions={conditions}
                onOpenExplainer={setActiveExplainerTopic}
                commArchitecture={activeMission.commArchitecture}
              />
            </div>

            {/* Illumination & Comm Window Timeline (defaults to 29.5d at pole + synodic summary) */}
            <IlluminationTimeline
              site={activeMission.landingSite}
              currentDate={currentDate}
              onSelectDate={setCurrentDate}
              panelConfig={panelConfig}
            />

            {/* Mission Flight Phases Timeline */}
            <MissionTimelineView
              mission={activeMission}
              currentDate={currentDate}
              onSelectMilestoneDate={setCurrentDate}
            />
          </div>
        )}

        {/* VIEW 4: LANDING SITE & DATE COMPARISON */}
        {currentTab === 'compare' && (
          <SiteComparisonView
            missions={missionsList}
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

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-500">Change Mission:</span>
                <select
                  value={activeMission.id}
                  onChange={e => {
                    const found = missionsList.find(m => m.id === e.target.value);
                    if (found) handleSelectMission(found);
                  }}
                  className="bg-[#05070B] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                >
                  {missionsList.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <DateTimeExplorer
              currentDate={currentDate}
              onDateChange={setCurrentDate}
              activeMission={activeMission}
            />

            <MissionTimelineView
              mission={activeMission}
              currentDate={currentDate}
              onSelectMilestoneDate={setCurrentDate}
            />

            <IlluminationTimeline
              site={activeMission.landingSite}
              currentDate={currentDate}
              onSelectDate={setCurrentDate}
              panelConfig={panelConfig}
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

      {/* Custom Landing Site Coordinates Modal */}
      <CustomLandingSiteModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onSaveCustomSite={handleSaveCustomSite}
        initialLat={activeMission.landingSite.latitude}
        initialLon={activeMission.landingSite.longitude}
      />

      {/* Footer */}
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
              onClick={() => setActiveExplainerTopic('lola-terrain')}
              className="hover:text-slate-300 transition-colors"
            >
              LOLA Horizon Method
            </button>
            <button
              onClick={() => setIsCustomModalOpen(true)}
              className="hover:text-cyan-400 text-cyan-500 transition-colors font-semibold"
            >
              Custom Coordinates
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
