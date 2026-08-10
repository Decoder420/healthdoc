export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export const MAX_UPLOAD_SIZE_BYTES = 2 * 1024 * 1024;

export function validateImageFile(file: File): string | null {
  if (!file.type.startsWith("image/")) {
    return "Photo must be an image file.";
  }
  if (file.size > MAX_UPLOAD_SIZE_BYTES) {
    return "Photo must be smaller than 2 MB.";
  }
  return null;
}

export function validateDocumentFile(file: File): string | null {
  const allowed = ["image/", "application/pdf"];
  if (!allowed.some((type) => file.type.startsWith(type))) {
    return "Document must be an image or PDF.";
  }
  if (file.size > MAX_UPLOAD_SIZE_BYTES) {
    return "Document must be smaller than 2 MB.";
  }
  return null;
}
