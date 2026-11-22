/**
 * SignBridge - Main Orchestration Application
 * Connects Computer Vision, ISL Avatar, NLP Grammar, Speech & UI Components
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM View Containers
  const views = {
    live: document.getElementById('view-live'),
    reverse: document.getElementById('view-reverse'),
    dialogue: document.getElementById('view-dialogue'),
    arena: document.getElementById('view-arena'),
    corpus: document.getElementById('view-corpus'),
    sos: document.getElementById('view-sos')
  };

  const navBtns = document.querySelectorAll('.nav-tab-btn');

  // Initialize Vision & Avatar Engines
  let visionEngine = null;
  let avatarRenderer = null;
  let arenaAvatar = null;

  try {
    visionEngine = new ISLVisionEngine('webcam-video', 'overlay-canvas');
  } catch (e) {
    console.error('Vision engine init error:', e);
  }

  try {
    avatarRenderer = new ISLAvatarRenderer('avatar-canvas');
  } catch (e) {
    console.error('Avatar renderer init error:', e);
  }

  try {
    arenaAvatar = new ISLAvatarRenderer('arena-avatar-canvas');
  } catch (e) {
    console.error('Arena avatar renderer init error:', e);
  }

  // --- TAB NAVIGATION SWITCHER ---
  function switchTab(targetViewId) {
    Object.keys(views).forEach(key => {
      if (views[key]) {
        views[key].classList.add('hidden');
      }
    });

    if (views[targetViewId]) {
      views[targetViewId].classList.remove('hidden');
    }

    navBtns.forEach(btn => {
      if (btn.dataset.tab === targetViewId) {
        btn.classList.add('active-tab');
      } else {
        btn.classList.remove('active-tab');
      }
    });

    if (typeof audioFeedback !== 'undefined') {
      audioFeedback.playClick();
    }

    // Tab-specific lifecycle activations
    if (targetViewId === 'live') {
      if (visionEngine && !visionEngine.isRunning) {
        visionEngine.startWebcam();
      }
    } else if (targetViewId === 'reverse') {
      // Load initial welcome sign sequence
      if (avatarRenderer) {
        avatarRenderer.loadSequence(['namaste', 'welcome'], null, null);
      }
    } else if (targetViewId === 'arena') {
      updateArenaUI(learningArena.getState());
      if (arenaAvatar && learningArena.targetSign) {
        arenaAvatar.loadSequence([learningArena.targetSign.id], null, null);
      }
    } else if (targetViewId === 'corpus') {
      renderCorpusGrid('all');
    }
  }

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      switchTab(btn.dataset.tab);
    });
  });

  // --- LIVE TRANSLATION STUDIO (ISL -> ENGLISH & HINDI) ---
  const signLabelBadge = document.getElementById('detected-sign-badge');
  const enSubtitle = document.getElementById('live-en-subtitle');
  const hiSubtitle = document.getElementById('live-hi-subtitle');
  const confidenceBar = document.getElementById('confidence-progress');
  const confidenceText = document.getElementById('confidence-val');
  const historyList = document.getElementById('translation-history-list');

  const startCameraBtn = document.getElementById('btn-start-camera');
  const demoFeedBtn = document.getElementById('btn-demo-feed');
  const toggleMirrorBtn = document.getElementById('btn-toggle-mirror');

  let translationHistory = [];

  if (visionEngine) {
    // Listen to recognized signs
    visionEngine.onSignDetected = (sign, confidence) => {
      if (!sign) return;

      // Update badge & subtitles
      if (signLabelBadge) signLabelBadge.textContent = sign.english.toUpperCase();
      if (enSubtitle) enSubtitle.textContent = sign.english;
      if (hiSubtitle) hiSubtitle.textContent = sign.hindi;

      // Audio feedback chime
      if (typeof audioFeedback !== 'undefined') {
        audioFeedback.playSignRecognized();
      }

      // Bilingual Speech output
      if (typeof speechEngine !== 'undefined' && speechEngine.autoSpeakEnabled) {
        const speechLang = document.getElementById('tts-lang-select') ? document.getElementById('tts-lang-select').value : 'hi-IN';
        const spokenText = speechLang.startsWith('hi') ? sign.hindi : sign.english;
        speechEngine.speak(spokenText, speechLang);
      }

      // Record to history list
      addTranslationHistory(sign, confidence);

      // If user is in Practice Arena, evaluate pose
      if (learningArena) {
        learningArena.evaluateLivePose(sign.id, confidence);
      }
    };

    // Listen to real-time metrics
    visionEngine.onMetricsUpdated = (metrics) => {
      const fpsEl = document.getElementById('hud-fps');
      const lightEl = document.getElementById('hud-lighting');
      const modeEl = document.getElementById('hud-mode');

      if (fpsEl) fpsEl.textContent = `${metrics.fps} FPS`;
      if (lightEl) lightEl.textContent = `${metrics.luminance}% (${metrics.lightingStatus})`;
      if (modeEl) modeEl.textContent = metrics.isDemoMode ? 'Simulated Feed' : 'Live Camera';

      if (!metrics.handDetected && !metrics.isDemoMode) {
        if (signLabelBadge) signLabelBadge.textContent = "SEARCHING FOR HAND...";
        if (enSubtitle && enSubtitle.textContent.includes('Perform a sign')) {
          enSubtitle.textContent = "Raise your hand into the camera frame...";
          if (hiSubtitle) hiSubtitle.textContent = "कृपया अपना हाथ कैमरे के सामने लाएं...";
        }
        if (confidenceBar) confidenceBar.style.width = "0%";
        if (confidenceText) confidenceText.textContent = "0%";
      } else {
        if (confidenceBar) confidenceBar.style.width = `${metrics.confidence}%`;
        if (confidenceText) confidenceText.textContent = `${metrics.confidence}%`;
      }
    };
  }

  // Quick Gesture Simulation Buttons
  document.querySelectorAll('.btn-test-gesture').forEach(btn => {
    btn.addEventListener('click', () => {
      const signId = btn.dataset.simulate;
      if (visionEngine) {
        visionEngine.simulateSign(signId);
      }
    });
  });

  function addTranslationHistory(sign, confidence) {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    translationHistory.unshift({ sign, confidence, timestamp });
    if (translationHistory.length > 8) translationHistory.pop();

    if (!historyList) return;
    historyList.innerHTML = '';
    translationHistory.forEach(item => {
      const li = document.createElement('li');
      li.className = 'p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 flex items-center justify-between text-xs transition-all hover:border-sky-500/50';
      li.innerHTML = `
        <div class="flex items-center space-x-3">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <div>
            <div class="font-semibold text-slate-100">${item.sign.english} <span class="text-sky-400 font-hindi">(${item.sign.hindi})</span></div>
            <div class="text-[10px] text-slate-400">${item.timestamp} • ISLRTC Verified</div>
          </div>
        </div>
        <span class="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono text-[10px]">${item.confidence}% match</span>
      `;
      historyList.appendChild(li);
    });
  }

  if (startCameraBtn) {
    startCameraBtn.addEventListener('click', () => {
      if (visionEngine) visionEngine.startWebcam();
    });
  }

  if (demoFeedBtn) {
    demoFeedBtn.addEventListener('click', () => {
      if (visionEngine) visionEngine.startDemoFeed();
    });
  }

  if (toggleMirrorBtn) {
    toggleMirrorBtn.addEventListener('click', () => {
      const container = document.getElementById('camera-feed-container');
      if (container) container.classList.toggle('scale-x-[-1]');
    });
  }

  // --- REVERSE SIGN STUDIO (SPEECH/TEXT -> ISL AVATAR) ---
  const textInput = document.getElementById('reverse-text-input');
  const translateBtn = document.getElementById('btn-translate-to-isl');
  const micBtn = document.getElementById('btn-mic-input');
  const islGlossDisplay = document.getElementById('isl-gloss-tokens');
  const islGrammarNote = document.getElementById('isl-grammar-notes');
  const speedSelect = document.getElementById('avatar-speed-select');
  const replayBtn = document.getElementById('btn-avatar-replay');
  const avatarPlayPauseBtn = document.getElementById('btn-avatar-play-pause');
  const currentSignBadge = document.getElementById('avatar-current-sign-badge');

  function executeReverseTranslation(text) {
    if (!text || !text.trim()) return;

    const result = islGrammarEngine.translateTextToISL(text);

    // Render Gloss Tokens
    if (islGlossDisplay) {
      islGlossDisplay.innerHTML = '';
      result.glossTokens.forEach(token => {
        const badge = document.createElement('span');
        badge.className = 'px-3 py-1 bg-sky-500/20 border border-sky-400/40 text-sky-300 font-mono text-sm rounded-lg shadow-sm font-semibold';
        badge.textContent = `[ ${token} ]`;
        islGlossDisplay.appendChild(badge);
      });
    }

    // Render Grammar Explanation
    if (islGrammarNote) {
      islGrammarNote.innerHTML = `
        <div class="text-xs text-slate-300 leading-relaxed">
          <strong class="text-sky-400">ISL SOV Structure:</strong> ${result.islSentenceString}<br/>
          <strong class="text-emerald-400">Hindi Equiv:</strong> <span class="font-hindi">${result.hindiGlossString}</span><br/>
          <span class="text-slate-400 italic">Linguistic Note: ${result.explanation}</span>
        </div>
      `;
    }

    // Feed to Kinematic Avatar
    if (avatarRenderer && result.signSequence.length > 0) {
      avatarRenderer.loadSequence(
        result.signSequence,
        (currentSign, idx, total) => {
          if (currentSignBadge) {
            currentSignBadge.innerHTML = `Signing <strong>${currentSign.english}</strong> (${idx + 1}/${total}) • <span class="font-hindi text-sky-400">${currentSign.hindi}</span>`;
          }
        },
        () => {
          if (currentSignBadge) {
            currentSignBadge.innerHTML = `Sequence completed. Ready for next input.`;
          }
        }
      );
    }
  }

  if (translateBtn && textInput) {
    translateBtn.addEventListener('click', () => {
      executeReverseTranslation(textInput.value);
    });

    textInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        executeReverseTranslation(textInput.value);
      }
    });
  }

  // Quick Preset Prompts
  document.querySelectorAll('.preset-prompt-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const phrase = btn.dataset.phrase;
      if (textInput) textInput.value = phrase;
      executeReverseTranslation(phrase);
    });
  });

  // Microphone STT Button
  if (micBtn) {
    micBtn.addEventListener('click', () => {
      const langChoice = document.getElementById('input-lang-select') ? document.getElementById('input-lang-select').value : 'en-IN';
      speechEngine.setLanguage(langChoice);

      if (speechEngine.isListening) {
        speechEngine.stopListening();
        micBtn.classList.remove('mic-pulse');
      } else {
        micBtn.classList.add('mic-pulse');
        speechEngine.startListening(
          (result) => {
            if (textInput) textInput.value = result.finalText || result.interimText;
            if (result.isFinal) {
              micBtn.classList.remove('mic-pulse');
              executeReverseTranslation(result.finalText);
            }
          },
          (isListening) => {
            if (!isListening) micBtn.classList.remove('mic-pulse');
          }
        );
      }
    });
  }

  // Avatar Controls
  if (speedSelect && avatarRenderer) {
    speedSelect.addEventListener('change', () => {
      avatarRenderer.setSpeed(parseFloat(speedSelect.value));
    });
  }

  if (replayBtn && avatarRenderer) {
    replayBtn.addEventListener('click', () => {
      avatarRenderer.replay();
    });
  }

  if (avatarPlayPauseBtn && avatarRenderer) {
    avatarPlayPauseBtn.addEventListener('click', () => {
      if (avatarRenderer.isPlaying) {
        avatarRenderer.pause();
        avatarPlayPauseBtn.textContent = '▶ Resume';
      } else {
        avatarRenderer.play();
        avatarPlayPauseBtn.textContent = '⏸ Pause';
      }
    });
  }

  // --- TWO-WAY CONVERSATIONAL BRIDGE STUDIO ---
  const chatTranscript = document.getElementById('dialogue-transcript');
  const hearingInput = document.getElementById('hearing-speech-input');
  const sendHearingBtn = document.getElementById('btn-send-hearing');
  const hearingMicBtn = document.getElementById('btn-hearing-mic');
  const exportSessionBtn = document.getElementById('btn-export-session');

  let sessionHistory = [
    { sender: 'hearing', lang: 'English', text: 'Hello! How can I help you today?', timestamp: '10:00 AM' },
    { sender: 'deaf', lang: 'ISL', text: 'Doctor Help Need (मुझे डॉक्टर की मदद चाहिए)', timestamp: '10:01 AM' }
  ];

  function renderTranscript() {
    if (!chatTranscript) return;
    chatTranscript.innerHTML = '';
    sessionHistory.forEach(msg => {
      const isHearing = msg.sender === 'hearing';
      const bubble = document.createElement('div');
      bubble.className = `flex ${isHearing ? 'justify-end' : 'justify-start'} mb-3`;
      bubble.innerHTML = `
        <div class="max-w-[75%] rounded-2xl p-4 ${isHearing ? 'bg-sky-600/30 border border-sky-500/40 text-slate-100 rounded-tr-none' : 'bg-slate-800 border border-emerald-500/40 text-slate-100 rounded-tl-none'} shadow-sm">
          <div class="flex items-center space-x-2 text-[10px] text-slate-400 mb-1">
            <span class="font-semibold ${isHearing ? 'text-sky-300' : 'text-emerald-300'}">${isHearing ? 'Hearing User (Voice/Text)' : 'Deaf Signer (ISL Camera)'}</span>
            <span>• ${msg.timestamp}</span>
          </div>
          <div class="text-sm font-medium leading-relaxed">${msg.text}</div>
        </div>
      `;
      chatTranscript.appendChild(bubble);
    });
    chatTranscript.scrollTop = chatTranscript.scrollHeight;
  }
  renderTranscript();

  if (sendHearingBtn && hearingInput) {
    sendHearingBtn.addEventListener('click', () => {
      const txt = hearingInput.value.trim();
      if (!txt) return;

      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      sessionHistory.push({ sender: 'hearing', lang: 'Bilingual', text: txt, timestamp: time });
      hearingInput.value = '';
      renderTranscript();

      // Automatically translate and render on Avatar for Deaf signer!
      executeReverseTranslation(txt);
    });
  }

  if (exportSessionBtn) {
    exportSessionBtn.addEventListener('click', () => {
      let exportContent = `SIGNBRIDGE - ACCESSIBLE CONVERSATION TRANSCRIPT\n`;
      exportContent += `Date: ${new Date().toLocaleDateString()}\n`;
      exportContent += `Languages: English, Hindi, Indian Sign Language (ISLRTC)\n`;
      exportContent += `=========================================================\n\n`;

      sessionHistory.forEach(item => {
        exportContent += `[${item.timestamp}] [${item.sender.toUpperCase()}]: ${item.text}\n`;
      });

      const blob = new Blob([exportContent], { type: 'text/plain;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `SignBridge_Transcript_${Date.now()}.txt`;
      a.click();
    });
  }

  // --- PRACTICE & LEARNING ARENA ---
  function updateArenaUI(state) {
    const titleEl = document.getElementById('arena-track-title');
    const signNameEl = document.getElementById('arena-sign-name');
    const hindiNameEl = document.getElementById('arena-hindi-name');
    const descEl = document.getElementById('arena-sign-desc');
    const dialectEl = document.getElementById('arena-sign-dialect');
    const xpEl = document.getElementById('arena-xp-badge');
    const streakEl = document.getElementById('arena-streak-badge');
    const accBar = document.getElementById('arena-accuracy-bar');
    const accVal = document.getElementById('arena-accuracy-val');
    const hintEl = document.getElementById('arena-coaching-hint');
    const holdBar = document.getElementById('arena-hold-progress');

    if (titleEl) titleEl.textContent = state.trackTitle;
    if (xpEl) xpEl.textContent = `${state.xp} XP`;
    if (streakEl) streakEl.textContent = `${state.streak} Day Streak`;

    if (state.targetSign) {
      if (signNameEl) signNameEl.textContent = state.targetSign.english;
      if (hindiNameEl) hindiNameEl.textContent = state.targetSign.hindi;
      if (descEl) descEl.textContent = state.targetSign.description;
      if (dialectEl) dialectEl.textContent = state.targetSign.regionalVariation;

      if (arenaAvatar) {
        arenaAvatar.loadSequence([state.targetSign.id], null, null);
      }
    }

    if (accBar) accBar.style.width = `${state.accuracy}%`;
    if (accVal) accVal.textContent = `${state.accuracy}%`;
    if (hintEl && state.coachingHint) hintEl.textContent = state.coachingHint;
    if (holdBar && state.holdProgress !== undefined) {
      holdBar.style.width = `${state.holdProgress * 100}%`;
    }
  }

  learningArena.onStateChanged = (state) => {
    updateArenaUI(state);
  };

  document.querySelectorAll('.arena-track-select-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.arena-track-select-btn').forEach(b => b.classList.remove('bg-sky-600', 'text-white'));
      btn.classList.add('bg-sky-600', 'text-white');
      learningArena.setTrack(btn.dataset.track);
    });
  });

  const nextArenaBtn = document.getElementById('btn-arena-next');
  const prevArenaBtn = document.getElementById('btn-arena-prev');

  if (nextArenaBtn) {
    nextArenaBtn.addEventListener('click', () => learningArena.nextSign());
  }
  if (prevArenaBtn) {
    prevArenaBtn.addEventListener('click', () => learningArena.prevSign());
  }

  // --- ISL CORPUS EXPLORER ---
  const corpusGrid = document.getElementById('corpus-card-grid');
  const corpusSearchInput = document.getElementById('corpus-search');

  function renderCorpusGrid(category = 'all', searchQuery = '') {
    if (!corpusGrid || typeof ISL_CORPUS === 'undefined') return;
    corpusGrid.innerHTML = '';

    const q = searchQuery.toLowerCase().trim();
    const filtered = ISL_CORPUS.filter(item => {
      const matchCat = category === 'all' || item.category === category;
      const matchQuery = !q || item.english.toLowerCase().includes(q) || item.hindi.toLowerCase().includes(q) || item.transliteration.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });

    filtered.forEach(sign => {
      const card = document.createElement('div');
      card.className = 'p-5 bg-slate-800/80 rounded-2xl border border-slate-700/60 hover:border-sky-500/60 transition-all flex flex-col justify-between cursor-pointer group shadow-lg';
      card.innerHTML = `
        <div>
          <div class="flex items-center justify-between mb-3">
            <span class="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold ${sign.handUsage === 'two-handed' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'}">
              ${sign.handUsage}
            </span>
            <span class="text-xs text-slate-400 capitalize">${sign.category}</span>
          </div>
          <h3 class="text-lg font-bold text-slate-100 group-hover:text-sky-300 transition-colors">${sign.english}</h3>
          <p class="text-base font-hindi text-sky-400 mb-2 font-medium">${sign.hindi} <span class="text-xs text-slate-400 font-sans">(${sign.transliteration})</span></p>
          <p class="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-3">${sign.description}</p>
        </div>
        <div class="pt-3 border-t border-slate-700/50 flex items-center justify-between">
          <span class="text-[10px] text-slate-400 flex items-center space-x-1">
            <svg class="w-3 h-3 text-sky-400 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span>${sign.regionalVariation.slice(0, 32)}...</span>
          </span>
          <button class="px-3 py-1 bg-sky-600/30 hover:bg-sky-500/40 text-sky-300 text-xs rounded-lg font-medium transition-colors play-sign-avatar-btn">
            ▶ Play Sign
          </button>
        </div>
      `;

      card.querySelector('.play-sign-avatar-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        switchTab('reverse');
        if (textInput) textInput.value = sign.english;
        executeReverseTranslation(sign.english);
      });

      card.addEventListener('click', () => {
        switchTab('reverse');
        if (textInput) textInput.value = sign.english;
        executeReverseTranslation(sign.english);
      });

      corpusGrid.appendChild(card);
    });
  }

  if (corpusSearchInput) {
    corpusSearchInput.addEventListener('input', () => {
      const activeCatBtn = document.querySelector('.corpus-filter-btn.active');
      const cat = activeCatBtn ? activeCatBtn.dataset.category : 'all';
      renderCorpusGrid(cat, corpusSearchInput.value);
    });
  }

  document.querySelectorAll('.corpus-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.corpus-filter-btn').forEach(b => {
        b.classList.remove('active', 'bg-sky-600', 'text-white');
        b.classList.add('bg-slate-800', 'text-slate-300');
      });
      btn.classList.add('active', 'bg-sky-600', 'text-white');
      btn.classList.remove('bg-slate-800', 'text-slate-300');
      const searchVal = corpusSearchInput ? corpusSearchInput.value : '';
      renderCorpusGrid(btn.dataset.category, searchVal);
    });
  });

  // --- EMERGENCY & SOS QUICKDECK ---
  document.querySelectorAll('.sos-card-btn').forEach(card => {
    card.addEventListener('click', () => {
      const phraseEn = card.dataset.en;
      const phraseHi = card.dataset.hi;

      // Broadcast audio in both languages
      if (typeof speechEngine !== 'undefined') {
        speechEngine.speak(phraseHi, 'hi-IN');
        setTimeout(() => {
          speechEngine.speak(phraseEn, 'en-IN');
        }, 1200);
      }

      // Switch to avatar and show visual sign
      switchTab('reverse');
      if (textInput) textInput.value = phraseEn;
      executeReverseTranslation(phraseEn);
    });
  });

  // --- ACCESSIBILITY & THEME TOGGLE ---
  const themeToggleBtn = document.getElementById('btn-toggle-theme');
  const soundToggleBtn = document.getElementById('btn-toggle-sound');

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('high-contrast-mode');
      const isContrast = document.body.classList.contains('high-contrast-mode');
      themeToggleBtn.textContent = isContrast ? '☀️ Contrast: HIGH' : '🌙 Contrast: NORMAL';
    });
  }

  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      const isMuted = soundToggleBtn.dataset.muted === 'true';
      if (isMuted) {
        soundToggleBtn.dataset.muted = 'false';
        soundToggleBtn.textContent = '🔊 Audio: ON';
        if (typeof audioFeedback !== 'undefined') audioFeedback.toggle(true);
      } else {
        soundToggleBtn.dataset.muted = 'true';
        soundToggleBtn.textContent = '🔇 Audio: OFF';
        if (typeof audioFeedback !== 'undefined') audioFeedback.toggle(false);
      }
    });
  }

  // Initial tab setup
  switchTab('live');
});
