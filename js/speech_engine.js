/**
 * SignBridge - Speech Engine (Bilingual Speech-to-Text & Text-to-Speech)
 * Supports English (en-IN / en-US) and Hindi (hi-IN)
 */

class SpeechEngine {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.activeLang = 'en-IN'; // 'en-IN' or 'hi-IN'
    this.synth = window.speechSynthesis || null;
    this.voices = [];
    this.autoSpeakEnabled = true;

    this.onResultCallback = null;
    this.onStateChangeCallback = null;

    this.initRecognition();
    this.loadVoices();
  }

  loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = () => {
        this.voices = this.synth.getVoices();
      };
    }
  }

  initRecognition() {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      console.warn('[SpeechEngine] SpeechRecognition API not supported in this browser environment.');
      return;
    }

    this.recognition = new SpeechRec();
    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.lang = this.activeLang;

    this.recognition.onstart = () => {
      this.isListening = true;
      if (this.onStateChangeCallback) this.onStateChangeCallback(true);
    };

    this.recognition.onresult = (event) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }

      if (this.onResultCallback) {
        this.onResultCallback({
          interimText: interim,
          finalText: final,
          isFinal: final.length > 0,
          lang: this.activeLang
        });
      }
    };

    this.recognition.onerror = (event) => {
      console.warn('[SpeechEngine] Speech recognition event:', event.error);
      this.isListening = false;
      if (this.onStateChangeCallback) this.onStateChangeCallback(false);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (this.onStateChangeCallback) this.onStateChangeCallback(false);
    };
  }

  setLanguage(langCode) {
    this.activeLang = langCode; // 'en-IN' or 'hi-IN'
    if (this.recognition) {
      this.recognition.lang = langCode;
    }
  }

  startListening(onResult, onStateChange) {
    this.onResultCallback = onResult;
    this.onStateChangeCallback = onStateChange;

    if (!this.recognition) {
      alert("Speech recognition is not supported in this browser. Please use Chrome, Edge, or a WebKit-based browser, or use text input.");
      return;
    }

    try {
      this.recognition.start();
    } catch (e) {
      // If already started, stop and restart
      this.recognition.stop();
      setTimeout(() => {
        try { this.recognition.start(); } catch (err) {}
      }, 200);
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  /**
   * Speak text in either Hindi or English
   */
  speak(text, lang = 'hi-IN') {
    if (!this.synth || !this.autoSpeakEnabled || !text) return;

    // Cancel current speech to prevent queue build-up
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.95; // Slightly measured pace for clarity
    utterance.pitch = 1.0;

    // Pick best matching voice
    if (this.voices.length > 0) {
      let matchedVoice = null;
      if (lang.startsWith('hi')) {
        matchedVoice = this.voices.find(v => v.lang.includes('hi') || v.name.toLowerCase().includes('hindi'));
      } else {
        matchedVoice = this.voices.find(v => v.lang.includes('en-IN') || (v.lang.includes('en') && v.name.toLowerCase().includes('india')));
      }

      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }
    }

    this.synth.speak(utterance);
  }
}

const speechEngine = new SpeechEngine();
