import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { MockUser, initialUser, POINT_STRUCTURE } from "@/lib/gamification";

interface GamificationContextType {
  users: MockUser[];
  currentUser: MockUser;
  reportsCount: number;
  addPoints: (points: number) => void;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export const GamificationProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<MockUser[]>(() => {
    const saved = localStorage.getItem("gamification_users");
    if (saved) return JSON.parse(saved);
    return [initialUser];
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

  return (
    <GamificationContext.Provider value={{ users, currentUser, reportsCount, addPoints }}>
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
