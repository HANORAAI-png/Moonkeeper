import React from 'react';
import { Sun, HelpCircle, Compass, Zap, Layers, Mountain, ShieldAlert } from 'lucide-react';
import { LocalEnvironmentConditions, SolarPanelConfiguration } from '../types/mission';
import { CalculationTopic } from './CalculationExplainerModal';

interface SunAnalysisPanelProps {
  conditions: LocalEnvironmentConditions;
  onOpenExplainer: (topic: CalculationTopic) => void;
  onSelectPanelType: (config: SolarPanelConfiguration) => void;
}

export const SunAnalysisPanel: React.FC<SunAnalysisPanelProps> = ({
  conditions,
  onOpenExplainer,
  onSelectPanelType
}) => {
  const {
    sunElevationDeg,
    sunAzimuthDeg,
    sunlightCondition,
    solarFluxEstimateWm2,
    solarFluxHorizontalWm2,
    solarFluxVerticalSunFacingWm2,
    selectedPanelType,
    terrainHorizonElevDegAtSun,
    isSunOccludedByTerrain,
    apparentSunElevationAboveTerrainDeg,
    timeUntilSunriseHours,
    timeUntilSunsetHours
  } = conditions;

  const statusStyles = {
    Available: {
      badge: 'text-amber-300 bg-amber-950/40 border-amber-500/40',
      label: isSunOccludedByTerrain ? 'Occluded by Local Terrain' : 'Direct Incident Sunlight',
      dot: 'bg-amber-400'
    },
    Limited: {
      badge: 'text-cyan-300 bg-cyan-950/40 border-cyan-500/40',
      label: 'Grazing Low-Angle Sunlight',
      dot: 'bg-cyan-400'
    },
    Unavailable: {
      badge: 'text-slate-400 bg-slate-900 border-slate-700',
      label: isSunOccludedByTerrain ? 'Occluded by Terrain / Crater Rim' : 'Sun Below Horizon (Night)',
      dot: 'bg-slate-500'
    }
  }[sunlightCondition];

  return (
    <div className="bg-[#090D16] border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-400">
              <Sun className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold tracking-tight text-white uppercase font-display">Sun Position & Illumination</h3>
              <p className="text-xs text-slate-400">Local Topocentric Frame with LOLA Topography</p>
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
                ? 'Above mean spherical horizon'
                : 'Below spherical horizon (astronomical night)'}
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

        {/* LOLA Local Terrain Clearance Banner */}
        <div className={`mt-3 p-3 rounded-lg border flex items-center justify-between ${
          isSunOccludedByTerrain
            ? 'bg-rose-950/30 border-rose-500/40 text-rose-300'
            : 'bg-[#05070B] border-slate-800 text-slate-300'
        }`}>
          <div className="flex items-center gap-2">
            <Mountain className={`w-4 h-4 ${isSunOccludedByTerrain ? 'text-rose-400' : 'text-cyan-400'}`} />
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                LOLA Terrain Horizon at Azimuth {sunAzimuthDeg.toFixed(0)}°
              </div>
              <div className="text-xs font-semibold mt-0.5">
                {isSunOccludedByTerrain
                  ? `Occluded by Crater Rim (Horizon is +${terrainHorizonElevDegAtSun.toFixed(1)}°)`
                  : `Clear of Terrain (+${apparentSunElevationAboveTerrainDeg.toFixed(1)}° above local rim)`}
              </div>
            </div>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Rim: +{terrainHorizonElevDegAtSun.toFixed(1)}°
          </span>
        </div>

        {/* Sunlight Condition Status Banner */}
        <div className="mt-3 p-3 rounded-lg border border-slate-800 bg-[#05070B] flex items-center justify-between">
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

        {/* SOLAR PANEL CONFIGURATION SELECTOR */}
        <div className="mt-3 p-3 bg-[#05070B] border border-slate-800/80 rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Solar Array Orientation
            </span>
            <span className="text-xs font-mono font-bold text-amber-300">
              {solarFluxEstimateWm2.toFixed(0)} W/m²
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={() => onSelectPanelType('vertical-sun-facing')}
              className={`p-1.5 text-left rounded border transition-colors ${
                selectedPanelType === 'vertical-sun-facing'
                  ? 'bg-amber-950/50 border-amber-500/50 text-amber-300'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="text-[10px] font-bold">Vertical (Sun-Facing)</div>
              <div className="text-[9px] font-mono text-slate-400 mt-0.5">{solarFluxVerticalSunFacingWm2.toFixed(0)} W/m² (Polar Opt)</div>
            </button>

            <button
              onClick={() => onSelectPanelType('vertical-omni')}
              className={`p-1.5 text-left rounded border transition-colors ${
                selectedPanelType === 'vertical-omni'
                  ? 'bg-amber-950/50 border-amber-500/50 text-amber-300'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="text-[10px] font-bold">Hex / Body Panels</div>
              <div className="text-[9px] font-mono text-slate-400 mt-0.5">Nova-C multi-face</div>
            </button>

            <button
              onClick={() => onSelectPanelType('horizontal')}
              className={`p-1.5 text-left rounded border transition-colors ${
                selectedPanelType === 'horizontal'
                  ? 'bg-amber-950/50 border-amber-500/50 text-amber-300'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="text-[10px] font-bold">Horizontal Flat Deck</div>
              <div className="text-[9px] font-mono text-slate-400 mt-0.5">{solarFluxHorizontalWm2.toFixed(0)} W/m² (Mare Opt)</div>
            </button>
          </div>

          <div className="text-[10px] text-slate-500 leading-snug">
            {Math.abs(conditions.sunElevationDeg) <= 10
              ? 'At low polar solar grazing angles, vertical panels receive near-maximum incident flux (~1,360 W/m²), whereas horizontal panels receive minimal flux.'
              : 'Near lunar equator at solar noon, horizontal panels receive peak flux.'}
          </div>
        </div>

        {/* Sunrise / Sunset Countdown */}
        <div className="mt-3 p-2.5 bg-[#05070B] border border-slate-800/80 rounded-lg text-xs flex items-center justify-between">
          <span className="text-slate-400 font-mono text-[11px]">Next Solar Transition:</span>
          <span className="font-mono text-slate-200 font-semibold tabular-nums">
            {sunElevationDeg >= 0
              ? timeUntilSunsetHours !== null ? `Local Sunset in ~${timeUntilSunsetHours.toFixed(0)} hours` : 'Continuous polar illumination window'
              : timeUntilSunriseHours !== null ? `Local Sunrise in ~${timeUntilSunriseHours.toFixed(0)} hours` : 'Polar night'}
          </span>
        </div>
      </div>

      {/* Scientific Principle Disclosure */}
      <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 leading-relaxed">
        <span className="text-slate-300 font-medium">Scientific Context: </span>
        Calculated with LRO LOLA topographic horizon profiling. Higher Sun elevation generally means stronger illumination at the selected location. Sunlight condition describes ambient geometric exposure and does not represent actual electrical power output generated by spacecraft solar arrays.
      </div>
    </div>
  );
};
