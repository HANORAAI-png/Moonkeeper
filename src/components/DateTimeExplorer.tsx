import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Play, Pause, RotateCcw, FastForward, Rewind, ChevronLeft, ChevronRight } from 'lucide-react';
import { LunarMission } from '../types/mission';

interface DateTimeExplorerProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  activeMission: LunarMission;
}

export const DateTimeExplorer: React.FC<DateTimeExplorerProps> = ({
  currentDate,
  onDateChange,
  activeMission,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1); // hours per second

  // Playback timer loop
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      onDateChange(new Date(currentDate.getTime() + playbackSpeed * 3600 * 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, currentDate, onDateChange]);

  // Format UTC string for input controls
  const isoString = currentDate.toISOString();
  const datePart = isoString.slice(0, 10);
  const timePart = isoString.slice(11, 16);

  const handleDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDateStr = e.target.value;
    if (!newDateStr) return;
    const [year, month, day] = newDateStr.split('-').map(Number);
    const updated = new Date(currentDate);
    updated.setUTCFullYear(year, month - 1, day);
    onDateChange(updated);
  };

  const handleTimeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTimeStr = e.target.value;
    if (!newTimeStr) return;
    const [hours, minutes] = newTimeStr.split(':').map(Number);
    const updated = new Date(currentDate);
    updated.setUTCHours(hours, minutes, 0, 0);
    onDateChange(updated);
  };

  const stepTime = (hoursDelta: number) => {
    onDateChange(new Date(currentDate.getTime() + hoursDelta * 3600 * 1000));
  };

  // Preset triggers
  const setPreset = (preset: 'live' | 'mission-landing' | 'im1' | 'apollo11' | 'chandrayaan3') => {
    setIsPlaying(false);
    switch (preset) {
      case 'live':
        onDateChange(new Date());
        break;
      case 'mission-landing':
        if (activeMission.landingDate) {
          onDateChange(new Date(activeMission.landingDate));
        } else if (activeMission.launchDate) {
          onDateChange(new Date(activeMission.launchDate));
        }
        break;
      case 'im1':
        onDateChange(new Date('2024-02-22T23:23:00Z'));
        break;
      case 'apollo11':
        onDateChange(new Date('1969-07-20T20:17:40Z'));
        break;
      case 'chandrayaan3':
        onDateChange(new Date('2023-08-23T12:32:00Z'));
        break;
    }
  };

  return (
    <div className="p-4 bg-[#090D16] border border-slate-800 rounded-xl space-y-3">
      {/* Top bar: Current Time & Presets */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Simulation Ephemeris Time (UTC):</span>
          <span className="text-sm font-mono font-bold text-white tabular-nums">
            {currentDate.toUTCString()}
          </span>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <button
            onClick={() => setPreset('live')}
            className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-md transition-colors"
          >
            Now (UTC)
          </button>
          {activeMission.landingDate && (
            <button
              onClick={() => setPreset('mission-landing')}
              className="px-2.5 py-1 bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-500/30 rounded-md transition-colors font-medium"
            >
              {activeMission.name} Touchdown
            </button>
          )}
          <button
            onClick={() => setPreset('im1')}
            className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 rounded-md transition-colors"
          >
            IM-1 Landing
          </button>
          <button
            onClick={() => setPreset('apollo11')}
            className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 rounded-md transition-colors"
          >
            Apollo 11
          </button>
        </div>
      </div>

      {/* Manual Input Steppers & Playback Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Date & Time Selectors */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-mono">Date:</span>
            <input
              type="date"
              value={datePart}
              onChange={handleDateInput}
              aria-label="Simulation date (UTC)"
              className="px-2.5 py-1.5 bg-[#05070B] border border-slate-700 rounded-md text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-mono">Time (UTC):</span>
            <input
              type="time"
              value={timePart}
              onChange={handleTimeInput}
              aria-label="Simulation time (UTC)"
              className="px-2.5 py-1.5 bg-[#05070B] border border-slate-700 rounded-md text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Step Buttons (-1d, -1h, +1h, +1d) */}
        <div className="flex items-center gap-1 text-xs">
          <button
            onClick={() => stepTime(-24)}
            className="px-2 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded text-slate-300 font-mono transition-colors"
            title="Step backwards 1 Earth day"
          >
            -24h
          </button>
          <button
            onClick={() => stepTime(-1)}
            className="px-2 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded text-slate-300 font-mono transition-colors"
            title="Step backwards 1 hour"
          >
            -1h
          </button>

          {/* Play/Pause */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-3 py-1.5 rounded-md font-semibold flex items-center gap-1.5 transition-colors ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Simulate</span>
              </>
            )}
          </button>

          <button
            onClick={() => stepTime(1)}
            className="px-2 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded text-slate-300 font-mono transition-colors"
            title="Step forward 1 hour"
          >
            +1h
          </button>
          <button
            onClick={() => stepTime(24)}
            className="px-2 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded text-slate-300 font-mono transition-colors"
            title="Step forward 1 Earth day"
          >
            +24h
          </button>
        </div>

        {/* Playback speed selector */}
        {isPlaying && (
          <div className="flex items-center gap-1 text-xs font-mono">
            <span className="text-slate-500">Speed:</span>
            {[1, 6, 24].map(spd => (
              <button
                key={spd}
                onClick={() => setPlaybackSpeed(spd)}
                className={`px-1.5 py-0.5 rounded text-[11px] ${
                  playbackSpeed === spd
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {spd}h/s
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
