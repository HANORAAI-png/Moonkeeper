/**
 * MoonKeeper - Lunar Mission Intelligence
 * Data types for lunar missions, landing sites, and ephemeris calculations.
 */

export type MissionStatus = 'Completed' | 'Planned' | 'In Preparation' | 'Concluded';

export type LunarRegion = 'South Pole' | 'Near Side Mare' | 'Far Side' | 'High Latitude' | 'Equatorial';

export type SunlightCondition = 'Available' | 'Limited' | 'Unavailable';

export type CommVisibilityState = 'Visible' | 'Marginal' | 'Not Visible';

export type SolarPanelConfiguration = 
  | 'horizontal' 
  | 'vertical-sun-facing' 
  | 'vertical-omni' 
  | 'tilted-lander';

export interface LandingSite {
  name: string;
  targetFeature: string;
  latitude: number; // Selenographic latitude (-90 to +90 degrees, positive North)
  longitude: number; // Selenographic longitude (-180 to +180 degrees, positive East)
  region: LunarRegion;
  elevationKm: number; // Relative to mean lunar radius (1737.4 km)
  terrainDescription: string;
  geologicalSignificance: string;
  isCustomSite?: boolean;
}

export interface PayloadItem {
  name: string;
  provider: string;
  objective: string;
  category: 'Science' | 'Technology Demo' | 'Navigation' | 'Resource Prospecting';
}

export interface OfficialSource {
  title: string;
  url: string;
  organization: string;
  accessionType: string;
}

export interface TimelineMilestone {
  phase: string;
  title: string;
  targetTimestamp: string; // ISO date string or relative T-time
  description: string;
  nominalSunElevationDeg: number;
  expectedCommVisibility: CommVisibilityState;
}

export interface LunarMission {
  id: string;
  name: string;
  lander: string;
  contractor: string;
  program: 'NASA CLPS' | 'Historical Reference' | 'International Science Reference' | 'Custom Mission';
  taskOrder: string;
  landingSite: LandingSite;
  status: MissionStatus;
  launchDate: string | null;
  landingDate: string | null;
  nominalDurationDays: number;
  description: string;
  commArchitecture: 'Direct-to-Earth (DTE)' | 'Orbital Relay Required (No Direct DTE)' | 'Direct-to-Earth + Surface Relay';
  payloads: PayloadItem[];
  officialSource: OfficialSource;
  milestones: TimelineMilestone[];
  missionHighlights: string[];
}

export interface LunarEphemerisState {
  timestamp: string; // ISO string
  subSolarLongitude: number; // deg East
  subSolarLatitude: number; // deg North (lunar axial tilt offset)
  subEarthLongitude: number; // deg East (optical + physical libration)
  subEarthLatitude: number; // deg North (libration)
  lunarPhaseAngle: number; // deg (0 = New Moon, 180 = Full Moon)
  lunarPhaseName: string;
  illuminationFraction: number; // 0.0 to 1.0 (percent of lunar disk illuminated)
}

export interface SynodicCycleSummary {
  totalSunlightHoursMonth: number;
  totalCommVisibleHoursMonth: number;
  sunlightPercentageMonth: number;
  commPercentageMonth: number;
  maxSunElevationDeg: number;
  minSunElevationDeg: number;
  maxEarthElevationDeg: number;
  minEarthElevationDeg: number;
  terrainOccultationHoursMonth: number;
}

export interface LocalEnvironmentConditions {
  sunElevationDeg: number; // geometric angular elevation relative to spherical horizon
  sunAzimuthDeg: number; // degrees clockwise from lunar North
  sunlightCondition: SunlightCondition;
  solarFluxEstimateWm2: number; // Incident solar flux for currently selected panel config
  solarFluxHorizontalWm2: number; // Flat horizontal plane (1361 * sin(elev))
  solarFluxVerticalSunFacingWm2: number; // Vertical panel facing Sun (1361 * cos(elev))
  solarFluxSelectedWm2: number;
  selectedPanelType: SolarPanelConfiguration;

  // LOLA Terrain Profile Topography
  terrainHorizonElevDegAtSun: number; // Elevation of local crater rim / mountain in Sun azimuth
  isSunOccludedByTerrain: boolean; // True if Sun is below local terrain crest
  apparentSunElevationAboveTerrainDeg: number; // sunElevationDeg - terrainHorizonElevDegAtSun

  earthElevationDeg: number; // geometric angular elevation relative to spherical horizon
  earthAzimuthDeg: number; // degrees clockwise from lunar North
  terrainHorizonElevDegAtEarth: number; // Elevation of local crater rim in Earth azimuth
  isEarthOccludedByTerrain: boolean; // True if Earth line of sight is obstructed by local terrain
  apparentEarthElevationAboveTerrainDeg: number; // earthElevationDeg - terrainHorizonElevDegAtEarth

  earthVisibilityState: CommVisibilityState;
  commOpportunitySummary: string;
  isDirectToEarthPossible: boolean;
  localLunarTimeHours: number; // 0 to 24 local lunar solar time
  timeUntilSunriseHours: number | null;
  timeUntilSunsetHours: number | null;

  synodicSummary?: SynodicCycleSummary;
}
