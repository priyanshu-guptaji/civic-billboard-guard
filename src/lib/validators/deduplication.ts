/**
 * Duplicate violation detection and prevention
 * Prevents same billboard from being reported multiple times within short timeframe
 * Reduces system clogging from redundant or spam reports
 */

export interface DuplicateCheckResult {
  isDuplicate: boolean;
  duplicateId?: string;
  reason?: string;
  confidenceScore?: number;
}

export interface ViolationRecord {
  id: string;
  type: string;
  location: {
    latitude: number;
    longitude: number;
  };
  description: string;
  timestamp: Date;
  imageHash?: string;
}

/**
 * Deduplication engine for violation reports
 * Uses multiple strategies to identify duplicates
 */
export class ViolationDeduplicationEngine {
  private static readonly LOCATION_THRESHOLD_KM = 0.1; // 100 meters
  private static readonly TIME_THRESHOLD_MS = 24 * 60 * 60 * 1000; // 24 hours
  private static readonly DESCRIPTION_SIMILARITY_THRESHOLD = 0.7;

  /**
   * Calculate geographic distance between two coordinates in kilometers
   * Uses Haversine formula
   */
  private static calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in km
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
   * Calculate Jaccard similarity between two strings
   * Used for detecting similar violation descriptions
   */
  private static calculateSimilarity(str1: string, str2: string): number {
    const s1 = new Set(str1.toLowerCase().split(/\s+/));
    const s2 = new Set(str2.toLowerCase().split(/\s+/));

    const intersection = new Set([...s1].filter((x) => s2.has(x)));
    const union = new Set([...s1, ...s2]);

    return intersection.size / union.size;
  }

  /**
   * Check if provided violation is a duplicate of an existing one
   * Considers location, time, type, and description
   *
   * @param newViolation - Violation report to check
   * @param existingViolations - Array of existing violation records
   * @returns Duplicate check result with confidence score
   */
  static checkForDuplicate(
    newViolation: ViolationRecord,
    existingViolations: ViolationRecord[]
  ): DuplicateCheckResult {
    const now = new Date();

    for (const existing of existingViolations) {
      // Skip old reports outside time window
      const timeDiff = now.getTime() - new Date(existing.timestamp).getTime();
      if (timeDiff > this.TIME_THRESHOLD_MS) {
        continue;
      }

      // Check location proximity
      const distance = this.calculateDistance(
        newViolation.location.latitude,
        newViolation.location.longitude,
        existing.location.latitude,
        existing.location.longitude
      );

      if (distance > this.LOCATION_THRESHOLD_KM) {
        continue; // Too far apart
      }

      // Check violation type match
      if (newViolation.type !== existing.type) {
        continue; // Different violation types
      }

      // Check description similarity
      const similarity = this.calculateSimilarity(
        newViolation.description,
        existing.description
      );

      if (similarity >= this.DESCRIPTION_SIMILARITY_THRESHOLD) {
        return {
          isDuplicate: true,
          duplicateId: existing.id,
          reason: `Duplicate of report ${existing.id}: same location, type, and similar description`,
          confidenceScore: similarity,
        };
      }

      // Check image hash if available
      if (
        newViolation.imageHash &&
        existing.imageHash &&
        newViolation.imageHash === existing.imageHash
      ) {
        return {
          isDuplicate: true,
          duplicateId: existing.id,
          reason: `Exact duplicate detected: identical image hash`,
          confidenceScore: 1.0,
        };
      }
    }

    return {
      isDuplicate: false,
      confidenceScore: 0,
    };
  }

  /**
   * Find all potential duplicates for a violation
   * Returns array of similar violations with confidence scores
   */
  static findPotentialDuplicates(
    violation: ViolationRecord,
    existingViolations: ViolationRecord[],
    minConfidence: number = 0.5
  ): Array<{ violation: ViolationRecord; confidence: number }> {
    const potentialDuplicates: Array<{
      violation: ViolationRecord;
      confidence: number;
    }> = [];
    const now = new Date();

    for (const existing of existingViolations) {
      // Skip old reports
      const timeDiff = now.getTime() - new Date(existing.timestamp).getTime();
      if (timeDiff > this.TIME_THRESHOLD_MS) {
        continue;
      }

      // Check location proximity
      const distance = this.calculateDistance(
        violation.location.latitude,
        violation.location.longitude,
        existing.location.latitude,
        existing.location.longitude
      );

      if (distance > this.LOCATION_THRESHOLD_KM * 5) {
        continue; // Too far apart
      }

      // Calculate composite confidence score
      let confidence = 0;

      // Type match (weight: 0.3)
      if (violation.type === existing.type) {
        confidence += 0.3;
      }

      // Location proximity (weight: 0.3) - closer = higher confidence
      const locationScore = Math.max(
        0,
        1 - distance / (this.LOCATION_THRESHOLD_KM * 10)
      );
      confidence += locationScore * 0.3;

      // Description similarity (weight: 0.4)
      const similarity = this.calculateSimilarity(
        violation.description,
        existing.description
      );
      confidence += similarity * 0.4;

      if (confidence >= minConfidence) {
        potentialDuplicates.push({
          violation: existing,
          confidence,
        });
      }
    }

    // Sort by confidence descending
    return potentialDuplicates.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Get statistics about violations in a geographic area
   * Useful for identifying duplicate hotspots
   */
  static getAreaStatistics(
    violations: ViolationRecord[],
    latitude: number,
    longitude: number,
    radiusKm: number = 1
  ): {
    totalReports: number;
    uniqueTypes: number;
    averageReportsPerType: number;
    timeRange: { earliest: Date; latest: Date } | null;
  } {
    const nearby = violations.filter((v) => {
      const distance = this.calculateDistance(
        latitude,
        longitude,
        v.location.latitude,
        v.location.longitude
      );
      return distance <= radiusKm;
    });

    if (nearby.length === 0) {
      return {
        totalReports: 0,
        uniqueTypes: 0,
        averageReportsPerType: 0,
        timeRange: null,
      };
    }

    const types = new Set(nearby.map((v) => v.type));
    const timestamps = nearby.map((v) => new Date(v.timestamp).getTime());

    return {
      totalReports: nearby.length,
      uniqueTypes: types.size,
      averageReportsPerType: nearby.length / types.size,
      timeRange: {
        earliest: new Date(Math.min(...timestamps)),
        latest: new Date(Math.max(...timestamps)),
      },
    };
  }
}

/**
 * Quick helper to check if violation is likely a duplicate
 *
 * @param newViolation - Violation to check
 * @param existingViolations - Existing violations
 * @returns True if likely duplicate
 */
export function isProbablyDuplicate(
  newViolation: ViolationRecord,
  existingViolations: ViolationRecord[]
): boolean {
  const result = ViolationDeduplicationEngine.checkForDuplicate(
    newViolation,
    existingViolations
  );
  return result.isDuplicate;
}
