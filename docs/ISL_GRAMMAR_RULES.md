# Linguistic Guide: Indian Sign Language (ISL) Grammar Rules

Indian Sign Language (ISL) is a natural, rich, visual-gestural language with its own comprehensive morphology, phonology, and syntax. It is **not** a signed version of spoken English or Hindi, nor is it identical to American Sign Language (ASL) or British Sign Language (BSL).

This guide documents the linguistic rules implemented within **SignBridge**, in adherence with **ISLRTC (Indian Sign Language Research and Training Centre)** standards.

---

## 1. Syntax & Sentence Structure: Time-SOV

While spoken English follows a **Subject-Verb-Object (SVO)** topology:
> *English (SVO):* "The doctor examined the patient today."

And spoken Hindi follows a **Subject-Object-Verb (SOV)** topology:
> *Hindi (SOV):* "डॉक्टर ने आज मरीज़ की जांच की।"

Indian Sign Language structures utterances with **Time Anchoring First**, followed by **Topic/Subject**, **Object**, and **Verb**:
> *ISL (Time-SOV):* `[TODAY] [DOCTOR] [PATIENT] [EXAMINE]`

### The Time-First Rule
In ISL, there are no inflectional verb tenses (e.g., *-ed*, *-ing*, *गा/गे/गी*). Instead, the temporal frame is established at the very beginning of the sentence:
- English: *"I will go to the station tomorrow."*
- ISL Gloss: `[TOMORROW] [ME] [STATION] [GO]`

---

## 2. Elimination of Copula Verbs & Prepositions

Spoken languages use auxiliary copula verbs to link subjects and predicates (*is*, *am*, *are*, *was*, *were*, *है*, *हूँ*, *था*). ISL does **not** employ copulas:
- English: *"Where is the hospital?"*
- Spoken Hindi: *"अस्पताल कहाँ है?"*
- ISL: `[HOSPITAL] [WHERE]`

Prepositions (*in*, *at*, *on*, *to*, *का*, *की*, *में*, *पर*) are generally omitted or embedded directly into the spatial direction of the verb movement (directional verbs).

---

## 3. WH-Question Movement to Terminus

In English, interrogative WH-words (*Where*, *What*, *When*, *Why*, *How*) typically appear at the sentence head:
> *"Where are you going?"*

In ISL, the question sign is shifted to the **end of the sentence**, accompanied by mandatory **Non-Manual Markers (NMMs)**:
> ISL: `[YOU] [GO] [WHERE]`

Non-manual markers for WH-questions include:
1. Furrowed eyebrows
2. Slight forward tilt of head
3. Direct eye contact maintained with the conversational partner

---

## 4. Two-Handed Fingerspelling vs. One-Handed Systems

A critical distinction between ISL and American Sign Language (ASL):
- **ASL** uses a predominantly **single-handed** fingerspelling alphabet.
- **ISL** uses a **two-handed** fingerspelling system (historically related to British Sign Language).
  - **Letter A:** Non-dominant hand open; dominant index touches the tip of the non-dominant thumb.
  - **Letter B:** Both hands form circles with thumb and index fingers, touching at fingertips like eyeglasses.
  - **Letter D:** Non-dominant index vertical; dominant hand forms a curved loop touching the vertical index.

SignBridge's Avatar and Classifier specifically account for this two-handed topology.

---

## 5. Regional Dialect Variations

India's rich cultural diversity manifests in subtle regional variations in ISL:
| Concept | Northern ISL (Delhi, Punjab, UP) | Southern ISL (Tamil Nadu, Karnataka, Kerala) |
| :--- | :--- | :--- |
| **Thank You** | Flat hand from chin moving forward with head nod | Two open hands sweeping upward and forward |
| **Water** | Tilting cupped hand to lips, or tapping 'W' to chin | Thumb near lips tilting backwards |
| **Tea / Chai** | Saucer and cup dipping motion | Stirring imaginary spoon in cup |

SignBridge notes these dialectal nuances in the ISL Corpus Explorer.
