/**
 * Location coordinate validation for violation reports
 * Prevents false coordinates submitted from arbitrary locations
 * Ensures all violation reports have valid geographic coordinates
 */

export interface CoordinateValidation {
  valid: boolean;
  errors: string[];
  latitude?: number;
  longitude?: number;
}

/**
 * Validates geographic coordinates for violation reports
 * Performs type checking, range validation, and precision checks
 *
 * @param lat - Latitude value
 * @param lon - Longitude value
 * @returns Validation result with errors if invalid
 */
export function validateCoordinates(lat: number, lon: number): CoordinateValidation {
  const errors: string[] = [];

  // Type validation
  if (typeof lat !== 'number' || typeof lon !== 'number') {
    return {
      valid: false,
      errors: ['Coordinates must be valid numbers'],
    };
  }

  // NaN validation
  if (isNaN(lat) || isNaN(lon)) {
    return {
      valid: false,
      errors: ['Coordinates must not be NaN'],
    };
  }

  // Range validation - latitude must be between -90 and 90
  if (lat < -90 || lat > 90) {
    errors.push('Latitude must be between -90 and 90 degrees');
  }

  // Range validation - longitude must be between -180 and 180
  if (lon < -180 || lon > 180) {
    errors.push('Longitude must be between -180 and 180 degrees');
  }

  // Invalid location detection - origin point (0,0) is highly suspicious
  if (lat === 0 && lon === 0) {
    errors.push('Location (0,0) is invalid - coordinate origin point');
  }

  // Precision check - require reasonable precision (at least 4 decimal places)
  // This prevents overly coarse coordinates that don't pinpoint actual locations
  const latDecimals = lat.toString().split('.')[1]?.length || 0;
  const lonDecimals = lon.toString().split('.')[1]?.length || 0;

  if (latDecimals < 4 || lonDecimals < 4) {
    errors.push('Coordinates must have at least 4 decimal places for accuracy');
  }

  return {
    valid: errors.length === 0,
    errors,
    latitude: lat,
    longitude: lon,
  };
}

/**
 * Quick validation check for coordinates
 * Returns boolean instead of detailed error information
 *
 * @param lat - Latitude value
 * @param lon - Longitude value
 * @returns True if coordinates are valid, false otherwise
 */
export function isValidLocation(lat: number, lon: number): boolean {
  return validateCoordinates(lat, lon).valid;
}

/**
 * Calculate distance between two coordinate pairs in kilometers
 * Uses Haversine formula for accurate distance calculation
 *
 * @param lat1 - First latitude
 * @param lon1 - First longitude
 * @param lat2 - Second latitude
 * @param lon2 - Second longitude
 * @returns Distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Check if two coordinates are within specified distance
 * Useful for detecting duplicate reports from same location
 *
 * @param lat1 - First latitude
 * @param lon1 - First longitude
 * @param lat2 - Second latitude
 * @param lon2 - Second longitude
 * @param maxDistanceKm - Maximum allowed distance in kilometers (default 100m)
 * @returns True if coordinates are within distance threshold
 */
export function coordinatesWithinDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  maxDistanceKm: number = 0.1
): boolean {
  const distance = calculateDistance(lat1, lon1, lat2, lon2);
  return distance <= maxDistanceKm;
}
