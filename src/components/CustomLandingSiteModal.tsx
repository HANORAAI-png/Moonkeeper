import React, { useState } from 'react';
import { LandingSite, LunarMission, LunarRegion } from '../types/mission';
import { formatCoordinates, formatLatitude, formatLongitude } from '../utils/coordinateFormatting';
import { X, MapPin, Compass, Sliders, Check, Sparkles } from 'lucide-react';

interface CustomLandingSiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveCustomSite: (mission: LunarMission) => void;
  initialLat?: number;
  initialLon?: number;
}

const PRESET_CUSTOM_TARGETS = [
  { name: 'Artemis Base Camp Concept (Shackleton)', lat: -89.90, lon: 0.00, region: 'South Pole' as LunarRegion, desc: 'Candidate permanent surface habitat outpost located on peak of persistent light.' },
  { name: 'Amundsen Crater Rim', lat: -84.50, lon: 85.60, region: 'South Pole' as LunarRegion, desc: 'High elevation rim crest overlooking extensive cryogenic cold traps.' },
  { name: 'Aristarchus Plateau', lat: 23.73, lon: -47.49, region: 'Near Side Mare' as LunarRegion, desc: 'Elevated volcanic crustal plateau featuring extensive pyroclastic deposits and Vallis Schröteri rille.' },
  { name: 'Copernicus Crater Floor', lat: 9.62, lon: -20.08, region: 'Equatorial' as LunarRegion, desc: 'Central rebound peak exposing deep lunar crustal olivine minerals.' },
  { name: 'Tsiolkovskiy Basin (Far Side)', lat: -20.40, lon: 129.10, region: 'Far Side' as LunarRegion, desc: 'Striking dark mare-floored far-side impact crater shielded from Earth radio frequencies.' }
];

export const CustomLandingSiteModal: React.FC<CustomLandingSiteModalProps> = ({
  isOpen,
  onClose,
  onSaveCustomSite,
  initialLat = -85.0,
  initialLon = 0.0
}) => {
  const [siteName, setSiteName] = useState<string>('Custom Expedition Site');
  const [latitude, setLatitude] = useState<number>(initialLat);
  const [longitude, setLongitude] = useState<number>(initialLon);
  const [terrainType, setTerrainType] = useState<string>('polar-highland');

  if (!isOpen) return null;

  // Auto-classify region based on lat / lon
  const getAutoRegion = (lat: number, lon: number): LunarRegion => {
    if (Math.abs(lat) >= 75) return 'South Pole';
    if (Math.abs(lon) > 90) return 'Far Side';
    if (Math.abs(lat) <= 15) return 'Equatorial';
    if (Math.abs(lat) >= 40) return 'High Latitude';
    return 'Near Side Mare';
  };

  const handleApply = () => {
    const region = getAutoRegion(latitude, longitude);
    const commArch = Math.abs(longitude) > 85
      ? 'Orbital Relay Required (No Direct DTE)'
      : 'Direct-to-Earth (DTE)';

    const customMission: LunarMission = {
      id: `custom-site-${Date.now()}`,
      name: siteName.trim() || 'Custom Lunar Site',
      lander: 'Generic Exploration Lander / Research Station',
      contractor: 'Mission Planner Specification',
      program: 'Custom Mission',
      taskOrder: 'User-Defined Selenographic Target',
      landingSite: {
        name: siteName.trim() || 'Custom Lunar Site',
        targetFeature: `${formatCoordinates(latitude, longitude)} (${region})`,
        latitude: parseFloat(latitude.toFixed(4)),
        longitude: parseFloat(longitude.toFixed(4)),
        region,
        elevationKm: Math.abs(latitude) > 70 ? 1.5 : -1.0,
        terrainDescription: `User-defined landing coordinates at ${formatCoordinates(latitude, longitude)}. Terrain modeled with ${terrainType === 'polar-highland' ? 'LOLA Polar Highland Profile' : 'LOLA Baseline Plain'}.`,
        geologicalSignificance: 'Custom research location evaluated for solar illumination windows and direct-to-Earth radio visibility.',
        isCustomSite: true,
      },
      status: 'Planned',
      launchDate: null,
      landingDate: null,
      nominalDurationDays: 14,
      description: `Custom expedition site entered by user at ${formatCoordinates(latitude, longitude)}. Fully integrated with dynamic LOLA horizon profiling, solar geometry, and direct-to-Earth line-of-sight calculations.`,
      commArchitecture: commArch,
      payloads: [
        { name: 'Surface Telemetry Sensor', provider: 'Mission Operations', objective: 'Local regolith temperature and solar flux monitoring', category: 'Science' },
        { name: 'Communication Transceiver', provider: 'Flight Avionics', objective: 'Line-of-sight RF communications tracking', category: 'Technology Demo' }
      ],
      officialSource: {
        title: 'User-Defined Coordinates (MoonKeeper Interactive Tool)',
        url: 'https://ssd.jpl.nasa.gov/horizons/',
        organization: 'Independent Planning Session',
        accessionType: 'Custom Simulation'
      },
      milestones: [
        { phase: 'Planning', title: 'Target Coordinates Selected', targetTimestamp: new Date().toISOString(), description: `Custom coordinates set to ${formatCoordinates(latitude, longitude)}.`, nominalSunElevationDeg: 0, expectedCommVisibility: commArch === 'Direct-to-Earth (DTE)' ? 'Visible' : 'Not Visible' }
      ],
      missionHighlights: [
        `Custom Selenographic Target at ${formatCoordinates(latitude, longitude)}`,
        `Region Classification: ${region}`,
        `Communication Architecture: ${commArch}`
      ]
    };

    onSaveCustomSite(customMission);
    onClose();
  };

  const applyPreset = (preset: typeof PRESET_CUSTOM_TARGETS[0]) => {
    setSiteName(preset.name);
    setLatitude(preset.lat);
    setLongitude(preset.lon);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-xl bg-[#090D16] border border-cyan-500/40 rounded-xl shadow-2xl p-6 text-slate-100 relative"
        role="dialog"
        aria-modal="true"
        aria-labelledby="custom-site-title"
      >
        <div className="flex items-start justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs uppercase font-mono tracking-wider text-cyan-400">Custom Mission Target</div>
              <h2 id="custom-site-title" className="text-lg font-bold text-white font-display">Define Custom Coordinates</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          {/* Site Name Input */}
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-1">
              Site / Expedition Name
            </label>
            <input
              type="text"
              value={siteName}
              onChange={e => setSiteName(e.target.value)}
              placeholder="e.g. Artemis South Outpost, Mare Research Node"
              className="w-full px-3 py-2 bg-[#05070B] border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500 font-sans"
            />
          </div>

          {/* Latitude Stepper & Slider */}
          <div className="p-3 bg-[#05070B] border border-slate-800 rounded-lg space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono uppercase text-slate-400">Latitude (-90° to +90°)</span>
              <span className="font-mono text-cyan-300 font-bold text-sm">
                {formatLatitude(latitude)} ({latitude > 0 ? `+${latitude.toFixed(2)}°` : `${latitude.toFixed(2)}°`})
              </span>
            </div>
            <input
              type="range"
              min="-90"
              max="90"
              step="0.05"
              value={latitude}
              onChange={e => setLatitude(parseFloat(e.target.value))}
              aria-label="Latitude coordinate slider"
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
              <span>90.00°S (South Pole)</span>
              <span>0.00° (Equator)</span>
              <span>90.00°N (North Pole)</span>
            </div>
          </div>

          {/* Longitude Stepper & Slider */}
          <div className="p-3 bg-[#05070B] border border-slate-800 rounded-lg space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono uppercase text-slate-400">Longitude (-180° to +180°)</span>
              <span className="font-mono text-cyan-300 font-bold text-sm">
                {formatLongitude(longitude)} ({longitude > 0 ? `+${longitude.toFixed(2)}°` : `${longitude.toFixed(2)}°`})
              </span>
            </div>
            <input
              type="range"
              min="-180"
              max="180"
              step="0.05"
              value={longitude}
              onChange={e => setLongitude(parseFloat(e.target.value))}
              aria-label="Longitude coordinate slider"
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
              <span>180.00°W (Far Side)</span>
              <span>0.00° (Sub-Earth)</span>
              <span>180.00°E (Far Side)</span>
            </div>
          </div>

          {/* Quick Target Presets */}
          <div>
            <span className="text-[11px] font-mono uppercase text-slate-400 block mb-2">
              Notable Lunar Exploration Candidates
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {PRESET_CUSTOM_TARGETS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => applyPreset(preset)}
                  className="p-2.5 rounded-lg border border-slate-800 bg-[#05070B] hover:border-cyan-500/50 hover:bg-slate-900/60 text-left transition-colors"
                >
                  <div className="font-semibold text-white truncate">{preset.name}</div>
                  <div className="text-[10px] font-mono text-cyan-400 mt-0.5">
                    {formatCoordinates(preset.lat, preset.lon)} · {preset.region}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs font-mono text-slate-400">
            Selected: <span className="text-cyan-300 font-semibold">{formatCoordinates(latitude, longitude)}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply Custom Site</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
