import { describe, it, expect } from 'vitest';
import {
  normalizeReportStatus,
  getReportStatusIndex,
  reportStatusBadgeVariant
} from './reports';

describe('reports', () => {
  describe('normalizeReportStatus', () => {
    it('returns the exact status if it is a valid ReportStatus', () => {
      expect(normalizeReportStatus('Submitted')).toBe('Submitted');
      expect(normalizeReportStatus('Under Review')).toBe('Under Review');
      expect(normalizeReportStatus('In Progress')).toBe('In Progress');
      expect(normalizeReportStatus('Resolved')).toBe('Resolved');
    });

    it('maps Pending to Submitted', () => {
      expect(normalizeReportStatus('Pending')).toBe('Submitted');
    });

    it('maps Verified to Under Review', () => {
      expect(normalizeReportStatus('Verified')).toBe('Under Review');
    });

    it('falls back to Submitted for unknown statuses', () => {
      expect(normalizeReportStatus('Unknown')).toBe('Submitted');
      expect(normalizeReportStatus('Random')).toBe('Submitted');
    });
  });

  describe('getReportStatusIndex', () => {
    it('returns correct index for valid statuses', () => {
      expect(getReportStatusIndex('Submitted')).toBe(0);
      expect(getReportStatusIndex('Under Review')).toBe(1);
      expect(getReportStatusIndex('In Progress')).toBe(2);
      expect(getReportStatusIndex('Resolved')).toBe(3);
    });

    it('returns correct index for un-normalized statuses', () => {
      expect(getReportStatusIndex('Pending')).toBe(0); // normalizes to Submitted
      expect(getReportStatusIndex('Verified')).toBe(1); // normalizes to Under Review
    });
  });

  describe('reportStatusBadgeVariant', () => {
    it('returns the correct variant for each status', () => {
      expect(reportStatusBadgeVariant('Resolved')).toBe('default');
      expect(reportStatusBadgeVariant('In Progress')).toBe('secondary');
      expect(reportStatusBadgeVariant('Under Review')).toBe('outline');
      expect(reportStatusBadgeVariant('Submitted')).toBe('secondary');
    });

    it('handles un-normalized statuses properly', () => {
      expect(reportStatusBadgeVariant('Pending')).toBe('secondary'); // normalizes to Submitted
      expect(reportStatusBadgeVariant('Verified')).toBe('outline'); // normalizes to Under Review
    });
  });
});
