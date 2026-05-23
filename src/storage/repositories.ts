import type {
  ApplicationDraft,
  AuthSession,
  JobApplication,
  Resume,
  UserSettings
} from "~types"

import { chromeStorage } from "./chromeStorage"
import { STORAGE_KEYS } from "./keys"

const MOCK_RESUMES: Resume[] = [
  {
    id: "mock-backend",
    name: "Backend_Resume_V3.pdf",
    category: "Backend",
    uploadedAt: "2026-04-12T09:00:00.000Z",
    size: 184_320,
    type: "application/pdf",
    mock: true
  },
  {
    id: "mock-fullstack",
    name: "Fullstack_Resume.pdf",
    category: "Fullstack",
    uploadedAt: "2026-05-02T17:30:00.000Z",
    size: 212_992,
    type: "application/pdf",
    mock: true
  },
  {
    id: "mock-ml",
    name: "ML_Resume.pdf",
    category: "ML",
    uploadedAt: "2026-05-18T12:15:00.000Z",
    size: 198_656,
    type: "application/pdf",
    mock: true
  }
]

const DEFAULT_SETTINGS: UserSettings = {
  theme: "system",
  defaultResumeId: null
}

export const resumesRepo = {
  async list(): Promise<Resume[]> {
    return chromeStorage.get<Resume[]>(STORAGE_KEYS.RESUMES, MOCK_RESUMES)
  },
  async save(resumes: Resume[]): Promise<void> {
    return chromeStorage.set(STORAGE_KEYS.RESUMES, resumes)
  },
  async add(resume: Resume): Promise<Resume[]> {
    const existing = await this.list()
    const next = [resume, ...existing]
    await this.save(next)
    return next
  },
  async remove(id: string): Promise<Resume[]> {
    const existing = await this.list()
    const next = existing.filter((r) => r.id !== id)
    await this.save(next)
    return next
  }
}

export const applicationsRepo = {
  async list(): Promise<JobApplication[]> {
    return chromeStorage.get<JobApplication[]>(STORAGE_KEYS.APPLICATIONS, [])
  },
  async add(application: JobApplication): Promise<JobApplication[]> {
    const existing = await this.list()
    const next = [application, ...existing]
    await chromeStorage.set(STORAGE_KEYS.APPLICATIONS, next)
    return next
  }
}

export const draftRepo = {
  async get(): Promise<ApplicationDraft | null> {
    return chromeStorage.get<ApplicationDraft | null>(STORAGE_KEYS.DRAFT, null)
  },
  async save(draft: ApplicationDraft): Promise<void> {
    return chromeStorage.set(STORAGE_KEYS.DRAFT, draft)
  },
  async clear(): Promise<void> {
    return chromeStorage.remove(STORAGE_KEYS.DRAFT)
  }
}

export const settingsRepo = {
  async get(): Promise<UserSettings> {
    return chromeStorage.get<UserSettings>(
      STORAGE_KEYS.SETTINGS,
      DEFAULT_SETTINGS
    )
  },
  async update(patch: Partial<UserSettings>): Promise<UserSettings> {
    const current = await this.get()
    const next = { ...current, ...patch }
    await chromeStorage.set(STORAGE_KEYS.SETTINGS, next)
    return next
  }
}

export const sessionRepo = {
  async get(): Promise<AuthSession | null> {
    return chromeStorage.get<AuthSession | null>(STORAGE_KEYS.SESSION, null)
  },
  async save(session: AuthSession): Promise<void> {
    return chromeStorage.set(STORAGE_KEYS.SESSION, session)
  },
  async clear(): Promise<void> {
    return chromeStorage.remove(STORAGE_KEYS.SESSION)
  }
}
