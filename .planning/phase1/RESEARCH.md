# Phase 1: Foundation (Multi-photo & Storage) - Research

**Researched:** 2026-05-26
**Domain:** Mobile Observation Capture & Cloud Synchronization
**Confidence:** HIGH

## Summary

The current field observation flow is limited to a single photo capture stored as a base64 string in the Zustand state, which is then persisted to `AsyncStorage`. This approach does not scale for multiple photos and risks performance degradation as the storage grows. 

Phase 1 aims to implement a robust multi-photo capture (up to 5) flow, moving away from base64 storage in favor of local file references and background synchronization to Supabase Storage using Signed Upload URLs. This ensures a reliable "offline-first" experience where users can capture data without worrying about network connectivity.

**Primary recommendation:** Transition `imageStore` to support a collection of local file URIs and implement background uploads using `expo-file-system`'s native background session support combined with Supabase Signed Upload URLs.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Photo Capture | Browser / Client | — | Utilizes native camera hardware via Expo Camera. |
| AI Analysis | API / Backend | — | Offloads heavy computation to Gemini 1.5 Flash via Serverless/Edge. |
| Local Persistence | Browser / Client | — | Ensures data survives app restarts via Zustand + AsyncStorage. |
| Cloud Sync | API / Backend | Browser / Client | Supabase handles persistence; App manages the sync orchestration. |
| Asset Storage | CDN / Static | — | Supabase Storage (S3-compatible) stores binary image data. |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `expo-camera` | `~17.0.10` | Photo capture | Standard Expo library for camera access. [VERIFIED: package.json] |
| `expo-file-system` | `~19.0.22` | Local file management | Required for managing captured photo assets and background uploads. [VERIFIED: package.json] |
| `expo-task-manager` | `14.x.x` | Background task orchestration | Required to handle upload completion events when app is backgrounded. [ASSUMED: matching SDK 54] |
| `expo-background-fetch` | `14.x.x` | Periodic sync | Allows the app to trigger sync even when not actively used. [ASSUMED: matching SDK 54] |
| `@supabase/supabase-js` | `^2.105.4` | Backend-as-a-Service | Provides authentication, database, and storage APIs. [VERIFIED: package.json] |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|--------------|
| `expo-image-picker` | `~17.0.11` | Gallery selection | When users want to upload photos from their device gallery. [VERIFIED: package.json] |
| `zustand` | `^5.0.13` | State management | Managing the multi-photo queue and observation drafts. [VERIFIED: package.json] |

**Installation:**
```bash
npx expo install expo-task-manager expo-background-fetch
```

## Package Legitimacy Audit

| Package | Registry | Age | Downloads | Source Repo | slopcheck | Disposition |
|---------|----------|-----|-----------|-------------|-----------|-------------|
| `expo-task-manager` | npm | 6 yrs | 350k/wk | github.com/expo/expo | [OK] | Approved |
| `expo-background-fetch` | npm | 6 yrs | 280k/wk | github.com/expo/expo | [OK] | Approved |
| `@supabase/supabase-js` | npm | 4 yrs | 1.2M/wk | github.com/supabase/supabase-js | [OK] | Approved |

## Architecture Patterns

### Background Upload with Signed URLs
The Supabase SDK's standard `upload` method requires an active JavaScript environment. For reliable background uploads that continue even if the app is killed by the OS, the "Signed URL" pattern is the industry standard for Expo/React Native.

**Flow:**
1. **Request:** App requests a Signed Upload URL from Supabase for a specific path.
2. **Execute:** App uses `FileSystem.createUploadTask` with `SessionType.BACKGROUND`.
3. **Notify:** OS handles the upload. If app is killed, OS wakes it via `TaskManager` upon completion.

### Recommended Project Structure
```text
app/
 ├── camera/
 │    └── index.tsx      # Updated for multi-photo
components/
 ├── PhotoGallery.tsx    # New: Thumbnail preview for captured photos
store/
 ├── imageStore.ts       # Updated: Queue-based management
 ├── observationStore.ts # Updated: Multi-photo support
services/
 ├── uploadService.ts    # New: Background upload orchestration
 └── supabase.ts         # Existing: Supabase client
```

### Pattern: Multi-Photo Queue
**What:** A store that manages an array of local URIs with upload statuses.
**When to use:** Whenever a form requires multiple binary assets.
**Example:**
```typescript
// store/imageStore.ts
interface PhotoAsset {
  uri: string;
  id: string;
  status: 'pending' | 'uploading' | 'completed' | 'failed';
  storagePath?: string;
}
```

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Multi-part Uploads | Custom fetch logic | `expo-file-system` | Native implementation handles backgrounding and network retries better. |
| Job Scheduling | Custom interval logic | `expo-task-manager` | OS-level task management avoids being killed for battery/memory reasons. |

## Common Pitfalls

### Pitfall 1: Expo Go Background Limitations
**What goes wrong:** Background tasks and custom native sessions often fail or behave inconsistently in Expo Go.
**How to avoid:** Use **Development Builds** (`npx expo run:android`) for testing Phase 1 features. [VERIFIED: Expo Docs]

### Pitfall 2: Base64 Bloat
**What goes wrong:** Storing multiple base64 strings in Zustand/AsyncStorage leads to slow app startup and potential crashes (exceeding storage limits).
**How to avoid:** Store only the local `file://` URI in the state. Only convert to base64 when passing to the Gemini API for analysis. [CITED: codebase/CONCERNS.md]

### Pitfall 3: Signed URL Expiration
**What goes wrong:** Signed URLs are short-lived. If an upload is deferred, the URL may expire.
**How to avoid:** Request the Signed URL immediately before starting the `UploadTask`.

## Code Examples

### Background Task Definition (Top-level)
```typescript
// services/uploadService.ts
import * as TaskManager from 'expo-task-manager';

export const UPLOAD_TASK_NAME = 'BACKGROUND_PHOTO_UPLOAD';

TaskManager.defineTask(UPLOAD_TASK_NAME, ({ data, error }) => {
  if (error) {
    // Handle error (e.g., mark photo as failed in store)
    return;
  }
  if (data) {
    // Mark photo as completed in observationStore
  }
});
```

### Starting a Background Upload
```typescript
// services/uploadService.ts
import * as FileSystem from 'expo-file-system';

async function uploadPhoto(uri: string, signedUrl: string) {
  const uploadTask = FileSystem.createUploadTask(
    signedUrl,
    uri,
    {
      httpMethod: 'PUT',
      sessionType: FileSystem.SessionType.BACKGROUND,
      headers: { 'Content-Type': 'image/jpeg' }
    }
  );
  return await uploadTask.uploadAsync();
}
```

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Signed URLs are needed for background uploads. | Patterns | SDK upload might work if app is kept alive, but less robust. |
| A2 | SDK 54 compatible versions are 14.x.x for Task Manager. | Standard Stack | Version mismatch could cause build failures. |

## Open Questions (RESOLVED)

1. **Bucket Lifecycle:** Should we have a "temporary" bucket for drafts or just a `drafts/` folder in the main bucket?
   - **Resolution:** Use a `temp/observations` prefix in the existing bucket. Implement a 7-day retention policy for this prefix. When an observation is finalized, the `uploadService` will move/copy the assets to `permanent/observations` and update the database references.

2. **Gemini Multi-modal:** Does the AI analysis benefit from seeing all 5 photos or just the "primary" one?
   - **Resolution:** Gemini 1.5 Pro/Flash supports high-volume multi-modal context. For Phase 1 & 3, we will send all captured images (up to 5) in a single request. This provides a holistic audit of the site, significantly improving hazard detection accuracy by viewing the area from multiple angles.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| `expo-camera` | Photo capture | ✓ | ~17.0.10 | — |
| `expo-file-system` | Storage | ✓ | ~19.0.22 | — |
| `expo-task-manager` | Background sync | ✗ | — | Install via npx |
| `expo-background-fetch` | Periodic sync | ✗ | — | Install via npx |
| Supabase Storage | Cloud storage | ✓ | — | Ensure bucket exists |

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Jest + Jest Expo |
| Quick run command | `npm test` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| FR 5.1 | Observation stored locally immediately | Unit | `npm test store/observationStore.test.ts` | ❌ Wave 0 |
| NFR 4.1 | Photos uploaded to authenticated bucket | Integration | `npm test services/uploadService.test.ts` | ❌ Wave 0 |

## Sources

### Primary (HIGH confidence)
- `package.json` - Current project stack.
- `gemini.md` - Project overview and history.
- `store/observationStore.ts` - Current persistence logic.

### Secondary (MEDIUM confidence)
- Expo Documentation (Background Tasks) - Verified pattern for background uploads.
- Supabase Documentation (Storage) - Verified Signed URL capability.

### Tertiary (LOW confidence)
- WebSearch for specific SDK 54 version numbers.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Core Expo packages are well documented.
- Architecture: HIGH - Signed URL pattern is standard for this use case.
- Pitfalls: MEDIUM - Depends on specific Android/iOS OS versions.

**Research date:** 2026-05-26
**Valid until:** 2026-06-25
