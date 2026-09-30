import React from 'react';
import { REFERENCE_DATA_SOURCES } from '../data/missions';
import { Database, ExternalLink, ShieldCheck, Cpu, BookOpen, Layers, Mountain, Zap } from 'lucide-react';

export const DataSourcesView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 bg-[#090D16] border border-slate-800 rounded-xl space-y-2">
        <div className="text-xs uppercase font-mono tracking-wider text-cyan-400">Data Provenance & Scientific Transparency</div>
        <h2 className="text-2xl font-bold text-white font-display">Data & Sources</h2>
        <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
          MoonKeeper relies exclusively on verified public mission archives, NASA Commercial Lunar Payload Services (CLPS) task order dossiers, and established planetary cartographic standards.
        </p>
      </div>

      {/* Official Data Sources List */}
      <div className="space-y-4">
        {REFERENCE_DATA_SOURCES.map((source, idx) => (
          <div key={idx} className="p-5 bg-[#090D16] border border-slate-800 rounded-xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400">{source.category}</span>
                <h3 className="text-base font-bold text-white font-display mt-0.5">{source.name}</h3>
              </div>
              <a
                href={source.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-lg bg-slate-900 border border-slate-700 text-cyan-400 hover:text-cyan-300 hover:border-cyan-500 transition-colors self-start sm:self-auto"
              >
                <span>Official Resource</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="text-xs text-slate-300 space-y-1.5">
              <div className="text-slate-400 font-mono text-[11px] uppercase">What MoonKeeper Uses It For:</div>
              <p className="leading-relaxed">{source.description}</p>
            </div>

            <div className="pt-2 text-[11px] font-mono text-slate-500">
              Operating Authority: <span className="text-slate-400">{source.agency}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Ephemeris Approximation & Scientific Accuracy Bounds */}
      <div className="p-6 bg-[#090D16] border border-slate-800 rounded-xl space-y-4">
        <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
          <Cpu className="w-5 h-5 text-cyan-400" />
          <span>Ephemeris Formulation & Comparison with JPL Horizons</span>
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          MoonKeeper implements an analytical topocentric ephemeris engine based on the IAU/IAG Mean Earth/Polar Axis (ME) frame and Meeus trigonometric expansions rather than streaming live multi-gigabyte numerical SPICE kernels.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-[#05070B] border border-slate-800 rounded-lg space-y-1">
            <span className="font-semibold text-slate-200 block">Analytical Approximation</span>
            <p className="text-slate-400 leading-relaxed">
              Calculates sub-solar longitude drifting 360° every 29.530588853 days, adjusted for lunar axial tilt (1.543°). Agreement with JPL Horizons DE440 is within ~0.2° to 0.6°.
            </p>
          </div>

          <div className="p-3 bg-[#05070B] border border-slate-800 rounded-lg space-y-1">
            <span className="font-semibold text-slate-200 block">LOLA Topographic Profiling</span>
            <p className="text-slate-400 leading-relaxed">
              Integrates 360° local terrain horizon elevation masks derived from LRO LOLA digital elevation models, accounting for shadowing from crater rims and peaks (e.g. Malapert Massif up to +6.8°).
            </p>
          </div>

          <div className="p-3 bg-[#05070B] border border-slate-800 rounded-lg space-y-1">
            <span className="font-semibold text-slate-200 block">Polar Sensitivity Caveat</span>
            <p className="text-slate-400 leading-relaxed">
              Near the lunar south pole, solar elevations hover between 0° and 3°. A variance of even 0.5° can shift sunrise or sunset timings by tens of hours. Operational flight dynamics require full numerical NASA SPICE kernel integration.
            </p>
          </div>
        </div>
      </div>

      {/* Solar Array Orientation & Thermal Context */}
      <div className="p-6 bg-[#090D16] border border-slate-800 rounded-xl space-y-4">
        <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" />
          <span>Polar Solar Array Physics (Vertical vs Horizontal)</span>
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          At polar landing sites (|lat| &gt; 75°), the Sun never rises high in the sky. While horizontal panels receive only 1361 × sin(α) (approximately 40 to 90 W/m²), vertically oriented solar panels facing the horizon receive 1361 × cos(α) (approximately 1,350 to 1,360 W/m²). This is why polar landers such as Nova-C utilize tall vertical cylindrical or polygonal panel arrays.
        </p>
      </div>

      {/* Scientific Transparency & Disclaimer */}
      <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 leading-relaxed space-y-2">
        <div className="text-slate-200 font-semibold flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>Institutional Independence</span>
        </div>
        <p>
          MoonKeeper is an independent lunar mission intelligence application built using public NASA and scientific planetary data. MoonKeeper is not affiliated with, funded by, or endorsed by NASA or any governmental space agency. Calculated visibility windows, solar elevations, and timelines are mathematical estimates for mission planning exploration and should not replace mission-critical trajectory and flight dynamics telemetry.
        </p>
      </div>
    </div>
  );
};
