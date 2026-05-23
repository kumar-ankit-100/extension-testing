import { AnimatePresence, motion } from "framer-motion"
import { CloudUpload, Loader2, UploadCloud } from "lucide-react"
import { useCallback, useRef, useState, type DragEvent } from "react"

import { cn, generateId } from "~lib/utils"
import { useResumeStore } from "~stores/resumeStore"
import type { Resume, ResumeCategory } from "~types"
import { validatePdf } from "~utils/file"

function inferCategory(filename: string): ResumeCategory {
  const lower = filename.toLowerCase()
  if (lower.includes("backend")) return "Backend"
  if (lower.includes("frontend")) return "Frontend"
  if (lower.includes("fullstack") || lower.includes("full-stack"))
    return "Fullstack"
  if (lower.includes("ml") || lower.includes("ai")) return "ML"
  if (lower.includes("data")) return "Data"
  if (lower.includes("devops") || lower.includes("sre")) return "DevOps"
  return "General"
}

export function ResumeUpload() {
  const { addResume, isUploading, setUploading } = useResumeStore()
  const [error, setError] = useState<string | null>(null)
  const [isDragActive, setIsDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(
    async (file: File) => {
      setError(null)
      const validation = validatePdf(file)
      if (!validation.ok) {
        setError(validation.error ?? "Invalid file.")
        return
      }
      setUploading(true)
      try {
        // Store METADATA ONLY. Persisting the raw PDF as base64 in
        // chrome.storage.local would block the popup long enough for Chrome
        // to close it on large files.
        const resume: Resume = {
          id: generateId(),
          name: file.name,
          category: inferCategory(file.name),
          uploadedAt: new Date().toISOString(),
          size: file.size,
          type: file.type || "application/pdf"
        }
        await addResume(resume)
      } catch (e) {
        console.error("[CareerOS] upload failed:", e)
        setError("Failed to save resume. Please try again.")
      } finally {
        setUploading(false)
      }
    },
    [addResume, setUploading]
  )

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) void handleFile(file)
    // reset so picking the same file again still fires onChange
    e.target.value = ""
  }

  function onDragOver(e: DragEvent<HTMLLabelElement>) {
    e.preventDefault()
    setIsDragActive(true)
  }
  function onDragLeave() {
    setIsDragActive(false)
  }
  function onDrop(e: DragEvent<HTMLLabelElement>) {
    e.preventDefault()
    setIsDragActive(false)
    const file = e.dataTransfer.files?.[0]
    if (file) void handleFile(file)
  }

  return (
    <div className="space-y-2">
      <label
        htmlFor="careeros-resume-input"
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={cn(
          "relative block rounded-xl border border-dashed p-4 text-center transition-all cursor-pointer select-none",
          isDragActive
            ? "border-primary bg-accent/60"
            : "border-border bg-muted/30 hover:bg-muted/50"
        )}>
        <input
          ref={inputRef}
          id="careeros-resume-input"
          type="file"
          accept="application/pdf,.pdf"
          className="sr-only"
          onChange={onInputChange}
        />
        <AnimatePresence mode="wait">
          {isUploading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-1.5 py-2">
              <Loader2 className="h-5 w-5 text-primary animate-spin" />
              <p className="text-xs text-muted-foreground">Uploading…</p>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "h-9 w-9 rounded-lg flex items-center justify-center transition-colors",
                  isDragActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-background text-muted-foreground border border-border"
                )}>
                {isDragActive ? (
                  <CloudUpload className="h-4 w-4" />
                ) : (
                  <UploadCloud className="h-4 w-4" />
                )}
              </div>
              <p className="text-xs font-medium">
                {isDragActive
                  ? "Drop to upload"
                  : "Click or drag a PDF to upload"}
              </p>
              <p className="text-[11px] text-muted-foreground">
                PDF only · max 5 MB
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </label>
      {error && (
        <p className="text-[11px] text-destructive font-medium">{error}</p>
      )}
    </div>
  )
}
