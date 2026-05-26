# Coding Conventions

**Analysis Date:** 2026-05-26

## Naming Patterns

**Files:**
- Components: PascalCase (e.g., `ActionCard.tsx`).
- Services/Stores: camelCase (e.g., `reportService.ts`, `observationStore.ts`).
- Layouts/Screens: kebab-case or special naming for Expo Router (e.g., `_layout.tsx`, `[id].tsx`).

**Functions:**
- Use camelCase for function names (e.g., `analyzeObservation`, `syncData`).
- Exported functions are often named as const arrow functions in services.

**Variables:**
- camelCase for local variables.
- UPPER_SNAKE_CASE for constants (though not widely used in the examined files).

**Types:**
- Interfaces and Types: PascalCase (e.g., `ObservationItem`, `SummaryReportFilters`).

## Code Style

**Formatting:**
- Presumed to follow standard Prettier/ESLint defaults (though no config files were found in root, `package.json` has a `lint` script that runs `tsc --noEmit`).

**Linting:**
- Uses TypeScript compiler for linting (`tsc --noEmit`).

## Import Organization

**Order:**
1. External libraries (React, Expo modules).
2. Internal stores/services.
3. Theme/Styles.

**Path Aliases:**
- Relative paths are used (e.g., `../../theme/colors`).

## Error Handling

**Patterns:**
- Try-catch blocks in services.
- `console.error` for logging errors.
- Alerts for user notification in UI components.
- Errors are re-thrown in services to be handled by the caller (UI).

## Logging

**Framework:** `console`

**Patterns:**
- Log completion of major background tasks (e.g., "Sync completed successfully").
- Log detailed error information in catch blocks.

## Comments

**When to Comment:**
- Use comments to separate sections in complex files (e.g., `reportService.ts`).
- Use comments to explain non-obvious logic or architectural choices (e.g., cascade delete in `observationStore.ts`).

**JSDoc/TSDoc:**
- Basic interface documentation is preferred over extensive JSDoc.

## Function Design

**Size:** Services contain multiple related functions, while components are relatively small and focused.

**Parameters:** Prefer object destructuring for functions with multiple parameters (e.g., `renderHeader` parameters).

**Return Values:** Services return Promises for async operations, often returning a boolean success indicator or the resulting data.

## Module Design

**Exports:**
- Mostly named exports for services.
- Default exports for screens and layouts (Expo Router convention).

**Barrel Files:**
- Not extensively used; direct imports from file paths are preferred.

---

*Convention analysis: 2026-05-26*
