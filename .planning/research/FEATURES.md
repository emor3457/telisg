# Feature Landscape: Field Observation Enhancements

**Domain:** EHS Field Observations
**Researched:** May 2026

## Table Stakes

Features users expect in any industrial-grade field observation tool.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Multi-Photo Selection** | Sites often require wide-angle + close-up shots of a single hazard. | Low | Use `expo-image-picker` with `allowsMultipleSelection`. |
| **Offline Image Staging** | Internet is often unavailable in basements or remote sites. | Medium | Use `expo-file-system` to queue local paths before upload. |
| **High-Res Zoom** | Detail is critical for checking expiration dates on tags or hairline cracks. | Low | Standard React Native `Image` with pinch-to-zoom. |
| **Geotagging & Timestamp** | Legal and audit requirement for ISO/OSHA compliance. | Low | Auto-captured at moment of 'Save'. |

## Differentiators

Features that set Tel ISG Pro apart as an "AI-First" safety tool.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **AI Hazard Auto-Analysis** | Instantly suggests hazard type (e.g., LOTO, PPE) from photos. | High | Uses Gemini 1.5 Flash Vision. |
| **Contextual Watermarking** | Burns GPS/Time/User/Weather directly into the photo copy. | Medium | Use `react-native-image-marker`. |
| **Sketch & Callout** | Allows drawing red circles and adding text pointers on images. | Medium | Powered by `@shopify/react-native-skia`. |
| **Energy Wheel Audit** | Prompting AI to look for specific energy types (Gravity, Pressure). | High | Structured prompting for Gemini Pro. |
| **Voice-to-Caption** | Allows the observer to dictate observations while hands are full. | Medium | `expo-speech` or AI transcription. |

## Anti-Features

Features to explicitly NOT build to maintain industrial focus.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| **Beautification Filters** | Obscures evidence; unprofessional for safety audits. | No filters; keep raw pixel data. |
| **Direct Social Sharing** | Privacy and trade secret risks. | Internal enterprise sharing/PDF reports only. |
| **Non-Traceable Deletion** | Auditors need to know if evidence was removed. | "Soft delete" with audit log. |

## Feature Dependencies

```
Photo Capture → Local Staging → AI Analysis → Annotation → Final Submission
(All steps require Metadata Capture at Start)
```

## MVP Recommendation

Prioritize:
1. **Multi-photo capture & local staging** (Solves the "no signal" problem).
2. **Basic Annotation** (Red circle/Arrow) to highlight exact hazards.
3. **AI Hazard Suggestion** (Flash-based) for faster form filling.

Defer: **Energy Wheel Analysis** and **Voice-to-Caption** for Phase 2.

## Sources
- [OSHA Construction Inspection Standards](https://www.osha.gov/construction/inspections)
- [SafetyCulture (iAuditor) Feature Analysis](https://safetyculture.com/)
- [Gemini Vision Best Practices](https://ai.google.dev/gemini-api/docs/vision)
