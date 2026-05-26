<!-- refreshed: 2026-05-26 -->
# Architecture

**Analysis Date:** 2026-05-26

## System Overview

```text
┌─────────────────────────────────────────────────────────────┐
│                       UI Layer (Expo)                        │
├──────────────────┬──────────────────┬───────────────────────┤
│   App Screens    │    Components    │   Theme / Styles      │
│     `app/`       │  `components/`   │      `theme/`         │
└────────┬─────────┴────────┬─────────┴──────────┬────────────┘
         │                  │                     │
         ▼                  ▼                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    Business Logic Layer                     │
│    `services/` (AI, Sync, Reports, Data Management)         │
└─────────────────────────────────────────────────────────────┘
         │                  │
         ▼                  ▼
┌─────────────────────────────────────────────────────────────┐
│  State & Persistence         │    External Integrations     │
│  `store/` (Zustand)          │    Supabase & Gemini AI      │
│  `AsyncStorage`              │                              │
└─────────────────────────────────────────────────────────────┘
```

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| `AuthContext` | Global authentication state and session management. | `context/AuthContext.tsx` |
| `ObservationStore` | Manages saha observations, persists to storage, triggers sync. | `store/observationStore.ts` |
| `ActionStore` | Manages corrective actions (DÖF), handles cascade deletes. | `store/actionStore.ts` |
| `AI Analysis` | Interfaces with Google Gemini for image-based hazard detection. | `services/aiAnalysis.ts` |
| `Report Service` | Generates ISO 45001 compliant PDF reports from observation data. | `services/reportService.ts` |
| `Sync Service` | Handles two-way synchronization between local store and Supabase. | `services/syncService.ts` |
| `Scanner` | QR code scanning for equipment identification. | `app/scanner/index.tsx` |

## Pattern Overview

**Overall:** Local-First with Cloud Sync

**Key Characteristics:**
- **Store-Driven UI:** Components react to changes in Zustand stores.
- **Service-Oriented Logic:** Business logic (AI, Sync, PDF) is encapsulated in dedicated service modules.
- **Offline Persistence:** All core data is stored in `AsyncStorage` via Zustand middleware, allowing offline usage.

## Layers

**UI Layer:**
- Purpose: Entry point for user interactions.
- Location: `app/` and `components/`
- Contains: React components, hooks, and navigation layouts.
- Depends on: `store/`, `services/`, `context/`

**State Layer:**
- Purpose: Source of truth for the application state.
- Location: `store/`
- Contains: Zustand stores for actions, observations, images, and settings.
- Depends on: `AsyncStorage`, `services/syncService` (side effects).

**Service Layer:**
- Purpose: External communication and complex processing.
- Location: `services/`
- Contains: API clients, data transformation logic, and background synchronization tasks.
- Depends on: External APIs (Supabase, Gemini).

## Data Flow

### Primary Request Path (Observation Capture)

1. User captures photo or selects image (`app/camera/index.tsx`).
2. Image is passed to AI Service (`services/aiAnalysis.ts`) for hazard detection.
3. Resulting data is saved to `ObservationStore` (`store/observationStore.ts`).
4. `ObservationStore` persists data to `AsyncStorage` and triggers `SyncService` (`services/syncService.ts`) for cloud backup.

### Report Generation Flow

1. User triggers PDF export from observation detail or dashboard.
2. `ReportService` (`services/reportService.ts`) gathers data from stores.
3. HTML template is populated and printed to PDF via `expo-print`.
4. Sharing dialog is opened via `expo-sharing`.

**State Management:**
- Handled primarily by Zustand stores with persistent middleware.
- `AuthContext` provides session-level state for authentication.

## Key Abstractions

**Store Persistence:**
- Purpose: Automatic local saving of application state.
- Examples: `store/observationStore.ts`
- Pattern: Middleware-based persistence.

**Report Templates:**
- Purpose: Reusable HTML/CSS blocks for consistent reporting.
- Examples: `services/reportService.ts` (Shared CSS functions).

## Entry Points

**Root Layout:**
- Location: `app/_layout.tsx`
- Triggers: App startup.
- Responsibilities: Font loading, Splash screen management, Auth provider initialization.

**Tab Navigation:**
- Location: `app/(tabs)/_layout.tsx`
- Triggers: After authentication.
- Responsibilities: Main application navigation.

## Architectural Constraints

- **Threading:** Single-threaded JavaScript event loop; background sync triggered via `setTimeout`.
- **Global state:** Managed through Zustand stores.
- **Circular imports:** Managed by using dynamic `import()` in stores to reference services (e.g., `store/observationStore.ts` dynamic import of `syncService`).

## Anti-Patterns

### Logic in Components

**What happens:** Some complex logic (e.g., data merging in `importData`) is mixed with service definitions or components.
**Why it's wrong:** Makes testing and reusability harder.
**Do this instead:** Move data transformation logic to utility functions.

### Manual Conflict Resolution

**What happens:** Syncing uses `upsert` without checking for newer remote data during a save.
**Why it's wrong:** Can lead to data loss if multiple devices are used.
**Do this instead:** Implement versioning or timestamp-based comparison.

## Error Handling

**Strategy:** Try-catch blocks in services with console logging and specific error re-throwing.

**Patterns:**
- UI-level alerts for user-facing errors (e.g., in `app/scanner/index.tsx`).
- Graceful degradation (e.g., showing a placeholder if image base64 is missing in PDF).

## Cross-Cutting Concerns

**Logging:** Centralized console logging in services.
**Validation:** Basic JSON structure validation during data import.
**Authentication:** Checked in `syncService` and layout guards.

---

*Architecture analysis: 2026-05-26*
