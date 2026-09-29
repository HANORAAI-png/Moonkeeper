/**
 * MoonKeeper - Lunar Ephemeris & Selenographic Geometry Engine
 * Based on IAU/IAG working group cartographic standards and standard lunar orbital mechanics.
 */

import { LandingSite, LocalEnvironmentConditions, LunarEphemerisState, SunlightCondition, CommVisibilityState } from '../types/mission';

const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;

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
 * Includes sub-solar coordinates, sub-Earth coordinates (with libration), and lunar phase.
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
  // The Moon rotates synchronously with its orbit; the sub-solar point drifts ~360 deg per synodic month (~29.53059 days)
  // Sub-solar colongitude = 90 - lambda_sun
  const colongitude = normalize360(D - 90 + 1.915 * Math.sin(M * DEG_TO_RAD) - 0.11 * Math.sin(Mprime * DEG_TO_RAD));
  const subSolarLongitude = normalize180(90 - colongitude);

  // Sub-solar selenographic latitude (tilt of lunar axis relative to the ecliptic is approx 1.543°)
  // The lunar rotational axis has an inclination of 1.543° with respect to the ecliptic pole.
  const subSolarLatitude = 1.543 * Math.sin((F - 1.5) * DEG_TO_RAD);

  // Optical Libration in Longitude (l') and Latitude (b')
  // Due to Moon's eccentric orbit and inclined axis, the sub-Earth point oscillates:
  // Libration in Longitude approx ±7.9°, Libration in Latitude approx ±6.7°
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
 * for a landing site at specified selenographic coordinates.
 */
export function calculateLocalConditions(
  site: LandingSite,
  date: Date,
  ephemeris?: LunarEphemerisState
): LocalEnvironmentConditions {
  const eph = ephemeris || calculateLunarEphemeris(date);

  const siteLatRad = site.latitude * DEG_TO_RAD;
  const siteLonRad = site.longitude * DEG_TO_RAD;

  // --- 1. SUN POSITION IN LOCAL HORIZON ---
  const sunLatRad = eph.subSolarLatitude * DEG_TO_RAD;
  const sunLonRad = eph.subSolarLongitude * DEG_TO_RAD;
  const deltaLonSun = sunLonRad - siteLonRad;

  // Solar zenith angle / elevation relative to horizontal plane
  // sin(elev) = sin(phi)*sin(delta) + cos(phi)*cos(delta)*cos(deltaLon)
  const sinSunElev = Math.sin(siteLatRad) * Math.sin(sunLatRad) +
    Math.cos(siteLatRad) * Math.cos(sunLatRad) * Math.cos(deltaLonSun);
  
  // Clamped for floating point safety
  const clampedSinElev = Math.max(-1, Math.min(1, sinSunElev));
  const sunElevationDeg = Math.asin(clampedSinElev) * RAD_TO_DEG;

  // Solar azimuth (clockwise from lunar North: 0° N, 90° E, 180° S, 270° W)
  const ySun = -Math.cos(sunLatRad) * Math.sin(deltaLonSun);
  const xSun = Math.cos(siteLatRad) * Math.sin(sunLatRad) -
    Math.sin(siteLatRad) * Math.cos(sunLatRad) * Math.cos(deltaLonSun);
  const sunAzimuthDeg = normalize360(Math.atan2(ySun, xSun) * RAD_TO_DEG);

  // Solar flux calculation (Solar constant at 1 AU ~ 1361 W/m²)
  // On the Moon with no atmosphere, flux is purely projected:
  const solarFluxEstimateWm2 = sunElevationDeg > 0 ? 1361 * Math.sin(sunElevationDeg * DEG_TO_RAD) : 0;

  // Sunlight condition classification
  let sunlightCondition: SunlightCondition = 'Unavailable';
  if (sunElevationDeg > 3.0) {
    sunlightCondition = 'Available';
  } else if (sunElevationDeg >= 0.0) {
    sunlightCondition = 'Limited'; // Grazing sunlight; vulnerable to crater rim shadows
  } else {
    sunlightCondition = 'Unavailable';
  }

  // --- 2. EARTH POSITION IN LOCAL HORIZON ---
  const earthLatRad = eph.subEarthLatitude * DEG_TO_RAD;
  const earthLonRad = eph.subEarthLongitude * DEG_TO_RAD;
  const deltaLonEarth = earthLonRad - siteLonRad;

  // Angular distance psi from landing site to sub-Earth point on lunar sphere
  const cosPsi = Math.sin(siteLatRad) * Math.sin(earthLatRad) +
    Math.cos(siteLatRad) * Math.cos(earthLatRad) * Math.cos(deltaLonEarth);
  const clampedCosPsi = Math.max(-1, Math.min(1, cosPsi));
  const psiDeg = Math.acos(clampedCosPsi) * RAD_TO_DEG;

  // Topocentric elevation of Earth center above local lunar horizon
  // Mean lunar radius = 1737.4 km, distance to Earth ~ 384,400 km -> parallax is ~0.26°
  const earthElevationDeg = 90.0 - psiDeg - 0.26 * Math.sin(psiDeg * DEG_TO_RAD);

  // Earth azimuth
  const yEarth = -Math.cos(earthLatRad) * Math.sin(deltaLonEarth);
  const xEarth = Math.cos(siteLatRad) * Math.sin(earthLatRad) -
    Math.sin(siteLatRad) * Math.cos(earthLatRad) * Math.cos(deltaLonEarth);
  const earthAzimuthDeg = normalize360(Math.atan2(yEarth, xEarth) * RAD_TO_DEG);

  // Direct-to-Earth communication visibility classification
  let earthVisibilityState: CommVisibilityState = 'Not Visible';
  let isDirectToEarthPossible = false;
  let commOpportunitySummary = '';

  if (earthElevationDeg > 5.0) {
    earthVisibilityState = 'Visible';
    isDirectToEarthPossible = true;
    commOpportunitySummary = 'Unobstructed geometric line-of-sight to Earth above local horizon.';
  } else if (earthElevationDeg >= 0.0) {
    earthVisibilityState = 'Marginal';
    isDirectToEarthPossible = true;
    commOpportunitySummary = 'Earth is near local horizon. Terrain elevation (crater rims/mountains) may occlude direct signal.';
  } else {
    earthVisibilityState = 'Not Visible';
    isDirectToEarthPossible = false;
    commOpportunitySummary = 'Earth is geometrically below the local lunar horizon (far-side or limb occlusion). Direct-to-Earth comms impossible; requires relay satellite.';
  }

  // --- 3. LOCAL LUNAR TIME & SUNRISE/SUNSET TIMING ---
  // One lunar solar day = 29.53059 Earth days (~708.73 hours)
  // Local lunar time is 12:00 (lunar noon) when sub-solar lon = site lon
  const lonDiff = normalize180(site.longitude - eph.subSolarLongitude);
  // lonDiff in [-180, +180]. When lonDiff = 0, local time is 12.00 (noon).
  const localLunarTimeHours = normalize360((lonDiff / 15.0) + 12.0) % 24;

  // Estimate hours until next sunrise or sunset using local latitude
  const timeUntilTransitions = estimateSunriseSunsetHours(site, date);

  return {
    sunElevationDeg,
    sunAzimuthDeg,
    sunlightCondition,
    solarFluxEstimateWm2,
    earthElevationDeg,
    earthAzimuthDeg,
    earthVisibilityState,
    commOpportunitySummary,
    isDirectToEarthPossible,
    localLunarTimeHours,
    timeUntilSunriseHours: timeUntilTransitions.untilSunriseHours,
    timeUntilSunsetHours: timeUntilTransitions.untilSunsetHours,
  };
}

/**
 * Approximate time until next sunrise / sunset by stepping forward in time.
 */
function estimateSunriseSunsetHours(site: LandingSite, startDate: Date): { untilSunriseHours: number | null; untilSunsetHours: number | null } {
  // If latitude is extreme polar (|lat| > 88°), site may have permanent light or permanent shadow depending on terrain
  const initialCond = calculateFastElevation(site, startDate);
  const initialSign = initialCond >= 0 ? 1 : -1;

  let untilSunriseHours: number | null = null;
  let untilSunsetHours: number | null = null;

  // Search forward in 4-hour steps up to 720 hours (one synodic month)
  const maxSearchHours = 720;
  const stepHours = 4;

  let prevElev = initialCond;
  let prevHours = 0;

  for (let h = stepHours; h <= maxSearchHours; h += stepHours) {
    const testDate = new Date(startDate.getTime() + h * 3600 * 1000);
    const elev = calculateFastElevation(site, testDate);

    // Detected crossing
    if (prevElev < 0 && elev >= 0 && untilSunriseHours === null) {
      // Linear interpolation for higher accuracy
      const fraction = (0 - prevElev) / (elev - prevElev);
      untilSunriseHours = prevHours + fraction * stepHours;
    } else if (prevElev >= 0 && elev < 0 && untilSunsetHours === null) {
      const fraction = (prevElev - 0) / (prevElev - elev);
      untilSunsetHours = prevHours + fraction * stepHours;
    }

    if (untilSunriseHours !== null && untilSunsetHours !== null) {
      break;
    }

    prevElev = elev;
    prevHours = h;
  }

  return { untilSunriseHours, untilSunsetHours };
}

function calculateFastElevation(site: LandingSite, date: Date): number {
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
  return Math.asin(Math.max(-1, Math.min(1, sinSunElev))) * RAD_TO_DEG;
}

/**
 * Computes an environmental timeseries over a given duration (e.g., 24 hours or 29.5 days).
 */
export function generateEnvironmentTimeSeries(
  site: LandingSite,
  baseDate: Date,
  totalHours: number,
  stepHours: number
): Array<{
  timestamp: string;
  hoursOffset: number;
  sunElevation: number;
  earthElevation: number;
  sunlightCondition: SunlightCondition;
  commState: CommVisibilityState;
}> {
  const series = [];
  const startTime = baseDate.getTime();

  for (let offset = 0; offset <= totalHours; offset += stepHours) {
    const pointDate = new Date(startTime + offset * 3600 * 1000);
    const cond = calculateLocalConditions(site, pointDate);

    series.push({
      timestamp: pointDate.toISOString(),
      hoursOffset: offset,
      sunElevation: Math.round(cond.sunElevationDeg * 10) / 10,
      earthElevation: Math.round(cond.earthElevationDeg * 10) / 10,
      sunlightCondition: cond.sunlightCondition,
      commState: cond.earthVisibilityState,
    });
  }

  return series;
}
