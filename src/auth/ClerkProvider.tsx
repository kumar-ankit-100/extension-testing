import { ClerkProvider as BaseClerkProvider } from "@clerk/chrome-extension"
import type { ReactNode } from "react"

const PUBLISHABLE_KEY = process.env.PLASMO_PUBLIC_CLERK_PUBLISHABLE_KEY

interface Props {
  children: ReactNode
}

/**
 * Wraps the popup with Clerk. Clerk for chrome extensions requires the popup
 * to be served over a stable URL — Plasmo handles that automatically.
 *
 * If a publishable key is not configured we render children directly so
 * developers can preview the UI without Clerk credentials.
 */
export function ClerkProvider({ children }: Props) {
  if (!PUBLISHABLE_KEY) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[CareerOS] PLASMO_PUBLIC_CLERK_PUBLISHABLE_KEY missing — rendering without Clerk."
      )
    }
    return <>{children}</>
  }

  return (
    <BaseClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      afterSignInUrl="/popup.html"
      afterSignUpUrl="/popup.html"
      signInUrl="/popup.html"
      appearance={{
        variables: {
          colorPrimary: "hsl(250 90% 62%)",
          borderRadius: "0.75rem"
        }
      }}>
      {children}
    </BaseClerkProvider>
  )
}
