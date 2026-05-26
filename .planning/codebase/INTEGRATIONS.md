# External Integrations

**Analysis Date:** 2026-05-26

## APIs & External Services

**AI Services:**
- Google Gemini AI - Used for automated hazard detection and risk analysis from images.
  - SDK/Client: `@google/generative-ai`
  - Auth: `EXPO_PUBLIC_GEMINI_API_KEY`
  - Model: `gemini-2.5-flash` (referenced in `services/aiAnalysis.ts`)

## Data Storage

**Databases:**
- Supabase (PostgreSQL) - Remote database for synchronization.
  - Connection: `EXPO_PUBLIC_SUPABASE_URL`
  - Client: `@supabase/supabase-js`

**File Storage:**
- Local Filesystem - Handled via `expo-file-system`.
- Supabase Storage - Likely for image hosting (though base64 is also used in stores).

**Caching:**
- AsyncStorage - Used for persisting Zustand stores locally.

## Authentication & Identity

**Auth Provider:**
- Supabase Auth - Handles user sign-in and sign-up.
  - Implementation: `context/AuthContext.tsx` using `supabase.auth`.

## Monitoring & Observability

**Error Tracking:**
- None detected (e.g., Sentry not explicitly configured in `package.json`).

**Logs:**
- Console logging used in services (`services/syncService.ts`, `services/aiAnalysis.ts`).

## CI/CD & Deployment

**Hosting:**
- Expo EAS - Used for building and potentially hosting development builds.

**CI Pipeline:**
- GitHub Actions - Configured in `.github/workflows/` for various tasks including gemini-dispatch and review.

## Environment Configuration

**Required env vars:**
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- `EXPO_PUBLIC_GEMINI_API_KEY`

**Secrets location:**
- `.env` file (local development).
- EAS Secrets (production builds).

## Webhooks & Callbacks

**Incoming:**
- None detected.

**Outgoing:**
- None detected.

---

*Integration audit: 2026-05-26*
