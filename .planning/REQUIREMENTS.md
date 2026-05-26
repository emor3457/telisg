# Requirements: Field Observation Enhancements

## Functional Requirements (FR)

### 1. Multi-Photo Management
- **FR 1.1**: The system shall allow users to capture or select up to 5 photos per observation.
- **FR 1.2**: Users shall be able to remove or reorder photos before submitting the observation.
- **FR 1.3**: The system shall display a thumbnail gallery of captured photos within the observation form.

### 2. Image Annotation (Skia)
- **FR 2.1**: Users shall be able to open any captured photo in a full-screen annotation editor.
- **FR 2.2**: The editor shall provide tools for freehand drawing (pen), geometric shapes (circles/rectangles), and text labels.
- **FR 2.3**: The system shall support "undo/redo" functionality for annotations.
- **FR 2.4**: The system shall save the annotated image as a separate derived asset while preserving the original.

### 3. AI Hazard Analysis (Gemini)
- **FR 3.1**: The system shall send all photos (up to 5) to Google Gemini Pro Vision API for collective analysis.
- **FR 3.2**: The AI shall return a structured JSON response containing:
    - `hazard`: Descriptive text of the primary hazard.
    - `riskLevel`: One of `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`.
    - `controls`: A list of 3-5 recommended corrective actions.
    - `category`: The type of hazard (e.g., Working at Height, Electrical, Housekeeping).
- **FR 3.3**: The system shall allow users to override/edit the AI-generated findings.

### 4. Contextual Metadata
- **FR 4.1**: The system shall automatically capture GPS coordinates (latitude/longitude) and altitude for the observation.
- **FR 4.2**: The system shall record the precise timestamp of the observation capture.
- **FR 4.3**: The system shall allow users to tag observations with predefined metadata (Department, Activity, Equipment ID).

### 5. Offline & Background Sync
- **FR 5.1**: Observations shall be stored locally (Zustand + AsyncStorage/SQLite) immediately upon capture.
- **FR 5.2**: The system shall attempt to sync pending observations to Supabase in the background using Expo Task Manager.
- **FR 5.3**: Users shall be able to see the sync status (Pending, Syncing, Completed, Error) for each observation.

## Non-Functional Requirements (NFR)

### 1. Performance
- **NFR 1.1**: Image annotation canvas should maintain 60fps for a fluid drawing experience.
- **NFR 1.2**: AI analysis response time should not exceed 10 seconds under normal network conditions.
- **NFR 1.3**: App startup time should not be significantly impacted by the local storage size.

### 2. Reliability
- **NFR 2.1**: The system must handle network failures gracefully, retrying sync with exponential backoff.
- **NFR 2.2**: Local storage must be persistent across app updates and device restarts.

### 3. Usability
- **NFR 3.1**: Annotation tools must be large enough for finger-based interaction (minimum 44x44dp hit area).
- **NFR 3.2**: UI must follow the established "Material-inspired" Android design language of the app.

### 4. Security
- **NFR 4.1**: All images uploaded to Supabase Storage must be stored in authenticated buckets.
- **NFR 4.2**: API keys (Gemini) must be stored securely and not exposed in client-side code (use Edge Functions/Environment Variables).

## UI/UX Requirements
- **UX 1.1**: Transition from camera to annotation should be seamless (shared element transition if possible).
- **UX 1.2**: Provide clear progress indicators (Skeleton loaders) during AI analysis.
- **UX 1.3**: Use color-coded risk indicators (Green=Low, Yellow=Medium, Red=High, Dark Red=Critical) consistent with the app theme.

## AI Integration Specifics
- **Prompting**: The system prompt should instruct Gemini to act as an "ISO 45001 Certified Safety Professional" and return strictly valid JSON.
- **Mapping**: AI risk levels must map to the app's `slaService.ts` for automatic target date calculation.
- **Localization**: AI responses must be requested in Turkish (`tr-TR`) by default, or the language specified in user settings.

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| FR 1.1 | Phase 1 | Completed |
| FR 1.2 | Phase 1 | Completed |
| FR 1.3 | Phase 1 | Completed |
| FR 2.1 | Phase 2 | Pending |
| FR 2.2 | Phase 2 | Pending |
| FR 2.3 | Phase 2 | Pending |
| FR 2.4 | Phase 2 | Pending |
| FR 3.1 | Phase 3 | Pending |
| FR 3.2 | Phase 3 | Pending |
| FR 3.3 | Phase 3 | Pending |
| FR 4.1 | Phase 1 | Completed |
| FR 4.2 | Phase 1 | Completed |
| FR 4.3 | Phase 4 | Pending |
| FR 5.1 | Phase 1 | Completed |
| FR 5.2 | Phase 1 | Completed |
| FR 5.3 | Phase 1 | Completed |
| NFR 1.1 | Phase 2 | Pending |
| NFR 1.2 | Phase 3 | Pending |
| NFR 1.3 | Phase 1 | Completed |
| NFR 2.1 | Phase 1 | Completed |
| NFR 2.2 | Phase 1 | Completed |
| NFR 3.1 | Phase 2 | Pending |
| NFR 3.2 | (Cross-cutting) | N/A |
| NFR 4.1 | Phase 1 | Completed |
| NFR 4.2 | Phase 3 | Pending |
| UX 1.1 | Phase 2 | Pending |
| UX 1.2 | Phase 3 | Pending |
| UX 1.3 | Phase 3 | Pending |
