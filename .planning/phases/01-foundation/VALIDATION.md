# Phase 1 Validation: Foundation (Multi-photo & Storage)

This document defines the verification steps to ensure Phase 1 requirements are fully met.

## Requirement Coverage

| Requirement | Description | Test Case | Status |
|-------------|-------------|-----------|--------|
| FR 1.1 | Up to 5 photos per observation | TC-1.1: Capture 6 photos, verify limit is enforced at 5. | Pending |
| FR 1.2 | Remove or reorder photos | TC-1.2: Capture 3 photos, reorder them, delete one, verify state. | Pending |
| FR 1.3 | Thumbnail gallery | TC-1.3: Verify thumbnails appear in the observation form. | Pending |
| FR 4.1 | GPS coordinates capture | TC-4.1: Take photo, check logs/store for lat/long/alt. | Pending |
| FR 4.2 | Timestamp record | TC-4.2: Verify observation timestamp is saved and accurate. | Pending |
| FR 5.1 | Local storage persistence | TC-5.1: Save observation, restart app, verify data remains. | Pending |
| FR 5.2 | Background sync (Supabase) | TC-5.2: Save observation, background app, verify Supabase upload. | Pending |
| FR 5.3 | Sync status visibility | TC-5.3: Verify 'Pending' -> 'Completed' status transitions in UI. | Pending |

## Automated Test Suites

- **Unit Tests**: `npm test`
    - `store/imageStore.test.ts`
    - `store/observationStore.test.ts`
    - `services/locationService.test.ts`
    - `services/syncService.test.ts`
- **Integration Tests**: Verify store persistence and background task registration.

## Manual Verification Steps (UAT)

### 1. Multi-photo Capture & Metadata
1. Open the camera.
2. Take 5 photos. Verify the 'done' button appears and no more photos can be taken.
3. Observe the location permission prompt; accept it.
4. Verify coordinates are logged/displayed.

### 2. Gallery Management
1. Navigate to the observation form.
2. Verify all 5 photos are displayed as thumbnails.
3. Drag the 3rd photo to the 1st position.
4. Delete the 5th photo.
5. Save the observation.

### 3. Background Sync
1. Turn off Wi-Fi/Data.
2. Create an observation.
3. Verify status is 'Pending'.
4. Turn on Wi-Fi/Data.
5. Move app to background.
6. Wait 1 minute.
7. Open app, verify status is 'Completed'.
8. Check Supabase Storage dashboard for the uploaded files.

## Success Sign-off

- [ ] All TC-* pass.
- [ ] Unit tests pass with >80% coverage on new files.
- [ ] Background sync works across app restarts and backgrounding.
