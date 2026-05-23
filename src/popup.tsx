import { AnimatePresence, motion } from "framer-motion"

import { ClerkProvider } from "~auth/ClerkProvider"
import { SignInScreen } from "~auth/SignInScreen"
import { useAuth } from "~auth/useAuth"
import { Skeleton } from "~components/ui/skeleton"
import { Dashboard } from "~features/dashboard/Dashboard"
import { useTheme } from "~hooks/useTheme"

import "./style.css"

function PopupShell() {
  // Ensure theme class is applied on first paint.
  useTheme()
  const { isLoaded, isSignedIn } = useAuth()

  return (
    <div className="w-[400px] bg-background text-foreground">
      <AnimatePresence mode="wait">
        {!isLoaded ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-4 space-y-3 min-h-[520px]">
            <Skeleton className="h-9 w-1/2" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-28 w-full" />
          </motion.div>
        ) : isSignedIn ? (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}>
            <Dashboard />
          </motion.div>
        ) : (
          <motion.div
            key="signin"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}>
            <SignInScreen />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Popup() {
  return (
    <ClerkProvider>
      <PopupShell />
    </ClerkProvider>
  )
}
