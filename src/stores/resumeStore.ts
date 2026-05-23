import { create } from "zustand"

import { resumesRepo } from "~storage/repositories"
import type { Resume } from "~types"

interface ResumeState {
  resumes: Resume[]
  selectedId: string | null
  isLoading: boolean
  isUploading: boolean
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

  hydrate: async () => {
    set({ isLoading: true })
    const resumes = await resumesRepo.list()
    set({
      resumes,
      isLoading: false,
      selectedId: get().selectedId ?? resumes[0]?.id ?? null
    })
  },

  select: (id) => set({ selectedId: id }),

  addResume: async (resume) => {
    const next = await resumesRepo.add(resume)
    set({ resumes: next, selectedId: resume.id })
  },

  removeResume: async (id) => {
    const next = await resumesRepo.remove(id)
    const selectedId = get().selectedId === id ? (next[0]?.id ?? null) : get().selectedId
    set({ resumes: next, selectedId })
  },

  setUploading: (isUploading) => set({ isUploading })
}))
