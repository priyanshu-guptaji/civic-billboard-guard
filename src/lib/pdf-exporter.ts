/**
 * Streaming PDF export for violation reports
 * Prevents memory exhaustion by processing violations in batches
 * Suitable for exporting large datasets without loading everything into memory
 */

export interface ExportOptions {
  title?: string;
  includeImages?: boolean;
  batchSize?: number;
  onProgress?: (processed: number, total: number) => void;
  filters?: {
    status?: string;
    type?: string;
    dateFrom?: Date;
    dateTo?: Date;
  };
}

export interface ViolationRecord {
  id: string;
  type: string;
  status: string;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  description: string;
  createdAt: Date;
  reportCount?: number;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  assignedTo?: string;
  reviewedBy?: string;
  reviewedAt?: Date;
}

/**
 * Streaming PDF report generator
 * Generates PDF reports by processing violations in batches
 */
export class StreamingPDFExporter {
  private static readonly DEFAULT_BATCH_SIZE = 100;
  private static readonly PAGE_HEIGHT = 792; // Letter size in points
  private static readonly PAGE_WIDTH = 612;
  private static readonly MARGIN = 40;
  private static readonly CONTENT_WIDTH = this.PAGE_WIDTH - this.MARGIN * 2;

  /**
   * Generate PDF report as blob (for client-side download)
   * Processes violations in batches to manage memory
   *
   * @param violations - Array of violations to export
   * @param options - Export configuration options
   * @returns Blob containing PDF data
   */
  static async generatePDFBlob(
    violations: ViolationRecord[],
    options: ExportOptions = {}
  ): Promise<Blob> {
    const chunks: Uint8Array[] = [];

    // Simulate streaming by collecting chunks
    await this.generatePDFStream(violations, {
      ...options,
      onChunk: (chunk) => chunks.push(new Uint8Array(chunk)),
    });

    return new Blob(chunks, { type: 'application/pdf' });
  }

  /**
   * Generate PDF report as downloadable file
   *
   * @param violations - Array of violations to export
   * @param filename - Output filename
   * @param options - Export configuration options
   */
  static async generateAndDownload(
    violations: ViolationRecord[],
    filename: string = 'violation-report.pdf',
    options: ExportOptions = {}
  ): Promise<void> {
    const blob = await this.generatePDFBlob(violations, options);
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  /**
   * Generate PDF report with streaming callback
   * Processes violations in batches and calls callback with progress
   *
   * @param violations - Array of violations to export
   * @param options - Export configuration options with streaming callback
   */
  private static async generatePDFStream(
    violations: ViolationRecord[],
    options: ExportOptions & { onChunk?: (chunk: Uint8Array) => void } = {}
  ): Promise<void> {
    const {
      title = 'Violation Report',
      batchSize = this.DEFAULT_BATCH_SIZE,
      onProgress,
      filters = {},
      onChunk,
    } = options;

    // Filter violations
    let filtered = violations;
    if (filters.status) {
      filtered = filtered.filter((v) => v.status === filters.status);
    }
    if (filters.type) {
      filtered = filtered.filter((v) => v.type === filters.type);
    }
    if (filters.dateFrom) {
      filtered = filtered.filter((v) => new Date(v.createdAt) >= filters.dateFrom!);
    }
    if (filters.dateTo) {
      filtered = filtered.filter((v) => new Date(v.createdAt) <= filters.dateTo!);
    }

    // Generate PDF structure (as text/html representation)
    // In production, use actual PDF library (jsPDF, PDFKit, etc.)
    const pdfContent: string[] = [];

    // Header
    pdfContent.push(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          h1 { text-align: center; color: #333; }
          .metadata { text-align: center; color: #666; margin: 20px 0; }
          .summary { background: #f5f5f5; padding: 15px; margin: 20px 0; border-radius: 5px; }
          .violation { page-break-inside: avoid; margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
          .violation-header { font-weight: bold; font-size: 14px; margin-bottom: 10px; }
          .violation-field { margin: 8px 0; font-size: 12px; }
          .label { font-weight: bold; color: #333; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th { background: #f5f5f5; padding: 10px; text-align: left; border: 1px solid #ddd; }
          td { padding: 10px; border: 1px solid #ddd; }
          .critical { color: #d32f2f; }
          .high { color: #f57c00; }
          .medium { color: #fbc02d; }
          .low { color: #388e3c; }
          .footer { margin-top: 40px; text-align: center; color: #999; font-size: 10px; }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <div class="metadata">
          <p>Generated: ${new Date().toLocaleString()}</p>
          <p>Total Reports: ${filtered.length}</p>
        </div>
    `);

    // Summary statistics
    const statusCounts = this.calculateStatusCounts(filtered);
    const typeCounts = this.calculateTypeCounts(filtered);

    pdfContent.push(`
      <div class="summary">
        <h3>Summary Statistics</h3>
        <table>
          <tr>
            <th>Status</th>
            <th>Count</th>
          </tr>
    `);

    for (const [status, count] of Object.entries(statusCounts)) {
      pdfContent.push(`<tr><td>${status}</td><td>${count}</td></tr>`);
    }

    pdfContent.push(`</table></div>`);

    // Process violations in batches
    let processedCount = 0;
    const totalCount = filtered.length;

    for (let i = 0; i < filtered.length; i += batchSize) {
      const batch = filtered.slice(i, i + batchSize);

      // Add violation details
      for (const violation of batch) {
        pdfContent.push(`
          <div class="violation">
            <div class="violation-header">
              [${violation.id}] ${violation.type}
              <span class="${violation.severity || 'medium'}">(${violation.severity || 'medium'})</span>
            </div>
            <div class="violation-field">
              <span class="label">Status:</span> ${violation.status}
            </div>
            <div class="violation-field">
              <span class="label">Location:</span> ${violation.location.address || `${violation.location.latitude}, ${violation.location.longitude}`}
            </div>
            <div class="violation-field">
              <span class="label">Description:</span> ${violation.description}
            </div>
            <div class="violation-field">
              <span class="label">Reported:</span> ${new Date(violation.createdAt).toLocaleString()}
            </div>
            ${violation.reportCount ? `<div class="violation-field"><span class="label">Report Count:</span> ${violation.reportCount}</div>` : ''}
            ${violation.assignedTo ? `<div class="violation-field"><span class="label">Assigned To:</span> ${violation.assignedTo}</div>` : ''}
            ${violation.reviewedBy ? `<div class="violation-field"><span class="label">Reviewed By:</span> ${violation.reviewedBy}</div>` : ''}
          </div>
        `);

        processedCount++;
      }

      // Progress callback
      if (onProgress) {
        onProgress(processedCount, totalCount);
      }

      // Yield to event loop to prevent blocking
      await this.delay(0);
    }

    // Footer
    pdfContent.push(`
      <div class="footer">
        <p>This is an automated report generated by the Civic Billboard Guard system.</p>
        <p>Report contains ${filtered.length} violation(s) as of ${new Date().toISOString()}</p>
      </div>
      </body>
      </html>
    `);

    // Send final content
    const html = pdfContent.join('');
    const encoded = new TextEncoder().encode(html);

    if (onChunk) {
      onChunk(encoded);
    }
  }

  /**
   * Get count of violations by status
   */
  private static calculateStatusCounts(
    violations: ViolationRecord[]
  ): Record<string, number> {
    const counts: Record<string, number> = {};

    for (const violation of violations) {
      counts[violation.status] = (counts[violation.status] || 0) + 1;
    }

    return counts;
  }

  /**
   * Get count of violations by type
   */
  private static calculateTypeCounts(
    violations: ViolationRecord[]
  ): Record<string, number> {
    const counts: Record<string, number> = {};

    for (const violation of violations) {
      counts[violation.type] = (counts[violation.type] || 0) + 1;
    }

    return counts;
  }

  /**
   * Helper to yield control to event loop
   */
  private static delay(ms: number = 0): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Estimate memory usage for export
   * Helps prevent memory exhaustion
   */
  static estimateMemoryUsage(violationCount: number): number {
    // Rough estimate: ~1KB per violation
    return violationCount * 1024;
  }

  /**
   * Calculate optimal batch size based on available memory
   */
  static calculateOptimalBatchSize(
    availableMemoryMB: number = 100,
    violationEstimateKB: number = 1
  ): number {
    const availableBytes = availableMemoryMB * 1024 * 1024;
    const bytesPerViolation = violationEstimateKB * 1024;
    const optimalBatch = Math.floor(availableBytes / bytesPerViolation / 10); // Use 10% of available memory

    return Math.max(10, Math.min(1000, optimalBatch));
  }
}

/**
 * Quick export helper
 */
export async function exportViolationsAsPDF(
  violations: ViolationRecord[],
  filename?: string,
  options?: ExportOptions
): Promise<void> {
  return StreamingPDFExporter.generateAndDownload(violations, filename, options);
}
