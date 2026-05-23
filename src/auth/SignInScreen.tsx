import { SignIn } from "@clerk/chrome-extension"
import { motion } from "framer-motion"
import { Briefcase, Sparkles } from "lucide-react"

const HAS_CLERK = Boolean(process.env.PLASMO_PUBLIC_CLERK_PUBLISHABLE_KEY)

export function SignInScreen() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="flex flex-col items-center justify-center px-6 py-8 gap-6 min-h-[520px]">
      <div className="relative">
        <div className="absolute inset-0 -z-10 blur-2xl bg-gradient-to-br from-indigo-400/40 via-violet-400/40 to-fuchsia-400/40 rounded-full" />
        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <Briefcase className="h-7 w-7 text-white" strokeWidth={2.2} />
        </div>
      </div>

      <div className="text-center space-y-2">
        <h1 className="text-xl font-semibold tracking-tight">
          Welcome to <span className="gradient-text">CareerOS</span>
        </h1>
        <p className="text-sm text-muted-foreground max-w-[280px] leading-relaxed">
          Your AI-powered career operating system. Track applications and
          tailor resumes in seconds.
        </p>
      </div>

      {HAS_CLERK ? (
        <div className="w-full flex justify-center">
          <SignIn
            routing="virtual"
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-none border border-border bg-card",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton:
                  "border border-border hover:bg-accent transition-colors",
                formButtonPrimary:
                  "bg-primary hover:bg-primary/90 text-primary-foreground"
              }
            }}
          />
        </div>
      ) : (
        <div className="w-full rounded-xl border border-dashed border-border bg-muted/40 p-4 text-xs text-muted-foreground flex gap-2">
          <Sparkles className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
          <span>
            Set <code className="font-mono">PLASMO_PUBLIC_CLERK_PUBLISHABLE_KEY</code>{" "}
            in <code className="font-mono">.env</code> to enable Google sign-in.
          </span>
        </div>
      )}

      <p className="text-[11px] text-muted-foreground/80">
        By continuing, you agree to our Terms & Privacy.
      </p>
    </motion.div>
  )
}
