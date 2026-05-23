/**
 * Thin promise-based wrapper around chrome.storage.local with an in-memory
 * fallback so the popup is also usable during `plasmo dev` outside of the
 * extension context.
 */

type StorageArea = chrome.storage.StorageArea

const memoryStore = new Map<string, unknown>()

function getArea(): StorageArea | null {
  if (typeof chrome !== "undefined" && chrome?.storage?.local) {
    return chrome.storage.local
  }
  return null
}

export const chromeStorage = {
  async get<T>(key: string, fallback: T): Promise<T> {
    const area = getArea()
    if (!area) {
      return (memoryStore.get(key) as T) ?? fallback
    }
    return new Promise((resolve) => {
      area.get([key], (result) => {
        const value = result?.[key]
        resolve(value === undefined ? fallback : (value as T))
      })
    })
  },

  async set<T>(key: string, value: T): Promise<void> {
    const area = getArea()
    if (!area) {
      memoryStore.set(key, value)
      return
    }
    return new Promise((resolve) => {
      area.set({ [key]: value }, () => resolve())
    })
  },

  async remove(key: string): Promise<void> {
    const area = getArea()
    if (!area) {
      memoryStore.delete(key)
      return
    }
    return new Promise((resolve) => {
      area.remove(key, () => resolve())
    })
  },

  onChanged(
    callback: (changes: { [key: string]: chrome.storage.StorageChange }) => void
  ): () => void {
    if (typeof chrome === "undefined" || !chrome.storage?.onChanged) {
      return () => {}
    }
    const handler = (
      changes: { [key: string]: chrome.storage.StorageChange },
      areaName: string
    ) => {
      if (areaName === "local") callback(changes)
    }
    chrome.storage.onChanged.addListener(handler)
    return () => chrome.storage.onChanged.removeListener(handler)
  }
}
