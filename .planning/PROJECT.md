# Project: Field Observation Enhancements

## Vision
To transform the EHS mobile application into a world-class field observation tool by enabling safety officers to capture high-fidelity, multi-photo evidence, perform precision image annotations, and leverage state-of-the-art AI for hazard identification and risk assessment. The goal is to maximize the accuracy of safety reports while minimizing the manual data entry effort required from the field.

## Stakeholders
- **Safety Officers**: Primary users who capture observations in the field. They require a fast, reliable, and "glove-friendly" interface.
- **EHS Managers**: Supervisors who review observations and track corrective actions. They rely on the quality and clarity of the evidence (annotated photos).
- **Development Team**: Responsible for implementing React Native Skia for annotations, Gemini AI for analysis, and robust background sync.
- **IT / System Administrators**: Responsible for managing Supabase infrastructure, storage quotas, and API limits (Gemini).

## Success Criteria
1. **Evidence Quality**: 100% of observations support multiple images, allowing for "context" and "detail" shots.
2. **Clarity**: Safety officers can successfully use the annotation tool to highlight hazards in at least 80% of captured photos.
3. **AI Accuracy**: The Gemini-integrated hazard analysis provides relevant hazard descriptions and risk levels that match expert assessment in >85% of cases.
4. **Data Integrity**: Zero data loss for observations captured in "offline" or "low-connectivity" environments (e.g., mines, basements).
5. **Efficiency**: Average time to record a complete observation with multiple photos and AI analysis is under 60 seconds.

## Scope
### In-Scope
- Multi-photo gallery and capture interface.
- React Native Skia-based image annotation (freehand drawing, shapes, text).
- Google Gemini Pro Vision integration for multi-image hazard analysis.
- Background synchronization using Expo Task Manager and Fetch API.
- Local-first storage strategy using Zustand and persistent storage.
- Storage of original and derived (annotated) assets.

### Out-of-Scope
- Video capture and analysis.
- Real-time streaming AR hazard detection.
- Integration with 3rd party ERP systems (deferred to later phase).
- Desktop web-based annotation (mobile-first focus).
