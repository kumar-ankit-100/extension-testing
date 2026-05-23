import {
  useAuth as useClerkAuth,
  useUser as useClerkUser
} from "@clerk/chrome-extension"
import { useEffect } from "react"

import { sessionRepo } from "~storage/repositories"

const HAS_CLERK = Boolean(process.env.PLASMO_PUBLIC_CLERK_PUBLISHABLE_KEY)

export interface AuthUser {
  id: string
  email: string | null
  fullName: string | null
  imageUrl: string | null
}

export interface AuthState {
  isLoaded: boolean
  isSignedIn: boolean
  user: AuthUser | null
}

/**
 * Bridge between Clerk and chrome.storage.local. Persists a snapshot of the
 * current session so background scripts / future API calls can read it without
 * needing the Clerk SDK in every context.
 *
 * When Clerk is not configured (no publishable key) we report a "dev user" so
 * the UI is still navigable.
 */
export function useAuth(): AuthState {
  if (!HAS_CLERK) {
    return {
      isLoaded: true,
      isSignedIn: true,
      user: {
        id: "dev-user",
        email: "dev@careeros.local",
        fullName: "Dev User",
        imageUrl: null
      }
    }
  }

  const { isLoaded, isSignedIn } = useClerkAuth()
  const { user } = useClerkUser()

  useEffect(() => {
    if (!isLoaded) return
    if (isSignedIn && user) {
      void sessionRepo.save({
        userId: user.id,
        email: user.primaryEmailAddress?.emailAddress ?? null,
        imageUrl: user.imageUrl ?? null,
        lastSyncedAt: new Date().toISOString()
      })
    } else {
      void sessionRepo.clear()
    }
  }, [isLoaded, isSignedIn, user])

  return {
    isLoaded,
    isSignedIn: Boolean(isSignedIn),
    user: user
      ? {
          id: user.id,
          email: user.primaryEmailAddress?.emailAddress ?? null,
          fullName: user.fullName,
          imageUrl: user.imageUrl ?? null
        }
      : null
  }
}
