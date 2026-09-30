import React, { useRef, useEffect, useState, useMemo } from 'react';
import { LandingSite, LocalEnvironmentConditions, LunarEphemerisState } from '../types/mission';
import { getTerrainProfileForSite } from '../utils/terrainProfiles';
import { formatCoordinates, formatLatitude, formatLongitude } from '../utils/coordinateFormatting';
import { Compass, RotateCw, ZoomIn, ZoomOut, Eye, Sun, Globe2, Crosshair, Layers, MapPin, Mountain } from 'lucide-react';

interface LunarGlobeCanvasProps {
  site: LandingSite;
  conditions: LocalEnvironmentConditions;
  ephemeris: LunarEphemerisState;
  missionName: string;
  onOpenCustomModal?: () => void;
}

// Major lunar maria selenographic coordinates and radii for rendering
const LUNAR_MARIA = [
  { name: 'Oceanus Procellarum', lat: 18.4, lon: -57.4, radiusX: 38, radiusY: 34, rot: 15 },
  { name: 'Mare Imbrium', lat: 32.8, lon: -15.6, radiusX: 20, radiusY: 18, rot: -5 },
  { name: 'Mare Serenitatis', lat: 28.0, lon: 17.5, radiusX: 14, radiusY: 13, rot: 10 },
  { name: 'Mare Tranquillitatis', lat: 8.5, lon: 31.4, radiusX: 16, radiusY: 14, rot: 0 },
  { name: 'Mare Crisium', lat: 17.0, lon: 59.1, radiusX: 11, radiusY: 9, rot: 20 },
  { name: 'Mare Fecunditatis', lat: -7.8, lon: 51.3, radiusX: 15, radiusY: 14, rot: -10 },
  { name: 'Mare Nectaris', lat: -15.2, lon: 35.5, radiusX: 9, radiusY: 9, rot: 0 },
  { name: 'Mare Nubium', lat: -21.3, lon: -16.6, radiusX: 14, radiusY: 12, rot: 5 },
  { name: 'Mare Humorum', lat: -24.4, lon: -38.4, radiusX: 9, radiusY: 8, rot: -15 },
  { name: 'Mare Frigoris', lat: 56.0, lon: 1.4, radiusX: 28, radiusY: 5, rot: 0 },
  { name: 'South Pole-Aitken', lat: -53.0, lon: -169.0, radiusX: 30, radiusY: 26, rot: 0 }
];

export const LunarGlobeCanvas: React.FC<LunarGlobeCanvasProps> = ({
  site,
  conditions,
  ephemeris,
  missionName,
  onOpenCustomModal
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // View mode: 'globe' (orthographic 3D projection) or 'radar' (local horizon sky dome)
  const [viewMode, setViewMode] = useState<'globe' | 'radar'>('globe');
  
  // Center projection coordinates for the orthographic globe (in degrees)
  const [centerLon, setCenterLon] = useState<number>(site.longitude);
  const [centerLat, setCenterLat] = useState<number>(site.latitude);
  const [zoom, setZoom] = useState<number>(1.0);
  
  // Display layers
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [showTerminator, setShowTerminator] = useState<boolean>(true);
  const [showTerrainSilhouette, setShowTerrainSilhouette] = useState<boolean>(true);

  // Mouse drag interaction
  const isDraggingRef = useRef<boolean>(false);
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Update center when site changes
  useEffect(() => {
    setCenterLon(site.longitude);
    setCenterLat(site.latitude);
  }, [site.name, site.latitude, site.longitude]);

  const handleCenterOnSite = () => {
    setCenterLon(site.longitude);
    setCenterLat(site.latitude);
    setZoom(1.0);
  };

  const handleResetToNearSide = () => {
    setCenterLon(0);
    setCenterLat(0);
    setZoom(1.0);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (viewMode !== 'globe') return;
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current || viewMode !== 'globe') return;
    const dx = e.clientX - lastMousePosRef.current.x;
    const dy = e.clientY - lastMousePosRef.current.y;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };

    setCenterLon(prev => {
      let next = prev - dx * 0.4;
      if (next > 180) next -= 360;
      if (next < -180) next += 360;
      return next;
    });

    setCenterLat(prev => {
      let next = prev + dy * 0.4;
      return Math.max(-89.9, Math.min(89.9, next));
    });
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // Canvas Render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    if (viewMode === 'globe') {
      renderGlobeView(ctx, width, height);
    } else {
      renderRadarView(ctx, width, height);
    }

    ctx.restore();
  }, [
    viewMode,
    centerLon,
    centerLat,
    zoom,
    showGrid,
    showLabels,
    showTerminator,
    showTerrainSilhouette,
    site,
    conditions,
    ephemeris
  ]);

  // --- RENDER GLOBE VIEW ---
  const renderGlobeView = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const cx = width / 2;
    const cy = height / 2;
    const R = Math.min(width, height) * 0.40 * zoom;

    const deg2rad = Math.PI / 180;
    const cLatRad = centerLat * deg2rad;
    const cLonRad = centerLon * deg2rad;

    const project = (latDeg: number, lonDeg: number): { x: number; y: number; visible: boolean; z: number } => {
      const lat = latDeg * deg2rad;
      const lon = lonDeg * deg2rad;
      const cosC = Math.sin(cLatRad) * Math.sin(lat) + Math.cos(cLatRad) * Math.cos(lat) * Math.cos(lon - cLonRad);
      const visible = cosC > 0.0;
      const x = cx + R * Math.cos(lat) * Math.sin(lon - cLonRad);
      const y = cy - R * (Math.cos(cLatRad) * Math.sin(lat) - Math.sin(cLatRad) * Math.cos(lat) * Math.cos(lon - cLonRad));
      return { x, y, visible, z: cosC };
    };

    // Space background
    ctx.fillStyle = '#05070B';
    ctx.fillRect(0, 0, width, height);

    // Subtle star dust
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    const starSeeds = [12, 45, 78, 120, 160, 210, 280, 310, 350, 420];
    starSeeds.forEach((s, idx) => {
      const sx = (s * 3.7 + idx * 47) % width;
      const sy = (s * 5.3 + idx * 83) % height;
      const dist = Math.hypot(sx - cx, sy - cy);
      if (dist > R + 10) {
        ctx.fillRect(sx, sy, 1, 1);
      }
    });

    // Lunar Globe base disk
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.clip();

    const globeGrad = ctx.createRadialGradient(cx - R * 0.25, cy - R * 0.25, R * 0.1, cx, cy, R);
    globeGrad.addColorStop(0, '#94A3B8');
    globeGrad.addColorStop(0.6, '#64748B');
    globeGrad.addColorStop(1, '#334155');
    ctx.fillStyle = globeGrad;
    ctx.fill();

    // Lunar Maria
    LUNAR_MARIA.forEach(maria => {
      const p = project(maria.lat, maria.lon);
      if (p.visible) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((maria.rot * Math.PI) / 180);
        ctx.scale(p.z, 1);

        const rX = (maria.radiusX / 90) * R;
        const rY = (maria.radiusY / 90) * R;

        const mariaGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.max(rX, rY));
        mariaGrad.addColorStop(0, 'rgba(30, 41, 59, 0.85)');
        mariaGrad.addColorStop(0.7, 'rgba(51, 65, 85, 0.65)');
        mariaGrad.addColorStop(1, 'rgba(71, 85, 105, 0.0)');

        ctx.fillStyle = mariaGrad;
        ctx.beginPath();
        ctx.ellipse(0, 0, Math.max(2, rX), Math.max(2, rY), 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (showLabels && p.z > 0.4) {
          ctx.fillStyle = 'rgba(226, 232, 240, 0.65)';
          ctx.font = '9px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(maria.name, p.x, p.y - 2);
        }
      }
    });

    // Selenographic Coordinate Grid
    if (showGrid) {
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.20)';
      ctx.lineWidth = 1;

      const lats = [-80, -60, -30, 0, 30, 60, 80];
      lats.forEach(lat => {
        ctx.beginPath();
        let first = true;
        for (let lon = -180; lon <= 180; lon += 5) {
          const pt = project(lat, lon);
          if (pt.visible) {
            if (first) { ctx.moveTo(pt.x, pt.y); first = false; }
            else { ctx.lineTo(pt.x, pt.y); }
          } else { first = true; }
        }
        ctx.stroke();
      });

      for (let lon = -180; lon < 180; lon += 30) {
        ctx.beginPath();
        let first = true;
        for (let lat = -89; lat <= 89; lat += 3) {
          const pt = project(lat, lon);
          if (pt.visible) {
            if (first) { ctx.moveTo(pt.x, pt.y); first = false; }
            else { ctx.lineTo(pt.x, pt.y); }
          } else { first = true; }
        }
        ctx.stroke();
      }

      ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      let eqFirst = true;
      for (let lon = -180; lon <= 180; lon += 3) {
        const pt = project(0, lon);
        if (pt.visible) {
          if (eqFirst) { ctx.moveTo(pt.x, pt.y); eqFirst = false; }
          else { ctx.lineTo(pt.x, pt.y); }
        } else { eqFirst = true; }
      }
      ctx.stroke();
    }

    // Day/Night Terminator Shadow
    if (showTerminator) {
      const subSunLatRad = ephemeris.subSolarLatitude * deg2rad;
      const subSunLonRad = ephemeris.subSolarLongitude * deg2rad;
      const step = 4;

      for (let py = cy - R; py <= cy + R; py += step) {
        const dy = py - cy;
        const maxDx = Math.sqrt(Math.max(0, R * R - dy * dy));
        if (maxDx <= 0) continue;

        for (let px = cx - maxDx; px <= cx + maxDx; px += step) {
          const xNorm = (px - cx) / R;
          const yNorm = -(py - cy) / R;
          const rho = Math.sqrt(xNorm * xNorm + yNorm * yNorm);
          if (rho > 1.0) continue;

          const c = Math.asin(rho);
          const sinC = Math.sin(c);
          const cosC = Math.cos(c);

          let latPt = Math.asin(cosC * Math.sin(cLatRad) + (yNorm * sinC * Math.cos(cLatRad)) / (rho || 1));
          let lonPt = cLonRad + Math.atan2(xNorm * sinC, rho * Math.cos(cLatRad) * cosC - yNorm * Math.sin(cLatRad) * sinC);

          const cosZenith = Math.sin(latPt) * Math.sin(subSunLatRad) +
            Math.cos(latPt) * Math.cos(subSunLatRad) * Math.cos(lonPt - subSunLonRad);

          if (cosZenith < 0.0) {
            const darkness = Math.min(0.85, 0.55 + Math.abs(cosZenith) * 0.35);
            ctx.fillStyle = `rgba(5, 7, 11, ${darkness})`;
            ctx.fillRect(px, py, step, step);
          } else if (cosZenith < 0.06) {
            const twilight = (1.0 - cosZenith / 0.06) * 0.5;
            ctx.fillStyle = `rgba(5, 7, 11, ${twilight})`;
            ctx.fillRect(px, py, step, step);
          }
        }
      }
    }

    ctx.restore();

    // Limb outline
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.stroke();

    // Sub-Earth Vector Indicator
    const earthProj = project(ephemeris.subEarthLatitude, ephemeris.subEarthLongitude);
    if (earthProj.visible) {
      ctx.fillStyle = '#38BDF8';
      ctx.beginPath();
      ctx.arc(earthProj.x, earthProj.y, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(earthProj.x, earthProj.y, 7, 0, Math.PI * 2);
      ctx.stroke();

      if (showLabels) {
        ctx.fillStyle = '#7DD3FC';
        ctx.font = '10px monospace';
        ctx.textAlign = 'left';
        ctx.fillText('🌍 Sub-Earth Point', earthProj.x + 10, earthProj.y + 3);
      }
    }

    // Sub-Solar Vector Indicator
    const sunProj = project(ephemeris.subSolarLatitude, ephemeris.subSolarLongitude);
    if (sunProj.visible) {
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.arc(sunProj.x, sunProj.y, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(245, 158, 11, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(sunProj.x, sunProj.y, 9, 0, Math.PI * 2);
      ctx.stroke();

      if (showLabels) {
        ctx.fillStyle = '#FCD34D';
        ctx.font = '10px monospace';
        ctx.textAlign = 'left';
        ctx.fillText('☀️ Sub-Solar Point', sunProj.x + 12, sunProj.y + 3);
      }
    }

    // Landing Site Reticle
    const siteProj = project(site.latitude, site.longitude);
    if (siteProj.visible) {
      const sx = siteProj.x;
      const sy = siteProj.y;

      ctx.strokeStyle = '#06B6D4';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(sx, sy, 8, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = '#22D3EE';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(sx - 12, sy);
      ctx.lineTo(sx - 9, sy);
      ctx.moveTo(sx + 9, sy);
      ctx.lineTo(sx + 12, sy);
      ctx.moveTo(sx, sy - 12);
      ctx.lineTo(sx, sy - 9);
      ctx.moveTo(sx, sy + 9);
      ctx.lineTo(sx, sy + 12);
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(sx, sy, 2.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#06B6D4';
      ctx.font = 'bold 11px var(--font-display, sans-serif)';
      ctx.textAlign = 'left';
      ctx.fillText(`📍 ${missionName}`, sx + 14, sy - 4);

      ctx.fillStyle = '#94A3B8';
      ctx.font = '9px monospace';
      ctx.fillText(`${site.name} (${formatCoordinates(site.latitude, site.longitude)})`, sx + 14, sy + 8);
    } else {
      const oppX = cx + (site.longitude > centerLon ? 1 : -1) * (R + 18);
      const oppY = cy - (site.latitude / 90) * (R * 0.8);
      ctx.fillStyle = 'rgba(6, 182, 212, 0.7)';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`📍 ${site.name} (Far Hemisphere)`, oppX > cx ? width - 80 : 80, oppY);
    }

    // Coordinate Overlay HUD
    ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
    ctx.strokeStyle = 'rgba(30, 41, 59, 0.9)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(12, height - 52, 220, 40, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#38BDF8';
    ctx.font = '9px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`CENTER: ${formatCoordinates(centerLat, centerLon)}`, 18, height - 36);
    ctx.fillStyle = '#94A3B8';
    ctx.fillText(`PHASE: ${ephemeris.lunarPhaseName} (${(ephemeris.illuminationFraction * 100).toFixed(0)}%)`, 18, height - 22);
  };

  // --- RENDER RADAR VIEW (Local Lunar Horizon Sky Dome with LOLA Topography) ---
  const renderRadarView = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const cx = width / 2;
    const cy = height / 2;
    const maxR = Math.min(width, height) * 0.42;
    const terrain = getTerrainProfileForSite(site);

    ctx.fillStyle = '#05070B';
    ctx.fillRect(0, 0, width, height);

    const elevToR = (elevDeg: number): number => {
      return ((90 - elevDeg) / 90) * maxR;
    };

    const azToAngle = (azDeg: number): number => {
      return (azDeg - 90) * (Math.PI / 180);
    };

    // 1. Below spherical horizon outer base
    ctx.fillStyle = '#090D16';
    ctx.beginPath();
    ctx.arc(cx, cy, maxR, 0, Math.PI * 2);
    ctx.fill();

    // 2. Concentric elevation rings
    const elevSteps = [
      { elev: 0, label: '0° Mean Spherical Horizon' },
      { elev: 15, label: '15°' },
      { elev: 30, label: '30°' },
      { elev: 60, label: '60°' }
    ];

    elevSteps.forEach(s => {
      const r = elevToR(s.elev);
      ctx.strokeStyle = s.elev === 0 ? 'rgba(6, 182, 212, 0.4)' : 'rgba(148, 163, 184, 0.15)';
      ctx.lineWidth = s.elev === 0 ? 1.5 : 0.8;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = s.elev === 0 ? '#22D3EE' : '#64748B';
      ctx.font = '9px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(s.label, cx + 4, cy - r + 11);
    });

    // 3. Azimuth radial spokes
    const cardinals = [
      { az: 0, label: 'N (0°)' },
      { az: 90, label: 'E (90°)' },
      { az: 180, label: 'S (180°)' },
      { az: 270, label: 'W (270°)' }
    ];

    cardinals.forEach(c => {
      const angle = azToAngle(c.az);
      const x = cx + maxR * Math.cos(angle);
      const y = cy + maxR * Math.sin(angle);

      ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(x, y);
      ctx.stroke();

      const tx = cx + (maxR + 16) * Math.cos(angle);
      const ty = cy + (maxR + 16) * Math.sin(angle);
      ctx.fillStyle = '#CBD5E1';
      ctx.font = '10px monospace font-semibold';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(c.label, tx, ty);
    });

    // 4. LOLA 360° LOCAL TERRAIN HORIZON SILHOUETTE
    if (showTerrainSilhouette) {
      ctx.save();
      ctx.beginPath();
      for (let az = 0; az <= 360; az += 2) {
        const elev = terrain.getHorizonElevation(az);
        const r = elevToR(elev);
        const angle = azToAngle(az);
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        if (az === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();

      // Terrain outline
      ctx.strokeStyle = 'rgba(244, 63, 94, 0.8)';
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // Terrain occlusion shading
      ctx.fillStyle = 'rgba(244, 63, 94, 0.08)';
      ctx.fill();

      // Prominent landmarks annotations
      terrain.landmarks.forEach(lm => {
        const lmAngle = azToAngle(lm.azimuthDeg);
        const lmR = elevToR(lm.peakElevationDeg);
        const lmx = cx + lmR * Math.cos(lmAngle);
        const lmy = cy + lmR * Math.sin(lmAngle);

        ctx.fillStyle = '#FB7185';
        ctx.beginPath();
        ctx.arc(lmx, lmy, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = '9px monospace';
        ctx.fillStyle = '#FDA4AF';
        ctx.textAlign = lmx > cx ? 'left' : 'right';
        ctx.fillText(`⛰️ ${lm.name} (+${lm.peakElevationDeg.toFixed(1)}°)`, lmx + (lmx > cx ? 6 : -6), lmy);
      });

      ctx.restore();
    }

    // Zenith marker
    ctx.fillStyle = '#06B6D4';
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#67E8F9';
    ctx.font = '9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Zenith (+90°)', cx, cy + 12);

    // 5. Plot Sun Position
    const sunAngle = azToAngle(conditions.sunAzimuthDeg);
    const sunR = elevToR(conditions.sunElevationDeg);
    const sunX = cx + sunR * Math.cos(sunAngle);
    const sunY = cy + sunR * Math.sin(sunAngle);

    ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
    ctx.setLineDash([2, 3]);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(sunX, sunY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = conditions.isSunOccludedByTerrain ? '#78350F' : conditions.sunElevationDeg >= 0 ? '#F59E0B' : '#451A03';
    ctx.beginPath();
    ctx.arc(sunX, sunY, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = conditions.isSunOccludedByTerrain ? '#EF4444' : '#FCD34D';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(sunX, sunY, 11, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = conditions.isSunOccludedByTerrain ? '#F87171' : '#FCD34D';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(
      `☀️ SUN (${conditions.sunElevationDeg.toFixed(1)}°${conditions.isSunOccludedByTerrain ? ' [OCCLUDED BY RIM]' : ''})`,
      sunX + 14,
      sunY - 4
    );

    // 6. Plot Earth Position
    const earthAngle = azToAngle(conditions.earthAzimuthDeg);
    const earthR = elevToR(conditions.earthElevationDeg);
    const earthX = cx + earthR * Math.cos(earthAngle);
    const earthY = cy + earthR * Math.sin(earthAngle);

    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.setLineDash([2, 3]);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(earthX, earthY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = conditions.isEarthOccludedByTerrain ? '#1E293B' : conditions.earthElevationDeg >= 0 ? '#0284C7' : '#0F172A';
    ctx.beginPath();
    ctx.arc(earthX, earthY, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = conditions.isEarthOccludedByTerrain ? '#EF4444' : '#38BDF8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(earthX, earthY, 11, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = conditions.isEarthOccludedByTerrain ? '#F87171' : '#38BDF8';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(
      `🌍 EARTH (${conditions.earthElevationDeg.toFixed(1)}°${conditions.isEarthOccludedByTerrain ? ' [OCCLUDED]' : ''})`,
      earthX + 14,
      earthY - 4
    );
  };

  return (
    <div className="relative w-full h-[460px] md:h-[520px] bg-[#05070B] border border-slate-800 rounded-xl overflow-hidden flex flex-col">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#090D16]/90 border-b border-slate-800/80 backdrop-blur-sm z-10 text-xs">
        {/* Left: View Mode Segmented Control */}
        <div className="flex items-center gap-1 p-0.5 bg-slate-900 rounded-lg border border-slate-800">
          <button
            onClick={() => setViewMode('globe')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              viewMode === 'globe'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Global Orthographic View
          </button>
          <button
            onClick={() => setViewMode('radar')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              viewMode === 'radar'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Local Horizon Sky Dome
          </button>
        </div>

        {/* Right: Quick actions, custom coords, and layer toggles */}
        <div className="flex items-center gap-2">
          {onOpenCustomModal && (
            <button
              onClick={onOpenCustomModal}
              className="px-2.5 py-1 text-cyan-300 hover:text-white bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 rounded-md transition-colors flex items-center gap-1.5 font-medium"
              title="Set custom landing coordinates"
            >
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>Custom Coordinates</span>
            </button>
          )}

          {viewMode === 'globe' ? (
            <>
              <button
                onClick={handleCenterOnSite}
                className="px-2.5 py-1 text-slate-300 hover:text-cyan-300 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-md transition-colors flex items-center gap-1.5"
                title="Center on mission landing site"
              >
                <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Center Site</span>
              </button>

              <button
                onClick={handleResetToNearSide}
                className="px-2.5 py-1 text-slate-300 hover:text-slate-100 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-md transition-colors flex items-center gap-1.5"
                title="Reset to Lunar Prime Meridian (0°, 0°)"
              >
                <RotateCw className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline">Near Side</span>
              </button>

              <div className="h-4 w-px bg-slate-800 mx-1" />

              <button
                onClick={() => setShowGrid(!showGrid)}
                className={`p-1.5 rounded-md border transition-colors ${
                  showGrid ? 'bg-cyan-950/60 border-cyan-500/40 text-cyan-400' : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
                title="Toggle coordinate graticule grid"
              >
                <Layers className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setShowTerminator(!showTerminator)}
                className={`p-1.5 rounded-md border transition-colors ${
                  showTerminator ? 'bg-cyan-950/60 border-cyan-500/40 text-cyan-400' : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
                title="Toggle day/night terminator shadow"
              >
                <Sun className="w-3.5 h-3.5" />
              </button>

              <div className="h-4 w-px bg-slate-800 mx-1" />

              <button
                onClick={() => setZoom(prev => Math.min(2.0, prev + 0.15))}
                className="p-1.5 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
                title="Zoom in"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoom(prev => Math.max(0.7, prev - 0.15))}
                className="p-1.5 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
                title="Zoom out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowTerrainSilhouette(!showTerrainSilhouette)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md border transition-colors flex items-center gap-1.5 ${
                showTerrainSilhouette ? 'bg-rose-950/60 border-rose-500/40 text-rose-300' : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
              title="Toggle LOLA terrain crater rim silhouette"
            >
              <Mountain className="w-3.5 h-3.5" />
              <span>LOLA Rim Mask</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Interactive Canvas Area */}
      <div className="relative flex-1 w-full h-full cursor-crosshair">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="w-full h-full block"
        />

        {viewMode === 'globe' ? (
          <div className="absolute top-3 left-3 pointer-events-none text-[11px] font-mono text-slate-400 bg-black/60 px-2.5 py-1 rounded border border-slate-800/80 backdrop-blur-sm">
            Drag to rotate · Click &ldquo;Center Site&rdquo; to focus
          </div>
        ) : (
          <div className="absolute top-3 left-3 pointer-events-none text-[11px] font-mono text-slate-400 bg-black/60 px-2.5 py-1 rounded border border-slate-800/80 backdrop-blur-sm">
            Observer frame at {site.name} · Red line: LOLA 360° terrain rim silhouette
          </div>
        )}

        {/* Legend / Key overlay in bottom-right */}
        <div className="absolute bottom-3 right-3 text-[11px] font-mono bg-black/75 px-3 py-2 rounded-lg border border-slate-800/90 backdrop-blur-sm space-y-1 text-slate-300">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" />
            <span>Site: {site.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
            <span>Sun Direction ({conditions.sunElevationDeg.toFixed(1)}°)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block" />
            <span>Earth Direction ({conditions.earthElevationDeg.toFixed(1)}°)</span>
          </div>
          {viewMode === 'radar' && (
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-0.5 bg-rose-400 inline-block" />
              <span>LOLA Rim Horizon Mask</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
