export const POINT_STRUCTURE = {
  SUBMIT_REPORT: 10,
  REPORT_VERIFIED: 50,
  REPORT_RESOLVED: 100,
};

export const BADGE_TIERS = [
  { name: "Bronze Scout", minPoints: 0, icon: "🥉" },
  { name: "Silver Reporter", minPoints: 101, icon: "🥈" },
  { name: "Gold Guardian", minPoints: 501, icon: "🥇" },
  { name: "Platinum Sentinel", minPoints: 1001, icon: "🏆" },
];

export interface MockUser {
  id: string;
  name: string;
  points: number;
  avatarUrl: string;
}

export const initialUser: MockUser = { 
  id: "6", 
  name: "Sneha", 
  points: 0, 
  avatarUrl: "https://i.pravatar.cc/150?u=6" 
};

export const getCurrentBadge = (points: number) => {
  return BADGE_TIERS.slice().reverse().find(tier => points >= tier.minPoints) || BADGE_TIERS[0];
};

export const getNextBadge = (points: number) => {
  return BADGE_TIERS.find(tier => tier.minPoints > points) || null;
};
