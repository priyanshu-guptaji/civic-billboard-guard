import { describe, it, expect } from 'vitest';
import { getCurrentBadge, getNextBadge } from './gamification';

describe('gamification', () => {
  describe('getCurrentBadge', () => {
    it('returns the first badge for 0 points', () => {
      expect(getCurrentBadge(0).name).toBe('Bronze Scout');
    });

    it('returns the correct badge for intermediate points', () => {
      expect(getCurrentBadge(100).name).toBe('Bronze Scout');
      expect(getCurrentBadge(101).name).toBe('Silver Reporter');
      expect(getCurrentBadge(500).name).toBe('Silver Reporter');
      expect(getCurrentBadge(501).name).toBe('Gold Guardian');
    });

    it('returns the highest badge for points beyond the max tier', () => {
      expect(getCurrentBadge(1001).name).toBe('Platinum Sentinel');
      expect(getCurrentBadge(9999).name).toBe('Platinum Sentinel');
    });
  });

  describe('getNextBadge', () => {
    it('returns the next badge for 0 points', () => {
      const nextBadge = getNextBadge(0);
      expect(nextBadge?.name).toBe('Silver Reporter');
    });

    it('returns the next badge when close to threshold', () => {
      const nextBadge = getNextBadge(100);
      expect(nextBadge?.name).toBe('Silver Reporter');
      
      const nextBadge2 = getNextBadge(500);
      expect(nextBadge2?.name).toBe('Gold Guardian');
    });

    it('returns null if already at or beyond the highest badge', () => {
      expect(getNextBadge(1001)).toBeNull();
      expect(getNextBadge(9999)).toBeNull();
    });
  });
});
