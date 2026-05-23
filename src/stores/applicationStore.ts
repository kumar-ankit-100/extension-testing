import { create } from "zustand"

import { applicationsRepo, draftRepo } from "~storage/repositories"
import type { ApplicationDraft, JobApplication } from "~types"
import { generateId } from "~lib/utils"

const EMPTY_DRAFT: ApplicationDraft = {
  company: "",
  jobTitle: "",
  jobUrl: "",
  resumeId: null,
  notes: ""
}

interface ApplicationState {
  draft: ApplicationDraft
  applications: JobApplication[]
  isSaving: boolean
  hydrate: () => Promise<void>
  updateDraft: (patch: Partial<ApplicationDraft>) => void
  resetDraft: () => Promise<void>
  submit: () => Promise<JobApplication>
}

export const useApplicationStore = create<ApplicationState>((set, get) => ({
  draft: EMPTY_DRAFT,
  applications: [],
  isSaving: false,

  hydrate: async () => {
    const [draft, applications] = await Promise.all([
      draftRepo.get(),
      applicationsRepo.list()
    ])
    set({ draft: draft ?? EMPTY_DRAFT, applications })
  },

  updateDraft: (patch) => {
    const next = { ...get().draft, ...patch }
    set({ draft: next })
    void draftRepo.save(next)
  },

  resetDraft: async () => {
    set({ draft: EMPTY_DRAFT })
    await draftRepo.clear()
  },

  submit: async () => {
    set({ isSaving: true })
    try {
      const draft = get().draft
      const application: JobApplication = {
        id: generateId(),
        company: draft.company.trim(),
        jobTitle: draft.jobTitle.trim(),
        jobUrl: draft.jobUrl.trim(),
        resumeId: draft.resumeId,
        notes: draft.notes.trim() || undefined,
        createdAt: new Date().toISOString()
      }
      const next = await applicationsRepo.add(application)
      set({ applications: next })
      await get().resetDraft()
      return application
    } finally {
      set({ isSaving: false })
    }
  }
}))
