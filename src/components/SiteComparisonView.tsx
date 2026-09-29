import React, { useState, useMemo } from 'react';
import { LunarMission } from '../types/mission';
import { calculateLocalConditions } from '../utils/lunarCalculations';
import { Scale, Sun, Globe2, Layers, Compass, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import { CalculationTopic } from './CalculationExplainerModal';

interface SiteComparisonViewProps {
  missions: LunarMission[];
  currentDate: Date;
  onSelectMission: (mission: LunarMission) => void;
  onOpenExplainer: (topic: CalculationTopic) => void;
}

export const SiteComparisonView: React.FC<SiteComparisonViewProps> = ({
  missions,
  currentDate,
  onSelectMission,
  onOpenExplainer,
}) => {
  // Allow user to select Site A and Site B (and optional Site C)
  const [missionAId, setMissionAId] = useState<string>(missions[0]?.id || 'clps-im-1');
  const [missionBId, setMissionBId] = useState<string>(missions[1]?.id || 'clps-blue-ghost-1');
  const [missionCId, setMissionCId] = useState<string>('clps-im-2-prime1');
  const [showThreeSites, setShowThreeSites] = useState<boolean>(false);

  const missionA = useMemo(() => missions.find(m => m.id === missionAId) || missions[0], [missions, missionAId]);
  const missionB = useMemo(() => missions.find(m => m.id === missionBId) || missions[1], [missions, missionBId]);
  const missionC = useMemo(() => missions.find(m => m.id === missionCId) || missions[2], [missions, missionCId]);

  // Compute live conditions for both sites at currentDate
  const condA = useMemo(() => calculateLocalConditions(missionA.landingSite, currentDate), [missionA, currentDate]);
  const condB = useMemo(() => calculateLocalConditions(missionB.landingSite, currentDate), [missionB, currentDate]);
  const condC = useMemo(() => calculateLocalConditions(missionC.landingSite, currentDate), [missionC, currentDate]);

  const comparedSites = showThreeSites ? [
    { mission: missionA, cond: condA, letter: 'A' },
    { mission: missionB, cond: condB, letter: 'B' },
    { mission: missionC, cond: condC, letter: 'C' }
  ] : [
    { mission: missionA, cond: condA, letter: 'A' },
    { mission: missionB, cond: condB, letter: 'B' }
  ];

  return (
    <div className="space-y-6">
      {/* Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-[#090D16] border border-slate-800 rounded-xl">
        <div>
          <div className="text-xs uppercase font-mono tracking-wider text-cyan-400">Multi-Site Environmental Metrics</div>
          <h2 className="text-xl font-bold text-white font-display">Landing Site & Environment Comparison</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Empirical comparison of solar elevation, Earth line-of-sight, and terrain geometry at selected date: <span className="font-mono text-cyan-300">{currentDate.toUTCString()}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setShowThreeSites(!showThreeSites)}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            {showThreeSites ? 'Compare 2 Sites' : 'Compare 3 Sites'}
          </button>
        </div>
      </div>

      {/* Selectors Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Selector A */}
        <div className="p-4 bg-[#090D16] border border-slate-800 rounded-xl">
          <label className="text-xs font-mono uppercase tracking-wider text-cyan-400 block mb-2">
            Target Site A
          </label>
          <select
            value={missionAId}
            onChange={e => setMissionAId(e.target.value)}
            className="w-full bg-[#05070B] border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 font-sans"
          >
            {missions.map(m => (
              <option key={`a-${m.id}`} value={m.id}>
                {m.name} ({m.landingSite.name})
              </option>
            ))}
          </select>
        </div>

        {/* Selector B */}
        <div className="p-4 bg-[#090D16] border border-slate-800 rounded-xl">
          <label className="text-xs font-mono uppercase tracking-wider text-cyan-400 block mb-2">
            Target Site B
          </label>
          <select
            value={missionBId}
            onChange={e => setMissionBId(e.target.value)}
            className="w-full bg-[#05070B] border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 font-sans"
          >
            {missions.map(m => (
              <option key={`b-${m.id}`} value={m.id}>
                {m.name} ({m.landingSite.name})
              </option>
            ))}
          </select>
        </div>

        {/* Selector C if enabled */}
        {showThreeSites && (
          <div className="p-4 bg-[#090D16] border border-slate-800 rounded-xl">
            <label className="text-xs font-mono uppercase tracking-wider text-cyan-400 block mb-2">
              Target Site C
            </label>
            <select
              value={missionCId}
              onChange={e => setMissionCId(e.target.value)}
              className="w-full bg-[#05070B] border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 font-sans"
            >
              {missions.map(m => (
                <option key={`c-${m.id}`} value={m.id}>
                  {m.name} ({m.landingSite.name})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Comparison Metrics Grid */}
      <div className={`grid grid-cols-1 ${showThreeSites ? 'lg:grid-cols-3' : 'md:grid-cols-2'} gap-4`}>
        {comparedSites.map(({ mission, cond, letter }) => (
          <div key={mission.id} className="bg-[#090D16] border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <span className="text-xs font-mono font-semibold text-cyan-400">SITE {letter}</span>
                  <h3 className="text-base font-bold text-white font-display">{mission.landingSite.name}</h3>
                  <div className="text-xs text-slate-400">{mission.name} · {mission.lander}</div>
                </div>
                <button
                  onClick={() => onSelectMission(mission)}
                  className="px-2.5 py-1 text-xs font-medium rounded-md bg-cyan-950 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-900/60 transition-colors"
                >
                  Analyze
                </button>
              </div>

              {/* Coordinates & Region */}
              <div className="grid grid-cols-2 gap-2 mt-3 text-xs font-mono">
                <div className="p-2 bg-[#05070B] border border-slate-800 rounded-lg">
                  <span className="text-slate-500 block text-[10px]">COORDINATES</span>
                  <span className="text-slate-200 font-semibold tabular-nums">
                    {mission.landingSite.latitude.toFixed(2)}°, {mission.landingSite.longitude.toFixed(2)}°
                  </span>
                </div>
                <div className="p-2 bg-[#05070B] border border-slate-800 rounded-lg">
                  <span className="text-slate-500 block text-[10px]">REGION / ELEVATION</span>
                  <span className="text-slate-200 font-semibold truncate block">
                    {mission.landingSite.region} ({mission.landingSite.elevationKm > 0 ? `+${mission.landingSite.elevationKm}` : mission.landingSite.elevationKm} km)
                  </span>
                </div>
              </div>

              {/* Key Environmental Parameters */}
              <div className="mt-4 space-y-3">
                {/* Sun Elevation */}
                <div className="p-3 bg-[#05070B] border border-slate-800 rounded-lg flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                      Sun Elevation
                    </div>
                    <div className="text-lg font-bold font-mono tabular-nums text-white mt-0.5">
                      {cond.sunElevationDeg >= 0 ? `+${cond.sunElevationDeg.toFixed(2)}°` : `${cond.sunElevationDeg.toFixed(2)}°`}
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 text-xs font-mono font-medium rounded border ${
                    cond.sunlightCondition === 'Available'
                      ? 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                      : cond.sunlightCondition === 'Limited'
                      ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}>
                    {cond.sunlightCondition}
                  </span>
                </div>

                {/* Earth Visibility */}
                <div className="p-3 bg-[#05070B] border border-slate-800 rounded-lg flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                      <Globe2 className="w-3.5 h-3.5 text-sky-400" />
                      Earth Elevation
                    </div>
                    <div className="text-lg font-bold font-mono tabular-nums text-white mt-0.5">
                      {cond.earthElevationDeg >= 0 ? `+${cond.earthElevationDeg.toFixed(2)}°` : `${cond.earthElevationDeg.toFixed(2)}°`}
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 text-xs font-mono font-medium rounded border ${
                    cond.earthVisibilityState === 'Visible'
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                      : cond.earthVisibilityState === 'Marginal'
                      ? 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                      : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                  }`}>
                    {cond.earthVisibilityState}
                  </span>
                </div>

                {/* Direct-to-Earth Comm Architecture */}
                <div className="p-2.5 bg-[#05070B] border border-slate-800 rounded-lg text-xs">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Comm Architecture</span>
                  <span className="text-slate-300 font-medium">{mission.commArchitecture}</span>
                </div>

                {/* Terrain Setting */}
                <div className="p-2.5 bg-[#05070B] border border-slate-800 rounded-lg text-xs">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Geological Setting</span>
                  <p className="text-slate-400 text-[11px] leading-relaxed line-clamp-3">
                    {mission.landingSite.terrainDescription}
                  </p>
                </div>
              </div>
            </div>

            {/* Scientific Payload Summary */}
            <div className="pt-3 border-t border-slate-800/80 text-xs">
              <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Primary Payload Suite ({mission.payloads.length})</span>
              <div className="flex flex-wrap gap-1">
                {mission.payloads.slice(0, 3).map((p, idx) => (
                  <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300">
                    {p.name}
                  </span>
                ))}
                {mission.payloads.length > 3 && (
                  <span className="px-1.5 py-0.5 text-[10px] font-mono text-slate-500">
                    +{mission.payloads.length - 3} more
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Comparative Analysis Discipline Note */}
      <div className="p-4 bg-[#090D16] border border-slate-800 rounded-xl text-xs text-slate-400 leading-relaxed">
        <h4 className="text-slate-200 font-semibold mb-1 flex items-center gap-1.5">
          <Scale className="w-4 h-4 text-cyan-400" />
          Comparative Analysis Methodology
        </h4>
        MoonKeeper presents empirical differences in solar illumination, geometric Earth elevation, and terrain constraints without assigning a subjective &ldquo;best&rdquo; score. Mission site selection involves trade-offs: polar sites (e.g., Malapert A or Shackleton) offer proximity to cryogenic volatile traps and prolonged grazing illumination, but feature extreme local topographic shadows and low Earth elevations. Equatorial mare sites (e.g., Mare Crisium) provide high solar elevation angles and high-elevation Earth lines of sight, but endure extreme two-week cryogenic nights (-180°C) and hot solar noons (+120°C).
      </div>
    </div>
  );
};
