# SignBridge 3-Minute Video Demo Script & Storyboard
## Winning Competition & Hackathon Video Walkthrough Guide
**Project:** SignBridge — Bi-directional Indian Sign Language (ISL) <-> English & Hindi Platform  
**Target Duration:** Exactly 3 Minutes (180 Seconds)  
**Tone:** Confident, empathetic, technically grounded, articulate.

---

### Overview & Video Structure

| Timestamp | Segment Name | Visual Focus | Spoken Focus |
| :--- | :--- | :--- | :--- |
| **0:00 - 0:30** | The Hook & Demographic Reality | Title Card $\rightarrow$ Problem Stats Card | 18M Deaf citizens, 300 interpreters |
| **0:30 - 1:15** | Live ISL Translation Demo | Live Camera Studio with Skeleton HUD | Real-time ISL signs $\rightarrow$ Hindi & English speech |
| **1:15 - 1:50** | Speech-to-ISL Avatar Demo | Reverse Studio & Kinematic Avatar | Voice input $\rightarrow$ ISL SOV grammar $\rightarrow$ Avatar signing |
| **1:50 - 2:20** | Two-Way Bridge & Arena | Dialogue Studio $\rightarrow$ Practice Arena | ER hospital dialogue & AI posture coach |
| **2:20 - 2:45** | Emergency SOS QuickDeck | SOS Cards Deck | 1-tap life-saving voice broadcast |
| **2:45 - 3:00** | Tech Stack, Impact & Call to Action | Architecture Diagram & GitHub Link | Open source, sub-50ms latency, zero-install |

---

### Segment 1: The Hook & Demographic Reality (0:00 - 0:30)

* **Visual on Screen:**  
  Start on the SignBridge Dashboard or open `presentation.html` on Slide 1 & 2. Show the stat cards: `18,000,000+ Deaf Citizens` and `< 300 Certified Interpreters`.
* **Voiceover:**
  > *"Namaste everyone. In India today, over 18 million citizens belong to the Deaf and Hard-of-Hearing community. Yet across the entire nation, there are fewer than 300 certified sign language interpreters—a staggering ratio of one interpreter for every 60,000 deaf people.*  
  > *When a deaf person enters a hospital emergency room, a railway ticket counter, or a bank, communication breaks down almost completely.  
  > To solve this, we created **SignBridge**: an advanced, bi-directional platform that translates Indian Sign Language into spoken English and Hindi, and vice versa, in real time."*

---

### Segment 2: Live Camera ISL Translation Demo (0:30 - 1:15)

* **Visual on Screen:**  
  Switch to the **Live Translation Studio** (`#view-live`).
  - Click **Start Live Camera** (or show the simulated live feed).
  - Hold up hands and make gestures (or use the one-click simulator bar):
    1. Make **Namaste** (palms joined at chest) $\rightarrow$ Show bounding box `✓ HAND DETECTED` and subtitles update to *"NAMASTE (HELLO) / नमस्ते"*. The audio speaks aloud in Hindi.
    2. Make a **Fist** $\rightarrow$ Subtitle updates to *"YES / हाँ"*.
    3. Make a **Peace / V sign** $\rightarrow$ Subtitle updates to *"DOCTOR / डॉक्टर"*.
    4. Point **Index Finger** up $\rightarrow$ Subtitle updates to *"NO / नहीं"*.
    5. Remove hands from frame $\rightarrow$ Point out that the dashed box appears: `⚠ NO HAND DETECTED`, and it gracefully pauses without spamming false positives.
* **Voiceover:**
  > *"Let's see SignBridge in action. Here in our Live Translation Studio, our vision engine tracks 21 distinct skeletal landmarks per hand at up to 60 frames per second.*  
  > *Notice that unlike foreign tools that mistakenly use American Sign Language, SignBridge is built on authentic Indian Sign Language Research and Training Centre standards.*  
  > *When I perform the two-handed Namaste greeting, the system detects the Anjali Mudra posture, immediately renders bilingual English and Hindi Devanagari subtitles, and speaks the words aloud.*  
  > *When I switch to a fist, it recognizes 'Yes'; a V-sign indicates 'Doctor'; an index finger indicates 'No'. And when no hand is present, it pauses cleanly without false triggers."*

---

### Segment 3: Speech & Text to Kinematic ISL Avatar (1:15 - 1:50)

* **Visual on Screen:**  
  Click on the **Reverse Sign Studio** tab (`#view-reverse`).
  - Click on the preset: *"Where is the hospital?"* or speak into the microphone.
  - Highlight the **ISL Grammar & Gloss Parser** box showing:  
    `[ HOSPITAL ] [ WHERE ]`
  - Show the 2D/3D Kinematic Avatar smoothly signing the sequence with articulated arms, five distinct fingers, and raised eyebrows.
* **Voiceover:**
  > *"Now, let's reverse the bridge: how does a hearing person speak back to a deaf individual?*  
  > *A doctor can speak or type: 'Where is the hospital?'*  
  > *Crucially, our NLP engine does NOT do a naive word-by-word English translation. In Indian Sign Language, English SVO word order is incorrect. Our engine restructures the sentence into ISL Time-SOV syntax, drops copula verbs like 'is', and shifts the question marker 'Where' to the end.*  
  > *It then feeds this sequence to our kinematic avatar, which signs with realistic joint easing, articulated fingers, and non-manual facial cues like raised questioning eyebrows."*

---

### Segment 4: Two-Way Dialogue Bridge & Practice Arena (1:50 - 2:20)

* **Visual on Screen:**  
  1. Click **Two-Way Bridge** tab (`#view-dialogue`): Show the split-screen conversation stream between hearing user and deaf signer. Click the **Export Session Transcript** button to show the downloaded `.txt` file.
  2. Click **Practice Arena** tab (`#view-arena`): Show the target sign vs live pose accuracy meter (`94% Match`) and real-time coaching tips.
* **Voiceover:**
  > *"In our Two-Way Dialogue Bridge, hearing and deaf participants can converse naturally across hospital or public service counters, and export the entire consultation transcript with one click for medical or legal records.*  
  > *We also built an interactive Practice Arena—a gamified AI coach that scores live hand postures with real-time feedback, helping students and healthcare workers master ISL in minutes a day."*

---

### Segment 5: Emergency SOS QuickDeck (2:20 - 2:45)

* **Visual on Screen:**  
  Click **Emergency SOS** tab (`#view-sos`).
  - Tap the **Call Doctor** card $\rightarrow$ Hear loud audio: *"मुझे डॉक्टर की मदद चाहिए / Call a doctor"*.
  - Tap the **Severe Pain** card $\rightarrow$ Hear: *"मुझे बहुत तेज़ दर्द हो रहा है / I am in severe pain"*.
* **Voiceover:**
  > *"In critical moments, every second counts. Our Emergency SOS QuickDeck provides one-tap tactile cards for high-risk scenarios: chest pain, calling a doctor, police, or medicine. A single tap broadcasts loud bilingual voice audio and launches the emergency sign on screen for first responders."*

---

### Segment 6: Tech Stack, Impact & Closing (2:45 - 3:00)

* **Visual on Screen:**  
  Show the GitHub repository (`github.com/lakshya-gupta34/Sign_Bridge`) and the `README.md` test suite results (10/10 and 13/13 passing).
* **Voiceover:**
  > *"SignBridge runs with zero heavy installs at sub-50ms latency, with 100% client-side privacy. It is open-sourced under the MIT license.*  
  > *Language should unite humanity, not isolate it. With SignBridge, we are giving voice to silence and ensuring that every Indian citizen is heard. Thank you!"*

---

### Pro-Tips for Recording Your Video

1. **Audio Recording:** Use a standard headset or microphone. Speak in a steady, confident, energetic tone.
2. **Screen Recording Tool:**
   - You can use OBS Studio, Windows Game Bar (`Win + G`), or open [demo_video.html](file:///C:/Users/DELL/.gemini/antigravity/scratch/SignBridge/demo_video.html) and click **"Record & Export Video"** to generate the video file directly from the browser!
3. **Pacing:** Keep your mouse cursor steady, click cleanly on buttons, and allow 1 to 2 seconds for animations to play out.
