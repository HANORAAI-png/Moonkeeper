import React, { useState, useMemo, useEffect } from 'react';
import { LandingSite, SunlightCondition, CommVisibilityState, SolarPanelConfiguration } from '../types/mission';
import { generateEnvironmentTimeSeries, calculateSynodicSummary } from '../utils/lunarCalculations';
import { Sun, Radio, Calendar, Info, Clock, Mountain, Zap } from 'lucide-react';

interface IlluminationTimelineProps {
  site: LandingSite;
  currentDate: Date;
  onSelectDate: (date: Date) => void;
  panelConfig?: SolarPanelConfiguration;
}

export const IlluminationTimeline: React.FC<IlluminationTimelineProps> = ({
  site,
  currentDate,
  onSelectDate,
  panelConfig
}) => {
  // At polar latitudes (|lat| >= 70°), default to full 29.5-day synodic view because 24h barely shifts
  const isPolar = Math.abs(site.latitude) >= 70;
  const [timelineMode, setTimelineMode] = useState<'24h' | '30d'>(isPolar ? '30d' : '24h');

  // If site changes to polar, auto-switch to 30d
  useEffect(() => {
    if (Math.abs(site.latitude) >= 70) {
      setTimelineMode('30d');
    }
  }, [site.name, site.latitude]);

  // Generate data series based on mode
  const timeSeries = useMemo(() => {
    if (timelineMode === '24h') {
      const startDate = new Date(currentDate.getTime() - 6 * 3600 * 1000);
      return generateEnvironmentTimeSeries(site, startDate, 24, 1, panelConfig);
    } else {
      const startDate = new Date(currentDate.getTime() - 4 * 24 * 3600 * 1000);
      return generateEnvironmentTimeSeries(site, startDate, 30 * 24, 12, panelConfig);
    }
  }, [site, currentDate, timelineMode, panelConfig]);

  // Compute 29.5-day synodic summary metrics
  const synodicSummary = useMemo(() => {
    return calculateSynodicSummary(site, currentDate);
  }, [site, currentDate]);

  const getSunlightBlock = (condition: SunlightCondition, isOccluded: boolean) => {
    if (isOccluded) {
      return {
        bg: 'bg-rose-950/30 hover:bg-rose-900/40 border-rose-500/40 text-rose-300',
        dot: 'bg-rose-400',
        label: 'OCCLUDED'
      };
    }
    switch (condition) {
      case 'Available':
        return {
          bg: 'bg-amber-500/20 hover:bg-amber-500/30 border-amber-500/40 text-amber-300',
          dot: 'bg-amber-400',
          label: 'AVAILABLE'
        };
      case 'Limited':
        return {
          bg: 'bg-cyan-500/20 hover:bg-cyan-500/30 border-cyan-500/40 text-cyan-300',
          dot: 'bg-cyan-400',
          label: 'LIMITED'
        };
      case 'Unavailable':
      default:
        return {
          bg: 'bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-slate-500',
          dot: 'bg-slate-600',
          label: 'NIGHT'
        };
    }
  };

  const getCommBlock = (state: CommVisibilityState) => {
    switch (state) {
      case 'Visible':
        return {
          bg: 'bg-sky-500/20 hover:bg-sky-500/30 border-sky-500/40 text-sky-300',
          dot: 'bg-sky-400',
          label: 'VISIBLE'
        };
      case 'Marginal':
        return {
          bg: 'bg-amber-500/20 hover:bg-amber-500/30 border-amber-500/40 text-amber-300',
          dot: 'bg-amber-400',
          label: 'MARGINAL'
        };
      case 'Not Visible':
      default:
        return {
          bg: 'bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-slate-500',
          dot: 'bg-slate-600',
          label: 'NO DTE'
        };
    }
  };

  return (
    <div className="bg-[#090D16] border border-slate-800 rounded-xl p-5 space-y-4">
      {/* Header and Mode Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div>
          <h3 className="text-sm font-semibold tracking-tight text-white uppercase font-display flex items-center gap-2">
            <span>Environmental Conditions Timeline</span>
          </h3>
          <p className="text-xs text-slate-400">
            {isPolar
              ? 'South Polar site (defaults to 29.5d synodic cycle as Sun moves slowly)'
              : 'Click any step to set simulation date & topocentric geometry'}
          </p>
        </div>

        {/* Segmented Mode Button */}
        <div className="flex items-center gap-1 p-0.5 bg-slate-900 rounded-lg border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setTimelineMode('24h')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              timelineMode === '24h'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            24-Hour Horizon Pass
          </button>
          <button
            onClick={() => setTimelineMode('30d')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              timelineMode === '30d'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Full Synodic Day (29.5d)
          </button>
        </div>
      </div>

      {/* SYNODIC MONTH SUMMARY CARD (Requested for polar & mission planning) */}
      <div className="p-3.5 bg-[#05070B] border border-slate-800 rounded-lg space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            29.5-Day Lunar Synodic Month Operational Budget
          </span>
          <span className="text-[11px] font-mono text-slate-500">708.7 Total Lunar Hours</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="p-2 bg-[#090D16] border border-slate-800/80 rounded">
            <div className="text-[10px] font-mono text-slate-400">Total Sunlight Hours</div>
            <div className="text-base font-bold font-mono text-amber-300 tabular-nums">
              {synodicSummary.totalSunlightHoursMonth}h
              <span className="text-xs font-normal text-slate-400 ml-1">({synodicSummary.sunlightPercentageMonth}%)</span>
            </div>
            <div className="text-[9px] text-slate-500">Clear of local terrain</div>
          </div>

          <div className="p-2 bg-[#090D16] border border-slate-800/80 rounded">
            <div className="text-[10px] font-mono text-slate-400">Crater Rim Occultations</div>
            <div className="text-base font-bold font-mono text-rose-300 tabular-nums">
              {synodicSummary.terrainOccultationHoursMonth}h
            </div>
            <div className="text-[9px] text-slate-500">Sun above 0° but behind rim</div>
          </div>

          <div className="p-2 bg-[#090D16] border border-slate-800/80 rounded">
            <div className="text-[10px] font-mono text-slate-400">Direct-to-Earth Comm</div>
            <div className="text-base font-bold font-mono text-sky-300 tabular-nums">
              {synodicSummary.totalCommVisibleHoursMonth}h
              <span className="text-xs font-normal text-slate-400 ml-1">({synodicSummary.commPercentageMonth}%)</span>
            </div>
            <div className="text-[9px] text-slate-500">Line-of-sight visibility</div>
          </div>

          <div className="p-2 bg-[#090D16] border border-slate-800/80 rounded">
            <div className="text-[10px] font-mono text-slate-400">Sun Elev Range (Cycle)</div>
            <div className="text-sm font-bold font-mono text-slate-200 tabular-nums">
              {synodicSummary.minSunElevationDeg > 0 ? `+${synodicSummary.minSunElevationDeg}°` : `${synodicSummary.minSunElevationDeg}°`} to +{synodicSummary.maxSunElevationDeg}°
            </div>
            <div className="text-[9px] text-slate-500">Earth: {synodicSummary.minEarthElevationDeg}° to +{synodicSummary.maxEarthElevationDeg}°</div>
          </div>
        </div>
      </div>

      {/* Timeline Grid Tracks */}
      <div className="space-y-4 overflow-x-auto pb-2">
        {/* Track 1: Sun Condition & Solar Array Output */}
        <div>
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              Sunlight Condition & Solar Flux
            </span>
            <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" /> Available</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-400" /> Limited</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-400" /> Terrain Occulted</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-600" /> Below Horizon</span>
            </div>
          </div>

          <div className="grid grid-flow-col auto-cols-[minmax(72px,1fr)] gap-1.5">
            {timeSeries.map((pt, i) => {
              const dateObj = new Date(pt.timestamp);
              const isCurrent = Math.abs(dateObj.getTime() - currentDate.getTime()) < (timelineMode === '24h' ? 1800000 : 21600000);
              const styling = getSunlightBlock(pt.sunlightCondition, pt.isTerrainOccluded);

              return (
                <button
                  key={`sun-${i}`}
                  onClick={() => onSelectDate(dateObj)}
                  className={`p-2 rounded-lg border text-left flex flex-col justify-between transition-all ${styling.bg} ${
                    isCurrent ? 'ring-2 ring-cyan-400 ring-offset-1 ring-offset-[#090D16]' : ''
                  }`}
                  title={`Date: ${dateObj.toUTCString()}\nSun Elev: ${pt.sunElevation}°\nTerrain Clearance: ${pt.apparentSunElevation}°\nFlux: ${pt.solarFluxWm2} W/m²`}
                >
                  <div className="text-[10px] font-mono text-slate-400 truncate">
                    {timelineMode === '24h'
                      ? `${dateObj.getUTCHours().toString().padStart(2, '0')}:00`
                      : `${dateObj.getUTCMonth() + 1}/${dateObj.getUTCDate()}`}
                  </div>
                  <div className="my-0.5 font-mono text-xs font-bold tabular-nums">
                    {pt.sunElevation > 0 ? `+${pt.sunElevation}°` : `${pt.sunElevation}°`}
                  </div>
                  <div className="text-[10px] font-mono font-bold text-amber-200 tabular-nums">
                    {pt.solarFluxWm2} W/m²
                  </div>
                  <div className="text-[9px] font-mono truncate opacity-90 mt-0.5">
                    {styling.label}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Track 2: Potential Direct-to-Earth Comm Visibility */}
        <div>
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-sky-400" />
              Potential Direct-to-Earth Visibility Window
            </span>
            <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-sky-400" /> Visible</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" /> Marginal</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-600" /> No Direct LOS</span>
            </div>
          </div>

          <div className="grid grid-flow-col auto-cols-[minmax(72px,1fr)] gap-1.5">
            {timeSeries.map((pt, i) => {
              const dateObj = new Date(pt.timestamp);
              const isCurrent = Math.abs(dateObj.getTime() - currentDate.getTime()) < (timelineMode === '24h' ? 1800000 : 21600000);
              const styling = getCommBlock(pt.commState);

              return (
                <button
                  key={`comm-${i}`}
                  onClick={() => onSelectDate(dateObj)}
                  className={`p-2 rounded-lg border text-left flex flex-col justify-between transition-all ${styling.bg} ${
                    isCurrent ? 'ring-2 ring-cyan-400 ring-offset-1 ring-offset-[#090D16]' : ''
                  }`}
                  title={`Date: ${dateObj.toUTCString()}\nEarth Elev: ${pt.earthElevation}°\nTerrain Clearance: ${pt.apparentEarthElevation}°`}
                >
                  <div className="text-[10px] font-mono text-slate-400 truncate">
                    {timelineMode === '24h'
                      ? `${dateObj.getUTCHours().toString().padStart(2, '0')}:00`
                      : `${dateObj.getUTCMonth() + 1}/${dateObj.getUTCDate()}`}
                  </div>
                  <div className="my-1 font-mono text-xs font-bold tabular-nums">
                    {pt.earthElevation > 0 ? `+${pt.earthElevation}°` : `${pt.earthElevation}°`}
                  </div>
                  <div className="text-[9px] font-mono font-medium truncate opacity-90">
                    {styling.label}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Disclaimers & Explanations */}
      <div className="p-3 bg-[#05070B] border border-slate-800 rounded-lg text-xs text-slate-400 leading-relaxed flex items-start gap-2">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <span className="text-slate-300 font-semibold">Mission Planning Rules: </span>
          Evaluated against LRO LOLA topographic horizon profiles. Sunlight condition describes ambient illumination clear of crater rims; actual power depends on array type (vertical vs horizontal) and lander tilt. Direct-to-Earth visibility denotes line-of-sight elevation and does not guarantee link closure without RF link margin and terrestrial DSN tracking scheduling.
        </div>
      </div>
    </div>
  );
};
