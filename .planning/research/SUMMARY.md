# Research Summary: Field Observation Enhancements

**Domain:** EHS Mobile & AI
**Researched:** May 2026
**Overall confidence:** HIGH

## Executive Summary

The "Field Observation Enhancements" for Tel ISG Pro aim to transform the current single-photo observation flow into a robust, AI-powered multi-modal evidence system. Key research highlights the necessity of **Skia** for performant image annotation and **Gemini 1.5 Flash** for low-latency hazard detection. 

Critically, for ISO 45001 and OSHA compliance, the system must separate "Evidence Integrity" from "AI Utility." This means preserving raw, metadata-rich original photos while providing a high-utility "Derived" layer with AI tags and user annotations. The research also confirms that background upload queuing is a non-negotiable table stake for field workers in connectivity-challenged environments.

## Key Findings

**Stack:** Expo 54 + `@shopify/react-native-skia` for annotation + `Gemini 1.5 Flash` for vision.
**Architecture:** Async Processing with "Original vs. Derived" asset tracking.
**Critical pitfall:** Metadata stripping during compression/upload can invalidate safety evidence.

## Implications for Roadmap

Based on research, suggested phase structure:

1. **Phase A: High-Performance Multi-Capture** - Focus on the underlying plumbing.
   - Addresses: Multi-photo management, `expo-image-manipulator` integration, and background sync.
   - Avoids: Memory exhaustion pitfalls by implementing thumbnailing immediately.

2. **Phase B: AI-Driven Insights** - Integrating intelligence.
   - Addresses: Hazard auto-tagging, risk scoring, and structured JSON output from Gemini.
   - Avoids: "Hallucination" risks by implementing a "Human-in-the-loop" confirmation UI.

3. **Phase C: Interactive Annotation & Compliance** - Finalizing the UX.
   - Addresses: Skia drawing tools, contextual watermarking (GPS/Weather), and PDF report generation.
   - Avoids: Metadata loss by burn-in watermarking on derived copies.

**Phase ordering rationale:**
- Phase A provides the reliable storage foundation. Phase B adds value (AI) without requiring complex UI. Phase C adds the most complex UI elements (Annotation) on top of a stable data flow.

**Research flags for phases:**
- Phase A: Needs testing on low-end Android devices for image processing lag.
- Phase C: Skia drawing coordinate mapping needs deep research (scaling overlays correctly to raw image resolution).

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Expo-compatible libs are well-documented and current. |
| Features | HIGH | Based on standard OSHA/ISO requirements. |
| Architecture | MEDIUM | Supabase background sync needs specific implementation detail. |
| Pitfalls | HIGH | Common mobile/EHS pitfalls are well-documented. |

## Gaps to Address

- **Coordinate Mapping:** Exact math for mapping Skia screen-coordinates to full-resolution JPEG pixels needs prototyping.
- **Offline Weather:** Strategy for fetching weather if the user is offline during capture (suggests fetching periodically in background).
- **Video Support:** While not in current scope, the architecture should be ready for Gemini 1.5 Pro's video processing capabilities.
