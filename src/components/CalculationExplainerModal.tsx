import React from 'react';
import { X, HelpCircle, Compass, Sun, Globe2, Layers, Cpu } from 'lucide-react';

export type CalculationTopic = 'sun-elevation' | 'sun-azimuth' | 'earth-visibility' | 'illumination-condition' | 'lunar-libration' | 'local-lunar-time';

interface CalculationExplainerModalProps {
  topic: CalculationTopic | null;
  onClose: () => void;
}

const TOPIC_DETAILS: Record<CalculationTopic, {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  formulaName: string;
  formulaLatex: string;
  explanation: string;
  variables: Array<{ symbol: string; name: string; description: string }>;
  scientificCaveat: string;
}> = {
  'sun-elevation': {
    title: 'Sun Elevation Angle Calculation',
    icon: Sun,
    formulaName: 'Spherical Trigonometric Solar Zenith Angle',
    formulaLatex: 'sin(α☉) = sin(ϕ)·sin(δ☉) + cos(ϕ)·cos(δ☉)·cos(λ - λ☉)',
    explanation: 'The Sun elevation represents the angular height of the center of the solar disk above the local astronomical lunar horizon. Because the Moon has no atmosphere, there is no atmospheric refraction, so astronomical elevation directly matches geometric line-of-sight to the solar center.',
    variables: [
      { symbol: 'α☉', name: 'Solar Elevation', description: 'Angle in degrees above the horizontal plane (+90° = zenith, 0° = horizon, negative = below horizon)' },
      { symbol: 'ϕ', name: 'Landing Site Latitude', description: 'Selenographic latitude of the mission landing site' },
      { symbol: 'δ☉', name: 'Sub-Solar Latitude', description: 'Declination of the Sun relative to the lunar equator (oscillates ±1.543° due to lunar axial obliquity)' },
      { symbol: 'λ', name: 'Landing Site Longitude', description: 'Selenographic longitude of the landing site' },
      { symbol: 'λ☉', name: 'Sub-Solar Longitude', description: 'Longitude directly underneath the Sun, drifting ~360° per synodic month (29.53 days)' }
    ],
    scientificCaveat: 'Calculations assume a mean spherical Moon (R = 1,737.4 km). In rugged polar topography (such as Malapert A or Shackleton), high crater rims or peaks of eternal light can cast shadows even when the Sun is slightly above the theoretical horizon, or capture sunlight when the Sun is just below.'
  },
  'sun-azimuth': {
    title: 'Solar Azimuth Determination',
    icon: Compass,
    formulaName: 'Topocentric Selenographic Azimuth',
    formulaLatex: 'tan(A☉) = -cos(δ☉)·sin(λ - λ☉) / [cos(ϕ)·sin(δ☉) - sin(ϕ)·cos(δ☉)·cos(λ - λ☉)]',
    explanation: 'The solar azimuth indicates the compass bearing of the Sun in the observer’s local reference frame, measured clockwise from selenographic North (0° = North, 90° = East, 180° = South, 270° = West). At equatorial sites, the Sun moves almost purely East-to-West. Near the lunar South Pole, the Sun circles continuously around the horizon across 360° during the lunar daytime.',
    variables: [
      { symbol: 'A☉', name: 'Solar Azimuth', description: 'Horizontal angle clockwise from true lunar North (0° to 360°)' },
      { symbol: 'ϕ', name: 'Site Latitude', description: 'Selenographic latitude' },
      { symbol: 'λ - λ☉', name: 'Hour Angle Offset', description: 'Angular longitude separation between site and sub-solar meridian' }
    ],
    scientificCaveat: 'Azimuth is defined with respect to the lunar spin axis (True Selenographic North). Compass instruments cannot operate on the Moon because the Moon lacks a global dipolar magnetic field.'
  },
  'earth-visibility': {
    title: 'Earth Line-of-Sight & Direct-to-Earth (DTE) Visibility',
    icon: Globe2,
    formulaName: 'Angular Separation & Lunar Horizon Geometry',
    formulaLatex: 'cos(ψ) = sin(ϕ)·sin(ϕ⊕) + cos(ϕ)·cos(ϕ⊕)·cos(λ - λ⊕)  →  α⊕ ≈ 90° - ψ',
    explanation: 'Direct-to-Earth communication requires that the Earth be geometrically above the local lunar horizon. Because the Moon is tidally locked to Earth, the Earth remains nearly stationary in the sky from any given lunar surface location, swinging within a small libration ellipse (±7.9° in longitude, ±6.7° in latitude). Sites on the lunar far side (e.g. Schrödinger Basin) have ψ > 90°, meaning Earth is permanently below the horizon and direct-to-Earth communication is impossible without orbital relay satellites.',
    variables: [
      { symbol: 'α⊕', name: 'Earth Elevation', description: 'Angular elevation of Earth center above local lunar horizon' },
      { symbol: 'ψ', name: 'Great-Circle Angular Distance', description: 'Angular separation from landing site to the sub-Earth point' },
      { symbol: 'ϕ⊕, λ⊕', name: 'Sub-Earth Coordinates', description: 'Coordinates on the lunar surface directly facing Earth center, modulated by lunar libration' }
    ],
    scientificCaveat: 'Direct-to-Earth communication depends on whether Earth is geometrically visible from the landing location and on mission/system constraints. Topographic blockage (such as being located inside a deep crater or behind a mountain ridge) can obstruct RF line-of-sight even if α⊕ is positive.'
  },
  'illumination-condition': {
    title: 'Sunlight Condition vs Solar Power Generation',
    icon: Layers,
    formulaName: 'Geometric Sunlight Classification',
    formulaLatex: 'Available (α☉ > 3.0°) | Limited (0.0° ≤ α☉ ≤ 3.0°) | Unavailable (α☉ < 0.0°)',
    explanation: 'MoonKeeper classifies sunlight into three distinct geometric states. We explicitly distinguish illumination condition from spacecraft electrical power generation, because actual electrical output depends on lander tilt, solar panel orientation, dust accumulation on photovoltaic glass, and shadowing from the lander body or nearby rocks.',
    variables: [
      { symbol: 'Available', name: 'Direct Sunlight', description: 'Sun is fully clear of the spherical horizon with substantial projected solar flux (up to 1,361 W/m²)' },
      { symbol: 'Limited', name: 'Low Grazing Sunlight', description: 'Sun is within 3° of the horizon. Regolith produces extremely elongated shadows; low incident flux on horizontal planes' },
      { symbol: 'Unavailable', name: 'Solar Shadow / Lunar Night', description: 'Sun center is below the horizon; direct solar illumination is zero' }
    ],
    scientificCaveat: 'Do not interpret "Available" as guaranteed electrical power. If a lander rests at an abnormal attitude (e.g., tilted on its side), solar panels may not align with incident rays even under bright ambient sunlight.'
  },
  'lunar-libration': {
    title: 'Lunar Optical & Physical Libration',
    icon: Cpu,
    formulaName: 'Sub-Earth Libration Oscillations',
    formulaLatex: 'l ≈ 7.9°·sin(M′) + ...  |  b ≈ 6.7°·sin(F) + ...',
    explanation: 'Although the Moon is tidally locked with one hemisphere facing Earth, eccentricities in its orbit and the inclination of its rotational axis relative to the orbital plane produce apparent oscillations called libration. This allows an observer on Earth to view ~59% of the lunar surface over time, and causes the apparent position of Earth in the lunar sky to drift in an ellipse over an anomalistic month (27.55 days).',
    variables: [
      { symbol: 'l', name: 'Libration in Longitude', description: 'East-West oscillation of the sub-Earth point (up to ±7.9°)' },
      { symbol: 'b', name: 'Libration in Latitude', description: 'North-South oscillation of the sub-Earth point (up to ±6.7°)' },
      { symbol: 'M′', name: 'Moon Mean Anomaly', description: 'Position along the eccentric lunar orbit' },
      { symbol: 'F', name: 'Argument of Latitude', description: 'Angular distance from ascending node' }
    ],
    scientificCaveat: 'For polar missions (e.g., IM-1 at 80° S or PRIME-1 at 89.45° S), libration causes Earth to rise and dip by several degrees relative to local crater crests, creating critical communication windows or periodic loss of signal.'
  },
  'local-lunar-time': {
    title: 'Local Lunar Solar Time (LLST)',
    icon: Compass,
    formulaName: 'Selenographic Solar Meridian Angle',
    formulaLatex: 'LLST = [(λsite - λ☉) / 15.0° + 12.00] mod 24',
    explanation: 'Local Lunar Solar Time divides the lunar day-night cycle into 24 lunar hours, where 12:00 corresponds to local lunar noon (when the Sun crosses the observer’s local meridian), and 00:00 corresponds to lunar midnight. Because one lunar synodic day lasts approximately 29.53 Earth days (708.7 hours), one "lunar hour" is equivalent to approximately 29.5 Earth hours.',
    variables: [
      { symbol: 'LLST', name: 'Local Lunar Solar Time', description: 'Time of lunar day from 00:00 to 23:59' },
      { symbol: '12:00', name: 'Lunar Noon', description: 'Sun is at its highest daily elevation at this longitude' },
      { symbol: '06:00 / 18:00', name: 'Nominal Sunrise / Sunset', description: 'Sun is on or near the local horizon (adjusted for latitude)' }
    ],
    scientificCaveat: 'At high polar latitudes (|ϕ| > 80°), the concept of standard sunrise and sunset at 06:00/18:00 breaks down, as seasonal shifts of ±1.54° can lead to months of continuous low-angle grazing sunlight or prolonged polar night.'
  }
};

export const CalculationExplainerModal: React.FC<CalculationExplainerModalProps> = ({ topic, onClose }) => {
  if (!topic) return null;
  const data = TOPIC_DETAILS[topic];
  const Icon = data.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-[#090D16] border border-cyan-500/30 rounded-xl shadow-2xl p-6 text-slate-100 relative"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs uppercase font-mono tracking-wider text-cyan-400">Scientific Calculation Method</div>
              <h2 id="modal-title" className="text-lg font-semibold text-white">{data.title}</h2>
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
          {/* Formula box */}
          <div className="p-3.5 bg-black/60 rounded-lg border border-slate-800 font-mono">
            <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">{data.formulaName}</div>
            <div className="text-cyan-300 text-sm md:text-base font-semibold">{data.formulaLatex}</div>
          </div>

          {/* Explanation */}
          <div>
            <h3 className="text-xs uppercase font-mono tracking-wider text-slate-400 mb-1.5">Principle</h3>
            <p className="text-sm text-slate-300 leading-relaxed">{data.explanation}</p>
          </div>

          {/* Variables table */}
          <div>
            <h3 className="text-xs uppercase font-mono tracking-wider text-slate-400 mb-2">Variables & Parameters</h3>
            <div className="border border-slate-800 rounded-lg overflow-hidden text-xs">
              <div className="grid grid-cols-12 bg-slate-900/80 px-3 py-2 text-slate-400 font-mono font-medium border-b border-slate-800">
                <span className="col-span-2">Symbol</span>
                <span className="col-span-4">Parameter</span>
                <span className="col-span-6">Description</span>
              </div>
              <div className="divide-y divide-slate-800/60 bg-slate-950/40">
                {data.variables.map((v, i) => (
                  <div key={i} className="grid grid-cols-12 px-3 py-2 items-center">
                    <span className="col-span-2 font-mono text-cyan-400 font-bold">{v.symbol}</span>
                    <span className="col-span-4 text-slate-200 font-medium">{v.name}</span>
                    <span className="col-span-6 text-slate-400">{v.description}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Scientific Caveat */}
          <div className="p-3.5 rounded-lg bg-amber-950/20 border border-amber-500/30 text-amber-200/90 text-xs leading-relaxed">
            <div className="font-semibold text-amber-300 mb-1 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 shrink-0" />
              Scientific & Engineering Boundary
            </div>
            {data.scientificCaveat}
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
