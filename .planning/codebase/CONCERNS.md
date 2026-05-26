# Codebase Concerns

**Analysis Date:** 2026-05-26

## Tech Debt

**Synchronization Logic:**
- Issue: Manual conflict resolution using `upsert` in `syncService.ts`. No check for newer remote data before overwriting.
- Files: `services/syncService.ts`
- Impact: Potential data loss if multiple users or devices update the same records simultaneously.
- Fix approach: Implement a "last updated at" check or use a versioning system for records.

**Hardcoded Simulation:**
- Issue: QR scanning currently uses a hardcoded alert with simulated data.
- Files: `app/scanner/index.tsx`
- Impact: Functionality is not yet connected to a real equipment database.
- Fix approach: Integrate with a real equipment API or Supabase table.

## Known Bugs

**PDF Image Loading:**
- Symptoms: PDF might not render images correctly if the URI is not accessible to the print service.
- Files: `services/reportService.ts`
- Trigger: Exporting an observation with a `file://` URI.
- Workaround: The system currently saves `imageBase64` in the store for PDF rendering, which is a heavy workaround.

## Security Considerations

**API Keys in Client:**
- Risk: `EXPO_PUBLIC_GEMINI_API_KEY` and Supabase keys are prefixed with `EXPO_PUBLIC_`, meaning they are bundled with the client application.
- Files: `.env`, `services/aiAnalysis.ts`, `services/supabase.ts`
- Current mitigation: None.
- Recommendations: Use a backend proxy for sensitive AI calls to keep the API key secret.

## Performance Bottlenecks

**Base64 Storage in Zustand:**
- Problem: Large base64 strings are stored in the state and persisted to `AsyncStorage`.
- Files: `store/observationStore.ts`
- Cause: Need for PDF generation images.
- Improvement path: Store only file paths and convert to base64 on-demand during PDF generation.

## Fragile Areas

**Data Import:**
- Files: `services/dataManager.ts`
- Why fragile: Simple merge strategy (`Set` check) might not handle complex data conflicts well.
- Safe modification: Add validation schema (e.g., Zod) for imported JSON files.
- Test coverage: Zero coverage for import/export logic.

## Scaling Limits

**AsyncStorage:**
- Current capacity: Typically 6MB on Android by default.
- Limit: Storing many base64 images will quickly exceed this limit.
- Scaling path: Move image storage to the filesystem and store only references in the database/store.

## Dependencies at Risk

**Gemini Model Version:**
- Risk: `gemini-2.5-flash` is a specific model version that might be deprecated or updated.
- Impact: AI analysis might break or change behavior.
- Migration plan: Use a more stable alias or implement a configurable model version.

## Missing Critical Features

**Push Notifications:**
- Problem: No system to alert users of critical hazards or assigned actions.
- Blocks: Timely response to safety incidents.

**Real Offline-First Sync:**
- Problem: Current sync is basic and triggered manually/on-add.
- Blocks: True offline-first experience with automatic background sync.

## Test Coverage Gaps

**Core Services:**
- What's not tested: AI analysis, Sync, PDF generation.
- Files: `services/aiAnalysis.ts`, `services/syncService.ts`, `services/reportService.ts`.
- Risk: Regressions in critical business logic.
- Priority: High.

---

*Concerns audit: 2026-05-26*
