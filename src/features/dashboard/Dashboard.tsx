import { motion } from "framer-motion"
import { useEffect } from "react"

import { ApplicationForm } from "~features/application/ApplicationForm"
import { useApplicationStore } from "~stores/applicationStore"

import { PopupHeader } from "./PopupHeader"

export function Dashboard() {
  const { applications, hydrate } = useApplicationStore()

  useEffect(() => {
    void hydrate()
  }, [hydrate])

  return (
    <div className="flex flex-col min-h-[520px]">
      <PopupHeader applicationCount={applications.length} />
      <motion.main
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22 }}
        className="flex-1 px-4 py-4">
        <ApplicationForm />
      </motion.main>
      <footer className="px-4 py-2.5 border-t border-border text-[10px] text-muted-foreground/80 flex items-center justify-between">
        <span>CareerOS · v0.1</span>
        <span className="font-mono">⌥ + space to open</span>
      </footer>
    </div>
  )
}
