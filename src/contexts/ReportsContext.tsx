import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { ReportStage, TimelineEvent } from "@/components/ReportTimeline";

export interface ReportData {
  id: string;
  location: string;
  type: string;
  date: string;
  status: ReportStage;
  points?: number;
  events: TimelineEvent[];
}

interface ReportsContextType {
  reports: ReportData[];
  addReport: (report: Omit<ReportData, "id" | "status" | "date" | "events" | "points">) => void;
}

const initialReports: ReportData[] = [
  {
    id: "REP-2026-001",
    location: "MG Road, Bangalore",
    type: "Unauthorized Billboard",
    date: "2026-05-27",
    status: "Under Review",
    points: 25,
    events: [
      { stage: "Submitted", timestamp: "May 27, 09:00 AM", description: "Report received via mobile app." },
      { stage: "AI Processed", timestamp: "May 27, 09:02 AM", description: "AI flagged 85% probability of violation." },
      { stage: "Under Review", timestamp: "May 27, 11:30 AM", description: "Forwarded to municipal authority for manual verification." }
    ]
  },
  {
    id: "REP-2026-002",
    location: "Brigade Road Junction",
    type: "Oversized Dimensions",
    date: "2026-05-25",
    status: "Resolved",
    points: 30,
    events: [
      { stage: "Submitted", timestamp: "May 25, 14:15 PM", description: "User reported structural hazard." },
      { stage: "AI Processed", timestamp: "May 25, 14:16 PM", description: "Dimensions exceed legal limits." },
      { stage: "Under Review", timestamp: "May 26, 10:00 AM", description: "Authority verified the violation." },
      { stage: "Field Agent Dispatched", timestamp: "May 26, 14:00 PM", description: "Team dispatched for removal." },
      { stage: "Resolved", timestamp: "May 27, 16:45 PM", description: "Billboard removed successfully. +100 points awarded." }
    ]
  },
  {
    id: "REP-2026-003",
    location: "Commercial Street",
    type: "Safety Hazard",
    date: "2026-05-28",
    status: "Submitted",
    points: 40,
    events: [
      { stage: "Submitted", timestamp: "May 28, 08:30 AM", description: "Report submitted." }
    ]
  }
];

const ReportsContext = createContext<ReportsContextType | undefined>(undefined);

export const ReportsProvider = ({ children }: { children: ReactNode }) => {
  const [reports, setReports] = useState<ReportData[]>(() => {
    const saved = localStorage.getItem("civic_reports");
    if (saved) return JSON.parse(saved);
    return initialReports;
  });

  useEffect(() => {
    localStorage.setItem("civic_reports", JSON.stringify(reports));
  }, [reports]);

  const addReport = (newReportData: Omit<ReportData, "id" | "status" | "date" | "events" | "points">) => {
    const today = new Date();
    const id = `REP-${today.getFullYear()}-${String(reports.length + 1).padStart(3, '0')}`;
    const dateStr = today.toISOString().split('T')[0];
    const timestampStr = today.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });

    const newReport: ReportData = {
      ...newReportData,
      id,
      date: dateStr,
      status: "Submitted",
      points: 10,
      events: [
        { stage: "Submitted", timestamp: timestampStr, description: "Report submitted." }
      ]
    };

    setReports(prev => [newReport, ...prev]);
  };

  return (
    <ReportsContext.Provider value={{ reports, addReport }}>
      {children}
    </ReportsContext.Provider>
  );
};

export const useReports = () => {
  const context = useContext(ReportsContext);
  if (context === undefined) {
    throw new Error("useReports must be used within a ReportsProvider");
  }
  return context;
};
