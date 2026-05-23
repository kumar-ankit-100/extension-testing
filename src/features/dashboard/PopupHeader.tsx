import { useClerk } from "@clerk/chrome-extension"
import { Briefcase, LogOut, Moon, Sun } from "lucide-react"

import { Button } from "~components/ui/button"
import { useTheme } from "~hooks/useTheme"
import { useAuth, type AuthUser } from "~auth/useAuth"

const HAS_CLERK = Boolean(process.env.PLASMO_PUBLIC_CLERK_PUBLISHABLE_KEY)

interface Props {
  applicationCount: number
}

export function PopupHeader({ applicationCount }: Props) {
  const { user } = useAuth()
  const { theme, toggle } = useTheme()
  const clerk = HAS_CLERK ? useClerk() : null

  return (
    <header className="px-4 pt-4 pb-3 flex items-center gap-3 border-b border-border bg-card/50">
      <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 flex items-center justify-center shadow-md shadow-violet-500/25">
        <Briefcase className="h-4 w-4 text-white" strokeWidth={2.4} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <h1 className="text-sm font-semibold tracking-tight">CareerOS</h1>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
            Beta
          </span>
        </div>
        <p className="text-[11px] text-muted-foreground truncate">
          {user ? <UserLine user={user} /> : "Track applications"}
          {applicationCount > 0 && (
            <span className="ml-1.5 text-muted-foreground/70">
              · {applicationCount} saved
            </span>
          )}
        </p>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={toggle}
        aria-label="Toggle theme"
        className="h-8 w-8">
        {theme === "dark" ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        )}
      </Button>

      {clerk && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => clerk.signOut()}
          aria-label="Sign out"
          className="h-8 w-8">
          <LogOut className="h-4 w-4" />
        </Button>
      )}
    </header>
  )
}

function UserLine({ user }: { user: AuthUser }) {
  return <>{user.email ?? user.fullName ?? "Signed in"}</>
}
