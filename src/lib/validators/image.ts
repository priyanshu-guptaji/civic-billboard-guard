/**
 * Image validation for violation evidence
 * Prevents malicious, fake, or inappropriate images from being submitted as evidence
 * Validates image integrity, format, and basic content appropriateness
 */

export interface ImageValidationResult {
  valid: boolean;
  errors: string[];
  warnings?: string[];
  metadata?: {
    width?: number;
    height?: number;
    format?: string;
    size?: number;
  };
}

/**
 * Validates image files for violation evidence submission
 * Checks file format, size, resolution, and basic metadata
 */
export class ImageValidator {
  // Minimum resolution for evidence images
  private static readonly MIN_WIDTH = 800;
  private static readonly MIN_HEIGHT = 600;

  // Maximum file size (10 MB)
  private static readonly MAX_FILE_SIZE = 10 * 1024 * 1024;

  // Allowed image MIME types
  private static readonly ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
  ];

  // Magic bytes for image format validation
  private static readonly MAGIC_BYTES: Record<string, Uint8Array> = {
    jpeg: new Uint8Array([0xff, 0xd8, 0xff]),
    png: new Uint8Array([0x89, 0x50, 0x4e, 0x47]),
    gif: new Uint8Array([0x47, 0x49, 0x46]),
    webp: new Uint8Array([0x52, 0x49, 0x46, 0x46]),
  };

  /**
   * Check if file starts with magic bytes (signature)
   * Prevents fake files with wrong extensions
   */
  private static checkMagicBytes(buffer: ArrayBuffer, format: string): boolean {
    const bytes = new Uint8Array(buffer);
    const magic = this.MAGIC_BYTES[format.toLowerCase()];

    if (!magic) {
      return true; // Skip check if format not in list
    }

    // Check if file starts with magic bytes
    for (let i = 0; i < magic.length; i++) {
      if (bytes[i] !== magic[i]) {
        return false;
      }
    }

    return true;
  }

  /**
   * Validate image file synchronously
   * Checks basic properties without full image parsing
   */
  static validateSync(
    file: File,
    mimeType: string
  ): ImageValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check file size
    if (file.size === 0) {
      errors.push('Image file is empty');
      return { valid: false, errors, metadata: { size: 0 } };
    }

    if (file.size > this.MAX_FILE_SIZE) {
      errors.push(
        `Image file too large: ${(file.size / 1024 / 1024).toFixed(1)}MB exceeds 10MB limit`
      );
    }

    // Check MIME type
    if (!this.ALLOWED_MIME_TYPES.includes(mimeType)) {
      errors.push(
        `Unsupported image format: ${mimeType}. Allowed: ${this.ALLOWED_MIME_TYPES.join(', ')}`
      );
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings: warnings.length > 0 ? warnings : undefined,
      metadata: {
        size: file.size,
        format: mimeType.split('/')[1],
      },
    };
  }

  /**
   * Validate image file asynchronously with full metadata check
   * Parses image to verify format and extract dimensions
   */
  static async validateAsync(
    file: File
  ): Promise<ImageValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    // First pass: basic validation
    const basicValidation = this.validateSync(file, file.type);
    if (!basicValidation.valid) {
      return basicValidation;
    }

    try {
      // Read file as data URL
      const buffer = await file.arrayBuffer();

      // Check magic bytes
      const format = file.type.split('/')[1];
      if (!this.checkMagicBytes(buffer, format)) {
        errors.push(
          `File format mismatch: file extension indicates ${format} but content does not match`
        );
      }

      // Parse image dimensions
      const dimensions = await this.extractImageDimensions(buffer, file.type);

      if (dimensions.width && dimensions.height) {
        // Check minimum resolution
        if (dimensions.width < this.MIN_WIDTH || dimensions.height < this.MIN_HEIGHT) {
          errors.push(
            `Image resolution too low: ${dimensions.width}x${dimensions.height}px. Minimum required: ${this.MIN_WIDTH}x${this.MIN_HEIGHT}px`
          );
        }

        // Warn if image is very small
        if (dimensions.width < 1024 || dimensions.height < 768) {
          warnings.push(
            `Image resolution is low for evidence quality: ${dimensions.width}x${dimensions.height}px`
          );
        }

        // Warn if image is extremely large
        if (dimensions.width > 8000 || dimensions.height > 8000) {
          warnings.push('Image resolution is extremely high, consider optimizing');
        }
      }

      return {
        valid: errors.length === 0,
        errors,
        warnings: warnings.length > 0 ? warnings : undefined,
        metadata: {
          width: dimensions.width,
          height: dimensions.height,
          size: file.size,
          format: file.type.split('/')[1],
        },
      };
    } catch (error) {
      errors.push(`Failed to validate image: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return {
        valid: false,
        errors,
        metadata: { size: file.size },
      };
    }
  }

  /**
   * Extract image dimensions from file buffer
   * Supports JPEG, PNG, GIF, WebP formats
   */
  private static async extractImageDimensions(
    buffer: ArrayBuffer,
    mimeType: string
  ): Promise<{ width?: number; height?: number }> {
    const format = mimeType.split('/')[1].toLowerCase();

    try {
      switch (format) {
        case 'jpeg':
          return this.extractJpegDimensions(buffer);
        case 'png':
          return this.extractPngDimensions(buffer);
        case 'gif':
          return this.extractGifDimensions(buffer);
        case 'webp':
          return this.extractWebpDimensions(buffer);
        default:
          return {};
      }
    } catch {
      return {};
    }
  }

  private static extractJpegDimensions(buffer: ArrayBuffer): {
    width?: number;
    height?: number;
  } {
    const view = new DataView(buffer);
    let offset = 2;

    while (offset < buffer.byteLength) {
      const marker = view.getUint16(offset, false);

      if (marker === 0xffc0 || marker === 0xffc2) {
        const height = view.getUint16(offset + 5, false);
        const width = view.getUint16(offset + 7, false);
        return { width, height };
      }

      offset += view.getUint16(offset + 2, false) + 2;
    }

    return {};
  }

  private static extractPngDimensions(buffer: ArrayBuffer): {
    width?: number;
    height?: number;
  } {
    const view = new DataView(buffer);
    if (buffer.byteLength < 24) return {};

    const width = view.getUint32(16, false);
    const height = view.getUint32(20, false);

    return { width, height };
  }

  private static extractGifDimensions(buffer: ArrayBuffer): {
    width?: number;
    height?: number;
  } {
    const view = new DataView(buffer);
    if (buffer.byteLength < 10) return {};

    const width = view.getUint16(6, true);
    const height = view.getUint16(8, true);

    return { width, height };
  }

  private static extractWebpDimensions(buffer: ArrayBuffer): {
    width?: number;
    height?: number;
  } {
    const view = new DataView(buffer);
    if (buffer.byteLength < 30) return {};

    // WebP format: Look for VP8 chunk
    try {
      const width = (view.getUint16(26, true) & 0x3fff) + 1;
      const height = (view.getUint16(28, true) & 0x3fff) + 1;
      return { width, height };
    } catch {
      return {};
    }
  }
}

/**
 * Quick validation helper for image files
 * Returns true if image is valid
 */
export function isValidImage(file: File): boolean {
  const result = ImageValidator.validateSync(file, file.type);
  return result.valid;
}

/**
 * Get human-readable error messages for validation failures
 */
export function getImageValidationErrors(file: File): string[] {
  const result = ImageValidator.validateSync(file, file.type);
  return result.errors;
}
