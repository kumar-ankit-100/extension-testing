export const MAX_RESUME_BYTES = 5 * 1024 * 1024 // 5 MB

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(reader.error)
    reader.onload = () => resolve(reader.result as string)
    reader.readAsDataURL(file)
  })
}

export interface FileValidationResult {
  ok: boolean
  error?: string
}

export function validatePdf(file: File): FileValidationResult {
  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    return { ok: false, error: "Only PDF files are supported." }
  }
  if (file.size > MAX_RESUME_BYTES) {
    return { ok: false, error: "Resume must be under 5 MB." }
  }
  return { ok: true }
}
