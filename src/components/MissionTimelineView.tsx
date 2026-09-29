import React from 'react';
import { LunarMission, TimelineMilestone } from '../types/mission';
import { Clock, CheckCircle2, ChevronRight, Calendar, ArrowRight, Sun, Radio } from 'lucide-react';

interface MissionTimelineViewProps {
  mission: LunarMission;
  currentDate: Date;
  onSelectMilestoneDate: (date: Date) => void;
}

export const MissionTimelineView: React.FC<MissionTimelineViewProps> = ({
  mission,
  currentDate,
  onSelectMilestoneDate,
}) => {
  return (
    <div className="bg-[#090D16] border border-slate-800 rounded-xl p-5 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
        <div>
          <div className="text-xs uppercase font-mono tracking-wider text-cyan-400">Flight Architecture & Operations</div>
          <h3 className="text-lg font-semibold text-white font-display">
            {mission.name} Mission Timeline
          </h3>
        </div>
        <div className="text-xs font-mono text-slate-400">
          Target Site: <span className="text-slate-200">{mission.landingSite.name}</span>
        </div>
      </div>

      {/* Horizontal Stepper Timeline */}
      <div className="relative">
        <div className="overflow-x-auto pb-4 pt-2">
          <div className="flex items-start gap-4 min-w-[720px]">
            {mission.milestones.map((milestone, idx) => {
              const milestoneDate = new Date(milestone.targetTimestamp);
              const isPast = currentDate.getTime() >= milestoneDate.getTime();
              const isSelected = Math.abs(currentDate.getTime() - milestoneDate.getTime()) < 43200000; // within 12 hours

              return (
                <div key={idx} className="flex-1 flex flex-col items-stretch">
                  {/* Step Connector line */}
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all ${
                        isSelected
                          ? 'bg-cyan-400 text-black ring-4 ring-cyan-500/20'
                          : isPast
                          ? 'bg-slate-800 text-cyan-300 border border-cyan-500/40'
                          : 'bg-slate-900 text-slate-500 border border-slate-800'
                      }`}
                    >
                      {idx + 1}
                    </div>
                    {idx < mission.milestones.length - 1 && (
                      <div className={`flex-1 h-0.5 ${isPast ? 'bg-cyan-950 border-t border-cyan-500/30' : 'bg-slate-800'}`} />
                    )}
                  </div>

                  {/* Milestone Card */}
                  <button
                    onClick={() => onSelectMilestoneDate(milestoneDate)}
                    className={`p-3 rounded-lg border text-left transition-all flex flex-col justify-between h-full ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-500 shadow-md ring-1 ring-cyan-500/40'
                        : 'bg-[#05070B] border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 text-[11px] font-mono text-cyan-400 mb-1">
                        <span className="font-semibold uppercase tracking-wider">{milestone.phase}</span>
                        <span className="text-slate-500">{milestoneDate.toISOString().slice(0, 10)}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-100 line-clamp-1">{milestone.title}</h4>
                      <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed line-clamp-3">
                        {milestone.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span className="flex items-center gap-1">
                        <Sun className="w-3 h-3 text-amber-400" />
                        <span>~{milestone.nominalSunElevationDeg}°</span>
                      </span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${
                        milestone.expectedCommVisibility === 'Visible'
                          ? 'bg-sky-950/60 text-sky-300'
                          : milestone.expectedCommVisibility === 'Marginal'
                          ? 'bg-amber-950/60 text-amber-300'
                          : 'bg-rose-950/60 text-rose-300'
                      }`}>
                        DTE: {milestone.expectedCommVisibility}
                      </span>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Primary Mission Highlights */}
      <div className="p-4 bg-[#05070B] border border-slate-800 rounded-lg">
        <h4 className="text-xs uppercase font-mono tracking-wider text-slate-400 mb-2">
          Key Engineering & Environmental Highlights
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {mission.missionHighlights.map((highlight, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-1.5" />
              <span>{highlight}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
