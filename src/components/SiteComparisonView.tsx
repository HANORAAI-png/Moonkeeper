import React, { useState, useMemo } from 'react';
import { LunarMission } from '../types/mission';
import { calculateLocalConditions } from '../utils/lunarCalculations';
import { formatCoordinates } from '../utils/coordinateFormatting';
import { Scale, Sun, Globe2, Layers, Compass, ArrowRight, ShieldCheck, HelpCircle, Calendar, Clock, RefreshCw } from 'lucide-react';
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
  // Selectors for Site A, B, and C
  const [missionAId, setMissionAId] = useState<string>(missions[0]?.id || 'clps-im-1');
  const [missionBId, setMissionBId] = useState<string>(missions[1]?.id || 'clps-blue-ghost-1');
  const [missionCId, setMissionCId] = useState<string>(missions[2]?.id || 'clps-im-2-prime1');
  const [showThreeSites, setShowThreeSites] = useState<boolean>(true); // Default to true or togglable

  // INDEPENDENT DATE COMPARISON (The challenge explicitly asks for sites AND dates)
  const [syncDates, setSyncDates] = useState<boolean>(false);
  const [dateA, setDateA] = useState<Date>(currentDate);
  const [dateB, setDateB] = useState<Date>(
    missions[1]?.landingDate ? new Date(missions[1].landingDate) : currentDate
  );
  const [dateC, setDateC] = useState<Date>(
    missions[2]?.landingDate ? new Date(missions[2].landingDate) : currentDate
  );

  const missionA = useMemo(() => missions.find(m => m.id === missionAId) || missions[0], [missions, missionAId]);
  const missionB = useMemo(() => missions.find(m => m.id === missionBId) || missions[1], [missions, missionBId]);
  const missionC = useMemo(() => missions.find(m => m.id === missionCId) || missions[2] || missions[0], [missions, missionCId]);

  // Evaluate conditions at their respective dates (or synced date)
  const effectiveDateA = syncDates ? currentDate : dateA;
  const effectiveDateB = syncDates ? currentDate : dateB;
  const effectiveDateC = syncDates ? currentDate : dateC;

  const condA = useMemo(() => calculateLocalConditions(missionA.landingSite, effectiveDateA), [missionA, effectiveDateA]);
  const condB = useMemo(() => calculateLocalConditions(missionB.landingSite, effectiveDateB), [missionB, effectiveDateB]);
  const condC = useMemo(() => calculateLocalConditions(missionC.landingSite, effectiveDateC), [missionC, effectiveDateC]);

  const comparedSites = showThreeSites ? [
    { mission: missionA, cond: condA, letter: 'A', date: effectiveDateA, setDate: setDateA, id: missionAId, setId: setMissionAId },
    { mission: missionB, cond: condB, letter: 'B', date: effectiveDateB, setDate: setDateB, id: missionBId, setId: setMissionBId },
    { mission: missionC, cond: condC, letter: 'C', date: effectiveDateC, setDate: setDateC, id: missionCId, setId: setMissionCId }
  ] : [
    { mission: missionA, cond: condA, letter: 'A', date: effectiveDateA, setDate: setDateA, id: missionAId, setId: setMissionAId },
    { mission: missionB, cond: condB, letter: 'B', date: effectiveDateB, setDate: setDateB, id: missionBId, setId: setMissionBId }
  ];

  return (
    <div className="space-y-6">
      {/* Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-[#090D16] border border-slate-800 rounded-xl">
        <div>
          <div className="text-xs uppercase font-mono tracking-wider text-cyan-400">Multi-Site & Temporal Comparison</div>
          <h2 className="text-xl font-bold text-white font-display">Landing Site & Date Comparison</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Empirical comparison of solar geometry, Earth line-of-sight, and LOLA terrain relief across landing locations and dates.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Sync Dates Toggle */}
          <button
            onClick={() => setSyncDates(!syncDates)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors flex items-center gap-1.5 ${
              syncDates
                ? 'bg-cyan-950 text-cyan-300 border-cyan-500/40'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{syncDates ? 'Dates Synced' : 'Independent Dates'}</span>
          </button>

          {/* 2 vs 3 sites toggle */}
          <button
            onClick={() => setShowThreeSites(!showThreeSites)}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            {showThreeSites ? 'Showing 3 Sites' : 'Compare 3 Sites'}
          </button>
        </div>
      </div>

      {/* Comparison Cards Grid */}
      <div className={`grid grid-cols-1 ${showThreeSites ? 'xl:grid-cols-3' : 'md:grid-cols-2'} gap-5`}>
        {comparedSites.map(({ mission, cond, letter, date, setDate, id, setId }) => (
          <div key={`${letter}-${mission.id}`} className="bg-[#090D16] border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
            {/* Header info & Mission Picker */}
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <span className="text-xs font-mono font-bold text-cyan-400">TARGET SITE {letter}</span>
                  <h3 className="text-base font-bold text-white font-display mt-0.5">{mission.landingSite.name}</h3>
                  <div className="text-xs text-slate-400">{mission.name} · {mission.lander}</div>
                </div>
                <button
                  onClick={() => onSelectMission(mission)}
                  className="px-2.5 py-1 text-xs font-medium rounded-md bg-cyan-950 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-900/60 transition-colors"
                >
                  Analyze
                </button>
              </div>

              {/* Mission Selector Dropdown */}
              <div className="mt-3">
                <label className="text-[10px] font-mono uppercase text-slate-500 block mb-1">
                  Change Mission / Target
                </label>
                <select
                  value={id}
                  onChange={e => {
                    setId(e.target.value);
                    const selected = missions.find(m => m.id === e.target.value);
                    if (selected && selected.landingDate && !syncDates) {
                      setDate(new Date(selected.landingDate));
                    }
                  }}
                  className="w-full bg-[#05070B] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-sans"
                >
                  {missions.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.landingSite.name})
                    </option>
                  ))}
                </select>
              </div>

              {/* Date & Time Selector for Site */}
              <div className="mt-3 p-2.5 bg-[#05070B] border border-slate-800 rounded-lg space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    Evaluation Date (UTC)
                  </span>
                  {syncDates && <span className="text-cyan-400 text-[10px]">Synced</span>}
                </div>

                {syncDates ? (
                  <div className="text-xs font-mono font-semibold text-slate-200 truncate">
                    {date.toUTCString()}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={date.toISOString().slice(0, 10)}
                      onChange={e => {
                        if (!e.target.value) return;
                        const [y, m, d] = e.target.value.split('-').map(Number);
                        const updated = new Date(date);
                        updated.setUTCFullYear(y, m - 1, d);
                        setDate(updated);
                      }}
                      className="flex-1 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-white font-mono"
                    />
                    <input
                      type="time"
                      value={date.toISOString().slice(11, 16)}
                      onChange={e => {
                        if (!e.target.value) return;
                        const [h, m] = e.target.value.split(':').map(Number);
                        const updated = new Date(date);
                        updated.setUTCHours(h, m, 0, 0);
                        setDate(updated);
                      }}
                      className="px-2 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-white font-mono"
                    />
                  </div>
                )}
              </div>

              {/* Coordinates & Region */}
              <div className="grid grid-cols-2 gap-2 mt-3 text-xs font-mono">
                <div className="p-2 bg-[#05070B] border border-slate-800 rounded-lg">
                  <span className="text-slate-500 block text-[10px]">COORDINATES</span>
                  <span className="text-slate-200 font-semibold tabular-nums">
                    {formatCoordinates(mission.landingSite.latitude, mission.landingSite.longitude)}
                  </span>
                </div>
                <div className="p-2 bg-[#05070B] border border-slate-800 rounded-lg">
                  <span className="text-slate-500 block text-[10px]">REGION / ELEV</span>
                  <span className="text-slate-200 font-semibold truncate block">
                    {mission.landingSite.region} ({mission.landingSite.elevationKm > 0 ? `+${mission.landingSite.elevationKm}` : mission.landingSite.elevationKm} km)
                  </span>
                </div>
              </div>

              {/* Key Environmental Parameters */}
              <div className="mt-3.5 space-y-2.5">
                {/* Sun Elevation & Terrain Occlusion */}
                <div className="p-2.5 bg-[#05070B] border border-slate-800 rounded-lg flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                      Sun Elevation
                    </div>
                    <div className="text-base font-bold font-mono tabular-nums text-white mt-0.5">
                      {cond.sunElevationDeg >= 0 ? `+${cond.sunElevationDeg.toFixed(2)}°` : `${cond.sunElevationDeg.toFixed(2)}°`}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Clearance: {cond.apparentSunElevationAboveTerrainDeg >= 0 ? `+${cond.apparentSunElevationAboveTerrainDeg.toFixed(1)}°` : `${cond.apparentSunElevationAboveTerrainDeg.toFixed(1)}°`}
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 text-xs font-mono font-medium rounded border ${
                    cond.isSunOccludedByTerrain
                      ? 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                      : cond.sunlightCondition === 'Available'
                      ? 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}>
                    {cond.isSunOccludedByTerrain ? 'Occluded' : cond.sunlightCondition}
                  </span>
                </div>

                {/* Solar Flux (Vertical Polar vs Horizontal) */}
                <div className="p-2.5 bg-[#05070B] border border-slate-800 rounded-lg flex items-center justify-between text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-slate-500 block">SOLAR FLUX (W/m²)</span>
                    <span className="text-amber-300 font-bold">
                      {cond.solarFluxVerticalSunFacingWm2.toFixed(0)} W/m² (Vert)
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block">HORIZONTAL</span>
                    <span className="text-slate-300">
                      {cond.solarFluxHorizontalWm2.toFixed(0)} W/m²
                    </span>
                  </div>
                </div>

                {/* Earth Visibility */}
                <div className="p-2.5 bg-[#05070B] border border-slate-800 rounded-lg flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                      <Globe2 className="w-3.5 h-3.5 text-sky-400" />
                      Earth Elevation
                    </div>
                    <div className="text-base font-bold font-mono tabular-nums text-white mt-0.5">
                      {cond.earthElevationDeg >= 0 ? `+${cond.earthElevationDeg.toFixed(2)}°` : `${cond.earthElevationDeg.toFixed(2)}°`}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Rim: +{cond.terrainHorizonElevDegAtEarth.toFixed(1)}°
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

                {/* Comm Architecture */}
                <div className="p-2.5 bg-[#05070B] border border-slate-800 rounded-lg text-xs">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block mb-0.5">Comm Architecture</span>
                  <span className="text-slate-300 font-medium truncate block">{mission.commArchitecture}</span>
                </div>
              </div>
            </div>

            {/* Geological Summary */}
            <div className="pt-3 border-t border-slate-800/80 text-xs text-slate-400">
              <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Geological Setting:</span>
              <p className="line-clamp-2 text-[11px] leading-relaxed">
                {mission.landingSite.terrainDescription}
              </p>
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
        MoonKeeper presents empirical differences in solar illumination, geometric Earth elevation, and LOLA crater rim terrain constraints without assigning a subjective &ldquo;best&rdquo; score. Mission site selection involves trade-offs: polar sites (e.g. Malapert A or Mons Mouton) offer proximity to cryogenic volatile traps and prolonged grazing illumination, but feature extreme local topographic shadows and low Earth elevations. Equatorial mare sites (e.g. Mare Crisium) provide high solar elevation angles and high-elevation Earth lines of sight, but endure extreme two-week cryogenic nights (-180°C) and hot solar noons (+120°C).
      </div>
    </div>
  );
};
