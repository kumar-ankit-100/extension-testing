import { motion } from "framer-motion"
import { Check, FileText } from "lucide-react"

import { Badge } from "~components/ui/badge"
import { cn, formatBytes, formatDate } from "~lib/utils"
import type { Resume } from "~types"

interface Props {
  resume: Resume
  selected: boolean
  onSelect: (id: string) => void
}

export function ResumeCard({ resume, selected, onSelect }: Props) {
  return (
    <motion.button
      type="button"
      layout
      whileTap={{ scale: 0.985 }}
      onClick={() => onSelect(resume.id)}
      className={cn(
        "group relative w-full text-left rounded-xl border p-3 transition-all flex items-start gap-3",
        "hover:shadow-md hover:-translate-y-[1px]",
        selected
          ? "border-primary/60 bg-accent/60 ring-1 ring-primary/40 shadow-sm"
          : "border-border bg-card hover:border-border/80"
      )}>
      <div
        className={cn(
          "h-9 w-9 shrink-0 rounded-lg flex items-center justify-center transition-colors",
          selected
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        )}>
        <FileText className="h-4 w-4" strokeWidth={2.2} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium truncate">{resume.name}</span>
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Badge variant="outline">{resume.category}</Badge>
          <span>•</span>
          <span>{formatDate(resume.uploadedAt)}</span>
          <span>•</span>
          <span>{formatBytes(resume.size)}</span>
        </div>
      </div>

      {selected && (
        <motion.div
          layoutId="resume-check"
          className="h-5 w-5 rounded-full bg-primary flex items-center justify-center shadow-sm shadow-primary/30">
          <Check className="h-3 w-3 text-primary-foreground" strokeWidth={3} />
        </motion.div>
      )}
    </motion.button>
  )
}
