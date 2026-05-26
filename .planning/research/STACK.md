# Technology Stack: Field Observation Enhancements

**Project:** Tel ISG Pro
**Researched:** May 2026
**Overall confidence:** HIGH

## Recommended Stack

### Image Processing & Storage
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| `expo-image-manipulator` | ~3.0.0 | Resizing & Compression | Critical for reducing multi-photo upload payloads without losing safety-critical detail. |
| `expo-file-system` | ~18.0.0 | Local Storage & Uploads | Robust file management and background upload support. |
| `expo-media-library` | ~16.0.0 | Gallery Access | Standard for accessing and saving photos to the device. |

### Image Annotation
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| `@shopify/react-native-skia` | Latest | Drawing Engine | High-performance (GPU-accelerated) drawing for circles, arrows, and text. Superior to SVG for complex annotations. |
| `react-native-gesture-handler` | ~2.20.0 | Interaction | Handles pinch-to-zoom and drawing gestures smoothly. |

### Contextual Metadata
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| `expo-location` | ~18.0.0 | Geotagging | Accurate GPS coordinates for ISO 45001 / OSHA audit traceability. |
| `expo-device` | ~7.0.0 | Hardware ID | Identifying the source device for the audit trail. |
| `OpenWeatherMap API` | - | Environmental Context | Fetching temperature/wind for high-risk work (e.g., crane ops). |

### AI Intelligence
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| `Gemini 1.5 Flash` | - | Real-time Analysis | Fast hazard detection and risk scoring during the walkthrough. |
| `Gemini 1.5 Pro` | - | Batch Audit | Deep reasoning across multiple images for complex site walkthroughs. |

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Annotation | Skia | marker.js (WebView) | Skia is native-performant and better integrated with Expo/React Native. |
| Metadata | Expo Location | Manual Entry | ISO 45001 requires "verifiable evidence"; automated GPS is harder to falsify. |
| Processing | Expo Manipulator | Backend resizing | Mobile-side resizing saves bandwidth and improves UX in low-signal areas. |

## Installation

```bash
# Core Processing
npx expo install expo-image-manipulator expo-file-system expo-location expo-media-library expo-device

# Annotation
npx expo install @shopify/react-native-skia react-native-gesture-handler
```

## Sources
- [Expo Documentation](https://docs.expo.dev/)
- [ISO 45001 Clause 7.5 (Documented Information)](https://www.iso.org/standard/63787.html)
- [Gemini Vision API Reference](https://ai.google.dev/gemini-api/docs/vision)
