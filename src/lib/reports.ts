export type ReportStatus = "Submitted" | "Under Review" | "In Progress" | "Resolved";

export type ReportStatusLike = ReportStatus | "Pending" | "Verified" | string;

export interface ReportStatusEvent {
  status: ReportStatus;
  at: number; // epoch ms
}

export interface CivicReport {
  id: string;
  reporterId: string;
  location: string;
  description: string;
  violationTypeId: string;
  violationTypeLabel: string;
  createdAt: number;
  updatedAt: number;
  status: ReportStatus;
  statusHistory: ReportStatusEvent[];
  pointsAwarded: number;
}

export interface CreateReportInput {
  reporterId: string;
  location: string;
  description: string;
  violationTypeId: string;
  violationTypeLabel: string;
  pointsAwarded: number;
}

export const STORAGE_KEY = "civic_reports_v1";

export const REPORT_STATUSES: ReportStatus[] = [
  "Submitted",
  "Under Review",
  "In Progress",
  "Resolved",
];

export const normalizeReportStatus = (status: ReportStatusLike): ReportStatus => {
  if (status === "Submitted" || status === "Under Review" || status === "In Progress" || status === "Resolved") {
    return status;
  }

  if (status === "Pending") return "Submitted";
  if (status === "Verified") return "Under Review";

  return "Submitted";
};

export const getReportStatusIndex = (status: ReportStatusLike): number => {
  const normalized = normalizeReportStatus(status);
  return REPORT_STATUSES.indexOf(normalized);
};

const safeJsonParse = <T,>(value: string | null): T | null => {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
};

const generateId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
};

export const loadAllReports = (): CivicReport[] => {
  const raw = safeJsonParse<CivicReport[]>(localStorage.getItem(STORAGE_KEY));
  if (raw && Array.isArray(raw)) return raw;

  const now = Date.now();
  const seeded: CivicReport[] = [
    {
      id: generateId(),
      reporterId: "6",
      location: "MG Road, Bangalore",
      description: "Billboard appears unauthorized and obstructs footpath.",
      violationTypeId: "unauthorized",
      violationTypeLabel: "Unauthorized Billboard",
      createdAt: now - 1000 * 60 * 60 * 6,
      updatedAt: now - 1000 * 60 * 20,
      status: "In Progress",
      statusHistory: [
        { status: "Submitted", at: now - 1000 * 60 * 60 * 6 },
        { status: "Under Review", at: now - 1000 * 60 * 60 * 5 },
        { status: "In Progress", at: now - 1000 * 60 * 20 },
      ],
      pointsAwarded: 10,
    },
    {
      id: generateId(),
      reporterId: "6",
      location: "Brigade Road Junction",
      description: "Oversized billboard; possibly violating size regulations.",
      violationTypeId: "oversized",
      violationTypeLabel: "Oversized/Wrong Dimensions",
      createdAt: now - 1000 * 60 * 60 * 24,
      updatedAt: now - 1000 * 60 * 60 * 2,
      status: "Resolved",
      statusHistory: [
        { status: "Submitted", at: now - 1000 * 60 * 60 * 24 },
        { status: "Under Review", at: now - 1000 * 60 * 60 * 22 },
        { status: "In Progress", at: now - 1000 * 60 * 60 * 6 },
        { status: "Resolved", at: now - 1000 * 60 * 60 * 2 },
      ],
      pointsAwarded: 10,
    },
    {
      id: generateId(),
      reporterId: "6",
      location: "Commercial Street",
      description: "Structure looks damaged; could be a safety hazard.",
      violationTypeId: "unsafe",
      violationTypeLabel: "Safety Hazard",
      createdAt: now - 1000 * 60 * 15,
      updatedAt: now - 1000 * 60 * 15,
      status: "Submitted",
      statusHistory: [{ status: "Submitted", at: now - 1000 * 60 * 15 }],
      pointsAwarded: 10,
    },
  ];

  saveAllReports(seeded, false); // Do not dispatch event on initial seed
  return seeded;
};

const saveAllReports = (reports: CivicReport[], dispatchEvent = true) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  if (dispatchEvent && typeof window !== "undefined") {
    window.dispatchEvent(new Event("sync-reports"));
  }
};

const advanceStatus = (status: ReportStatus): ReportStatus => {
  switch (status) {
    case "Submitted":
      return "Under Review";
    case "Under Review":
      return "In Progress";
    case "In Progress":
      return "Resolved";
    case "Resolved":
      return "Resolved";
  }
};

const maybeAutoAdvance = (report: CivicReport, now: number): CivicReport => {
  if (report.status === "Resolved") return report;

  const lastEventAt = report.statusHistory[report.statusHistory.length - 1]?.at ?? report.updatedAt;
  const elapsedMs = now - lastEventAt;

  const nextDueMs =
    report.status === "Submitted"
      ? 10_000
      : report.status === "Under Review"
        ? 15_000
        : 25_000;

  if (elapsedMs < nextDueMs) return report;

  const nextStatus = advanceStatus(report.status);
  if (nextStatus === report.status) return report;

  return {
    ...report,
    status: nextStatus,
    updatedAt: now,
    statusHistory: [...report.statusHistory, { status: nextStatus, at: now }],
  };
};

export const reportStatusBadgeVariant = (
  status: ReportStatusLike
): "default" | "secondary" | "outline" | "destructive" => {
  const normalized = normalizeReportStatus(status);
  switch (normalized) {
    case "Resolved":
      return "default";
    case "In Progress":
      return "secondary";
    case "Under Review":
      return "outline";
    case "Submitted":
    default:
      return "secondary";
  }
};

export const getActiveReports = (reporterId?: string): CivicReport[] => {
  const now = Date.now();
  // Fetch a clean snapshot directly from source to avoid updating stale filtered lists
  const allReports = loadAllReports();

  let hasChanges = false;
  const updatedAllReports = allReports.map((report) => {
    const updatedReport = maybeAutoAdvance(report, now);
    if (updatedReport.updatedAt !== report.updatedAt) {
      hasChanges = true;
    }
    return updatedReport;
  });

  // Save back the global unsliced database, avoiding event loop chains
  if (hasChanges) {
    saveAllReports(updatedAllReports, false);
  }

  const filtered = reporterId 
    ? updatedAllReports.filter((r) => r.reporterId === reporterId) 
    : updatedAllReports;

  // sort newest first
  return [...filtered].sort((a, b) => b.createdAt - a.createdAt);
};

export const listReports = async (opts?: { reporterId?: string }): Promise<CivicReport[]> => {
  const filtered = getActiveReports(opts?.reporterId);
  // Simulate network latency.
  await new Promise((resolve) => setTimeout(resolve, 250));
  return filtered;
};

export const submitReport = async (input: CreateReportInput): Promise<CivicReport> => {
  const now = Date.now();

  const newReport: CivicReport = {
    id: generateId(),
    reporterId: input.reporterId,
    location: input.location,
    description: input.description,
    violationTypeId: input.violationTypeId,
    violationTypeLabel: input.violationTypeLabel,
    createdAt: now,
    updatedAt: now,
    status: "Submitted",
    statusHistory: [{ status: "Submitted", at: now }],
    pointsAwarded: input.pointsAwarded,
  };

  // Simulate API call.
  await new Promise((resolve) => setTimeout(resolve, 900));

  // Reload dynamically right before writing to guarantee transactional state integrity
  const existing = loadAllReports();
  saveAllReports([newReport, ...existing], true);

  return newReport;
};