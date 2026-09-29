import React from 'react';
import { Compass, Shield, Orbit, Eye, BarChart3, HelpCircle } from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Hero card */}
      <div className="p-8 bg-[#090D16] border border-slate-800 rounded-xl space-y-4">
        <div className="text-xs uppercase font-mono tracking-wider text-cyan-400">Mission Overview</div>
        <h2 className="text-2xl md:text-3xl font-bold text-white font-display">About MoonKeeper</h2>
        <p className="text-base text-slate-200 leading-relaxed">
          &ldquo;MoonKeeper is an interactive lunar mission intelligence platform designed to make lunar mission and environmental data easier to explore and understand.&rdquo;
        </p>
        <p className="text-sm text-slate-400 leading-relaxed">
          Commercial Lunar Payload Services (CLPS) landers and international science missions face a dynamic, unforgiving lunar surface environment. Unlike low Earth orbit, where day and night alternate every 90 minutes, a single lunar day lasts approximately 29.5 Earth days. Surface temperatures fluctuate from +120°C in full sunlight to below -180°C during polar night, while direct communication with Earth depends strictly on landing geometry, lunar libration, and rugged crater rim relief.
        </p>
      </div>

      {/* Core Architectural Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-[#090D16] border border-slate-800 rounded-xl space-y-2">
          <div className="p-2 w-fit rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 mb-3">
            <Orbit className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white font-display">Orbital & Selenographic Rigor</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Real mathematical transformations convert any UTC date and selenographic coordinate into local topocentric Sun and Earth elevation and azimuth angles.
          </p>
        </div>

        <div className="p-5 bg-[#090D16] border border-slate-800 rounded-xl space-y-2">
          <div className="p-2 w-fit rounded-lg bg-amber-950/60 border border-amber-500/30 text-amber-400 mb-3">
            <Eye className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white font-display">Illumination Truth</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Transparently distinguishes ambient solar illumination condition from spacecraft power generation, preventing misleading engineering assumptions.
          </p>
        </div>

        <div className="p-5 bg-[#090D16] border border-slate-800 rounded-xl space-y-2">
          <div className="p-2 w-fit rounded-lg bg-sky-950/60 border border-sky-500/30 text-sky-400 mb-3">
            <BarChart3 className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white font-display">Objective Comparison</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Compare polar, equatorial mare, and far-side landing sites based on measurable physical characteristics rather than subjective scoring.
          </p>
        </div>
      </div>

      {/* Mission Statement & Independence */}
      <div className="p-6 bg-[#090D16] border border-slate-800 rounded-xl space-y-3">
        <h3 className="text-sm uppercase font-mono tracking-wider text-slate-400">Platform Independence</h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          MoonKeeper is an independent lunar mission exploration and planning web application based on NASA/public lunar mission data. It is developed to support aerospace researchers, mission planners, students, and space enthusiasts seeking an intuitive, scientifically grounded window into commercial lunar operations.
        </p>
        <p className="text-xs text-slate-500 leading-relaxed">
          No partnership, endorsement, ownership, or development by NASA or any governmental space agency is claimed or implied. All mission specifications are compiled from public task orders and scientific releases.
        </p>
      </div>
    </div>
  );
};
