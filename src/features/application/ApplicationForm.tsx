import { AnimatePresence, motion } from "framer-motion"
import { CheckCircle2, Loader2, Send, Sparkles } from "lucide-react"
import { useEffect, useState } from "react"

import { Button } from "~components/ui/button"
import { Input } from "~components/ui/input"
import { Label } from "~components/ui/label"
import { Textarea } from "~components/ui/textarea"
import { ResumeList } from "~features/resumes/ResumeList"
import { ResumeUpload } from "~features/resumes/ResumeUpload"
import { useApplicationStore } from "~stores/applicationStore"
import { useResumeStore } from "~stores/resumeStore"
import { detectFromActiveTab } from "~utils/jobDetector"

export function ApplicationForm() {
  const { draft, updateDraft, submit, isSaving } = useApplicationStore()
  const {
    resumes,
    selectedId,
    isLoading,
    select,
    hydrate: hydrateResumes
  } = useResumeStore()

  const [success, setSuccess] = useState(false)
  const [detected, setDetected] = useState<string | null>(null)

  // One-shot autofill from active tab on first mount.
  useEffect(() => {
    let cancelled = false
    async function run() {
      const result = await detectFromActiveTab()
      if (cancelled || !result) return
      const patch: Partial<typeof draft> = {}
      if (!draft.jobUrl && result.jobUrl) patch.jobUrl = result.jobUrl
      if (!draft.company && result.company) patch.company = result.company
      if (Object.keys(patch).length > 0) {
        updateDraft(patch)
        setDetected(result.source ?? null)
      }
    }
    void run()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Keep selected resume in sync with the draft.
  useEffect(() => {
    if (selectedId && draft.resumeId !== selectedId) {
      updateDraft({ resumeId: selectedId })
    }
  }, [selectedId, draft.resumeId, updateDraft])

  useEffect(() => {
    void hydrateResumes()
  }, [hydrateResumes])

  const canSubmit =
    draft.company.trim().length > 0 &&
    draft.jobTitle.trim().length > 0 &&
    !isSaving

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    await submit()
    setSuccess(true)
    setTimeout(() => setSuccess(false), 2200)
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {detected && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-[11px] text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          <span>
            Auto-detected from <span className="font-semibold capitalize">{detected}</span>
          </span>
        </motion.div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            placeholder="Anthropic"
            value={draft.company}
            onChange={(e) => updateDraft({ company: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="jobTitle">Job title</Label>
          <Input
            id="jobTitle"
            placeholder="Senior Engineer"
            value={draft.jobTitle}
            onChange={(e) => updateDraft({ jobTitle: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="jobUrl">Job URL</Label>
        <Input
          id="jobUrl"
          type="url"
          placeholder="https://…"
          value={draft.jobUrl}
          onChange={(e) => updateDraft({ jobUrl: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Resume</Label>
          <span className="text-[10px] text-muted-foreground">
            {resumes.length} available
          </span>
        </div>
        <ResumeList
          resumes={resumes}
          selectedId={selectedId}
          isLoading={isLoading}
          onSelect={select}
        />
        <ResumeUpload />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Textarea
          id="notes"
          placeholder="Referral, recruiter contact, deadline…"
          value={draft.notes}
          onChange={(e) => updateDraft({ notes: e.target.value })}
        />
      </div>

      <Button
        type="submit"
        variant="gradient"
        size="lg"
        disabled={!canSubmit}
        className="w-full">
        <AnimatePresence mode="wait" initial={false}>
          {success ? (
            <motion.span
              key="success"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Saved!
            </motion.span>
          ) : isSaving ? (
            <motion.span
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving…
            </motion.span>
          ) : (
            <motion.span
              key="idle"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              Save application
            </motion.span>
          )}
        </AnimatePresence>
      </Button>
    </form>
  )
}
