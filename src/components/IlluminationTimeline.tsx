import React, { useState, useMemo } from 'react';
import { LandingSite, SunlightCondition, CommVisibilityState } from '../types/mission';
import { generateEnvironmentTimeSeries } from '../utils/lunarCalculations';
import { Sun, Radio, Calendar, Info, Clock } from 'lucide-react';

interface IlluminationTimelineProps {
  site: LandingSite;
  currentDate: Date;
  onSelectDate: (date: Date) => void;
}

export const IlluminationTimeline: React.FC<IlluminationTimelineProps> = ({
  site,
  currentDate,
  onSelectDate,
}) => {
  // Timeline mode: 24-hour detailed timeline (1-hour steps) or 29.5-day synodic month (1-day steps)
  const [timelineMode, setTimelineMode] = useState<'24h' | '30d'>('24h');

  // Generate data series based on mode
  const timeSeries = useMemo(() => {
    if (timelineMode === '24h') {
      // 24 hours starting 6 hours before current time
      const startDate = new Date(currentDate.getTime() - 6 * 3600 * 1000);
      return generateEnvironmentTimeSeries(site, startDate, 24, 1);
    } else {
      // 30 days starting 5 days before current time (29.5 synodic cycle)
      const startDate = new Date(currentDate.getTime() - 5 * 24 * 3600 * 1000);
      return generateEnvironmentTimeSeries(site, startDate, 30 * 24, 12);
    }
  }, [site, currentDate, timelineMode]);

  // Helper for sunlight color block
  const getSunlightBlock = (condition: SunlightCondition) => {
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
          label: 'UNAVAILABLE'
        };
    }
  };

  // Helper for comm visibility block
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
          label: 'NOT VISIBLE'
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
            Click any time step to update simulation date and geometry
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

      {/* Timeline Grid Container */}
      <div className="space-y-4 overflow-x-auto pb-2">
        {/* Track 1: Sun Condition */}
        <div>
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              Sunlight Condition
            </span>
            <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" /> Available (&gt;3°)</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-400" /> Limited (0°–3°)</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-600" /> Unavailable (&lt;0°)</span>
            </div>
          </div>

          <div className="grid grid-flow-col auto-cols-[minmax(64px,1fr)] gap-1.5">
            {timeSeries.map((pt, i) => {
              const dateObj = new Date(pt.timestamp);
              const isCurrent = Math.abs(dateObj.getTime() - currentDate.getTime()) < (timelineMode === '24h' ? 1800000 : 21600000);
              const styling = getSunlightBlock(pt.sunlightCondition);

              return (
                <button
                  key={`sun-${i}`}
                  onClick={() => onSelectDate(dateObj)}
                  className={`p-2 rounded-lg border text-left flex flex-col justify-between transition-all ${styling.bg} ${
                    isCurrent ? 'ring-2 ring-cyan-400 ring-offset-1 ring-offset-[#090D16]' : ''
                  }`}
                  title={`Date: ${dateObj.toUTCString()}\nSun Elev: ${pt.sunElevation}°\nCondition: ${pt.sunlightCondition}`}
                >
                  <div className="text-[10px] font-mono text-slate-400 truncate">
                    {timelineMode === '24h'
                      ? `${dateObj.getUTCHours().toString().padStart(2, '0')}:00`
                      : `${dateObj.getUTCMonth() + 1}/${dateObj.getUTCDate()}`}
                  </div>
                  <div className="my-1 font-mono text-xs font-bold tabular-nums">
                    {pt.sunElevation > 0 ? `+${pt.sunElevation}°` : `${pt.sunElevation}°`}
                  </div>
                  <div className="text-[9px] font-mono font-medium truncate opacity-90">
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
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-sky-400" /> Visible (&gt;5°)</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" /> Marginal (0°–5°)</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-600" /> Not Visible (&lt;0°)</span>
            </div>
          </div>

          <div className="grid grid-flow-col auto-cols-[minmax(64px,1fr)] gap-1.5">
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
                  title={`Date: ${dateObj.toUTCString()}\nEarth Elev: ${pt.earthElevation}°\nVisibility: ${pt.commState}`}
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
          Sunlight condition describes geometric ambient exposure only; actual solar array electrical output depends on lander attitude, dust cover, and subsystem health. Potential direct-to-Earth visibility denotes line-of-sight elevation; it does not guarantee communication link closure, which also requires RF link margins, terrestrial DSN antenna availability, and unobstructed local terrain relief.
        </div>
      </div>
    </div>
  );
};
