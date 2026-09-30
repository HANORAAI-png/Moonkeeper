/**
 * MoonKeeper - Selenographic Coordinate Formatting Utilities
 * Prevents double-negative formatting (e.g. prevents "-80.1°S", formats correctly as "80.13°S" or "-80.13°")
 */

export function formatLatitude(lat: number, format: 'cardinal' | 'signed' = 'cardinal'): string {
  if (isNaN(lat)) return '0.00°';
  const abs = Math.abs(lat).toFixed(2);
  
  if (format === 'signed') {
    return `${lat > 0 ? '+' : lat < 0 ? '-' : ''}${abs}°`;
  }
  
  if (Math.abs(lat) < 0.005) return '0.00° (Equator)';
  return `${abs}°${lat > 0 ? 'N' : 'S'}`;
}

export function formatLongitude(lon: number, format: 'cardinal' | 'signed' = 'cardinal'): string {
  if (isNaN(lon)) return '0.00°';
  const abs = Math.abs(lon).toFixed(2);

  if (format === 'signed') {
    return `${lon > 0 ? '+' : lon < 0 ? '-' : ''}${abs}°`;
  }

  if (Math.abs(lon) < 0.005) return '0.00° (Prime Meridian)';
  return `${abs}°${lon > 0 ? 'E' : 'W'}`;
}

export function formatCoordinates(lat: number, lon: number, format: 'cardinal' | 'signed' = 'cardinal'): string {
  return `${formatLatitude(lat, format)}, ${formatLongitude(lon, format)}`;
}
