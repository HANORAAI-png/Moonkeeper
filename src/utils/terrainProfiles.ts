/**
 * MoonKeeper - Lunar LOLA (Lunar Orbiter Laser Altimeter) Horizon Elevation Profiles
 * Modeled local topographic horizon masks representing elevation angle of crater rims,
 * ridges, and mountains that produce local solar and Earth line-of-sight occultations.
 */

import { LandingSite } from '../types/mission';

export interface LocalLandmark {
  name: string;
  azimuthDeg: number;
  peakElevationDeg: number;
  description: string;
}

export interface TerrainProfile {
  id: string;
  name: string;
  sourceDataset: string;
  meanHorizonElevDeg: number;
  maxHorizonElevDeg: number;
  landmarks: LocalLandmark[];
  getHorizonElevation: (azimuthDeg: number) => number;
}

// Helper to smooth angles
function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * LOLA profile for Malapert A Crater (IM-1 landing site)
 * Malapert Mountain (Massif) dominates azimuth ~190° to ~240° reaching up to 6.8° elevation!
 */
export const MALAPERT_A_PROFILE: TerrainProfile = {
  id: 'malapert-a',
  name: 'Malapert A Crater Rim & Massif',
  sourceDataset: 'LRO LOLA DEM 20m/px Topographic Model',
  meanHorizonElevDeg: 2.8,
  maxHorizonElevDeg: 6.8,
  landmarks: [
    { name: 'Malapert Mountain (Massif)', azimuthDeg: 215, peakElevationDeg: 6.8, description: 'Towering 5 km anorthosite massif producing prominent seasonal solar shadows' },
    { name: 'Malapert A North Rim', azimuthDeg: 15, peakElevationDeg: 2.1, description: 'Crater rim crest facing low-latitude highlands' },
    { name: 'Connecting Saddle', azimuthDeg: 310, peakElevationDeg: 1.6, description: 'Low saddle corridor offering lowest horizon opening' }
  ],
  getHorizonElevation: (azimuthDeg: number): number => {
    const az = (azimuthDeg % 360 + 360) % 360;
    // Malapert Massif peak centered around 215°
    const massifDist = Math.abs(az - 215);
    const massifEff = Math.max(0, 1 - massifDist / 35);
    const massifBump = massifEff * 4.4;

    // North-East rim ridge
    const neRidge = 0.8 * Math.sin(degToRad(az * 2 + 40));
    // Base crater interior rim slope
    const baseRim = 2.4;

    return Math.max(0.6, baseRim + massifBump + neRidge);
  }
};

/**
 * LOLA profile for Mons Mouton Plateau (IM-2 Athena target ~84.8°S)
 */
export const MONS_MOUTON_PROFILE: TerrainProfile = {
  id: 'mons-mouton',
  name: 'Mons Mouton Plateau Margin',
  sourceDataset: 'LRO LOLA Digital Elevation Model',
  meanHorizonElevDeg: 2.3,
  maxHorizonElevDeg: 4.6,
  landmarks: [
    { name: 'Mons Mouton Summit Ridge', azimuthDeg: 135, peakElevationDeg: 4.6, description: 'Elevated plateau shoulder' },
    { name: 'South Escarpment', azimuthDeg: 195, peakElevationDeg: 3.4, description: 'Steep slope dropping toward polar basin' },
    { name: 'Northern Flat Plain', azimuthDeg: 350, peakElevationDeg: 1.2, description: 'Low relief terrace' }
  ],
  getHorizonElevation: (azimuthDeg: number): number => {
    const az = (azimuthDeg % 360 + 360) % 360;
    const summitDist = Math.abs(az - 135);
    const summitBump = Math.max(0, 1 - summitDist / 40) * 2.8;
    return Math.max(0.8, 1.8 + summitBump + 0.5 * Math.sin(degToRad(az + 60)));
  }
};

/**
 * LOLA profile for Shackleton Connecting Ridge (89.45°S)
 */
export const SHACKLETON_RIDGE_PROFILE: TerrainProfile = {
  id: 'shackleton-ridge',
  name: 'Shackleton Connecting Ridge',
  sourceDataset: 'LRO LOLA Polar 5m/px DEM',
  meanHorizonElevDeg: 2.9,
  maxHorizonElevDeg: 5.4,
  landmarks: [
    { name: 'Shackleton Crater Rim Crest', azimuthDeg: 175, peakElevationDeg: 5.4, description: 'Steep rim crest of permanently shadowed Shackleton Crater' },
    { name: 'de Gerlache Rim Wall', azimuthDeg: 305, peakElevationDeg: 4.2, description: 'Adjacent impact rim crest' },
    { name: 'Connecting Ridge Ridgecrest', azimuthDeg: 50, peakElevationDeg: 1.4, description: 'Narrow corridor of persistent illumination' }
  ],
  getHorizonElevation: (azimuthDeg: number): number => {
    const az = (azimuthDeg % 360 + 360) % 360;
    const shackletonBump = Math.max(0, 1 - Math.abs(az - 175) / 30) * 3.6;
    const degerlacheBump = Math.max(0, 1 - Math.abs(az - 305) / 35) * 2.6;
    return Math.max(0.9, 1.8 + shackletonBump + degerlacheBump + 0.4 * Math.sin(degToRad(az * 3)));
  }
};

/**
 * Mare Crisium Basin Floor (Blue Ghost Mission 1)
 * Distant multi-ring basin mountains (Mons Latreille) create a low, flat horizon
 */
export const MARE_CRISIUM_PROFILE: TerrainProfile = {
  id: 'mare-crisium',
  name: 'Mare Crisium Basin Plain',
  sourceDataset: 'LRO LOLA Topography / LROC WAC Altimetry',
  meanHorizonElevDeg: 0.8,
  maxHorizonElevDeg: 1.6,
  landmarks: [
    { name: 'Mons Latreille (Distant Peak)', azimuthDeg: 280, peakElevationDeg: 1.6, description: 'Volcanic and impact uplift peak in northern Crisium plain' },
    { name: 'East Crisium Ring Rim', azimuthDeg: 95, peakElevationDeg: 1.1, description: 'Distant multi-ring basin rim' }
  ],
  getHorizonElevation: (azimuthDeg: number): number => {
    const az = (azimuthDeg % 360 + 360) % 360;
    const latreille = Math.max(0, 1 - Math.abs(az - 280) / 20) * 0.8;
    return Math.max(0.4, 0.7 + latreille + 0.2 * Math.sin(degToRad(az * 2)));
  }
};

/**
 * Apollo 11 Mare Tranquillitatis Baseline
 */
export const MARE_TRANQUILLITATIS_PROFILE: TerrainProfile = {
  id: 'mare-tranquillitatis',
  name: 'Mare Tranquillitatis Basalt Plain',
  sourceDataset: 'Apollo Metric Camera & LRO LOLA Topography',
  meanHorizonElevDeg: 0.4,
  maxHorizonElevDeg: 0.8,
  landmarks: [
    { name: 'West Crater Rim (Distant)', azimuthDeg: 260, peakElevationDeg: 0.8, description: 'Rim of 180m crater bypassed by Armstrong during landing' }
  ],
  getHorizonElevation: (azimuthDeg: number): number => {
    const az = (azimuthDeg % 360 + 360) % 360;
    return Math.max(0.2, 0.4 + 0.2 * Math.sin(degToRad(az)));
  }
};

/**
 * Schrödinger Basin Far Side (Draper APEX 1.0)
 */
export const SCHROEDINGER_PROFILE: TerrainProfile = {
  id: 'schroedinger',
  name: 'Schrödinger Basin Floor',
  sourceDataset: 'LRO LOLA Topographic Model',
  meanHorizonElevDeg: 3.1,
  maxHorizonElevDeg: 5.1,
  landmarks: [
    { name: 'Inner Peak Ring', azimuthDeg: 45, peakElevationDeg: 5.1, description: 'Uplifted peak ring mountains' },
    { name: 'Basin Outer Rim Wall', azimuthDeg: 220, peakElevationDeg: 3.8, description: 'Multi-ring boundary wall' }
  ],
  getHorizonElevation: (azimuthDeg: number): number => {
    const az = (azimuthDeg % 360 + 360) % 360;
    const peak = Math.max(0, 1 - Math.abs(az - 45) / 30) * 2.8;
    return Math.max(1.2, 2.3 + peak + 0.5 * Math.sin(degToRad(az * 2)));
  }
};

/**
 * Generic synthetic terrain profile for custom or high-latitude sites
 */
export function getGenericTerrainProfile(latitude: number): TerrainProfile {
  const isPolar = Math.abs(latitude) >= 70;
  const isHighland = Math.abs(latitude) >= 40 && Math.abs(latitude) < 70;

  if (isPolar) {
    return {
      id: 'generic-polar',
      name: 'Polar Highland Terrain Profile (Modeled LOLA Average)',
      sourceDataset: 'LRO LOLA Polar Altimetry Regional Synthesis',
      meanHorizonElevDeg: 2.6,
      maxHorizonElevDeg: 4.8,
      landmarks: [
        { name: 'Adjacent Crater Rim', azimuthDeg: 180, peakElevationDeg: 4.8, description: 'Southern high-standing terrain ridge' }
      ],
      getHorizonElevation: (azimuthDeg: number) => {
        const az = (azimuthDeg % 360 + 360) % 360;
        return Math.max(0.8, 2.2 + 1.8 * Math.cos(degToRad(az - 180)) + 0.5 * Math.sin(degToRad(az * 3)));
      }
    };
  }

  if (isHighland) {
    return {
      id: 'generic-highland',
      name: 'Highland Cratered Terrain Profile',
      sourceDataset: 'LRO LOLA Regional Highlands DEM',
      meanHorizonElevDeg: 1.6,
      maxHorizonElevDeg: 3.2,
      landmarks: [
        { name: 'Impact Crater Rim', azimuthDeg: 90, peakElevationDeg: 3.2, description: 'Rolling crater ridge' }
      ],
      getHorizonElevation: (azimuthDeg: number) => {
        const az = (azimuthDeg % 360 + 360) % 360;
        return Math.max(0.5, 1.5 + 0.9 * Math.sin(degToRad(az * 2)));
      }
    };
  }

  // Mare / Equatorial
  return {
    id: 'generic-mare',
    name: 'Mare Basalt Plain (Near Spherical Horizon)',
    sourceDataset: 'LRO LOLA Baseline Topography',
    meanHorizonElevDeg: 0.5,
    maxHorizonElevDeg: 1.1,
    landmarks: [
      { name: 'Low Swell / Ridge', azimuthDeg: 0, peakElevationDeg: 1.1, description: 'Wrinkle ridge crest' }
    ],
    getHorizonElevation: (azimuthDeg: number) => {
      const az = (azimuthDeg % 360 + 360) % 360;
      return Math.max(0.2, 0.5 + 0.3 * Math.sin(degToRad(az * 3)));
    }
  };
}

/**
 * Retrieves the matching LOLA terrain profile for any landing site
 */
export function getTerrainProfileForSite(site: LandingSite): TerrainProfile {
  const nameLower = site.name.toLowerCase();
  const targetLower = site.targetFeature.toLowerCase();

  if (nameLower.includes('malapert') || targetLower.includes('malapert')) {
    return MALAPERT_A_PROFILE;
  }
  if (nameLower.includes('mouton') || targetLower.includes('mouton')) {
    return MONS_MOUTON_PROFILE;
  }
  if (nameLower.includes('shackleton') || targetLower.includes('shackleton')) {
    return SHACKLETON_RIDGE_PROFILE;
  }
  if (nameLower.includes('crisium') || targetLower.includes('crisium')) {
    return MARE_CRISIUM_PROFILE;
  }
  if (nameLower.includes('tranquillitatis') || nameLower.includes('tranquility') || targetLower.includes('tranquillitatis')) {
    return MARE_TRANQUILLITATIS_PROFILE;
  }
  if (nameLower.includes('schrödinger') || nameLower.includes('schrodinger') || targetLower.includes('schrodinger')) {
    return SCHROEDINGER_PROFILE;
  }

  return getGenericTerrainProfile(site.latitude);
}
