/**
 * SignBridge - Indian Sign Language (ISL) Corpus & Lexicon
 * Aligned with ISLRTC (Indian Sign Language Research & Training Centre) Standards
 * 
 * Each sign contains:
 * - id: unique slug
 * - english: canonical English meaning
 * - hindi: canonical Devanagari Hindi translation
 * - transliteration: Hinglish phonetics
 * - category: 'greetings' | 'essentials' | 'medical' | 'places' | 'questions' | 'alphabet' | 'numbers'
 * - handUsage: 'two-handed' | 'one-handed'
 * - description: Detailed anatomical movement guide
 * - regionalVariation: Dialect notes (Northern vs Southern Indian ISL variants)
 * - landmarkTarget: Normalized hand landmark target vector for recognition & avatar kinematic rigging
 */

const ISL_CORPUS = [
  // --- GREETINGS ---
  {
    id: "namaste",
    english: "Namaste / Hello",
    hindi: "नमस्ते",
    transliteration: "Namaste",
    category: "greetings",
    handUsage: "two-handed",
    description: "Both palms pressed flat together at center of chest (Anjali Mudra), slight forward bow of head.",
    regionalVariation: "Universal across all Indian ISL dialects. Common formal greeting.",
    motionTrajectory: "static_hold",
    landmarkTarget: {
      leftHand: { wrist: { x: 0.44, y: 0.65 }, index: { x: 0.47, y: 0.45 }, middle: { x: 0.48, y: 0.43 }, thumb: { x: 0.42, y: 0.52 }, ring: { x: 0.49, y: 0.46 }, pinky: { x: 0.50, y: 0.49 } },
      rightHand: { wrist: { x: 0.56, y: 0.65 }, index: { x: 0.53, y: 0.45 }, middle: { x: 0.52, y: 0.43 }, thumb: { x: 0.58, y: 0.52 }, ring: { x: 0.51, y: 0.46 }, pinky: { x: 0.50, y: 0.49 } }
    }
  },
  {
    id: "dhanyavaad",
    english: "Thank You",
    hindi: "धन्यवाद",
    transliteration: "Dhanyavaad",
    category: "greetings",
    handUsage: "one-handed",
    description: "Dominant flat hand with fingertips gently touching chin, moving forward and slightly downward with a nod.",
    regionalVariation: "In some Southern centers, a two-handed open gesture with palms upward is also recognized.",
    motionTrajectory: "chin_to_front",
    landmarkTarget: {
      leftHand: null,
      rightHand: { wrist: { x: 0.58, y: 0.50 }, index: { x: 0.56, y: 0.35 }, middle: { x: 0.55, y: 0.33 }, thumb: { x: 0.62, y: 0.40 }, ring: { x: 0.54, y: 0.36 }, pinky: { x: 0.53, y: 0.40 } }
    }
  },
  {
    id: "welcome",
    english: "Welcome / You are welcome",
    hindi: "स्वागत है",
    transliteration: "Swagat",
    category: "greetings",
    handUsage: "two-handed",
    description: "Both open hands facing upward, sweeping inward toward the chest in an inviting motion.",
    regionalVariation: "Standard across North & Central India.",
    motionTrajectory: "sweep_inward",
    landmarkTarget: {
      leftHand: { wrist: { x: 0.35, y: 0.62 }, index: { x: 0.38, y: 0.48 }, middle: { x: 0.40, y: 0.47 }, thumb: { x: 0.32, y: 0.55 }, ring: { x: 0.42, y: 0.50 }, pinky: { x: 0.44, y: 0.54 } },
      rightHand: { wrist: { x: 0.65, y: 0.62 }, index: { x: 0.62, y: 0.48 }, middle: { x: 0.60, y: 0.47 }, thumb: { x: 0.68, y: 0.55 }, ring: { x: 0.58, y: 0.50 }, pinky: { x: 0.56, y: 0.54 } }
    }
  },
  {
    id: "kripya",
    english: "Please",
    hindi: "कृपया",
    transliteration: "Kripya",
    category: "greetings",
    handUsage: "one-handed",
    description: "Dominant flat palm circling gently on the center of the chest in a clockwise direction.",
    regionalVariation: "Some signers touch fingers together near mouth and extend outwards.",
    motionTrajectory: "chest_circle",
    landmarkTarget: {
      leftHand: null,
      rightHand: { wrist: { x: 0.52, y: 0.58 }, index: { x: 0.50, y: 0.44 }, middle: { x: 0.48, y: 0.43 }, thumb: { x: 0.55, y: 0.50 }, ring: { x: 0.47, y: 0.46 }, pinky: { x: 0.46, y: 0.50 } }
    }
  },

  // --- ESSENTIALS & NEEDS ---
  {
    id: "help",
    english: "Help / Need Assistance",
    hindi: "मदद",
    transliteration: "Madad",
    category: "essentials",
    handUsage: "two-handed",
    description: "Non-dominant flat palm acts as a base; dominant closed fist with thumb up rests on base and pushes upward together.",
    regionalVariation: "Standard universal emergency sign in ISL.",
    motionTrajectory: "elevate_upward",
    landmarkTarget: {
      leftHand: { wrist: { x: 0.42, y: 0.68 }, index: { x: 0.48, y: 0.60 }, middle: { x: 0.49, y: 0.59 }, thumb: { x: 0.40, y: 0.62 }, ring: { x: 0.50, y: 0.61 }, pinky: { x: 0.51, y: 0.63 } },
      rightHand: { wrist: { x: 0.54, y: 0.62 }, index: { x: 0.52, y: 0.54 }, middle: { x: 0.51, y: 0.55 }, thumb: { x: 0.53, y: 0.46 }, ring: { x: 0.50, y: 0.57 }, pinky: { x: 0.49, y: 0.59 } }
    }
  },
  {
    id: "water",
    english: "Water",
    hindi: "पानी",
    transliteration: "Paani",
    category: "essentials",
    handUsage: "one-handed",
    description: "Dominant hand forms a cupped 'C' or pinched shape, tilted near the mouth imitating holding a glass.",
    regionalVariation: "In Delhi ISL, three extended fingers ('W') tapping chin is also seen in English medium schools.",
    motionTrajectory: "tilt_to_mouth",
    landmarkTarget: {
      leftHand: null,
      rightHand: { wrist: { x: 0.60, y: 0.52 }, index: { x: 0.53, y: 0.38 }, middle: { x: 0.52, y: 0.40 }, thumb: { x: 0.56, y: 0.42 }, ring: { x: 0.53, y: 0.44 }, pinky: { x: 0.55, y: 0.47 } }
    }
  },
  {
    id: "food",
    english: "Food / Eat",
    hindi: "खाना",
    transliteration: "Khana",
    category: "essentials",
    handUsage: "one-handed",
    description: "Fingertips gathered together (flat O handshape) tapping lips twice.",
    regionalVariation: "Universal Indian cultural gesture for eating / bhojan.",
    motionTrajectory: "tap_lips_twice",
    landmarkTarget: {
      leftHand: null,
      rightHand: { wrist: { x: 0.54, y: 0.52 }, index: { x: 0.51, y: 0.38 }, middle: { x: 0.50, y: 0.38 }, thumb: { x: 0.52, y: 0.40 }, ring: { x: 0.49, y: 0.39 }, pinky: { x: 0.48, y: 0.41 } }
    }
  },
  {
    id: "tea",
    english: "Tea / Chai",
    hindi: "चाय",
    transliteration: "Chai",
    category: "essentials",
    handUsage: "two-handed",
    description: "Non-dominant flat palm forms saucer; dominant thumb and index form tiny cup and dip into saucer.",
    regionalVariation: "Very characteristic authentic Indian cultural sign.",
    motionTrajectory: "cup_dip",
    landmarkTarget: {
      leftHand: { wrist: { x: 0.40, y: 0.65 }, index: { x: 0.48, y: 0.62 }, middle: { x: 0.49, y: 0.62 }, thumb: { x: 0.38, y: 0.60 }, ring: { x: 0.50, y: 0.63 }, pinky: { x: 0.51, y: 0.64 } },
      rightHand: { wrist: { x: 0.55, y: 0.58 }, index: { x: 0.48, y: 0.52 }, middle: { x: 0.50, y: 0.55 }, thumb: { x: 0.46, y: 0.53 }, ring: { x: 0.52, y: 0.58 }, pinky: { x: 0.54, y: 0.60 } }
    }
  },
  {
    id: "yes",
    english: "Yes",
    hindi: "हाँ",
    transliteration: "Haan",
    category: "essentials",
    handUsage: "one-handed",
    description: "Closed fist nodding up and down from the wrist, mirroring a head nod.",
    regionalVariation: "Universal across ISL.",
    motionTrajectory: "fist_nod",
    landmarkTarget: {
      leftHand: null,
      rightHand: { wrist: { x: 0.58, y: 0.56 }, index: { x: 0.56, y: 0.46 }, middle: { x: 0.55, y: 0.47 }, thumb: { x: 0.58, y: 0.45 }, ring: { x: 0.54, y: 0.48 }, pinky: { x: 0.53, y: 0.49 } }
    }
  },
  {
    id: "no",
    english: "No",
    hindi: "नहीं",
    transliteration: "Nahi",
    category: "essentials",
    handUsage: "one-handed",
    description: "Index finger extended vertically, waving side to side horizontally with slight head shake.",
    regionalVariation: "Universal ISL negation.",
    motionTrajectory: "finger_wave_horizontal",
    landmarkTarget: {
      leftHand: null,
      rightHand: { wrist: { x: 0.58, y: 0.58 }, index: { x: 0.56, y: 0.35 }, middle: { x: 0.55, y: 0.50 }, thumb: { x: 0.59, y: 0.48 }, ring: { x: 0.54, y: 0.52 }, pinky: { x: 0.53, y: 0.54 } }
    }
  },

  // --- MEDICAL & EMERGENCY ---
  {
    id: "doctor",
    english: "Doctor",
    hindi: "डॉक्टर",
    transliteration: "Doctor",
    category: "medical",
    handUsage: "two-handed",
    description: "Non-dominant wrist turned palm up; dominant index and middle fingertips tap the wrist pulse twice.",
    regionalVariation: "Emulates pulse checking (Nadi Parikshan) - standard in Indian medical settings.",
    motionTrajectory: "tap_pulse_twice",
    landmarkTarget: {
      leftHand: { wrist: { x: 0.40, y: 0.62 }, index: { x: 0.45, y: 0.52 }, middle: { x: 0.46, y: 0.51 }, thumb: { x: 0.38, y: 0.55 }, ring: { x: 0.47, y: 0.53 }, pinky: { x: 0.48, y: 0.56 } },
      rightHand: { wrist: { x: 0.48, y: 0.50 }, index: { x: 0.42, y: 0.59 }, middle: { x: 0.43, y: 0.59 }, thumb: { x: 0.50, y: 0.52 }, ring: { x: 0.45, y: 0.51 }, pinky: { x: 0.46, y: 0.52 } }
    }
  },
  {
    id: "hospital",
    english: "Hospital",
    hindi: "अस्पताल",
    transliteration: "Asptal",
    category: "medical",
    handUsage: "two-handed",
    description: "Dominant index and middle finger trace a Red Cross symbol on the non-dominant shoulder or opposite forearm.",
    regionalVariation: "Standard symbol across India.",
    motionTrajectory: "cross_trace",
    landmarkTarget: {
      leftHand: { wrist: { x: 0.38, y: 0.58 }, index: { x: 0.44, y: 0.46 }, middle: { x: 0.45, y: 0.45 }, thumb: { x: 0.36, y: 0.50 }, ring: { x: 0.46, y: 0.48 }, pinky: { x: 0.47, y: 0.51 } },
      rightHand: { wrist: { x: 0.45, y: 0.46 }, index: { x: 0.40, y: 0.52 }, middle: { x: 0.41, y: 0.52 }, thumb: { x: 0.48, y: 0.48 }, ring: { x: 0.43, y: 0.47 }, pinky: { x: 0.44, y: 0.48 } }
    }
  },
  {
    id: "medicine",
    english: "Medicine / Tablet",
    hindi: "दवाई",
    transliteration: "Dawai",
    category: "medical",
    handUsage: "one-handed",
    description: "Thumb and index finger pinch an imaginary pill and place it towards mouth or twist into opposite palm.",
    regionalVariation: "Universal Indian sign for tablets/capsules.",
    motionTrajectory: "pinch_to_mouth",
    landmarkTarget: {
      leftHand: null,
      rightHand: { wrist: { x: 0.58, y: 0.52 }, index: { x: 0.53, y: 0.40 }, middle: { x: 0.55, y: 0.45 }, thumb: { x: 0.52, y: 0.40 }, ring: { x: 0.56, y: 0.48 }, pinky: { x: 0.57, y: 0.51 } }
    }
  },
  {
    id: "pain",
    english: "Pain / Hurt",
    hindi: "दर्द",
    transliteration: "Dard",
    category: "medical",
    handUsage: "two-handed",
    description: "Both index fingers pointing towards each other, twisting repeatedly with a pained facial expression.",
    regionalVariation: "Sign location moves to the specific area of pain (head, stomach, chest).",
    motionTrajectory: "index_twist_converge",
    landmarkTarget: {
      leftHand: { wrist: { x: 0.42, y: 0.55 }, index: { x: 0.48, y: 0.50 }, middle: { x: 0.43, y: 0.56 }, thumb: { x: 0.42, y: 0.53 }, ring: { x: 0.41, y: 0.58 }, pinky: { x: 0.40, y: 0.60 } },
      rightHand: { wrist: { x: 0.58, y: 0.55 }, index: { x: 0.52, y: 0.50 }, middle: { x: 0.57, y: 0.56 }, thumb: { x: 0.58, y: 0.53 }, ring: { x: 0.59, y: 0.58 }, pinky: { x: 0.60, y: 0.60 } }
    }
  },
  {
    id: "police",
    english: "Police",
    hindi: "पुलिस",
    transliteration: "Police",
    category: "medical",
    handUsage: "one-handed",
    description: "Dominant thumb and index finger tap shoulder twice to indicate uniform epaulette / stars.",
    regionalVariation: "Standard Indian police insignia recognition.",
    motionTrajectory: "shoulder_tap",
    landmarkTarget: {
      leftHand: null,
      rightHand: { wrist: { x: 0.62, y: 0.44 }, index: { x: 0.54, y: 0.32 }, middle: { x: 0.56, y: 0.36 }, thumb: { x: 0.56, y: 0.34 }, ring: { x: 0.58, y: 0.39 }, pinky: { x: 0.60, y: 0.42 } }
    }
  },

  // --- PEOPLE & PLACES ---
  {
    id: "me",
    english: "Me / I",
    hindi: "मैं",
    transliteration: "Main",
    category: "people",
    handUsage: "one-handed",
    description: "Index finger points directly towards the center of one's own chest.",
    regionalVariation: "Universal across all sign languages.",
    motionTrajectory: "point_chest",
    landmarkTarget: {
      leftHand: null,
      rightHand: { wrist: { x: 0.56, y: 0.60 }, index: { x: 0.50, y: 0.48 }, middle: { x: 0.54, y: 0.55 }, thumb: { x: 0.56, y: 0.52 }, ring: { x: 0.55, y: 0.57 }, pinky: { x: 0.56, y: 0.59 } }
    }
  },
  {
    id: "you",
    english: "You",
    hindi: "आप / तुम",
    transliteration: "Aap / Tum",
    category: "people",
    handUsage: "one-handed",
    description: "Index finger points straight outward toward the conversational partner.",
    regionalVariation: "Universal deixis marker.",
    motionTrajectory: "point_forward",
    landmarkTarget: {
      leftHand: null,
      rightHand: { wrist: { x: 0.58, y: 0.62 }, index: { x: 0.58, y: 0.38 }, middle: { x: 0.56, y: 0.55 }, thumb: { x: 0.60, y: 0.52 }, ring: { x: 0.55, y: 0.57 }, pinky: { x: 0.54, y: 0.59 } }
    }
  },
  {
    id: "family",
    english: "Family",
    hindi: "परिवार",
    transliteration: "Parivaar",
    category: "people",
    handUsage: "two-handed",
    description: "Both hands form 'F' or pinch shapes starting together in front, drawing a circle outward and meeting pinkies at the end.",
    regionalVariation: "Standard ISL dictionary sign.",
    motionTrajectory: "circular_envelope",
    landmarkTarget: {
      leftHand: { wrist: { x: 0.40, y: 0.58 }, index: { x: 0.44, y: 0.45 }, middle: { x: 0.45, y: 0.45 }, thumb: { x: 0.43, y: 0.46 }, ring: { x: 0.47, y: 0.48 }, pinky: { x: 0.49, y: 0.52 } },
      rightHand: { wrist: { x: 0.60, y: 0.58 }, index: { x: 0.56, y: 0.45 }, middle: { x: 0.55, y: 0.45 }, thumb: { x: 0.57, y: 0.46 }, ring: { x: 0.53, y: 0.48 }, pinky: { x: 0.51, y: 0.52 } }
    }
  },
  {
    id: "school",
    english: "School",
    hindi: "स्कूल / विद्यालय",
    transliteration: "School",
    category: "places",
    handUsage: "two-handed",
    description: "Dominant flat hand claps down onto non-dominant flat palm twice horizontally.",
    regionalVariation: "Universal ISL sign for study / educational institute.",
    motionTrajectory: "horizontal_clap_twice",
    landmarkTarget: {
      leftHand: { wrist: { x: 0.42, y: 0.60 }, index: { x: 0.50, y: 0.58 }, middle: { x: 0.51, y: 0.58 }, thumb: { x: 0.44, y: 0.54 }, ring: { x: 0.52, y: 0.59 }, pinky: { x: 0.53, y: 0.61 } },
      rightHand: { wrist: { x: 0.54, y: 0.52 }, index: { x: 0.48, y: 0.56 }, middle: { x: 0.49, y: 0.56 }, thumb: { x: 0.52, y: 0.50 }, ring: { x: 0.48, y: 0.58 }, pinky: { x: 0.47, y: 0.60 } }
    }
  },
  {
    id: "station",
    english: "Railway Station / Bus Station",
    hindi: "स्टेशन",
    transliteration: "Station",
    category: "places",
    handUsage: "two-handed",
    description: "Both index fingers pointing forward, moving like parallel train tracks or chugging train pistons.",
    regionalVariation: "Standard Indian train motion iconicity.",
    motionTrajectory: "parallel_forward_chug",
    landmarkTarget: {
      leftHand: { wrist: { x: 0.42, y: 0.58 }, index: { x: 0.42, y: 0.42 }, middle: { x: 0.40, y: 0.52 }, thumb: { x: 0.44, y: 0.50 }, ring: { x: 0.39, y: 0.54 }, pinky: { x: 0.38, y: 0.56 } },
      rightHand: { wrist: { x: 0.58, y: 0.58 }, index: { x: 0.58, y: 0.42 }, middle: { x: 0.60, y: 0.52 }, thumb: { x: 0.56, y: 0.50 }, ring: { x: 0.61, y: 0.54 }, pinky: { x: 0.62, y: 0.56 } }
    }
  },

  // --- TIME & QUESTIONS ---
  {
    id: "where",
    english: "Where?",
    hindi: "कहाँ?",
    transliteration: "Kahaan?",
    category: "questions",
    handUsage: "two-handed",
    description: "Both hands held in front with palms facing upwards, moving side to side with raised furrowed eyebrows.",
    regionalVariation: "Question word always placed at the end of ISL sentence.",
    motionTrajectory: "palms_up_shrug",
    landmarkTarget: {
      leftHand: { wrist: { x: 0.35, y: 0.60 }, index: { x: 0.33, y: 0.48 }, middle: { x: 0.34, y: 0.46 }, thumb: { x: 0.39, y: 0.52 }, ring: { x: 0.36, y: 0.47 }, pinky: { x: 0.38, y: 0.49 } },
      rightHand: { wrist: { x: 0.65, y: 0.60 }, index: { x: 0.67, y: 0.48 }, middle: { x: 0.66, y: 0.46 }, thumb: { x: 0.61, y: 0.52 }, ring: { x: 0.64, y: 0.47 }, pinky: { x: 0.62, y: 0.49 } }
    }
  },
  {
    id: "what",
    english: "What?",
    hindi: "क्या?",
    transliteration: "Kya?",
    category: "questions",
    handUsage: "one-handed",
    description: "Dominant hand open, palm facing up, shaking gently side to side with questioning facial expression.",
    regionalVariation: "Universal ISL query marker.",
    motionTrajectory: "side_shake_palm_up",
    landmarkTarget: {
      leftHand: null,
      rightHand: { wrist: { x: 0.58, y: 0.60 }, index: { x: 0.60, y: 0.46 }, middle: { x: 0.58, y: 0.44 }, thumb: { x: 0.54, y: 0.50 }, ring: { x: 0.56, y: 0.46 }, pinky: { x: 0.54, y: 0.49 } }
    }
  },
  {
    id: "when",
    english: "When?",
    hindi: "कब?",
    transliteration: "Kab?",
    category: "questions",
    handUsage: "two-handed",
    description: "Dominant index finger circles around the tip of non-dominant stationary index finger and touches it (clock hand).",
    regionalVariation: "Standard ISL temporal query.",
    motionTrajectory: "circle_and_touch",
    landmarkTarget: {
      leftHand: { wrist: { x: 0.45, y: 0.58 }, index: { x: 0.48, y: 0.44 }, middle: { x: 0.44, y: 0.52 }, thumb: { x: 0.46, y: 0.50 }, ring: { x: 0.43, y: 0.54 }, pinky: { x: 0.42, y: 0.56 } },
      rightHand: { wrist: { x: 0.55, y: 0.52 }, index: { x: 0.49, y: 0.43 }, middle: { x: 0.54, y: 0.50 }, thumb: { x: 0.56, y: 0.48 }, ring: { x: 0.55, y: 0.52 }, pinky: { x: 0.56, y: 0.54 } }
    }
  },
  {
    id: "today",
    english: "Today / Now",
    hindi: "आज / अभी",
    transliteration: "Aaj",
    category: "questions",
    handUsage: "two-handed",
    description: "Both hands with bent fingers or 'Y' shape dropped firmly downward in front of body.",
    regionalVariation: "Time markers in ISL always placed at start of sentence.",
    motionTrajectory: "firm_drop_down",
    landmarkTarget: {
      leftHand: { wrist: { x: 0.38, y: 0.52 }, index: { x: 0.36, y: 0.64 }, middle: { x: 0.38, y: 0.65 }, thumb: { x: 0.42, y: 0.56 }, ring: { x: 0.40, y: 0.63 }, pinky: { x: 0.42, y: 0.62 } },
      rightHand: { wrist: { x: 0.62, y: 0.52 }, index: { x: 0.64, y: 0.64 }, middle: { x: 0.62, y: 0.65 }, thumb: { x: 0.58, y: 0.56 }, ring: { x: 0.60, y: 0.63 }, pinky: { x: 0.58, y: 0.62 } }
    }
  },
  {
    id: "tomorrow",
    english: "Tomorrow",
    hindi: "कल (आने वाला)",
    transliteration: "Kal",
    category: "questions",
    handUsage: "one-handed",
    description: "Dominant thumb touches cheek and arches forward in a semicircle trajectory ahead of body.",
    regionalVariation: "Standard future timeline vector in ISL.",
    motionTrajectory: "arch_forward_from_cheek",
    landmarkTarget: {
      leftHand: null,
      rightHand: { wrist: { x: 0.62, y: 0.45 }, index: { x: 0.60, y: 0.32 }, middle: { x: 0.62, y: 0.34 }, thumb: { x: 0.56, y: 0.36 }, ring: { x: 0.64, y: 0.36 }, pinky: { x: 0.66, y: 0.39 } }
    }
  },

  // --- TWO-HANDED ISL FINGERSPELLING ALPHABET EXAMPLES ---
  // Note: Unlike American Sign Language (ASL) which is 1-handed, Indian Sign Language (ISL) fingerspelling
  // shares historical links with British Sign Language (BSL) and uses TWO HANDS for letters A, B, D, etc.
  {
    id: "isl_a",
    english: "ISL Letter A",
    hindi: "अक्षर A",
    transliteration: "Letter A",
    category: "alphabet",
    handUsage: "two-handed",
    description: "Non-dominant hand held open palm forward; dominant index finger touches the tip of the non-dominant thumb.",
    regionalVariation: "ISLRTC Standard two-handed vowel placement.",
    motionTrajectory: "index_touches_thumb",
    landmarkTarget: {
      leftHand: { wrist: { x: 0.42, y: 0.60 }, index: { x: 0.42, y: 0.42 }, middle: { x: 0.44, y: 0.40 }, thumb: { x: 0.48, y: 0.48 }, ring: { x: 0.46, y: 0.42 }, pinky: { x: 0.48, y: 0.45 } },
      rightHand: { wrist: { x: 0.56, y: 0.58 }, index: { x: 0.48, y: 0.48 }, middle: { x: 0.54, y: 0.54 }, thumb: { x: 0.55, y: 0.52 }, ring: { x: 0.55, y: 0.56 }, pinky: { x: 0.56, y: 0.58 } }
    }
  },
  {
    id: "isl_b",
    english: "ISL Letter B",
    hindi: "अक्षर B",
    transliteration: "Letter B",
    category: "alphabet",
    handUsage: "two-handed",
    description: "Both hands form circles with thumb and index fingers, touching at fingertips like binoculars or eyeglasses (two loops).",
    regionalVariation: "Universal ISL letter B shape.",
    motionTrajectory: "double_circles_touch",
    landmarkTarget: {
      leftHand: { wrist: { x: 0.42, y: 0.58 }, index: { x: 0.46, y: 0.48 }, middle: { x: 0.43, y: 0.54 }, thumb: { x: 0.46, y: 0.52 }, ring: { x: 0.41, y: 0.56 }, pinky: { x: 0.39, y: 0.58 } },
      rightHand: { wrist: { x: 0.58, y: 0.58 }, index: { x: 0.54, y: 0.48 }, middle: { x: 0.57, y: 0.54 }, thumb: { x: 0.54, y: 0.52 }, ring: { x: 0.59, y: 0.56 }, pinky: { x: 0.61, y: 0.58 } }
    }
  },
  {
    id: "isl_d",
    english: "ISL Letter D",
    hindi: "अक्षर D",
    transliteration: "Letter D",
    category: "alphabet",
    handUsage: "two-handed",
    description: "Non-dominant index finger extended vertically; dominant thumb and index form a curved 'C' touching the non-dominant index to make a 'D'.",
    regionalVariation: "ISLRTC Standard letter D.",
    motionTrajectory: "curve_touches_vertical",
    landmarkTarget: {
      leftHand: { wrist: { x: 0.44, y: 0.60 }, index: { x: 0.44, y: 0.38 }, middle: { x: 0.41, y: 0.52 }, thumb: { x: 0.46, y: 0.50 }, ring: { x: 0.40, y: 0.54 }, pinky: { x: 0.39, y: 0.56 } },
      rightHand: { wrist: { x: 0.58, y: 0.56 }, index: { x: 0.45, y: 0.40 }, middle: { x: 0.55, y: 0.52 }, thumb: { x: 0.45, y: 0.58 }, ring: { x: 0.56, y: 0.54 }, pinky: { x: 0.57, y: 0.56 } }
    }
  }
];

// Helper lookup tables
const ISL_BY_ID = ISL_CORPUS.reduce((acc, sign) => {
  acc[sign.id] = sign;
  return acc;
}, {});

const ISL_CATEGORIES = [
  { id: "all", label: "All Signs (समस्त)", count: ISL_CORPUS.length },
  { id: "greetings", label: "Greetings (अभिवादन)" },
  { id: "essentials", label: "Daily Essentials (दैनिक आवश्यकताएँ)" },
  { id: "medical", label: "Medical & SOS (चिकित्सा व आपातकाल)" },
  { id: "people", label: "People & Family (लोग व परिवार)" },
  { id: "places", label: "Places & Travel (स्थान व यात्रा)" },
  { id: "questions", label: "Questions & Time (प्रश्न व समय)" },
  { id: "alphabet", label: "Fingerspelling Alphabet (वर्णमाला)" }
];

// If running in browser window vs Node.js module
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ISL_CORPUS, ISL_BY_ID, ISL_CATEGORIES };
}
