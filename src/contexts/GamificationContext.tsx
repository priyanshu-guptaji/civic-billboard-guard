import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { MockUser, mockUsers } from "@/lib/gamification";

interface GamificationContextType {
  users: MockUser[];
  currentUser: MockUser;
  reportsCount: number;
  addPoints: (points: number) => void;
  toggleStar: (userId: string) => void;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export const GamificationProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<MockUser[]>(() => {
    const saved = localStorage.getItem("gamification_users");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Partial<MockUser>[];
        // Ensure all users have the new fields
        return parsed.map((user) => ({
          id: user.id || "",
          name: user.name || "",
          points: user.points || 0,
          avatarUrl: user.avatarUrl || "",
          reportsCount: user.reportsCount ?? 0,
          starredBy: user.starredBy ?? []
        }));
      } catch {
        return mockUsers;
      }
    }
    return mockUsers;
  });
  const [reportsCount, setReportsCount] = useState(() => {
    const saved = localStorage.getItem("gamification_reportsCount");
    if (saved) return parseInt(saved, 10);
    return 0;
  });

  useEffect(() => {
    localStorage.setItem("gamification_users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem("gamification_reportsCount", reportsCount.toString());
  }, [reportsCount]);

  // We consider 'Sneha' (id: '6') as the current logged-in user
  const currentUserId = "6";
  const currentUser = users.find(u => u.id === currentUserId) || users[0];

  const addPoints = (pointsToAdd: number) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === currentUserId 
          ? { ...user, points: user.points + pointsToAdd }
          : user
      )
    );
    setReportsCount(prev => prev + 1);
  };

  const toggleStar = (userId: string) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId
          ? {
              ...user,
              starredBy: user.starredBy.includes(currentUserId)
                ? user.starredBy.filter(id => id !== currentUserId)
                : [...user.starredBy, currentUserId]
            }
          : user
      )
    );
  };

  return (
    <GamificationContext.Provider value={{ users, currentUser, reportsCount, addPoints, toggleStar }}>
      {children}
    </GamificationContext.Provider>
  );
};

export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (context === undefined) {
    throw new Error("useGamification must be used within a GamificationProvider");
  }
  return context;
};
