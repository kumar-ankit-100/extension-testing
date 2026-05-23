export type ResumeCategory =
  | "Backend"
  | "Frontend"
  | "Fullstack"
  | "ML"
  | "Data"
  | "DevOps"
  | "General"

export interface Resume {
  id: string
  name: string
  category: ResumeCategory
  uploadedAt: string
  size: number
  type: string
  /** True for the seeded mock resumes. */
  mock?: boolean
}

export interface JobApplication {
  id: string
  company: string
  jobTitle: string
  jobUrl: string
  resumeId: string | null
  notes?: string
  createdAt: string
  source?: DetectedSource
}

export interface ApplicationDraft {
  company: string
  jobTitle: string
  jobUrl: string
  resumeId: string | null
  notes: string
}

export type DetectedSource =
  | "linkedin"
  | "greenhouse"
  | "lever"
  | "generic"
  | null

export interface DetectedJob {
  company?: string
  jobTitle?: string
  jobUrl?: string
  source: DetectedSource
}

export interface UserSettings {
  theme: "light" | "dark" | "system"
  defaultResumeId: string | null
}

export interface AuthSession {
  userId: string | null
  email: string | null
  imageUrl: string | null
  lastSyncedAt: string
}
