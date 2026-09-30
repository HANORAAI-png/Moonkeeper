/**
 * MoonKeeper - Lunar Ephemeris & Selenographic Geometry Engine
 * Analytical topocentric ephemeris engine incorporating IAU/IAG Mean Earth/Polar Axis (ME)
 * cartographic frame and LOLA topographic horizon profiling.
 */

import { LandingSite, LocalEnvironmentConditions, LunarEphemerisState, SunlightCondition, CommVisibilityState, SolarPanelConfiguration, SynodicCycleSummary } from '../types/mission';
import { getTerrainProfileForSite } from './terrainProfiles';

const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;
export const SOLAR_CONSTANT_WM2 = 1361.0; // Total solar irradiance at 1 AU

/**
 * Converts a standard JavaScript Date object into Julian Date (JD).
 */
export function getJulianDate(date: Date): number {
  const time = date.getTime();
  return time / 86400000 + 2440587.5;
}

/**
 * Normalizes an angle into [0, 360) degrees.
 */
export function normalize360(deg: number): number {
  let angle = deg % 360;
  if (angle < 0) angle += 360;
  return angle;
}

/**
 * Normalizes an angle into [-180, 180) degrees.
 */
export function normalize180(deg: number): number {
  let angle = normalize360(deg);
  if (angle > 180) angle -= 360;
  return angle;
}

/**
 * Computes global lunar ephemeris state for a given UTC timestamp.
 * Based on IAU/IAG rotational parameters and Meeus trigonometric expansions.
 */
export function calculateLunarEphemeris(date: Date): LunarEphemerisState {
  const jd = getJulianDate(date);
  const d = jd - 2451545.0; // Days since J2000.0 (2000 Jan 1.5)

  // Mean elongation of the Moon (deg)
  const D = normalize360(297.8501921 + 12.19074912 * d);
  
  // Sun's mean anomaly (deg)
  const M = normalize360(357.5291092 + 0.98560028 * d);
  
  // Moon's mean anomaly (deg)
  const Mprime = normalize360(134.9633964 + 13.06499295 * d);
  
  // Moon's argument of latitude (distance from ascending node) (deg)
  const F = normalize360(93.2720950 + 13.22935026 * d);

  // Sub-solar selenographic longitude (deg East)
  const colongitude = normalize360(D - 90 + 1.915 * Math.sin(M * DEG_TO_RAD) - 0.11 * Math.sin(Mprime * DEG_TO_RAD));
  const subSolarLongitude = normalize180(90 - colongitude);

  // Sub-solar selenographic latitude (inclination of lunar equator to ecliptic ~ 1.543°)
  const subSolarLatitude = 1.543 * Math.sin((F - 1.5) * DEG_TO_RAD);

  // Optical & Physical Libration in Longitude (l) and Latitude (b)
  const librationLong = 7.9 * Math.sin(Mprime * DEG_TO_RAD) + 1.3 * Math.sin((2 * D - Mprime) * DEG_TO_RAD) - 0.4 * Math.sin(2 * D * DEG_TO_RAD);
  const librationLat = 6.7 * Math.sin(F * DEG_TO_RAD) + 0.7 * Math.sin((2 * D - F) * DEG_TO_RAD);

  const subEarthLongitude = normalize180(librationLong);
  const subEarthLatitude = librationLat;

  // Phase angle: 0 = New Moon, 180 = Full Moon
  const phaseAngle = Math.abs(normalize180(D));
  const illuminationFraction = 0.5 * (1 + Math.cos((180 - phaseAngle) * DEG_TO_RAD));

  let phaseName = 'New Moon';
  if (phaseAngle < 22.5) phaseName = 'New Moon';
  else if (phaseAngle < 67.5) phaseName = 'Waxing Crescent';
  else if (phaseAngle < 112.5) phaseName = 'First Quarter';
  else if (phaseAngle < 157.5) phaseName = 'Waxing Gibbous';
  else if (phaseAngle < 202.5) phaseName = 'Full Moon';
  else if (phaseAngle < 247.5) phaseName = 'Waning Gibbous';
  else if (phaseAngle < 292.5) phaseName = 'Last Quarter';
  else phaseName = 'Waning Crescent';

  return {
    timestamp: date.toISOString(),
    subSolarLongitude,
    subSolarLatitude,
    subEarthLongitude,
    subEarthLatitude,
    lunarPhaseAngle: phaseAngle,
    lunarPhaseName: phaseName,
    illuminationFraction,
  };
}

/**
 * Calculates local topocentric conditions (Sun & Earth position in local lunar horizon frame)
 * incorporating LOLA local topographic horizon profiles and solar panel geometry.
 */
export function calculateLocalConditions(
  site: LandingSite,
  date: Date,
  ephemeris?: LunarEphemerisState,
  panelConfig?: SolarPanelConfiguration
): LocalEnvironmentConditions {
  const eph = ephemeris || calculateLunarEphemeris(date);
  const terrain = getTerrainProfileForSite(site);

  // Default panel configuration based on latitude
  // At polar latitudes (>60°), vertical panels receive ~1360 W/m² whereas horizontal panels receive <100 W/m²
  const selectedPanel: SolarPanelConfiguration = panelConfig || (Math.abs(site.latitude) >= 60 ? 'vertical-sun-facing' : 'horizontal');

  const siteLatRad = site.latitude * DEG_TO_RAD;
  const siteLonRad = site.longitude * DEG_TO_RAD;

  // --- 1. SUN POSITION IN LOCAL HORIZON ---
  const sunLatRad = eph.subSolarLatitude * DEG_TO_RAD;
  const sunLonRad = eph.subSolarLongitude * DEG_TO_RAD;
  const deltaLonSun = sunLonRad - siteLonRad;

  // Solar zenith angle / elevation relative to spherical horizontal plane
  const sinSunElev = Math.sin(siteLatRad) * Math.sin(sunLatRad) +
    Math.cos(siteLatRad) * Math.cos(sunLatRad) * Math.cos(deltaLonSun);
  
  const clampedSinElev = Math.max(-1, Math.min(1, sinSunElev));
  const sunElevationDeg = Math.asin(clampedSinElev) * RAD_TO_DEG;

  // Solar azimuth (clockwise from true selenographic North)
  const ySun = -Math.cos(sunLatRad) * Math.sin(deltaLonSun);
  const xSun = Math.cos(siteLatRad) * Math.sin(sunLatRad) -
    Math.sin(siteLatRad) * Math.cos(sunLatRad) * Math.cos(deltaLonSun);
  const sunAzimuthDeg = normalize360(Math.atan2(ySun, xSun) * RAD_TO_DEG);

  // --- LOLA TERRAIN PROFILE AT SUN AZIMUTH ---
  const terrainHorizonElevDegAtSun = terrain.getHorizonElevation(sunAzimuthDeg);
  const apparentSunElevationAboveTerrainDeg = sunElevationDeg - terrainHorizonElevDegAtSun;
  const isSunOccludedByTerrain = apparentSunElevationAboveTerrainDeg < 0;

  // --- 2. SOLAR FLUX CALCULATIONS ---
  // Horizontal flat panel: 1361 * sin(elev)
  const solarFluxHorizontalWm2 = (sunElevationDeg > 0 && !isSunOccludedByTerrain)
    ? Math.max(0, SOLAR_CONSTANT_WM2 * Math.sin(sunElevationDeg * DEG_TO_RAD))
    : 0;

  // Vertical Sun-facing panel: 1361 * cos(elev)
  const solarFluxVerticalSunFacingWm2 = (sunElevationDeg > 0 && !isSunOccludedByTerrain)
    ? Math.max(0, SOLAR_CONSTANT_WM2 * Math.cos(sunElevationDeg * DEG_TO_RAD))
    : 0;

  let solarFluxSelectedWm2 = 0;
  if (!isSunOccludedByTerrain && sunElevationDeg > 0) {
    switch (selectedPanel) {
      case 'horizontal':
        solarFluxSelectedWm2 = solarFluxHorizontalWm2;
        break;
      case 'vertical-sun-facing':
        solarFluxSelectedWm2 = solarFluxVerticalSunFacingWm2;
        break;
      case 'vertical-omni':
        // Cylindrical or hexagonal multi-faceted lander body
        solarFluxSelectedWm2 = (SOLAR_CONSTANT_WM2 / Math.PI) * Math.cos(sunElevationDeg * DEG_TO_RAD);
        break;
      case 'tilted-lander':
        // Approx 30° tilt towards local slope
        const tiltedElev = Math.max(0, Math.min(90, sunElevationDeg + 30));
        solarFluxSelectedWm2 = SOLAR_CONSTANT_WM2 * Math.sin(tiltedElev * DEG_TO_RAD);
        break;
    }
  }

  // --- 3. SUNLIGHT CONDITION CLASSIFICATION ---
  let sunlightCondition: SunlightCondition = 'Unavailable';
  if (isSunOccludedByTerrain) {
    sunlightCondition = 'Unavailable'; // Blocked by local crater rim or mountain
  } else if (apparentSunElevationAboveTerrainDeg > 2.0) {
    sunlightCondition = 'Available';
  } else if (apparentSunElevationAboveTerrainDeg >= 0.0) {
    sunlightCondition = 'Limited'; // Low grazing sunlight, deep regolith shadows
  } else {
    sunlightCondition = 'Unavailable';
  }

  // --- 4. EARTH POSITION IN LOCAL HORIZON ---
  const earthLatRad = eph.subEarthLatitude * DEG_TO_RAD;
  const earthLonRad = eph.subEarthLongitude * DEG_TO_RAD;
  const deltaLonEarth = earthLonRad - siteLonRad;

  const cosPsi = Math.sin(siteLatRad) * Math.sin(earthLatRad) +
    Math.cos(siteLatRad) * Math.cos(earthLatRad) * Math.cos(deltaLonEarth);
  const clampedCosPsi = Math.max(-1, Math.min(1, cosPsi));
  const psiDeg = Math.acos(clampedCosPsi) * RAD_TO_DEG;

  // Topocentric elevation of Earth center above local lunar horizon
  const earthElevationDeg = 90.0 - psiDeg - 0.26 * Math.sin(psiDeg * DEG_TO_RAD);

  // Earth azimuth
  const yEarth = -Math.cos(earthLatRad) * Math.sin(deltaLonEarth);
  const xEarth = Math.cos(siteLatRad) * Math.sin(earthLatRad) -
    Math.sin(siteLatRad) * Math.cos(earthLatRad) * Math.cos(deltaLonEarth);
  const earthAzimuthDeg = normalize360(Math.atan2(yEarth, xEarth) * RAD_TO_DEG);

  // --- LOLA TERRAIN PROFILE AT EARTH AZIMUTH ---
  const terrainHorizonElevDegAtEarth = terrain.getHorizonElevation(earthAzimuthDeg);
  const apparentEarthElevationAboveTerrainDeg = earthElevationDeg - terrainHorizonElevDegAtEarth;
  const isEarthOccludedByTerrain = apparentEarthElevationAboveTerrainDeg < 0;

  // Direct-to-Earth communication visibility classification
  let earthVisibilityState: CommVisibilityState = 'Not Visible';
  let isDirectToEarthPossible = false;
  let commOpportunitySummary = '';

  if (earthElevationDeg < 0) {
    earthVisibilityState = 'Not Visible';
    isDirectToEarthPossible = false;
    commOpportunitySummary = 'Earth is geometrically below the spherical lunar horizon (far-side or limb occlusion). Direct-to-Earth comms impossible; requires orbital relay.';
  } else if (isEarthOccludedByTerrain) {
    earthVisibilityState = 'Not Visible';
    isDirectToEarthPossible = false;
    commOpportunitySummary = `Earth line of sight is obstructed by local terrain (local horizon rises to ${terrainHorizonElevDegAtEarth.toFixed(1)}° in this azimuth).`;
  } else if (apparentEarthElevationAboveTerrainDeg > 3.0) {
    earthVisibilityState = 'Visible';
    isDirectToEarthPossible = true;
    commOpportunitySummary = `Unobstructed direct line of sight to Earth (+${apparentEarthElevationAboveTerrainDeg.toFixed(1)}° above local terrain horizon).`;
  } else {
    earthVisibilityState = 'Marginal';
    isDirectToEarthPossible = true;
    commOpportunitySummary = `Earth is near the local terrain rim (+${apparentEarthElevationAboveTerrainDeg.toFixed(1)}° clearance). Terrain elevation variations may create marginal signal margin.`;
  }

  // --- 5. LOCAL LUNAR TIME & SUNRISE/SUNSET TIMING ---
  const lonDiff = normalize180(site.longitude - eph.subSolarLongitude);
  const localLunarTimeHours = normalize360((lonDiff / 15.0) + 12.0) % 24;

  const timeUntilTransitions = estimateSunriseSunsetWithTerrain(site, date, terrain);

  return {
    sunElevationDeg,
    sunAzimuthDeg,
    sunlightCondition,
    solarFluxEstimateWm2: solarFluxSelectedWm2,
    solarFluxHorizontalWm2,
    solarFluxVerticalSunFacingWm2,
    solarFluxSelectedWm2,
    selectedPanelType: selectedPanel,

    terrainHorizonElevDegAtSun,
    isSunOccludedByTerrain,
    apparentSunElevationAboveTerrainDeg,

    earthElevationDeg,
    earthAzimuthDeg,
    terrainHorizonElevDegAtEarth,
    isEarthOccludedByTerrain,
    apparentEarthElevationAboveTerrainDeg,

    earthVisibilityState,
    commOpportunitySummary,
    isDirectToEarthPossible,
    localLunarTimeHours,
    timeUntilSunriseHours: timeUntilTransitions.untilSunriseHours,
    timeUntilSunsetHours: timeUntilTransitions.untilSunsetHours,
  };
}

/**
 * Evaluates exact sunrise and sunset countdown taking local LOLA terrain elevation into account.
 */
function estimateSunriseSunsetWithTerrain(
  site: LandingSite,
  startDate: Date,
  terrain: ReturnType<typeof getTerrainProfileForSite>
): { untilSunriseHours: number | null; untilSunsetHours: number | null } {
  const initialCond = checkSunApparentElevation(site, startDate, terrain);
  const isInitiallyLit = initialCond > 0;

  let untilSunriseHours: number | null = null;
  let untilSunsetHours: number | null = null;

  const maxSearchHours = 720; // 30 days
  const stepHours = 2;

  let prevApparent = initialCond;
  let prevHours = 0;

  for (let h = stepHours; h <= maxSearchHours; h += stepHours) {
    const testDate = new Date(startDate.getTime() + h * 3600 * 1000);
    const apparentElev = checkSunApparentElevation(site, testDate, terrain);

    // Sunrise crossing (from below terrain to above terrain)
    if (prevApparent <= 0 && apparentElev > 0 && untilSunriseHours === null) {
      const frac = (0 - prevApparent) / (apparentElev - prevApparent || 1);
      untilSunriseHours = prevHours + frac * stepHours;
    }
    // Sunset crossing (from above terrain to below terrain)
    else if (prevApparent > 0 && apparentElev <= 0 && untilSunsetHours === null) {
      const frac = (prevApparent - 0) / (prevApparent - apparentElev || 1);
      untilSunsetHours = prevHours + frac * stepHours;
    }

    if (untilSunriseHours !== null && untilSunsetHours !== null) break;

    prevApparent = apparentElev;
    prevHours = h;
  }

  return { untilSunriseHours, untilSunsetHours };
}

function checkSunApparentElevation(
  site: LandingSite,
  date: Date,
  terrain: ReturnType<typeof getTerrainProfileForSite>
): number {
  const jd = getJulianDate(date);
  const d = jd - 2451545.0;
  const D = normalize360(297.8501921 + 12.19074912 * d);
  const subSolarLon = normalize180(180 - D);
  const subSolarLat = 1.543 * Math.sin((93.272 + 13.229 * d) * DEG_TO_RAD);

  const siteLatRad = site.latitude * DEG_TO_RAD;
  const siteLonRad = site.longitude * DEG_TO_RAD;
  const sunLatRad = subSolarLat * DEG_TO_RAD;
  const sunLonRad = subSolarLon * DEG_TO_RAD;
  const deltaLonSun = sunLonRad - siteLonRad;

  const sinSunElev = Math.sin(siteLatRad) * Math.sin(sunLatRad) +
    Math.cos(siteLatRad) * Math.cos(sunLatRad) * Math.cos(deltaLonSun);
  const sunElevationDeg = Math.asin(Math.max(-1, Math.min(1, sinSunElev))) * RAD_TO_DEG;

  const ySun = -Math.cos(sunLatRad) * Math.sin(deltaLonSun);
  const xSun = Math.cos(siteLatRad) * Math.sin(sunLatRad) -
    Math.sin(siteLatRad) * Math.cos(sunLatRad) * Math.cos(deltaLonSun);
  const sunAzimuthDeg = normalize360(Math.atan2(ySun, xSun) * RAD_TO_DEG);

  const terrainElev = terrain.getHorizonElevation(sunAzimuthDeg);
  return sunElevationDeg - terrainElev;
}

/**
 * Computes synodic month statistics (708.7 hours cycle)
 */
export function calculateSynodicSummary(site: LandingSite, startDate: Date): SynodicCycleSummary {
  const synodicHours = 708.7;
  const step = 3; // 3-hour resolution
  let sunlightHours = 0;
  let commHours = 0;
  let terrainOccultations = 0;
  let maxSun = -999;
  let minSun = 999;
  let maxEarth = -999;
  let minEarth = 999;

  const totalSteps = Math.floor(synodicHours / step);

  for (let s = 0; s < totalSteps; s++) {
    const testDate = new Date(startDate.getTime() + s * step * 3600 * 1000);
    const cond = calculateLocalConditions(site, testDate);

    if (cond.sunElevationDeg > maxSun) maxSun = cond.sunElevationDeg;
    if (cond.sunElevationDeg < minSun) minSun = cond.sunElevationDeg;
    if (cond.earthElevationDeg > maxEarth) maxEarth = cond.earthElevationDeg;
    if (cond.earthElevationDeg < minEarth) minEarth = cond.earthElevationDeg;

    if (cond.apparentSunElevationAboveTerrainDeg > 0) {
      sunlightHours += step;
    } else if (cond.sunElevationDeg > 0 && cond.isSunOccludedByTerrain) {
      terrainOccultations += step;
    }

    if (cond.earthVisibilityState !== 'Not Visible') {
      commHours += step;
    }
  }

  return {
    totalSunlightHoursMonth: Math.round(sunlightHours),
    totalCommVisibleHoursMonth: Math.round(commHours),
    sunlightPercentageMonth: Math.round((sunlightHours / synodicHours) * 100),
    commPercentageMonth: Math.round((commHours / synodicHours) * 100),
    maxSunElevationDeg: Math.round(maxSun * 10) / 10,
    minSunElevationDeg: Math.round(minSun * 10) / 10,
    maxEarthElevationDeg: Math.round(maxEarth * 10) / 10,
    minEarthElevationDeg: Math.round(minEarth * 10) / 10,
    terrainOccultationHoursMonth: Math.round(terrainOccultations),
  };
}

/**
 * Computes an environmental timeseries over a given duration.
 */
export function generateEnvironmentTimeSeries(
  site: LandingSite,
  baseDate: Date,
  totalHours: number,
  stepHours: number,
  panelConfig?: SolarPanelConfiguration
): Array<{
  timestamp: string;
  hoursOffset: number;
  sunElevation: number;
  apparentSunElevation: number;
  earthElevation: number;
  apparentEarthElevation: number;
  sunlightCondition: SunlightCondition;
  commState: CommVisibilityState;
  solarFluxWm2: number;
  isTerrainOccluded: boolean;
}> {
  const series = [];
  const startTime = baseDate.getTime();

  for (let offset = 0; offset <= totalHours; offset += stepHours) {
    const pointDate = new Date(startTime + offset * 3600 * 1000);
    const cond = calculateLocalConditions(site, pointDate, undefined, panelConfig);

    series.push({
      timestamp: pointDate.toISOString(),
      hoursOffset: offset,
      sunElevation: Math.round(cond.sunElevationDeg * 10) / 10,
      apparentSunElevation: Math.round(cond.apparentSunElevationAboveTerrainDeg * 10) / 10,
      earthElevation: Math.round(cond.earthElevationDeg * 10) / 10,
      apparentEarthElevation: Math.round(cond.apparentEarthElevationAboveTerrainDeg * 10) / 10,
      sunlightCondition: cond.sunlightCondition,
      commState: cond.earthVisibilityState,
      solarFluxWm2: Math.round(cond.solarFluxEstimateWm2),
      isTerrainOccluded: cond.isSunOccludedByTerrain,
    });
  }

  return series;
}
