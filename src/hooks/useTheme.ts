import { useCallback, useEffect, useState } from "react"

import { settingsRepo } from "~storage/repositories"

type Theme = "light" | "dark"

function resolveSystem(): Theme {
  if (typeof window === "undefined") return "light"
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light"
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("light")

  useEffect(() => {
    let mounted = true
    void settingsRepo.get().then((settings) => {
      if (!mounted) return
      const next: Theme =
        settings.theme === "system" ? resolveSystem() : settings.theme
      setTheme(next)
    })
    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    if (typeof document === "undefined") return
    document.documentElement.classList.toggle("dark", theme === "dark")
  }, [theme])

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark"
      void settingsRepo.update({ theme: next })
      return next
    })
  }, [])

  return { theme, toggle }
}
