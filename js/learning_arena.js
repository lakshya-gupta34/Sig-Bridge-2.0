/**
 * SignBridge - Interactive ISL Practice & Learning Arena
 * Real-time Gamified Sign Language Coaching with Posture Feedback
 */

class ISLLearningArena {
  constructor() {
    this.currentTrack = 'greetings';
    this.currentSignIndex = 0;
    this.activeSigns = [];
    this.targetSign = null;

    // Gamification state
    this.xp = parseInt(localStorage.getItem('signbridge_xp') || '150', 10);
    this.streak = parseInt(localStorage.getItem('signbridge_streak') || '3', 10);
    this.completedSigns = new Set(JSON.parse(localStorage.getItem('signbridge_completed') || '["namaste"]'));

    // Hold verification state
    this.holdTimer = 0;
    this.requiredHoldSeconds = 1.8;
    this.currentAccuracy = 0; // 0 - 100%
    this.isHolding = false;

    this.onStateChanged = null;
    this.initTracks();
  }

  initTracks() {
    this.tracks = {
      greetings: {
        title: "Level 1: Essential Greetings & Courtesy",
        signs: ['namaste', 'dhanyavaad', 'welcome', 'kripya']
      },
      emergency: {
        title: "Level 2: Emergency & Healthcare SOS",
        signs: ['help', 'doctor', 'hospital', 'pain', 'water', 'police']
      },
      daily: {
        title: "Level 3: Daily Conversation & Needs",
        signs: ['food', 'tea', 'yes', 'no', 'family']
      },
      alphabet: {
        title: "Level 4: Two-Handed ISL Alphabet",
        signs: ['isl_a', 'isl_b', 'isl_d']
      }
    };

    this.setTrack(this.currentTrack);
  }

  setTrack(trackKey) {
    if (this.tracks[trackKey]) {
      this.currentTrack = trackKey;
      this.currentSignIndex = 0;
      this.activeSigns = this.tracks[trackKey].signs;
      this.loadSign(this.activeSigns[0]);
    }
  }

  loadSign(signId) {
    if (typeof ISL_BY_ID !== 'undefined' && ISL_BY_ID[signId]) {
      this.targetSign = ISL_BY_ID[signId];
      this.holdTimer = 0;
      this.isHolding = false;
      this.currentAccuracy = 0;
      if (this.onStateChanged) this.onStateChanged(this.getState());
    }
  }

  nextSign() {
    if (this.currentSignIndex < this.activeSigns.length - 1) {
      this.currentSignIndex++;
      this.loadSign(this.activeSigns[this.currentSignIndex]);
    }
  }

  prevSign() {
    if (this.currentSignIndex > 0) {
      this.currentSignIndex--;
      this.loadSign(this.activeSigns[this.currentSignIndex]);
    }
  }

  /**
   * Evaluate user's live detected pose against current target sign
   */
  evaluateLivePose(detectedSignId, confidence) {
    if (!this.targetSign) return;

    if (detectedSignId === this.targetSign.id) {
      this.currentAccuracy = Math.min(100, Math.round(confidence * 1.05));
    } else {
      // Partial credit / distance estimation
      this.currentAccuracy = Math.max(10, Math.round(confidence * 0.4));
    }

    // Generate real-time coaching advice
    let hint = "Position hands in front of chest";
    if (this.currentAccuracy > 85) {
      hint = "Outstanding posture! Hold steady to complete...";
      this.holdTimer += 0.2;
      this.isHolding = true;

      if (this.holdTimer >= this.requiredHoldSeconds) {
        this.completeTargetSign();
      }
    } else if (this.currentAccuracy > 60) {
      hint = "Good shape! Keep elbows stable and align fingertips.";
      this.holdTimer = Math.max(0, this.holdTimer - 0.1);
      this.isHolding = false;
    } else {
      hint = `Observe the target motion: ${this.targetSign.description}`;
      this.holdTimer = 0;
      this.isHolding = false;
    }

    if (this.onStateChanged) {
      this.onStateChanged({
        ...this.getState(),
        coachingHint: hint,
        holdProgress: Math.min(1.0, this.holdTimer / this.requiredHoldSeconds)
      });
    }
  }

  completeTargetSign() {
    if (!this.targetSign) return;

    const signId = this.targetSign.id;
    const isFirstTime = !this.completedSigns.has(signId);

    this.completedSigns.add(signId);
    this.xp += isFirstTime ? 50 : 15;
    this.holdTimer = 0;
    this.isHolding = false;

    // Save progress
    localStorage.setItem('signbridge_xp', this.xp.toString());
    localStorage.setItem('signbridge_completed', JSON.stringify(Array.from(this.completedSigns)));

    // Play celebration audio fanfare
    if (typeof audioFeedback !== 'undefined') {
      audioFeedback.playCelebration();
    }

    if (this.onStateChanged) {
      this.onStateChanged({
        ...this.getState(),
        justCompleted: true,
        coachingHint: `🎉 Perfect! You mastered "${this.targetSign.english}" (+50 XP)!`
      });
    }

    // Advance to next sign after brief delay
    setTimeout(() => {
      this.nextSign();
    }, 1800);
  }

  getState() {
    return {
      currentTrack: this.currentTrack,
      trackTitle: this.tracks[this.currentTrack].title,
      targetSign: this.targetSign,
      signIndex: this.currentSignIndex,
      totalSigns: this.activeSigns.length,
      xp: this.xp,
      streak: this.streak,
      accuracy: this.currentAccuracy,
      isCompleted: this.targetSign ? this.completedSigns.has(this.targetSign.id) : false,
      holdProgress: Math.min(1.0, this.holdTimer / this.requiredHoldSeconds)
    };
  }
}

const learningArena = new ISLLearningArena();
