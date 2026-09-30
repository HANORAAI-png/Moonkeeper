import React from 'react';
import { LunarMission } from '../types/mission';
import { formatCoordinates } from '../utils/coordinateFormatting';
import { ArrowRight, Compass, Sun, Globe2, Clock, Sparkles, Orbit, ChevronRight } from 'lucide-react';
import heroLunarImage from '../assets/images/hero_lunar_globe_1790694965219.jpg';

interface HomeHeroViewProps {
  onExploreMissions: () => void;
  onRunAnalysis: () => void;
  featuredMission: LunarMission;
  onSelectMission: (mission: LunarMission) => void;
}

export const HomeHeroView: React.FC<HomeHeroViewProps> = ({
  onExploreMissions,
  onRunAnalysis,
  featuredMission,
  onSelectMission,
}) => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="relative rounded-2xl border border-slate-800 bg-[#070A10] overflow-hidden">
        {/* Background glow and subtle orbital ring */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 p-8 md:p-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <div className="text-xs uppercase font-mono tracking-widest text-cyan-400">
                Lunar Mission Intelligence Platform
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight font-display leading-[1.1]">
                MOONKEEPER
              </h1>
              <p className="text-lg md:text-xl font-medium text-slate-200 mt-2 font-display">
                &ldquo;Explore the Moon. Understand its Environment. Plan Lunar Missions.&rdquo;
              </p>
            </div>

            <p className="text-sm md:text-base text-slate-300 max-w-xl leading-relaxed">
              An interactive lunar mission browser for exploring commercial lunar missions, landing sites, illumination conditions, Earth visibility and mission opportunities.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onExploreMissions}
                className="px-6 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs md:text-sm tracking-wide transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2"
              >
                <span>EXPLORE MISSIONS</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onRunAnalysis}
                className="px-6 py-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-100 border border-slate-700 font-semibold text-xs md:text-sm tracking-wide transition-colors flex items-center gap-2"
              >
                <span>RUN MISSION ANALYSIS</span>
                <Compass className="w-4 h-4 text-cyan-400" />
              </button>
            </div>

            {/* Live Telemetry Teaser */}
            <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
              <div>
                FEATURED SITE: <span className="text-cyan-300 font-semibold">{featuredMission.landingSite.name}</span>
              </div>
              <span>·</span>
              <div>
                TARGET: <span className="text-slate-200">{formatCoordinates(featuredMission.landingSite.latitude, featuredMission.landingSite.longitude)}</span>
              </div>
            </div>
          </div>

          {/* Right Hero Visual with realistic generated Moon */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full max-w-[380px] aspect-square rounded-2xl overflow-hidden border border-slate-700/60 shadow-2xl group">
              <img
                src={heroLunarImage}
                alt="Realistic Lunar Moon Globe with craters and terminator"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

              {/* Floating Orbit Callout */}
              <div className="absolute bottom-4 left-4 right-4 p-3 bg-black/70 backdrop-blur-md rounded-lg border border-slate-800 text-xs">
                <div className="flex items-center justify-between font-mono">
                  <span className="text-cyan-400 text-[11px] uppercase">{featuredMission.name}</span>
                  <span className="text-slate-400 text-[10px]">{featuredMission.lander}</span>
                </div>
                <div className="text-slate-300 text-xs mt-1">
                  {featuredMission.landingSite.targetFeature}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURES Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div>
            <div className="text-xs uppercase font-mono tracking-wider text-cyan-400">Core Capabilities</div>
            <h2 className="text-xl font-bold text-white font-display">Mission Intelligence Features</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Feature 1 */}
          <div
            onClick={onExploreMissions}
            className="p-5 bg-[#090D16] border border-slate-800 hover:border-cyan-500/50 rounded-xl transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="p-2 w-fit rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 mb-3">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white font-display group-hover:text-cyan-300 transition-colors">
                Mission Browser
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Explore lunar missions and landing locations. Filter by region, mission status, and contractor.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-mono text-cyan-400 font-semibold gap-1">
              <span>View Missions</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Feature 2 */}
          <div
            onClick={onRunAnalysis}
            className="p-5 bg-[#090D16] border border-slate-800 hover:border-cyan-500/50 rounded-xl transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="p-2 w-fit rounded-lg bg-amber-950/60 border border-amber-500/30 text-amber-400 mb-3">
                <Sun className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white font-display group-hover:text-cyan-300 transition-colors">
                Lunar Environment
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Understand sunlight, illumination and lunar conditions. Differentiate ambient flux from power.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-mono text-cyan-400 font-semibold gap-1">
              <span>Analyze Environment</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Feature 3 */}
          <div
            onClick={onRunAnalysis}
            className="p-5 bg-[#090D16] border border-slate-800 hover:border-cyan-500/50 rounded-xl transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="p-2 w-fit rounded-lg bg-sky-950/60 border border-sky-500/30 text-sky-400 mb-3">
                <Globe2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white font-display group-hover:text-cyan-300 transition-colors">
                Sun & Earth Geometry
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Visualize the positions of the Sun and Earth relative to the landing site and local horizon radar.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-mono text-cyan-400 font-semibold gap-1">
              <span>View Horizon Sky Dome</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Feature 4 */}
          <div
            onClick={onRunAnalysis}
            className="p-5 bg-[#090D16] border border-slate-800 hover:border-cyan-500/50 rounded-xl transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="p-2 w-fit rounded-lg bg-indigo-950/60 border border-indigo-500/30 text-indigo-400 mb-3">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white font-display group-hover:text-cyan-300 transition-colors">
                Mission Timeline
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Explore how environmental conditions change over time across the 29.5-day synodic lunar day.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-mono text-cyan-400 font-semibold gap-1">
              <span>Open Timelines</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
