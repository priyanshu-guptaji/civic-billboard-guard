/**
 * Audit logging system for violation status changes
 * Tracks all modifications with accountability information
 * Enables compliance auditing and investigation of violations
 */

export type AuditAction =
  | 'created'
  | 'status_changed'
  | 'assigned'
  | 'resolved'
  | 'reopened'
  | 'metadata_updated'
  | 'photo_added'
  | 'comment_added'
  | 'approved'
  | 'rejected';

export interface AuditLogEntry {
  id: string;
  violationId: string;
  action: AuditAction;
  performedBy: {
    userId: string;
    username: string;
    role: string;
    department?: string;
  };
  timestamp: Date;
  oldValue?: unknown;
  newValue?: unknown;
  changes?: Record<string, { from: unknown; to: unknown }>;
  reason?: string;
  metadata?: {
    ipAddress?: string;
    userAgent?: string;
    sessionId?: string;
    [key: string]: unknown;
  };
}

/**
 * Audit logger for tracking violation lifecycle events
 */
export class ViolationAuditLogger {
  private static logs: AuditLogEntry[] = [];
  private static readonly MAX_LOGS = 100000; // Memory limit

  /**
   * Log an action performed on a violation
   * Should be called whenever a violation is modified
   */
  static async logAction(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): Promise<AuditLogEntry> {
    const auditEntry: AuditLogEntry = {
      ...entry,
      id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
      timestamp: new Date(),
    };

    this.logs.push(auditEntry);

    // Maintain memory limit
    if (this.logs.length > this.MAX_LOGS) {
      this.logs = this.logs.slice(-this.MAX_LOGS);
    }

    // In production, persist to backend
    await this.persistToBackend(auditEntry);

    return auditEntry;
  }

  /**
   * Get audit history for a specific violation
   */
  static async getViolationHistory(violationId: string): Promise<AuditLogEntry[]> {
    const history = this.logs.filter((log) => log.violationId === violationId);

    // In production, fetch from backend
    const backendHistory = await this.fetchFromBackend(violationId);

    return [...backendHistory, ...history].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }

  /**
   * Get audit logs filtered by date range
   */
  static async getLogsByDateRange(
    startDate: Date,
    endDate: Date,
    filters?: { action?: AuditAction; userId?: string }
  ): Promise<AuditLogEntry[]> {
    let results = this.logs.filter((log) => {
      const logDate = new Date(log.timestamp);
      return logDate >= startDate && logDate <= endDate;
    });

    if (filters?.action) {
      results = results.filter((log) => log.action === filters.action);
    }

    if (filters?.userId) {
      results = results.filter((log) => log.performedBy.userId === filters.userId);
    }

    return results.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  /**
   * Get action summary for a violation
   * Shows timeline of key events
   */
  static async getViolationSummary(violationId: string): Promise<{
    created?: AuditLogEntry;
    lastModified?: AuditLogEntry;
    statusChanges: AuditLogEntry[];
    assignmentChanges: AuditLogEntry[];
    approvals: AuditLogEntry[];
  }> {
    const history = await this.getViolationHistory(violationId);

    return {
      created: history.find((log) => log.action === 'created'),
      lastModified: history[history.length - 1],
      statusChanges: history.filter((log) => log.action === 'status_changed'),
      assignmentChanges: history.filter((log) => log.action === 'assigned'),
      approvals: history.filter((log) => log.action === 'approved' || log.action === 'rejected'),
    };
  }

  /**
   * Generate audit report for compliance
   * Shows who did what and when for accountability
   */
  static async generateComplianceReport(
    startDate: Date,
    endDate: Date
  ): Promise<{
    period: { start: Date; end: Date };
    totalActions: number;
    actionCounts: Record<AuditAction, number>;
    userStats: Record<
      string,
      {
        username: string;
        role: string;
        actionCount: number;
        lastActive: Date;
      }
    >;
  }> {
    const logs = await this.getLogsByDateRange(startDate, endDate);

    const actionCounts: Record<AuditAction, number> = {
      created: 0,
      status_changed: 0,
      assigned: 0,
      resolved: 0,
      reopened: 0,
      metadata_updated: 0,
      photo_added: 0,
      comment_added: 0,
      approved: 0,
      rejected: 0,
    };

    const userStats: Record<
      string,
      {
        username: string;
        role: string;
        actionCount: number;
        lastActive: Date;
      }
    > = {};

    for (const log of logs) {
      actionCounts[log.action]++;

      const userId = log.performedBy.userId;
      if (!userStats[userId]) {
        userStats[userId] = {
          username: log.performedBy.username,
          role: log.performedBy.role,
          actionCount: 0,
          lastActive: log.timestamp,
        };
      }

      userStats[userId].actionCount++;
      userStats[userId].lastActive = new Date(
        Math.max(
          userStats[userId].lastActive.getTime(),
          log.timestamp.getTime()
        )
      );
    }

    return {
      period: { start: startDate, end: endDate },
      totalActions: logs.length,
      actionCounts,
      userStats,
    };
  }

  /**
   * Check if user performed suspicious activity
   * Useful for detecting abuse patterns
   */
  static async checkSuspiciousActivity(
    userId: string,
    timeWindowMinutes: number = 60
  ): Promise<{
    suspicious: boolean;
    reasons: string[];
    actionCount: number;
  }> {
    const cutoff = new Date(Date.now() - timeWindowMinutes * 60 * 1000);
    const recentActions = this.logs.filter(
      (log) =>
        log.performedBy.userId === userId && new Date(log.timestamp) > cutoff
    );

    const suspiciousReasons: string[] = [];

    // Too many actions in short time
    if (recentActions.length > 50) {
      suspiciousReasons.push(`${recentActions.length} actions in ${timeWindowMinutes} minutes`);
    }

    // Many rapid rejections
    const rejections = recentActions.filter((log) => log.action === 'rejected');
    if (rejections.length > 20) {
      suspiciousReasons.push(`${rejections.length} rejections in ${timeWindowMinutes} minutes`);
    }

    // Rapid creation and deletion patterns
    const creations = recentActions.filter((log) => log.action === 'created');
    const removals = recentActions.filter(
      (log) => log.action === 'resolved' || log.action === 'reopened'
    );
    if (creations.length > 10 && removals.length > 10) {
      suspiciousReasons.push('Suspicious create-delete pattern detected');
    }

    return {
      suspicious: suspiciousReasons.length > 0,
      reasons: suspiciousReasons,
      actionCount: recentActions.length,
    };
  }

  /**
   * Persist audit entry to backend (implementation placeholder)
   * In production, this sends to a secure audit log database
   */
  private static async persistToBackend(entry: AuditLogEntry): Promise<void> {
    // TODO: Implement backend persistence
    // In production:
    // - Send to dedicated audit log server
    // - Use immutable append-only storage
    // - Implement log rotation and archival
    // - Add encryption for sensitive fields
    console.log('[Audit Log]', entry);
  }

  /**
   * Fetch historical logs from backend (implementation placeholder)
   */
  private static async fetchFromBackend(_violationId: string): Promise<AuditLogEntry[]> {
    // TODO: Implement backend fetch
    // In production:
    // - Query audit log database
    // - Return paginated results
    // - Include archived logs
    return [];
  }
}

/**
 * Helper function to log violation status change
 */
export async function logStatusChange(
  violationId: string,
  oldStatus: string,
  newStatus: string,
  performedBy: { userId: string; username: string; role: string },
  reason?: string
): Promise<AuditLogEntry> {
  return ViolationAuditLogger.logAction({
    violationId,
    action: 'status_changed',
    performedBy,
    oldValue: oldStatus,
    newValue: newStatus,
    reason,
    changes: {
      status: { from: oldStatus, to: newStatus },
    },
  });
}

/**
 * Helper function to log violation approval
 */
export async function logApproval(
  violationId: string,
  performedBy: { userId: string; username: string; role: string },
  reason?: string
): Promise<AuditLogEntry> {
  return ViolationAuditLogger.logAction({
    violationId,
    action: 'approved',
    performedBy,
    reason,
  });
}

/**
 * Helper function to log violation rejection
 */
export async function logRejection(
  violationId: string,
  performedBy: { userId: string; username: string; role: string },
  reason?: string
): Promise<AuditLogEntry> {
  return ViolationAuditLogger.logAction({
    violationId,
    action: 'rejected',
    performedBy,
    reason,
  });
}
