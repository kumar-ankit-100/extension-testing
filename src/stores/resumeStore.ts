import { create } from "zustand"

import { resumesRepo } from "~storage/repositories"
import type { Resume } from "~types"

interface ResumeState {
  resumes: Resume[]
  selectedId: string | null
  isLoading: boolean
  isUploading: boolean
  isHydrated: boolean
  hydrate: () => Promise<void>
  select: (id: string | null) => void
  addResume: (resume: Resume) => Promise<void>
  removeResume: (id: string) => Promise<void>
  setUploading: (uploading: boolean) => void
}

export const useResumeStore = create<ResumeState>((set, get) => ({
  resumes: [],
  selectedId: null,
  isLoading: true,
  isUploading: false,
  isHydrated: false,

  hydrate: async () => {
    if (get().isHydrated) return
    set({ isLoading: true })
    const resumes = await resumesRepo.list()
    console.log("[CareerOS] resumes loaded:", resumes.length)
    set({
      resumes,
      isLoading: false,
      isHydrated: true,
      selectedId: get().selectedId ?? resumes[0]?.id ?? null
    })
  },

  select: (id) => set({ selectedId: id }),

  // IMPORTANT: build the next array first, then call set + persist with the
  // SAME reference. Avoid `setResumes(newResume)` followed by `save(resumes)`
  // which would write a stale array.
  addResume: async (resume) => {
    const updated = [resume, ...get().resumes]
    set({ resumes: updated, selectedId: resume.id })
    await resumesRepo.save(updated)
    console.log("[CareerOS] resume uploaded:", resume.name, "total:", updated.length)
  },

  removeResume: async (id) => {
    const updated = get().resumes.filter((r) => r.id !== id)
    const selectedId =
      get().selectedId === id ? (updated[0]?.id ?? null) : get().selectedId
    set({ resumes: updated, selectedId })
    await resumesRepo.save(updated)
    console.log("[CareerOS] resume removed:", id)
  },

  setUploading: (isUploading) => set({ isUploading })
}))
