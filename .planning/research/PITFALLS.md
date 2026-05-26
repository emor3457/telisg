# Domain Pitfalls: Field Observations & AI

**Domain:** EHS Field Observations
**Researched:** May 2026

## Critical Pitfalls

### Pitfall 1: Metadata Stripping
**What goes wrong:** Mobile platforms (iOS/Android) or image compression libraries often strip EXIF data (GPS/Time) by default to preserve privacy or save space.
**Consequences:** Loss of legal defensibility. The photo becomes "unverifiable" for ISO 45001 audits.
**Prevention:** Explicitly extract metadata using `expo-location` at the *moment* of capture and store it as a separate database record, rather than relying on the file's EXIF.

### Pitfall 2: Memory Exhaustion (OOM)
**What goes wrong:** Loading multiple 12MP high-res photos into a scrollable list or a Skia canvas simultaneously.
**Why it happens:** React Native's bridge can be overwhelmed by large binary data transfers.
**Prevention:** Always use thumbnails for list views. Only load the high-res version when the user enters the Annotation or Detail screen. Use `expo-image-manipulator` to generate a 200px thumbnail immediately after capture.

### Pitfall 3: AI Hallucinations in Safety Contexts
**What goes wrong:** AI identifies a "hazard" that isn't there, or worse, fails to see a life-threatening one (e.g., a frayed wire).
**Consequences:** Loss of user trust or false sense of security.
**Prevention:** Always present AI findings as "Suggestions." Use a "Human-in-the-loop" UI where the user must confirm or correct AI-generated tags.

## Moderate Pitfalls

### Pitfall 4: Background Upload Failure
**What goes wrong:** The app is closed or the phone enters sleep mode while a large multi-photo observation is uploading.
**Prevention:** Use `expo-task-manager` for background uploads and implement a "Sync Status" indicator on the dashboard to show pending uploads.

### Pitfall 5: Poor Lighting / Low-Quality AI Input
**What goes wrong:** Photos taken in dark tunnels or rainy conditions are unreadable for Gemini.
**Prevention:** Use the device's flashlight via `expo-camera` API. Implement a client-side "Image Quality" check (e.g., check for blur or brightness) before allowing the user to submit.

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| **Multi-Photo** | UI Lag in Gallery | Use `FlashList` (Shopify) instead of `FlatList` for better performance. |
| **Annotation** | Drawing Offset | Ensure Skia coordinate system is correctly mapped to the image resolution (Scale-to-fit issues). |
| **AI Analysis** | Token Cost | Use Gemini 1.5 Flash for primary analysis; reserve Pro for complex cases. |

## Sources
- [React Native Performance Documentation](https://reactnative.dev/docs/performance)
- [OSHA Evidence Collection Guidelines](https://www.osha.gov/enforcement/directives/cpl-02-00-164)
- [EHS Today: The Risks of AI in Safety](https://www.ehstoday.com/safety-technology)
