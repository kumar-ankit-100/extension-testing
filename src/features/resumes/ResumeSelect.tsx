import { FileText } from "lucide-react"

import { Badge } from "~components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "~components/ui/select"
import { Skeleton } from "~components/ui/skeleton"
import { formatDate } from "~lib/utils"
import type { Resume } from "~types"

interface Props {
  resumes: Resume[]
  selectedId: string | null
  isLoading: boolean
  onSelect: (id: string) => void
}

export function ResumeSelect({ resumes, selectedId, isLoading, onSelect }: Props) {
  if (isLoading) {
    return <Skeleton className="h-[44px] w-full rounded-xl" />
  }

  const selected = resumes.find((r) => r.id === selectedId) ?? null

  return (
    <Select
      value={selectedId ?? undefined}
      onValueChange={(value) => onSelect(value)}>
      <SelectTrigger>
        <SelectValue
          placeholder={
            <span className="text-muted-foreground">Select a resume…</span>
          }>
          {selected ? <ResumeRow resume={selected} compact /> : null}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {resumes.length === 0 ? (
          <div className="px-3 py-4 text-center text-xs text-muted-foreground">
            No resumes yet — upload one below.
          </div>
        ) : (
          resumes.map((resume) => (
            <SelectItem key={resume.id} value={resume.id}>
              <ResumeRow resume={resume} />
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  )
}

function ResumeRow({ resume, compact = false }: { resume: Resume; compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5 min-w-0">
      <div className="h-7 w-7 shrink-0 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
        <FileText className="h-3.5 w-3.5" strokeWidth={2.2} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium truncate">{resume.name}</div>
        {!compact && (
          <div className="mt-0.5 flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <Badge variant="outline">{resume.category}</Badge>
            <span>•</span>
            <span>{formatDate(resume.uploadedAt)}</span>
          </div>
        )}
        {compact && (
          <div className="text-[10px] text-muted-foreground truncate">
            {resume.category} · {formatDate(resume.uploadedAt)}
          </div>
        )}
      </div>
    </div>
  )
}
