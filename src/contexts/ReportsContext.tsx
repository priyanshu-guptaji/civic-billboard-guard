import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { ReportStage, TimelineEvent } from "@/components/ReportTimeline";
import { STORAGE_KEY, CivicReport, getActiveReports } from "@/lib/reports";
import { useGamification } from "@/contexts/GamificationContext";

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

const mapCivicReportToReportData = (report: CivicReport): ReportData => {
  const dateStr = new Date(report.createdAt).toISOString().split("T")[0];

  // Map ReportStatus to ReportStage
  let statusStage: ReportStage = "Submitted";
  if (report.status === "In Progress") {
    statusStage = "Field Agent Dispatched";
  } else if (report.status === "Under Review") {
    statusStage = "Under Review";
  } else if (report.status === "Resolved") {
    statusStage = "Resolved";
  } else if (report.status === "Submitted") {
    statusStage = "Submitted";
  }

  // Build events
  const events: TimelineEvent[] = report.statusHistory.map((evt) => {
    let stage: ReportStage = "Submitted";
    if (evt.status === "Under Review") {
      stage = "Under Review";
    } else if (evt.status === "In Progress") {
      stage = "Field Agent Dispatched";
    } else if (evt.status === "Resolved") {
      stage = "Resolved";
    }

    const timestampStr = new Date(evt.at).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    let description = "Step completed.";
    if (evt.status === "Submitted") {
      description = report.description || "Report received via mobile app.";
    } else if (evt.status === "Under Review") {
      description = "Forwarded to municipal authority for manual verification.";
    } else if (evt.status === "In Progress") {
      description = "Team dispatched for removal.";
    } else if (evt.status === "Resolved") {
      description = "Billboard removed successfully. +100 points awarded.";
    }

    return {
      stage,
      timestamp: timestampStr,
      description,
    };
  });

  // Insert AI Processed event right after Submitted if we have progressed beyond Submitted
  const hasSubsequentEvents = report.statusHistory.length > 1 || report.status !== "Submitted";
  if (hasSubsequentEvents) {
    const submittedEvent = report.statusHistory.find((h) => h.status === "Submitted");
    const baseTime = submittedEvent ? submittedEvent.at : report.createdAt;
    const aiProcessedAt = baseTime + 1000 * 60; // 1 minute later
    const aiProcessedTimestampStr = new Date(aiProcessedAt).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    events.splice(1, 0, {
      stage: "AI Processed",
      timestamp: aiProcessedTimestampStr,
      description: "AI flagged 85% probability of violation.",
    });
  }

  return {
    id: report.id,
    location: report.location,
    type: report.violationTypeLabel,
    date: dateStr,
    status: statusStage,
    points: report.pointsAwarded,
    events,
  };
};

export const ReportsProvider = ({ children }: { children: ReactNode }) => {
  const { currentUser } = useGamification();
  const [reports, setReports] = useState<ReportData[]>(() => {
    const active = getActiveReports(currentUser.id);
    return active.map(mapCivicReportToReportData);
  });

  const syncReports = () => {
    const active = getActiveReports(currentUser.id);
    setReports(active.map(mapCivicReportToReportData));
  };

  useEffect(() => {
    syncReports();

    const interval = setInterval(syncReports, 3000);

    const handleSync = () => {
      syncReports();
    };
    window.addEventListener("sync-reports", handleSync);

    return () => {
      clearInterval(interval);
      window.removeEventListener("sync-reports", handleSync);
    };
  }, []);

  const addReport = (newReportData: Omit<ReportData, "id" | "status" | "date" | "events" | "points">) => {
    const today = new Date();
    const id = `REP-${today.getFullYear()}-${String(Date.now()).slice(-6)}`;
    
    const newCivicReport: CivicReport = {
      id,
      reporterId: currentUser.id,
      location: newReportData.location,
      description: "",
      violationTypeId: "other",
      violationTypeLabel: newReportData.type,
      createdAt: today.getTime(),
      updatedAt: today.getTime(),
      status: "Submitted",
      statusHistory: [{ status: "Submitted", at: today.getTime() }],
      pointsAwarded: 10,
    };

    const saved = localStorage.getItem(STORAGE_KEY);
    let allReports: CivicReport[] = [];
    if (saved) {
      try {
        allReports = JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing reports inside addReport", e);
      }
    }
    allReports = [newCivicReport, ...allReports];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allReports));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("sync-reports"));
    }
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
