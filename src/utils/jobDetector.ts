import type { DetectedJob, DetectedSource } from "~types"

/**
 * Lightweight auto-detection. Today this only inspects the active tab's URL
 * and pulls the company/role out of well-known job board URL patterns.
 *
 * The architecture is intentionally pluggable: each detector returns either
 * `null` (no match) or a partial `DetectedJob`. Add detectors below as new
 * boards are supported (e.g. content-script-driven DOM scraping).
 */

type Detector = (url: URL) => Partial<DetectedJob> | null

const linkedinDetector: Detector = (url) => {
  if (!url.hostname.includes("linkedin.com")) return null
  if (!url.pathname.includes("/jobs/")) return null
  return { source: "linkedin", jobUrl: url.toString() }
}

const greenhouseDetector: Detector = (url) => {
  if (!url.hostname.includes("greenhouse.io")) return null
  // Pattern: boards.greenhouse.io/<company>/jobs/<id>
  const [, company] = url.pathname.split("/")
  return {
    source: "greenhouse",
    company: company ? toTitleCase(company) : undefined,
    jobUrl: url.toString()
  }
}

const leverDetector: Detector = (url) => {
  if (!url.hostname.includes("lever.co")) return null
  // Pattern: jobs.lever.co/<company>/<uuid>
  const [, company] = url.pathname.split("/")
  return {
    source: "lever",
    company: company ? toTitleCase(company) : undefined,
    jobUrl: url.toString()
  }
}

const genericDetector: Detector = (url) => ({
  source: "generic",
  jobUrl: url.toString()
})

const DETECTORS: Detector[] = [
  linkedinDetector,
  greenhouseDetector,
  leverDetector,
  genericDetector
]

function toTitleCase(slug: string): string {
  return slug
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim()
}

export function detectFromUrl(rawUrl: string | undefined): DetectedJob {
  const fallback: DetectedJob = { source: null as DetectedSource }
  if (!rawUrl) return fallback
  try {
    const url = new URL(rawUrl)
    for (const detector of DETECTORS) {
      const hit = detector(url)
      if (hit) return { source: null, ...hit } as DetectedJob
    }
    return fallback
  } catch {
    return fallback
  }
}

/**
 * Reads the active tab and runs URL-based detection. Returns `null` when the
 * tabs API isn't available (e.g. during local dev outside of chrome).
 */
export async function detectFromActiveTab(): Promise<DetectedJob | null> {
  if (typeof chrome === "undefined" || !chrome.tabs?.query) return null
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs?.[0]?.url
      resolve(detectFromUrl(url))
    })
  })
}
