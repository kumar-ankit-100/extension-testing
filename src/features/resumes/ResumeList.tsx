import { AnimatePresence, motion } from "framer-motion"
import { FileQuestion } from "lucide-react"

import { Skeleton } from "~components/ui/skeleton"
import type { Resume } from "~types"

import { ResumeCard } from "./ResumeCard"

interface Props {
  resumes: Resume[]
  selectedId: string | null
  isLoading: boolean
  onSelect: (id: string) => void
}

export function ResumeList({ resumes, selectedId, isLoading, onSelect }: Props) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-[64px] w-full rounded-xl" />
        ))}
      </div>
    )
  }

  if (resumes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center gap-2 py-8 rounded-xl border border-dashed border-border bg-muted/30">
        <FileQuestion className="h-6 w-6 text-muted-foreground" />
        <p className="text-sm font-medium">No resumes yet</p>
        <p className="text-xs text-muted-foreground max-w-[220px]">
          Upload your first resume below to start tracking applications.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2 max-h-[180px] overflow-y-auto scrollbar-thin pr-1">
      <AnimatePresence initial={false}>
        {resumes.map((resume) => (
          <motion.div
            key={resume.id}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}>
            <ResumeCard
              resume={resume}
              selected={selectedId === resume.id}
              onSelect={onSelect}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
