# Project Roadmap: Field Observation Enhancements

## Phases

- [x] **Phase 1: Foundation (Multi-photo & Storage)** - Core multi-photo capture flow, persistent local storage, and background synchronization plumbing.
- [ ] **Phase 2: Annotation (Skia)** - Professional image annotation tools using React Native Skia for highlighting hazards and adding context.
- [ ] **Phase 3: Intelligence (Gemini AI)** - Integration with Gemini Pro Vision for automated hazard detection, risk scoring, and localized analysis.
- [ ] **Phase 4: Context & Reporting** - Enrichment with departmental metadata, watermarked exports, and integration with the primary observation feed.

---

## Phase Details

### Phase 1: Foundation (Multi-photo & Storage)
**Goal**: Users can reliably capture multiple photos and have them saved locally and synced in the background.
**Depends on**: Existing project scaffold
**Requirements**: FR 1.1, FR 1.2, FR 1.3, FR 4.1, FR 4.2, FR 5.1, FR 5.2, FR 5.3, NFR 1.3, NFR 2.1, NFR 2.2, NFR 4.1
**Success Criteria** (what must be TRUE):
  1. User can capture or select up to 5 photos for a single observation.
  2. User can view and manage a thumbnail gallery (reorder/delete) within the observation form.
  3. Observation data and photos are persisted locally immediately upon capture and survive app restarts.
  4. Photos are uploaded to Supabase Storage buckets using background tasks with exponential backoff retry.
**Plans**: 3 plans
- [x] 01-01-PLAN.md — Refactor data layer for multi-photo and local persistence.
- [x] 01-02-PLAN.md — Enhance camera flow and build multi-photo gallery UI.
- [x] 01-03-PLAN.md — Implement background sync infrastructure with Supabase.
**UI hint**: yes

### Phase 2: Annotation (Skia)
**Goal**: Users can visually highlight hazards on captured photos using a professional drawing toolset.
**Depends on**: Phase 1
**Requirements**: FR 2.1, FR 2.2, FR 2.3, FR 2.4, NFR 1.1, NFR 3.1, UX 1.1
**Success Criteria** (what must be TRUE):
  1. User can launch a full-screen annotation editor from any photo thumbnail with smooth transitions.
  2. User can utilize pen, circle, rectangle, and text tools to mark hazards on the photo.
  3. User can undo and redo annotation actions during the editing session.
  4. System generates and saves a "Derived" annotated JPEG while keeping the "Original" intact.
**Plans**: TBD
**UI hint**: yes

### Phase 3: Intelligence (Gemini AI)
**Goal**: Users receive instant, high-quality hazard analysis and risk scoring for their observations.
**Depends on**: Phase 1
**Requirements**: FR 3.1, FR 3.2, FR 3.3, NFR 1.2, NFR 4.2, UX 1.2, UX 1.3
**Success Criteria** (what must be TRUE):
  1. System automatically triggers Gemini Pro Vision analysis after multi-photo capture completes.
  2. User sees a structured hazard description, category, and risk level in the UI (localized to Turkish).
  3. Risk levels are visually indicated using theme-consistent color coding (Green to Dark Red).
  4. User can verify and modify the AI findings before final submission.
**Plans**: TBD
**UI hint**: yes

### Phase 4: Context & Reporting
**Goal**: Observations are enriched with environmental context and can be exported as professional reports.
**Depends on**: Phase 2, Phase 3
**Requirements**: FR 4.3
**Success Criteria** (what must be TRUE):
  1. User can tag observations with Department, Activity, and Equipment ID metadata.
  2. Exported views/reports include GPS coordinates and "burned-in" watermarks on annotated images.
  3. The main observation feed displays multi-photo indicators and high-level AI risk summaries.
**Plans**: TBD
**UI hint**: yes

---

## Progress Table

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 3/3 | Done | 2026-05-26 |
| 2. Annotation | 0/0 | Not started | - |
| 3. Intelligence | 0/0 | Not started | - |
| 4. Context & Reporting | 0/0 | Not started | - |
