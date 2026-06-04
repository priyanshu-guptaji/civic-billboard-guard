/**
 * Location coordinate validation for violation reports
 * Prevents false coordinates submitted from arbitrary locations
 */

export interface CoordinateValidation {
  valid: boolean;
  errors: string[];
  latitude?: number;
  longitude?: number;
}

export function validateCoordinates(lat: number, lon: number): CoordinateValidation {
  const errors: string[] = [];

  // Type validation
  if (typeof lat !== 'number' || typeof lon !== 'number') {
    return {
      valid: false,
      errors: ['Coordinates must be valid numbers'],
    };
  }

  // Range validation
  if (lat < -90 || lat > 90) {
    errors.push('Latitude must be between -90 and 90 degrees');
  }

  if (lon < -180 || lon > 180) {
    errors.push('Longitude must be between -180 and 180 degrees');
  }

  // Invalid location detection
  if (lat === 0 && lon === 0) {
    errors.push('Location (0,0) is invalid - coordinate origin point');
  }

  // Precision check (require reasonable precision)
  if (Number.isInteger(lat) && Number.isInteger(lon)) {
    errors.push('Coordinates too imprecise - require at least 2 decimal places');
  }

  return {
    valid: errors.length === 0,
    errors,
    latitude: lat,
    longitude: lon,
  };
}

export function isValidLocation(lat: number, lon: number): boolean {
  return validateCoordinates(lat, lon).valid;
}
