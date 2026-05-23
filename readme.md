# CareerOS — Browser Extension

AI-powered career operating system. Track job applications, manage tailored
resumes, and autofill from the active tab — all from a single popup.

> **Scope:** this repository contains **only** the browser extension frontend.
> No backend, no database — resumes and applications are persisted to
> `chrome.storage.local`.

---

## Tech Stack

- **[Plasmo](https://www.plasmo.com/)** — extension build framework
- **React 18 + TypeScript**
- **Tailwind CSS** + custom design tokens
- **shadcn/ui-style primitives** (built on Radix)
- **Clerk** (`@clerk/chrome-extension`) for Google sign-in
- **Zustand** for state
- **Framer Motion** for animations
- **react-dropzone** for resume upload

---

## Folder Structure

```
src/
├── popup.tsx                 # Plasmo popup entry
├── style.css                 # Tailwind + design tokens
│
├── auth/                     # Clerk wrapper + sign-in screen
│   ├── ClerkProvider.tsx
│   ├── SignInScreen.tsx
│   └── useAuth.ts
│
├── components/ui/            # shadcn-style primitives
│   ├── button.tsx
│   ├── input.tsx
│   ├── textarea.tsx
│   ├── label.tsx
│   ├── card.tsx
│   ├── badge.tsx
│   └── skeleton.tsx
│
├── features/
│   ├── application/          # Application form
│   ├── dashboard/            # Popup shell + header
│   └── resumes/              # Resume list, card, upload
│
├── hooks/
│   └── useTheme.ts
│
├── lib/
│   └── utils.ts              # cn(), formatDate(), formatBytes(), generateId()
│
├── storage/                  # chrome.storage abstraction
│   ├── chromeStorage.ts
│   ├── keys.ts
│   └── repositories.ts       # resumesRepo / applicationsRepo / draftRepo / settingsRepo / sessionRepo
│
├── stores/                   # Zustand stores
│   ├── resumeStore.ts
│   └── applicationStore.ts
│
├── types/
│   └── index.ts
│
└── utils/
    ├── file.ts               # PDF validation + base64 reader
    └── jobDetector.ts        # Pluggable auto-detection (LinkedIn / Greenhouse / Lever)
```

---

## Getting Started

```bash
# 1. install
pnpm install   # or npm install / yarn

# 2. configure Clerk
cp .env.example .env
# add your Clerk publishable key:
# PLASMO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...

# 3. dev mode (auto-reload)
pnpm dev

# 4. production build
pnpm build
```

Then load the unpacked extension from `build/chrome-mv3-dev` (dev) or
`build/chrome-mv3-prod` (prod) via `chrome://extensions`.

> **Without a Clerk key:** the popup still renders end-to-end with a stub
> "dev user" so you can preview the UI without setting up Clerk.

---

## Authentication Flow

1. User clicks extension icon → popup opens.
2. `<ClerkProvider>` boots and reads the current session.
3. While `isLoaded === false` we render a skeleton.
4. If **not signed in** → `<SignInScreen>` with Clerk's Google sign-in.
5. If **signed in** → `<Dashboard>` with the application form.
6. Whenever the Clerk user changes, a snapshot is written to
   `chrome.storage.local` under `careeros:session` for future
   background-script use.

---

## Storage Model

All persistence goes through `chromeStorage` + typed repositories. Keys live
in [`src/storage/keys.ts`](src/storage/keys.ts):

| Key                     | Shape                | Repo                |
| ----------------------- | -------------------- | ------------------- |
| `careeros:resumes`      | `Resume[]`           | `resumesRepo`       |
| `careeros:applications` | `JobApplication[]`   | `applicationsRepo`  |
| `careeros:draft`        | `ApplicationDraft`   | `draftRepo`         |
| `careeros:settings`     | `UserSettings`       | `settingsRepo`      |
| `careeros:session`      | `AuthSession`        | `sessionRepo`       |

An in-memory fallback keeps the popup usable during local dev outside the
extension context.

---

## Auto Job Detection

`src/utils/jobDetector.ts` runs URL-based detection on the active tab and
autofills the form. Architecture is **pluggable** — each detector returns a
partial `DetectedJob`. Today there are detectors for:

- LinkedIn
- Greenhouse
- Lever
- Generic (URL-only fallback)

To add DOM scraping later (e.g. via a Plasmo content script), just push a new
detector into the `DETECTORS` array.

---

## Resume System

- Seeded with three mock resumes (`Backend_Resume_V3.pdf`,
  `Fullstack_Resume.pdf`, `ML_Resume.pdf`) on first launch.
- Upload is PDF-only, max 5 MB, with drag-and-drop and loading states.
- Newly-uploaded resumes are base64-encoded, stored in
  `chrome.storage.local`, and become selectable immediately.
- Category is auto-inferred from the filename
  (`Backend`, `Frontend`, `Fullstack`, `ML`, `Data`, `DevOps`, `General`).

---

## Design

- Linear / Notion / Cursor-inspired aesthetic
- Soft shadows, rounded corners, subtle gradients
- Light glassmorphism on the brand mark
- Dark mode via `.dark` class + CSS variables
- Smooth Framer Motion transitions everywhere
- Popup is fixed at **400px** wide, ~520px tall
