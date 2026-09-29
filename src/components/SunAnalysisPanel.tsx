import React from 'react';
import { Sun, HelpCircle, ArrowUpRight, Clock, Compass, Zap } from 'lucide-react';
import { LocalEnvironmentConditions } from '../types/mission';
import { CalculationTopic } from './CalculationExplainerModal';

interface SunAnalysisPanelProps {
  conditions: LocalEnvironmentConditions;
  onOpenExplainer: (topic: CalculationTopic) => void;
}

export const SunAnalysisPanel: React.FC<SunAnalysisPanelProps> = ({
  conditions,
  onOpenExplainer,
}) => {
  const {
    sunElevationDeg,
    sunAzimuthDeg,
    sunlightCondition,
    solarFluxEstimateWm2,
    timeUntilSunriseHours,
    timeUntilSunsetHours
  } = conditions;

  // Visual status color mapping with explicit textual semantics
  const statusStyles = {
    Available: {
      badge: 'text-amber-300 bg-amber-950/40 border-amber-500/40',
      label: 'Direct Incident Sunlight',
      dot: 'bg-amber-400'
    },
    Limited: {
      badge: 'text-cyan-300 bg-cyan-950/40 border-cyan-500/40',
      label: 'Grazing Low-Angle Sunlight',
      dot: 'bg-cyan-400'
    },
    Unavailable: {
      badge: 'text-slate-400 bg-slate-900 border-slate-700',
      label: 'Sun Below Horizon (Night)',
      dot: 'bg-slate-500'
    }
  }[sunlightCondition];

  return (
    <div className="bg-[#090D16] border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-400">
              <Sun className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold tracking-tight text-white uppercase font-display">Sun Position & Geometry</h3>
              <p className="text-xs text-slate-400">Local Selenographic Horizontal Frame</p>
            </div>
          </div>
          <button
            onClick={() => onOpenExplainer('sun-elevation')}
            className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors py-1 px-2 rounded hover:bg-slate-800/60"
            title="How is sun elevation and azimuth calculated?"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">How is this calculated?</span>
          </button>
        </div>

        {/* Primary Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          {/* Sun Elevation */}
          <div className="p-3 bg-[#05070B] border border-slate-800/80 rounded-lg">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Sun Elevation</span>
              <span className="font-mono text-[11px] text-slate-500">Angle (α☉)</span>
            </div>
            <div className="mt-1 flex items-baseline">
              <span className={`text-2xl font-bold font-mono tabular-nums ${sunElevationDeg >= 0 ? 'text-amber-300' : 'text-slate-400'}`}>
                {sunElevationDeg >= 0 ? `+${sunElevationDeg.toFixed(2)}` : sunElevationDeg.toFixed(2)}
              </span>
              <span className="text-xs font-mono text-slate-400 ml-1">deg</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-400 leading-snug">
              {sunElevationDeg > 0
                ? 'Above local horizon plane'
                : 'Below local horizon (astronomical night)'}
            </div>
          </div>

          {/* Sun Azimuth */}
          <div className="p-3 bg-[#05070B] border border-slate-800/80 rounded-lg">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Sun Azimuth</span>
              <span className="font-mono text-[11px] text-slate-500">Bearing (A☉)</span>
            </div>
            <div className="mt-1 flex items-baseline">
              <span className="text-2xl font-bold font-mono tabular-nums text-slate-100">
                {sunAzimuthDeg.toFixed(1)}
              </span>
              <span className="text-xs font-mono text-slate-400 ml-1">deg</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-400 leading-snug">
              Clockwise from True Selenographic North
            </div>
          </div>
        </div>

        {/* Sunlight Condition Status Banner */}
        <div className="mt-3.5 p-3 rounded-lg border border-slate-800 bg-[#05070B] flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-mono">Sunlight Condition</div>
            <div className="flex items-center gap-2 mt-1">
              <span className={`w-2 h-2 rounded-full ${statusStyles.dot}`} />
              <span className="text-sm font-semibold text-white">{statusStyles.label}</span>
            </div>
          </div>
          <button
            onClick={() => onOpenExplainer('illumination-condition')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md border ${statusStyles.badge}`}
          >
            {sunlightCondition}
          </button>
        </div>

        {/* Incident Solar Flux Estimate */}
        <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
          <div className="p-2.5 bg-[#05070B] border border-slate-800/80 rounded-lg">
            <div className="text-slate-400 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" />
              <span>Projected Solar Flux</span>
            </div>
            <div className="mt-1 font-mono text-sm text-slate-200 font-semibold tabular-nums">
              {solarFluxEstimateWm2 > 0 ? `${solarFluxEstimateWm2.toFixed(0)} W/m²` : '0 W/m²'}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">On horizontal regolith plane</div>
          </div>

          <div className="p-2.5 bg-[#05070B] border border-slate-800/80 rounded-lg">
            <div className="text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-cyan-400" />
              <span>Next Solar Transition</span>
            </div>
            <div className="mt-1 font-mono text-sm text-slate-200 font-semibold tabular-nums">
              {sunElevationDeg >= 0
                ? timeUntilSunsetHours !== null ? `Sunset in ~${timeUntilSunsetHours.toFixed(0)}h` : 'Continuous daylight'
                : timeUntilSunriseHours !== null ? `Sunrise in ~${timeUntilSunriseHours.toFixed(0)}h` : 'Polar night'}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Estimated spherical horizon crossing</div>
          </div>
        </div>
      </div>

      {/* Scientific Principle Disclosure */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 leading-relaxed">
        <span className="text-slate-300 font-medium">Scientific Context: </span>
        Higher Sun elevation generally means stronger illumination at the selected location. Sunlight condition describes ambient geometric exposure and does not represent actual electrical power output generated by spacecraft solar arrays.
      </div>
    </div>
  );
};
