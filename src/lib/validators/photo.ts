export function validatePhotoMetadata(photo: any) {
  const errors = [];
  if (!photo.uploadedAt) errors.push('Missing upload timestamp');
  if (!photo.exif) errors.push('Missing EXIF data');
  if (!photo.fileHash) errors.push('Missing file hash');
  return { valid: errors.length === 0, errors };
}

export function detectDuplicatePhotos(photos: any[]) {
  const hashes = new Set();
  const duplicates = [];
  for (const photo of photos) {
    if (hashes.has(photo.fileHash)) {
      duplicates.push(photo.id);
    }
    hashes.add(photo.fileHash);
  }
  return duplicates;
}
