import React, { useState, useMemo } from 'react';
import { LunarMission, MissionStatus, LunarRegion } from '../types/mission';
import { formatCoordinates } from '../utils/coordinateFormatting';
import { Search, Filter, ExternalLink, ArrowRight, Compass, Calendar, Rocket, MapPin, Plus } from 'lucide-react';

interface MissionBrowserViewProps {
  missions: LunarMission[];
  selectedMissionId: string;
  onSelectMission: (mission: LunarMission) => void;
  onAnalyzeMission: (mission: LunarMission) => void;
  onOpenCustomModal?: () => void;
}

export const MissionBrowserView: React.FC<MissionBrowserViewProps> = ({
  missions,
  selectedMissionId,
  onSelectMission,
  onAnalyzeMission,
  onOpenCustomModal,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [regionFilter, setRegionFilter] = useState<string>('all');

  // Filter missions
  const filteredMissions = useMemo(() => {
    return missions.filter(m => {
      const matchesSearch =
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.lander.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.landingSite.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.contractor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
      const matchesRegion = regionFilter === 'all' || m.landingSite.region === regionFilter;

      return matchesSearch && matchesStatus && matchesRegion;
    });
  }, [missions, searchQuery, statusFilter, regionFilter]);

  const statusColor = (status: MissionStatus) => {
    switch (status) {
      case 'Completed':
        return 'text-emerald-400 bg-emerald-950/40 border-emerald-500/40';
      case 'Planned':
      case 'In Preparation':
        return 'text-cyan-400 bg-cyan-950/40 border-cyan-500/40';
      case 'Concluded':
        return 'text-slate-400 bg-slate-900 border-slate-700';
      default:
        return 'text-slate-400 bg-slate-900 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Filters bar */}
      <div className="p-5 bg-[#090D16] border border-slate-800 rounded-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="text-xs uppercase font-mono tracking-wider text-cyan-400">Public Mission Manifest</div>
            <h2 className="text-xl font-bold text-white font-display">Commercial Lunar Mission Browser</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Verified NASA CLPS task orders, post-landing flight telemetry, and lunar science landing sites
            </p>
          </div>

          <div className="flex items-center gap-3">
            {onOpenCustomModal && (
              <button
                onClick={onOpenCustomModal}
                className="px-3 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-500/40 font-semibold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Custom Coordinates</span>
              </button>
            )}

            <div className="text-xs font-mono text-slate-400">
              Showing <span className="text-white font-bold">{filteredMissions.length}</span> of {missions.length}
            </div>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2">
          {/* Search box */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by mission, lander, contractor, or landing site..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#05070B] border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Status Filter */}
          <div className="md:col-span-3">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              aria-label="Filter by mission status"
              className="w-full px-3 py-2 bg-[#05070B] border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-sans"
            >
              <option value="all">All Mission Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Planned">Planned</option>
              <option value="In Preparation">In Preparation</option>
              <option value="Concluded">Concluded</option>
            </select>
          </div>

          {/* Region Filter */}
          <div className="md:col-span-3">
            <select
              value={regionFilter}
              onChange={e => setRegionFilter(e.target.value)}
              aria-label="Filter by target lunar region"
              className="w-full px-3 py-2 bg-[#05070B] border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-sans"
            >
              <option value="all">All Lunar Regions</option>
              <option value="South Pole">South Pole</option>
              <option value="Near Side Mare">Near Side Mare</option>
              <option value="Far Side">Far Side</option>
              <option value="High Latitude">High Latitude</option>
              <option value="Equatorial">Equatorial</option>
            </select>
          </div>
        </div>
      </div>

      {/* Mission Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMissions.map(m => {
          const isSelected = m.id === selectedMissionId;

          return (
            <div
              key={m.id}
              className={`bg-[#090D16] border rounded-xl p-5 flex flex-col justify-between transition-all ${
                isSelected
                  ? 'border-cyan-500 ring-1 ring-cyan-500/40 shadow-lg'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Top line metadata */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider">
                      {m.program} · {m.taskOrder}
                    </div>
                    <h3 className="text-base font-bold text-white font-display mt-0.5">
                      {m.name}
                    </h3>
                  </div>

                  <span className={`px-2 py-0.5 text-xs font-mono font-medium rounded border ${statusColor(m.status)}`}>
                    {m.status}
                  </span>
                </div>

                {/* Core specifications */}
                <div className="grid grid-cols-2 gap-2 my-3 p-3 bg-[#05070B] border border-slate-800/80 rounded-lg text-xs">
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase block">Lander / Provider</span>
                    <span className="text-slate-200 font-medium">{m.lander}</span>
                    <div className="text-[11px] text-slate-400">{m.contractor}</div>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase block">Landing Location</span>
                    <span className="text-slate-200 font-medium">{m.landingSite.name}</span>
                    <div className="text-[11px] font-mono text-cyan-400">
                      {formatCoordinates(m.landingSite.latitude, m.landingSite.longitude)}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/60">
                    <span className="text-[10px] font-mono text-slate-500 uppercase block">Launch Date</span>
                    <span className="text-slate-300 font-mono">
                      {m.launchDate ? new Date(m.launchDate).toISOString().slice(0, 10) : 'Data unavailable'}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-800/60">
                    <span className="text-[10px] font-mono text-slate-500 uppercase block">Landing Date</span>
                    <span className="text-slate-300 font-mono">
                      {m.landingDate ? new Date(m.landingDate).toISOString().slice(0, 10) : 'Data unavailable'}
                    </span>
                  </div>
                </div>

                {/* Mission Description */}
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-3">
                  {m.description}
                </p>

                {/* Geological Setting */}
                <div className="text-xs text-slate-400 mb-3">
                  <span className="text-slate-500 font-mono text-[10px] uppercase block">Geological Setting:</span>
                  <p className="line-clamp-2">{m.landingSite.terrainDescription}</p>
                </div>
              </div>

              {/* Bottom official source & Action buttons */}
              <div className="pt-3 border-t border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px] truncate max-w-[280px]">
                    <span className="font-mono uppercase text-slate-500">Source:</span>
                    <a
                      href={m.officialSource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 underline truncate flex items-center gap-1"
                      title={m.officialSource.title}
                    >
                      <span>{m.officialSource.organization}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  </div>

                  <span className="text-[11px] font-mono text-slate-500">
                    {m.payloads.length} Payloads
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectMission(m)}
                    className={`flex-1 py-2 px-3 text-xs font-medium rounded-lg border transition-colors ${
                      isSelected
                        ? 'bg-slate-800 text-slate-300 border-slate-700'
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    {isSelected ? 'Currently Selected' : 'Select Mission'}
                  </button>

                  <button
                    onClick={() => {
                      onSelectMission(m);
                      onAnalyzeMission(m);
                    }}
                    className="py-2 px-4 text-xs font-semibold rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <span>Run Analysis</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredMissions.length === 0 && (
        <div className="p-12 text-center bg-[#090D16] border border-slate-800 rounded-xl">
          <p className="text-slate-400 text-sm">No lunar missions found matching your filter criteria.</p>
          <button
            onClick={() => { setSearchQuery(''); setStatusFilter('all'); setRegionFilter('all'); }}
            className="mt-3 px-3 py-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-medium"
          >
            Clear Search & Filters
          </button>
        </div>
      )}
    </div>
  );
};
