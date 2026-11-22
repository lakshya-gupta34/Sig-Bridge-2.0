# SignBridge Architecture & Technical Design Document

## 1. System Overview

**SignBridge** is a bidirectional, multimodal assistive platform that bridges the communication divide between the Deaf & Hard-of-Hearing (DHH) community and the hearing population in India. It performs real-time two-way translation:
1. **ISL &rarr; English &amp; हिन्दी (Hindi):** Captures live camera sign gestures via normalized 3D hand/arm landmarks, classifies topological feature vectors against calibrated ISLRTC templates, generates bilingual subtitles, and speaks translations aloud via neural Text-to-Speech (TTS).
2. **English &amp; हिन्दी &rarr; ISL:** Ingests spoken audio (Speech-to-Text) or typed text in English/Hindi, transforms SVO/SOV natural sentences into canonical Indian Sign Language (ISL) SOV grammar glosses, and renders realistic signing on an articulated 2D/3D kinematic avatar.

```
                      +------------------------------------+
                      |     SignBridge System Boundary     |
                      +------------------------------------+

   [ Deaf Signer ]                                         [ Hearing User ]
         |                                                        ^
   (Signs in ISL)                                           (Hears Speech /
         |                                                   Reads Subtitles)
         v                                                        |
+-------------------+                                    +-------------------+
| Live Camera Feed  |                                    | Bilingual Speech  |
| (640x480 @ 30fps) |                                    | Synthesis (TTS)   |
+-------------------+                                    +-------------------+
         |                                                        ^
         v                                                        |
+-------------------+      +-----------------------+     +-------------------+
| Landmark Tracking | ---> | Topology Vector Match | --> | Bilingual Natural |
| (21 Joints x 2)   |      | (Cosine + Centroids)  |     | Text Reconstruct  |
+-------------------+      +-----------------------+     +-------------------+
                                                                  |
============================== BI-DIRECTIONAL ====================|
                                                                  v
+-------------------+      +-----------------------+     +-------------------+
| Kinematic Avatar  | <--- | ISL SOV Grammar &     | <-- | Speech-to-Text    |
| Joint Animation   |      | Gloss Tokenizer       |     | / User Text Input |
+-------------------+      +-----------------------+     +-------------------+
         |                                                        ^
         v                                                        |
   (Views Sign Avatar)                                      (Speaks / Types)
         |                                                        |
   [ Deaf Signer ]                                         [ Hearing User ]
```

---

## 2. Computer Vision & Landmark Pipeline

### 2.1 Landmark Coordinate Invariance
Raw MediaPipe landmarks output normalized viewport coordinates $(x, y, z) \in [0, 1]$. To achieve scale and translation invariance:
1. **Translation Invariance:** The wrist coordinate $(x_0, y_0, z_0)$ serves as the local origin $(0, 0, 0)$. All subsequent hand joints $j \in \{1, \dots, 20\}$ are shifted relative to the wrist:
   $$\vec{P}'_j = \vec{P}_j - \vec{P}_0$$
2. **Scale Invariance:** The vector length from the wrist to the middle finger metacarpophalangeal (MCP) joint ($j=9$) defines the palm span $S$:
   $$S = \|\vec{P}_9 - \vec{P}_0\|_2$$
   Normalized landmarks are scaled by $S$:
   $$\hat{\vec{P}}_j = \frac{\vec{P}'_j}{S}$$

### 2.2 Temporal Debouncing Filter
To eliminate spurious hand tremor and frame misclassification, predictions are routed through a 5-frame sliding window buffer. A sign label is emitted if and only if:
$$\text{frequency}(sign) \ge 3 \quad \text{and} \quad \text{confidence} \ge 60\%$$

---

## 3. Natural Language Processing (NLP) ISL Grammar Engine

Indian Sign Language has distinct linguistic rules recognized by the **Indian Sign Language Research and Training Centre (ISLRTC)**:

### 3.1 Sentence Ordering
- **English:** Subject - Verb - Object (SVO), e.g., *"Tomorrow I will visit the hospital."*
- **Hindi:** Subject - Object - Verb (SOV), e.g., *"कल मैं अस्पताल जाऊंगा।"*
- **ISL:** Time - Topic/Subject - Object - Verb - Negation - Question (SOV-Q)
  $$\text{ISL Sequence: } [\text{TOMORROW}] \ [\text{ME}] \ [\text{HOSPITAL}] \ [\text{VISIT}]$$

### 3.2 Grammatical Transformations
1. **Time-First Anchor:** Temporal adverbs (*today*, *tomorrow*, *yesterday*, *now*) are extracted and prepended to the head of the sequence to establish the temporal frame of reference.
2. **Copula Verb Elimination:** Auxiliary copula verbs (*is*, *am*, *are*, *was*, *were*, *है*, *हूँ*, *था*) are eliminated as ISL expresses existence through context and spatial indexing.
3. **WH-Movement:** Question words (*where*, *what*, *when*, *why*, *how*, *who*, *कहाँ*, *क्या*, *कब*) migrate to the terminus of the sequence, synchronizing with non-manual facial markers (furrowed brows).
4. **Negation Post-Position:** Negative particles (*no*, *not*, *nahi*, *नहीं*) follow the verb rather than preceding it.

---

## 4. Kinematic Avatar Renderer

The visual avatar is rendered using HTML5 2D Canvas with anatomical vector kinematics:
- **Articulated Skeletal Rig:** Left and right shoulders, elbows, wrists, and 5 articulated finger rays (Thumb, Index, Middle, Ring, Pinky).
- **Inverse Kinematics (IK):** Elbow positions are geometrically resolved from shoulder-to-wrist vectors to maintain natural human arm curvature.
- **Interpolation:** Keyframe joint transformations utilize cubic Bézier easing ($C(t) = 4t^3$ for $t < 0.5$):
  $$p(t) = p_{prev} + (p_{target} - p_{prev}) \cdot C(t)$$
- **Non-Manual Markers (NMM):** Eyebrow elevation ($+5\text{px}$) and head tilt are dynamically modulated when question signs are detected.

---

## 5. Security & Accessibility Standards
- **Zero-Dependency Core:** The client-side dashboard executes fully offline with zero mandatory external build steps.
- **W3C WCAG 2.1 AAA:** Supports high-contrast mode for deaf individuals with concurrent low vision.
- **Privacy First:** Video streams are processed entirely client-side; no video bytes leave the user's browser unless the developer explicitly connects the optional WebSocket backend.
