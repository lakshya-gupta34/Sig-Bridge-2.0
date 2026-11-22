"""
SignBridge - Python Natural Language Processing & ISL Grammar Engine
Implements ISLRTC (Indian Sign Language Research & Training Centre) Linguistic Rules:
- Time-Subject-Object-Verb (SOV) Syntax Ordering
- Elimination of Copula Verbs ('is', 'am', 'are', 'was', 'है', 'था', etc.)
- WH-Question particle movement to sentence terminus
- Negative marker post-positioning
"""

import re
from typing import Dict, List, Any, Optional

EN_STOPWORDS = {
    'is', 'am', 'are', 'was', 'were', 'be', 'been', 'being',
    'a', 'an', 'the',
    'to', 'of', 'in', 'at', 'on', 'for', 'with', 'by', 'about',
    'do', 'does', 'did', 'have', 'has', 'had', 'will', 'would', 'shall', 'should', 'can', 'could'
}

HI_STOPWORDS = {
    'है', 'हूँ', 'हो', 'हैं', 'था', 'थी', 'थे',
    'का', 'की', 'के', 'को', 'से', 'में', 'पर', 'तक', 'ने',
    'एक', 'यह', 'वह'
}

TIME_WORDS_EN = {'today', 'tomorrow', 'yesterday', 'now', 'morning', 'night', 'soon', 'later'}
TIME_WORDS_HI = {'आज', 'कल', 'अभी', 'सुबह', 'रात', 'जल्दी', 'बाद'}

QUESTION_WORDS_EN = {'where', 'what', 'when', 'who', 'why', 'how'}
QUESTION_WORDS_HI = {'कहाँ', 'क्या', 'कब', 'कौन', 'क्यों', 'कैसे', 'किधर'}

LEMMA_MAP = {
    # Greetings
    'hello': 'namaste', 'hi': 'namaste', 'namaste': 'namaste', 'namaskar': 'namaste',
    'नमस्ते': 'namaste', 'नमस्कार': 'namaste',
    'thank': 'dhanyavaad', 'thanks': 'dhanyavaad', 'thank you': 'dhanyavaad',
    'dhanyavaad': 'dhanyavaad', 'धन्यवाद': 'dhanyavaad', 'शुक्रिया': 'dhanyavaad',
    'welcome': 'welcome', 'स्वागत': 'welcome',
    'please': 'kripya', 'कृपया': 'kripya',

    # Essentials
    'help': 'help', 'assist': 'help', 'madad': 'help', 'मदद': 'help',
    'water': 'water', 'paani': 'water', 'पानी': 'water', 'जल': 'water',
    'food': 'food', 'eat': 'food', 'khana': 'food', 'खाना': 'food',
    'tea': 'tea', 'chai': 'tea', 'चाय': 'tea',
    'yes': 'yes', 'haan': 'yes', 'हाँ': 'yes',
    'no': 'no', 'not': 'no', 'nahi': 'no', 'nahin': 'no', 'नहीं': 'no',

    # Medical
    'doctor': 'doctor', 'dr': 'doctor', 'डॉक्टर': 'doctor',
    'hospital': 'hospital', 'clinic': 'hospital', 'अस्पताल': 'hospital',
    'medicine': 'medicine', 'tablet': 'medicine', 'dawai': 'medicine', 'दवाई': 'medicine',
    'pain': 'pain', 'hurt': 'pain', 'दर्द': 'pain',
    'police': 'police', 'पुलिस': 'police',

    # People & Places
    'i': 'me', 'me': 'me', 'my': 'me', 'main': 'me', 'mujhe': 'me', 'मैं': 'me', 'मुझे': 'me',
    'you': 'you', 'your': 'you', 'aap': 'you', 'tum': 'you', 'आप': 'you', 'तुम': 'you',
    'family': 'family', 'परिवार': 'family',
    'school': 'school', 'स्कूल': 'school',
    'station': 'station', 'स्टेशन': 'station',

    # Time & Questions
    'where': 'where', 'kahan': 'where', 'कहाँ': 'where',
    'what': 'what', 'kya': 'what', 'क्या': 'what',
    'when': 'when', 'kab': 'when', 'कब': 'when',
    'today': 'today', 'aaj': 'today', 'आज': 'today',
    'tomorrow': 'tomorrow', 'kal': 'tomorrow', 'कल': 'tomorrow'
}

CANONICAL_HINDI_MAP = {
    'namaste': 'नमस्ते',
    'dhanyavaad': 'धन्यवाद',
    'welcome': 'स्वागत',
    'kripya': 'कृपया',
    'help': 'मदद',
    'water': 'पानी',
    'food': 'खाना',
    'tea': 'चाय',
    'yes': 'हाँ',
    'no': 'नहीं',
    'doctor': 'डॉक्टर',
    'hospital': 'अस्पताल',
    'medicine': 'दवाई',
    'pain': 'दर्द',
    'police': 'पुलिस',
    'me': 'मैं',
    'you': 'आप',
    'family': 'परिवार',
    'school': 'स्कूल',
    'station': 'स्टेशन',
    'where': 'कहाँ',
    'what': 'क्या',
    'when': 'कब',
    'today': 'आज',
    'tomorrow': 'कल'
}


class ISLGrammarProcessor:
    """Parses natural English & Hindi sentences into ISL SOV Glosses and vice versa."""

    @staticmethod
    def detect_language(text: str) -> str:
        """Returns 'hi' if Devanagari script is detected, else 'en'."""
        if re.search(r'[\u0900-\u097F]', text):
            return 'hi'
        return 'en'

    @classmethod
    def text_to_isl(cls, input_text: str) -> Dict[str, Any]:
        """Convert English or Hindi natural text into ISL SOV gloss structure."""
        if not input_text or not input_text.strip():
            return {
                "original_text": "",
                "language": "en",
                "gloss_tokens": [],
                "isl_sentence": "",
                "hindi_equivalent": "",
                "explanation": "Empty input string."
            }

        lang = cls.detect_language(input_text)
        is_question = '?' in input_text or bool(re.search(r'\b(where|what|when|why|how|kya|kahan|kab)\b', input_text, re.I))

        # Tokenize and normalize
        clean_text = re.sub(r'[.,\/#!$%\^&\*;:{}=\-_`~()?"\'–—]', ' ', input_text.lower()).strip()
        tokens = clean_text.split()

        time_tokens = []
        question_tokens = []
        core_tokens = []
        negation_tokens = []

        i = 0
        while i < len(tokens):
            token = tokens[i]

            # Bigram check (e.g. 'thank you')
            if i + 1 < len(tokens):
                bigram = f"{token} {tokens[i+1]}"
                if bigram in LEMMA_MAP:
                    core_tokens.append(LEMMA_MAP[bigram])
                    i += 2
                    continue

            # Drop stopwords & copulas
            if lang == 'en' and token in EN_STOPWORDS:
                i += 1
                continue
            if lang == 'hi' and token in HI_STOPWORDS:
                i += 1
                continue

            sign_id = LEMMA_MAP.get(token, token)

            # Categorize by ISL grammatical role
            if token in TIME_WORDS_EN or token in TIME_WORDS_HI or sign_id in {'today', 'tomorrow'}:
                time_tokens.append(sign_id)
            elif token in QUESTION_WORDS_EN or token in QUESTION_WORDS_HI or sign_id in {'where', 'what', 'when'}:
                question_tokens.append(sign_id)
            elif token in {'no', 'not', 'nahi', 'nahin', 'नहीं'} or sign_id == 'no':
                negation_tokens.append('no')
            else:
                core_tokens.append(sign_id)

            i += 1

        # ISL SOV Structure: [TIME] + [CORE] + [NEGATION] + [QUESTION]
        ordered_sequence = time_tokens + core_tokens + negation_tokens + question_tokens

        # Deduplicate sequential identical signs
        deduped = []
        for s in ordered_sequence:
            if not deduped or deduped[-1] != s:
                deduped.append(s)

        gloss_tokens = [s.upper() for s in deduped]
        isl_sentence = " ".join(gloss_tokens)
        hindi_gloss = " ".join([CANONICAL_HINDI_MAP.get(s, s) for s in deduped])

        notes = []
        if time_tokens: notes.append("Time marker pulled to sentence head (ISL discourse anchor).")
        if question_tokens: notes.append("WH-Question moved to terminus with non-manual facial marker.")
        if negation_tokens: notes.append("Negation placed post-verb.")
        notes.append("Auxiliary copula verbs removed.")

        return {
            "original_text": input_text,
            "language": "Hindi" if lang == 'hi' else "English",
            "gloss_tokens": gloss_tokens,
            "sign_sequence": deduped,
            "isl_sentence": isl_sentence,
            "hindi_equivalent": hindi_gloss,
            "explanation": " ".join(notes)
        }

    @classmethod
    def isl_to_text(cls, sign_sequence: List[str]) -> Dict[str, str]:
        """Convert an ordered sequence of ISL signs into natural English & Hindi sentences."""
        if not sign_sequence:
            return {"english": "", "hindi": ""}

        norm_seq = [s.lower() for s in sign_sequence]
        key = "_".join(norm_seq)

        phrase_bank = {
            'namaste': ("Hello / Greetings!", "नमस्ते! आपका स्वागत है।"),
            'dhanyavaad': ("Thank you very much.", "आपका बहुत-बहुत धन्यवाद।"),
            'hospital_where': ("Where is the hospital?", "अस्पताल कहाँ है?"),
            'station_where': ("Where is the railway station?", "रेलवे स्टेशन कहाँ है?"),
            'me_help': ("I need assistance, please help me.", "मुझे मदद की ज़रूरत है, कृपया सहायता करें।"),
            'me_water': ("I want drinking water.", "मुझे पीने का पानी चाहिए।"),
            'doctor_help': ("Please summon a doctor immediately.", "कृपया तुरंत डॉक्टर को बुलाएं।"),
            'me_pain': ("I am in physical pain.", "मुझे दर्द हो रहा है।")
        }

        if key in phrase_bank:
            en, hi = phrase_bank[key]
            return {"english": en, "hindi": hi}

        en_words = [s.capitalize() for s in norm_seq]
        hi_words = [CANONICAL_HINDI_MAP.get(s, s) for s in norm_seq]

        return {
            "english": " ".join(en_words) + ".",
            "hindi": " ".join(hi_words) + "।"
        }
