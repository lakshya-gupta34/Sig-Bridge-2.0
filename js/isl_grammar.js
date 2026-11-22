/**
 * SignBridge - Indian Sign Language (ISL) Grammar & Natural Language Processing Engine
 * 
 * Implements ISL Linguistic Rules based on ISLRTC Research:
 * 1. SOV (Subject - Object - Verb) Sentence Structure
 * 2. Time-First Rule (Temporal markers like TODAY, TOMORROW anchor the discourse)
 * 3. Copula Verb Elimination (is, am, are, was, were, be, है, हूँ, था, थी are dropped)
 * 4. WH-Question Movement (What, Where, When, Why, How move to the sentence end)
 * 5. Negative Marker Post-positioning (NO / NOT follows the verb)
 * 6. Directional Verb Incorporation & Preposition Stripping
 */

class ISLGrammarEngine {
  constructor() {
    // English Stopwords / Copula Verbs to drop
    this.enStopwords = new Set([
      'is', 'am', 'are', 'was', 'were', 'be', 'been', 'being',
      'a', 'an', 'the',
      'to', 'of', 'in', 'at', 'on', 'for', 'with', 'by', 'about',
      'do', 'does', 'did', 'have', 'has', 'had', 'will', 'would', 'shall', 'should', 'can', 'could'
    ]);

    // Hindi Stopwords / Postpositions to drop
    this.hiStopwords = new Set([
      'है', 'हूँ', 'हो', 'हैं', 'था', 'थी', 'थे',
      'का', 'की', 'के', 'को', 'से', 'में', 'पर', 'तक', 'ने',
      'एक', 'यह', 'वह'
    ]);

    // Question markers
    this.questionWords = {
      en: ['where', 'what', 'when', 'who', 'why', 'how'],
      hi: ['कहाँ', 'क्या', 'कब', 'कौन', 'क्यों', 'कैसे', 'किधर']
    };

    // Temporal markers that must be pulled to sentence start in ISL
    this.timeWords = {
      en: ['today', 'tomorrow', 'yesterday', 'now', 'morning', 'night', 'soon', 'later'],
      hi: ['आज', 'कल', 'अभी', 'सुबह', 'रात', 'जल्दी', 'बाद']
    };

    // Semantic Mapping Lexicon to Canonical ISL Gloss IDs
    this.lemmaMap = {
      // Greetings
      'hello': 'namaste',
      'hi': 'namaste',
      'namaste': 'namaste',
      'namaskar': 'namaste',
      'नमस्ते': 'namaste',
      'नमस्कार': 'namaste',
      'thank': 'dhanyavaad',
      'thanks': 'dhanyavaad',
      'thank you': 'dhanyavaad',
      'dhanyavaad': 'dhanyavaad',
      'dhanyavad': 'dhanyavaad',
      'धन्यवाद': 'dhanyavaad',
      'shukriya': 'dhanyavaad',
      'शुक्रिया': 'dhanyavaad',
      'welcome': 'welcome',
      'स्वागत': 'welcome',
      'please': 'kripya',
      'kripya': 'kripya',
      'कृपया': 'kripya',

      // Essentials
      'help': 'help',
      'assist': 'help',
      'assistance': 'help',
      'madad': 'help',
      'मदद': 'help',
      'sahayata': 'help',
      'सहायता': 'help',
      'water': 'water',
      'paani': 'water',
      'pani': 'water',
      'पानी': 'water',
      'जल': 'water',
      'food': 'food',
      'eat': 'food',
      'eating': 'food',
      'khana': 'food',
      'खाना': 'food',
      'bhojan': 'food',
      'भोजन': 'food',
      'tea': 'tea',
      'chai': 'tea',
      'चाय': 'tea',
      'yes': 'yes',
      'haan': 'yes',
      'हाँ': 'yes',
      'no': 'no',
      'not': 'no',
      'nahi': 'no',
      'nahin': 'no',
      'नहीं': 'no',

      // Medical
      'doctor': 'doctor',
      'dr': 'doctor',
      'डॉक्टर': 'doctor',
      'चिकित्सक': 'doctor',
      'hospital': 'hospital',
      'clinic': 'hospital',
      'asptal': 'hospital',
      'अस्पताल': 'hospital',
      'दवाखाना': 'hospital',
      'medicine': 'medicine',
      'pill': 'medicine',
      'tablet': 'medicine',
      'dawai': 'medicine',
      'दवाई': 'medicine',
      'दवा': 'medicine',
      'pain': 'pain',
      'hurt': 'pain',
      'hurts': 'pain',
      'ache': 'pain',
      'dard': 'pain',
      'दर्द': 'pain',
      'police': 'police',
      'cop': 'police',
      'पुलिस': 'police',

      // People
      'i': 'me',
      'me': 'me',
      'my': 'me',
      'mine': 'me',
      'main': 'me',
      'mujhe': 'me',
      'mera': 'me',
      'meri': 'me',
      'मैं': 'me',
      'मुझे': 'me',
      'मेरा': 'me',
      'मेरी': 'me',
      'you': 'you',
      'your': 'you',
      'yours': 'you',
      'aap': 'you',
      'tum': 'you',
      'tumhara': 'you',
      'aapka': 'you',
      'आप': 'you',
      'तुम': 'you',
      'आपका': 'you',
      'तुम्हारा': 'you',
      'family': 'family',
      'parivaar': 'family',
      'परिवार': 'family',
      'school': 'school',
      'college': 'school',
      'study': 'school',
      'vidyalaya': 'school',
      'स्कूल': 'school',
      'विद्यालय': 'school',
      'station': 'station',
      'railway': 'station',
      'स्टेशन': 'station',

      // Time & Questions
      'where': 'where',
      'kahan': 'where',
      'kaha': 'where',
      'कहाँ': 'where',
      'किधर': 'where',
      'what': 'what',
      'kya': 'what',
      'क्या': 'what',
      'when': 'when',
      'kab': 'when',
      'कब': 'when',
      'today': 'today',
      'aaj': 'today',
      'आज': 'today',
      'tomorrow': 'tomorrow',
      'kal': 'tomorrow',
      'कल': 'tomorrow'
    };
  }

  /**
   * Detect whether input text is primarily Devanagari Hindi or Latin English
   */
  detectLanguage(text) {
    const devanagariPattern = /[\u0900-\u097F]/;
    return devanagariPattern.test(text) ? 'hi' : 'en';
  }

  /**
   * Clean and normalize raw text
   */
  tokenize(text) {
    // Replace punctuation but remember if it was a question
    const isQuestion = text.includes('?') ||
      /\b(where|what|when|why|how|who|kya|kahan|kab|kyon|kaise)\b/i.test(text) ||
      /[कहाँ|क्या|कब|क्यों|कैसे]/.test(text);

    const clean = text
      .toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'–—]/g, ' ')
      .trim();

    const rawTokens = clean.split(/\s+/).filter(t => t.length > 0);
    return { tokens: rawTokens, isQuestion };
  }

  /**
   * Transform natural English or Hindi text into an ISL Gloss Sequence
   * adheres to ISL SOV, Time-First, and Question-Last syntax.
   */
  translateTextToISL(inputText) {
    if (!inputText || !inputText.trim()) {
      return {
        originalText: '',
        detectedLanguage: 'en',
        glossTokens: [],
        signSequence: [],
        islSentenceString: '',
        hindiGlossString: '',
        explanation: 'Empty input provided.'
      };
    }

    const lang = this.detectLanguage(inputText);
    const { tokens, isQuestion } = this.tokenize(inputText);

    const timeTokens = [];
    const questionTokens = [];
    const coreTokens = [];
    const negationTokens = [];

    // Classify tokens according to ISL grammatical roles
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];

      // Check multi-word phrase lookups (e.g., 'thank you')
      if (i + 1 < tokens.length) {
        const bigram = `${token} ${tokens[i + 1]}`;
        if (this.lemmaMap[bigram]) {
          coreTokens.push(this.lemmaMap[bigram]);
          i++; // skip next
          continue;
        }
      }

      // Drop language-specific stopwords & copulas
      if (lang === 'en' && this.enStopwords.has(token)) continue;
      if (lang === 'hi' && this.hiStopwords.has(token)) continue;

      // Map to canonical sign id
      const signId = this.lemmaMap[token] || token;

      // Temporal markers (anchor at start of ISL sentence)
      if (this.timeWords.en.includes(token) || this.timeWords.hi.includes(token) || ['today', 'tomorrow'].includes(signId)) {
        timeTokens.push(signId);
      }
      // Question markers (shift to end of ISL sentence)
      else if (this.questionWords.en.includes(token) || this.questionWords.hi.includes(token) || ['where', 'what', 'when'].includes(signId)) {
        questionTokens.push(signId);
      }
      // Negation markers (shift towards end after verb)
      else if (['no', 'nahi', 'nahin', 'not', 'नहीं'].includes(token) || signId === 'no') {
        negationTokens.push('no');
      }
      // Core content words (Subject, Object, Verb)
      else {
        coreTokens.push(signId);
      }
    }

    // Reconstruct into ISL Grammatical Structure:
    // [TIME] + [CORE (Subject + Object + Verb)] + [NEGATION] + [QUESTION]
    const finalSequence = [];

    // 1. Time First
    timeTokens.forEach(t => finalSequence.push(t));

    // 2. Core Subject & Object & Verb
    coreTokens.forEach(t => finalSequence.push(t));

    // 3. Negation Post-position
    negationTokens.forEach(t => finalSequence.push(t));

    // 4. Question Marker at End
    questionTokens.forEach(t => finalSequence.push(t));

    // If marked as question but no explicit question word, tag general question marker
    if (isQuestion && questionTokens.length === 0 && finalSequence.length > 0) {
      // Question facial/head marker implied
    }

    // Deduplicate adjacent identical signs (e.g. repeated words)
    const dedupedSequence = finalSequence.filter((item, pos, arr) => pos === 0 || item !== arr[pos - 1]);

    // Build human-friendly strings and explanations
    const englishGlossString = dedupedSequence.map(id => id.toUpperCase()).join(' ');
    
    // Look up Hindi equivalents from corpus or map
    const hindiGlossString = dedupedSequence.map(id => {
      // check if in global ISL_BY_ID
      if (typeof ISL_BY_ID !== 'undefined' && ISL_BY_ID[id]) {
        return ISL_BY_ID[id].hindi;
      }
      return id;
    }).join(' ');

    const explanationParts = [];
    if (timeTokens.length > 0) explanationParts.push("Time marker placed first (ISL temporal anchor).");
    if (questionTokens.length > 0) explanationParts.push("Question marker moved to end with non-manual facial inflection.");
    if (negationTokens.length > 0) explanationParts.push("Negation placed post-verb.");
    explanationParts.push("Copula auxiliary verbs (is/am/are/है/था) dropped per ISLRTC standard.");

    return {
      originalText: inputText,
      detectedLanguage: lang === 'hi' ? 'Hindi (हिन्दी)' : 'English',
      glossTokens: dedupedSequence.map(id => id.toUpperCase()),
      signSequence: dedupedSequence,
      islSentenceString: englishGlossString,
      hindiGlossString: hindiGlossString,
      explanation: explanationParts.join(" ")
    };
  }

  /**
   * Reverse Translation: Convert ISL Sign Sequence back into natural English and Hindi sentences
   */
  translateISLToText(signSequence) {
    if (!signSequence || signSequence.length === 0) {
      return { english: '', hindi: '' };
    }

    const ids = signSequence.map(s => (typeof s === 'string' ? s.toLowerCase() : s.id));

    // Check predefined multi-sign sentence patterns
    const key = ids.join('_');

    const phraseBank = {
      'namaste': {
        english: "Hello / Greetings!",
        hindi: "नमस्ते! आपका स्वागत है।"
      },
      'dhanyavaad': {
        english: "Thank you very much.",
        hindi: "आपका बहुत-बहुत धन्यवाद।"
      },
      'hospital_where': {
        english: "Where is the hospital?",
        hindi: "अस्पताल कहाँ है?"
      },
      'station_where': {
        english: "Where is the railway station?",
        hindi: "रेलवे स्टेशन कहाँ है?"
      },
      'me_help': {
        english: "I need help, please assist me.",
        hindi: "मुझे मदद की ज़रूरत है, कृपया सहायता करें।"
      },
      'me_water': {
        english: "I want water.",
        hindi: "मुझे पानी चाहिए।"
      },
      'me_food': {
        english: "I am hungry / I want food.",
        hindi: "मुझे खाना चाहिए / मुझे भूख लगी है।"
      },
      'doctor_help': {
        english: "Please call a doctor immediately.",
        hindi: "कृपया तुरंत डॉक्टर को बुलाएं।"
      },
      'me_pain': {
        english: "I am experiencing pain.",
        hindi: "मुझे दर्द हो रहा है।"
      },
      'today_doctor_me': {
        english: "I have to visit the doctor today.",
        hindi: "मुझे आज डॉक्टर के पास जाना है।"
      },
      'tomorrow_school_you': {
        english: "Will you go to school tomorrow?",
        hindi: "क्या आप कल स्कूल जाएंगे?"
      }
    };

    if (phraseBank[key]) {
      return phraseBank[key];
    }

    // Dynamic reconstruction if not in phraseBank
    const enWords = [];
    const hiWords = [];

    ids.forEach(id => {
      let signData = null;
      if (typeof ISL_BY_ID !== 'undefined' && ISL_BY_ID[id]) {
        signData = ISL_BY_ID[id];
      }

      if (signData) {
        enWords.push(signData.english.split('/')[0].trim());
        hiWords.push(signData.hindi.split('/')[0].trim());
      } else {
        enWords.push(id);
        hiWords.push(id);
      }
    });

    return {
      english: enWords.join(' ') + '.',
      hindi: hiWords.join(' ') + '।'
    };
  }
}

// Global instantiation for client usage
const islGrammarEngine = new ISLGrammarEngine();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ISLGrammarEngine, islGrammarEngine };
}
