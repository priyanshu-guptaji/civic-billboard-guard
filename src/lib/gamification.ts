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
  reportsCount: number;
  starredBy: string[]; // array of user IDs who starred this user
}

export const initialUser: MockUser = { 
  id: "6", 
  name: "Sneha", 
  points: 0, 
  avatarUrl: "https://i.pravatar.cc/150?u=6",
  reportsCount: 0,
  starredBy: []
};

export const mockUsers: MockUser[] = [
  { id: "1", name: "Rajesh Kumar", points: 1250, avatarUrl: "https://i.pravatar.cc/150?u=1", reportsCount: 28, starredBy: ["6", "3"] },
  { id: "2", name: "Priya Sharma", points: 950, avatarUrl: "https://i.pravatar.cc/150?u=2", reportsCount: 22, starredBy: ["6"] },
  { id: "3", name: "Amit Patel", points: 850, avatarUrl: "https://i.pravatar.cc/150?u=3", reportsCount: 18, starredBy: ["1", "6"] },
  { id: "4", name: "Deepa Nair", points: 750, avatarUrl: "https://i.pravatar.cc/150?u=4", reportsCount: 15, starredBy: ["6"] },
  { id: "5", name: "Vikram Singh", points: 620, avatarUrl: "https://i.pravatar.cc/150?u=5", reportsCount: 14, starredBy: [] },
  { id: "6", name: "Sneha", points: 500, avatarUrl: "https://i.pravatar.cc/150?u=6", reportsCount: 10, starredBy: ["1", "2"] },
  { id: "7", name: "Arun Kumar", points: 420, avatarUrl: "https://i.pravatar.cc/150?u=7", reportsCount: 9, starredBy: [] },
  { id: "8", name: "Neha Gupta", points: 380, avatarUrl: "https://i.pravatar.cc/150?u=8", reportsCount: 8, starredBy: ["6"] },
];

export const getCurrentBadge = (points: number) => {
  return BADGE_TIERS.slice().reverse().find(tier => points >= tier.minPoints) || BADGE_TIERS[0];
};

export const getNextBadge = (points: number) => {
  return BADGE_TIERS.find(tier => tier.minPoints > points) || null;
};
