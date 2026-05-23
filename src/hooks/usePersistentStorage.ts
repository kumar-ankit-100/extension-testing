import { useCallback, useEffect, useRef, useState } from "react"

import { chromeStorage } from "~storage/chromeStorage"

/**
 * Hydrates state from `chrome.storage.local` on mount and writes back on every
 * update. Always pass the next value explicitly to `setValue` (avoid functional
 * setters that read stale closures) so the persisted payload matches what the
 * UI just rendered.
 *
 *   const [resumes, setResumes, { isHydrated }] = usePersistentStorage(
 *     "careeros:resumes",
 *     []
 *   )
 *   await setResumes([...resumes, newResume])
 */
export function usePersistentStorage<T>(
  key: string,
  fallback: T
): [T, (next: T) => Promise<void>, { isHydrated: boolean }] {
  const [value, setLocal] = useState<T>(fallback)
  const [isHydrated, setHydrated] = useState(false)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    let cancelled = false
    void (async () => {
      const stored = await chromeStorage.get<T>(key, fallback)
      if (cancelled || !mountedRef.current) return
      setLocal(stored)
      setHydrated(true)
      console.log(`[CareerOS] hydrated "${key}"`)
    })()
    return () => {
      cancelled = true
      mountedRef.current = false
    }
    // We intentionally hydrate once per key. Fallback ref is stable per caller.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  const setValue = useCallback(
    async (next: T) => {
      setLocal(next)
      await chromeStorage.set(key, next)
      console.log(`[CareerOS] persisted "${key}"`)
    },
    [key]
  )

  return [value, setValue, { isHydrated }]
}
