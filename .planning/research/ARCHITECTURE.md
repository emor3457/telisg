# Architecture Patterns: Field Observations

**Domain:** EHS Image Processing & AI
**Researched:** May 2026

## Recommended Architecture

The system follows an "Async Processing" pattern to ensure field workers are not blocked by slow AI responses or poor network.

### Component Boundaries

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| **Capture Module** | Camera/Gallery picker, Metadata attachment (GPS/Time). | Image Store |
| **Asset Manager** | Resizing (Manipulator), Local Caching. | Supabase Storage |
| **Annotation Engine** | Skia-based drawing layer, saving 'Derived' images. | Image Store |
| **AI Analyst** | Gemini Vision API calls, Structured hazard extraction. | Supabase Edge Functions |
| **Sync Service** | Background queue management for uploads. | Supabase |

### Data Flow

1. **Capture**: User takes 3 photos. App captures `GPS` and `Timestamp` immediately.
2. **Process**: Images are compressed locally to < 1MB.
3. **Analyze**: Compressed images sent to Gemini for initial hazard identification.
4. **Annotate**: User overlays red circles on the original-size local preview.
5. **Save**: App saves two versions: `Original` (raw evidence) and `Annotated` (for reports).
6. **Sync**: Images uploaded in background; form data sent to Supabase.

## Patterns to Follow

### Pattern 1: Original vs. Derived Asset
Always keep the original photo untouched to satisfy ISO 45001 "Data Integrity" requirements.
```typescript
interface ObservationPhoto {
  id: string;
  originalUri: string;      // Untouched raw capture
  annotatedUri?: string;     // With Skia overlays
  metadata: {
    lat: number;
    lng: number;
    accuracy: number;
    timestamp: string;      // ISO 8601
    deviceId: string;
  }
}
```

### Pattern 2: Structured AI Prompting
Use a system persona to ensure consistent safety auditing.
```typescript
const EHS_SYSTEM_PROMPT = `
  You are a Senior EHS Auditor. Analyze the provided images for hazards.
  Return JSON: {
    hazards: Array<{type: string, severity: 'Low'|'Med'|'High', description: string}>,
    iso_clause: string,
    mitigation_strategy: string
  }
`;
```

## Anti-Patterns to Avoid

### Anti-Pattern: Blocking AI Calls
**Problem:** Waiting for AI analysis before letting the user save the observation.
**Consequence:** Users close the app in frustration if the network is slow.
**Instead:** Allow saving the observation immediately; run AI in the background and update the form via subscription/push.

## Scalability Considerations

| Concern | At 100 users | At 10K users | At 1M users |
|---------|--------------|--------------|-------------|
| **Image Storage** | Direct S3/Supabase | CDN + Image Optimization | Tiered storage (Archive old photos) |
| **AI Cost** | Flash 1.5 (Free/Low) | Pro 1.5 (Usage based) | Fine-tuned internal model |
| **Metadata Integrity** | Database fields | Blockchain/Signed Hashes | Legal-grade Digital Notary |

## Sources
- [Martin Fowler - Async Architecture Patterns](https://martinfowler.com/articles/async-communication.html)
- [ISO 45001:2018 Evidence Requirements](https://www.iso.org/standard/63787.html)
