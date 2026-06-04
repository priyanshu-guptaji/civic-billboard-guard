export function validateCoordinates(lat: number, lon: number) {
  const errors = [];
  if (typeof lat !== 'number' || typeof lon !== 'number') errors.push('Coordinates must be numbers');
  if (lat < -90 || lat > 90) errors.push('Invalid latitude');
  if (lon < -180 || lon > 180) errors.push('Invalid longitude');
  if (lat === 0 && lon === 0) errors.push('Invalid location');
  return { valid: errors.length === 0, errors };
}
