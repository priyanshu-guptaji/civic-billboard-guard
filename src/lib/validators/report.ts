export function detectDuplicateReports(reports: any[]) {
  const seen = new Map();
  const duplicates = [];
  for (const report of reports) {
    const key = `${report.billboardId}_${Math.round(report.lat * 1000)}_${Math.round(report.lon * 1000)}`;
    if (seen.has(key)) {
      duplicates.push(report.id);
    }
    seen.set(key, report.id);
  }
  return duplicates;
}

export function createAuditLog(violationId: string, action: string, changes: any) {
  return {
    violationId,
    action,
    changes,
    timestamp: new Date(),
    user: null
  };
}
