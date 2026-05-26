# Technology Stack

**Analysis Date:** 2026-05-26

## Languages

**Primary:**
- TypeScript 5.9 - Used throughout the entire application for type safety and modern JavaScript features.

**Secondary:**
- HTML/CSS (Inline/Strings) - Used for PDF report generation in `services/reportService.ts`.

## Runtime

**Environment:**
- Node.js (Development)
- Expo SDK 54 - Provides the underlying platform and hardware access (Camera, FileSystem, etc.).
- React Native 0.81.5 - The core mobile framework.

**Package Manager:**
- npm
- Lockfile: `package-lock.json` present.

## Frameworks

**Core:**
- React 19.1.0 - UI component library.
- Expo Router 6.0.23 - File-based routing for navigation.

**Testing:**
- Jest 29.7.0 - Test runner (configured in `jest.config.js`).
- jest-expo - Expo-specific Jest presets.

**Build/Dev:**
- Babel - Configured in `babel.config.js` with `react-native-reanimated/plugin`.
- EAS (Expo Application Services) - Used for builds as seen in `eas.json` and `package.json` scripts.

## Key Dependencies

**Critical:**
- `zustand` 5.0.13 - State management.
- `@supabase/supabase-js` 2.105.4 - Backend integration for auth and database.
- `@google/generative-ai` 0.24.1 - Integration with Gemini 2.5 Flash for AI analysis.
- `react-native-reanimated` 4.1.1 - Smooth UI animations.

**Infrastructure:**
- `expo-camera` - QR and photo capture.
- `expo-file-system` - Local file management.
- `expo-print` & `expo-sharing` - PDF generation and export.
- `@react-native-async-storage/async-storage` - Persistent local storage for Zustand.

## Configuration

**Environment:**
- Configured via `.env` and `.env.example`.
- Key configs: `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`, `EXPO_PUBLIC_GEMINI_API_KEY`.

**Build:**
- `app.json`: Expo configuration, plugins (expo-router, expo-camera), and project metadata.
- `tsconfig.json`: TypeScript compiler settings.

## Platform Requirements

**Development:**
- Android Studio / Xcode (depending on target).
- Expo Go or Development Builds.

**Production:**
- Android (APK/AAB) via EAS.
- iOS support (configured in `app.json`).

---

*Stack analysis: 2026-05-26*
