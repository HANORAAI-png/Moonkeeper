import React from 'react';
import { Globe2, HelpCircle, Radio, AlertTriangle, CheckCircle2, XCircle, Mountain } from 'lucide-react';
import { LocalEnvironmentConditions } from '../types/mission';
import { CalculationTopic } from './CalculationExplainerModal';

interface EarthVisibilityPanelProps {
  conditions: LocalEnvironmentConditions;
  onOpenExplainer: (topic: CalculationTopic) => void;
  commArchitecture: string;
}

export const EarthVisibilityPanel: React.FC<EarthVisibilityPanelProps> = ({
  conditions,
  onOpenExplainer,
  commArchitecture
}) => {
  const {
    earthElevationDeg,
    earthAzimuthDeg,
    earthVisibilityState,
    commOpportunitySummary,
    terrainHorizonElevDegAtEarth,
    isEarthOccludedByTerrain,
    apparentEarthElevationAboveTerrainDeg,
  } = conditions;

  const visibilityStyles = {
    Visible: {
      badge: 'text-emerald-300 bg-emerald-950/40 border-emerald-500/40',
      label: 'Geometrically Above Terrain Horizon',
      icon: CheckCircle2,
      textColor: 'text-emerald-400'
    },
    Marginal: {
      badge: 'text-amber-300 bg-amber-950/40 border-amber-500/40',
      label: 'Near Terrain Horizon (Limb Margin)',
      icon: AlertTriangle,
      textColor: 'text-amber-400'
    },
    'Not Visible': {
      badge: 'text-rose-300 bg-rose-950/40 border-rose-500/40',
      label: isEarthOccludedByTerrain ? 'Occluded by Crater Rim / Mountain' : 'Below Horizon / Far Side',
      icon: XCircle,
      textColor: 'text-rose-400'
    }
  }[earthVisibilityState];

  const StatusIcon = visibilityStyles.icon;

  return (
    <div className="bg-[#090D16] border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-sky-950/40 border border-sky-500/30 text-sky-400">
              <Globe2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold tracking-tight text-white uppercase font-display">Earth Visibility & Geometry</h3>
              <p className="text-xs text-slate-400">Direct-to-Earth Line of Sight with LOLA Relief</p>
            </div>
          </div>
          <button
            onClick={() => onOpenExplainer('earth-visibility')}
            className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors py-1 px-2 rounded hover:bg-slate-800/60"
            title="How is Earth visibility calculated?"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">How is this calculated?</span>
          </button>
        </div>

        {/* Primary Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          {/* Earth Elevation */}
          <div className="p-3 bg-[#05070B] border border-slate-800/80 rounded-lg">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Earth Elevation</span>
              <span className="font-mono text-[11px] text-slate-500">Angle (α⊕)</span>
            </div>
            <div className="mt-1 flex items-baseline">
              <span className={`text-2xl font-bold font-mono tabular-nums ${earthElevationDeg >= 0 ? 'text-sky-300' : 'text-rose-400'}`}>
                {earthElevationDeg >= 0 ? `+${earthElevationDeg.toFixed(2)}` : earthElevationDeg.toFixed(2)}
              </span>
              <span className="text-xs font-mono text-slate-400 ml-1">deg</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-400 leading-snug">
              {earthElevationDeg > 0
                ? 'Above spherical horizon'
                : 'Below spherical horizon (occluded by lunar body)'}
            </div>
          </div>

          {/* Earth Azimuth */}
          <div className="p-3 bg-[#05070B] border border-slate-800/80 rounded-lg">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Earth Azimuth</span>
              <span className="font-mono text-[11px] text-slate-500">Bearing (A⊕)</span>
            </div>
            <div className="mt-1 flex items-baseline">
              <span className="text-2xl font-bold font-mono tabular-nums text-slate-100">
                {earthAzimuthDeg.toFixed(1)}
              </span>
              <span className="text-xs font-mono text-slate-400 ml-1">deg</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-400 leading-snug">
              Clockwise from True Selenographic North
            </div>
          </div>
        </div>

        {/* LOLA Local Terrain Clearance Banner for Earth */}
        <div className={`mt-3 p-3 rounded-lg border flex items-center justify-between ${
          isEarthOccludedByTerrain
            ? 'bg-rose-950/30 border-rose-500/40 text-rose-300'
            : 'bg-[#05070B] border-slate-800 text-slate-300'
        }`}>
          <div className="flex items-center gap-2">
            <Mountain className={`w-4 h-4 ${isEarthOccludedByTerrain ? 'text-rose-400' : 'text-sky-400'}`} />
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                LOLA Terrain Horizon at Earth Bearing ({earthAzimuthDeg.toFixed(0)}°)
              </div>
              <div className="text-xs font-semibold mt-0.5">
                {isEarthOccludedByTerrain
                  ? `Earth occluded by local ridge (Rim is +${terrainHorizonElevDegAtEarth.toFixed(1)}°)`
                  : `Line of sight clear of terrain (+${apparentEarthElevationAboveTerrainDeg.toFixed(1)}° above local rim)`}
              </div>
            </div>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Rim: +{terrainHorizonElevDegAtEarth.toFixed(1)}°
          </span>
        </div>

        {/* Earth Visibility State Banner */}
        <div className="mt-3 p-3 rounded-lg border border-slate-800 bg-[#05070B] flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-mono">Geometric Visibility State</div>
            <div className="flex items-center gap-2 mt-1">
              <StatusIcon className={`w-4 h-4 ${visibilityStyles.textColor}`} />
              <span className="text-sm font-semibold text-white">{visibilityStyles.label}</span>
            </div>
          </div>
          <button
            onClick={() => onOpenExplainer('lunar-libration')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md border ${visibilityStyles.badge}`}
          >
            {earthVisibilityState}
          </button>
        </div>

        {/* Communication Opportunity Assessment */}
        <div className="mt-3 p-3 bg-[#05070B] border border-slate-800/80 rounded-lg text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-mono uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-cyan-400" />
              Communication Opportunity
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              {commArchitecture}
            </span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            {commOpportunitySummary}
          </p>
        </div>
      </div>

      {/* Scientific Principle Disclosure */}
      <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 leading-relaxed">
        <span className="text-slate-300 font-medium">Communication Rule: </span>
        Direct-to-Earth communication depends on whether Earth is geometrically visible from the landing location and on mission/system constraints. Topographic blockage and lander attitude (such as IM-1 tipping onto its side) severely impact high-gain antenna link margins even when Earth is geometrically above the horizon.
      </div>
    </div>
  );
};
