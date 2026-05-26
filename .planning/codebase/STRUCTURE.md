# Codebase Structure

**Analysis Date:** 2026-05-26

## Directory Layout

```
[project-root]/
├── .expo/          # Expo configuration and generated types
├── .github/        # GitHub Actions workflows and AI command configs
├── app/            # Expo Router application screens and layouts
│   ├── (tabs)/     # Main application tabs (Dashboard, Actions, etc.)
│   ├── auth/       # Authentication screens (SignIn, SignUp)
│   ├── camera/     # Camera and photo selection interface
│   ├── observations/ # Observation detail and list views
│   └── scanner/    # QR/Barcode scanning functionality
├── assets/         # App icons, splash screens, and static fonts
├── components/     # Reusable UI components (ActionCard, DashboardCard, etc.)
├── context/        # React Context providers (AuthContext)
├── services/       # Business logic and external API integrations
├── skills/         # Project-specific AI agent instructions
├── store/          # Zustand state management stores
└── theme/          # Global styling constants (Colors, Typography)
```

## Directory Purposes

**app/:**
- Purpose: Application entry points and route definitions.
- Contains: Screen components and layout configurations.
- Key files: `app/_layout.tsx`, `app/index.tsx`.

**services/:**
- Purpose: Logic layer for external systems and complex operations.
- Contains: API clients and processing services.
- Key files: `services/aiAnalysis.ts`, `services/reportService.ts`, `services/syncService.ts`.

**store/:**
- Purpose: Global state management.
- Contains: Zustand stores with local persistence.
- Key files: `store/observationStore.ts`, `store/actionStore.ts`.

**components/:**
- Purpose: Reusable presentational and container components.
- Contains: Actionable UI elements used across different screens.
- Key files: `components/ActionCard.tsx`, `components/PrimaryButton.tsx`.

## Key File Locations

**Entry Points:**
- `app/_layout.tsx`: Root application layout and provider setup.
- `app/index.tsx`: Splash/Welcome screen or home redirect.

**Configuration:**
- `app.json`: Expo project configuration.
- `package.json`: Dependency and script management.
- `.env`: Environment variables (API keys).

**Core Logic:**
- `services/aiAnalysis.ts`: Gemini AI integration.
- `services/syncService.ts`: Cloud synchronization logic.

**Testing:**
- `jest.config.js`: Test runner configuration.

## Naming Conventions

**Files:**
- PascalCase for components (`ActionCard.tsx`).
- camelCase for services and stores (`syncService.ts`, `observationStore.ts`).
- lowercase-dash for directory names (`(tabs)`, `observations`).

**Directories:**
- Plural names for collections (`components`, `services`, `stores`).

## Where to Add New Code

**New Feature:**
- Primary code: Add a new directory in `app/` if it's a new screen, or add to existing tab in `app/(tabs)/`.
- Tests: Create a `__tests__` directory alongside the feature or a `.test.ts` file in the same directory.

**New Component/Module:**
- Implementation: `components/` for UI, `services/` for logic, `store/` for state.

**Utilities:**
- Shared helpers: `services/` or a new `utils/` directory.

## Special Directories

**.expo/:**
- Purpose: Internal Expo tool information.
- Generated: Yes
- Committed: No (mostly)

**.github/:**
- Purpose: CI/CD workflows and automation scripts.
- Generated: No
- Committed: Yes

---

*Structure analysis: 2026-05-26*
