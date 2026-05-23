export const STORAGE_KEYS = {
  RESUMES: "careeros:resumes",
  APPLICATIONS: "careeros:applications",
  DRAFT: "careeros:draft",
  SETTINGS: "careeros:settings",
  SESSION: "careeros:session"
} as const

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS]
