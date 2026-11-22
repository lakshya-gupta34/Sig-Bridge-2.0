/**
 * SignBridge - Expressive Kinematic ISL Avatar Renderer
 * 
 * Features:
 * - HTML5 2D Canvas vector rendering of human upper-torso and articulated dual arms
 * - Realistic anatomical joint kinematics (Shoulder -> Elbow -> Wrist -> 5 Fingers)
 * - Cubic-bezier smooth motion interpolation between sequential ISL signs
 * - Facial expression synthesis (eye blinking, eyebrow raising on questions)
 * - Motion vector trajectory trails showing signing paths
 * - Step scrubber, speed controls (0.5x, 1x, 1.5x), replay and loop modes
 */

class ISLAvatarRenderer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;

    // Viewport dimensions
    this.width = this.canvas ? this.canvas.width : 600;
    this.height = this.canvas ? this.canvas.height : 500;

    // Animation state
    this.isPlaying = false;
    this.playbackSpeed = 1.0; // 0.5, 1.0, 1.5
    this.sequence = []; // Array of sign objects
    this.currentIndex = 0;
    this.progress = 0; // 0.0 to 1.0 within current sign
    this.lastFrameTime = performance.now();

    // Natural facial micro-motions
    this.blinkTimer = 0;
    this.isBlinking = false;
    this.eyeBrowRaise = 0; // 0 to 1

    // Default neutral rest pose (hands resting casually near lower chest/hips)
    this.neutralPose = {
      leftHand: { wrist: { x: 0.38, y: 0.78 }, index: { x: 0.38, y: 0.86 }, middle: { x: 0.39, y: 0.87 }, thumb: { x: 0.36, y: 0.81 }, ring: { x: 0.40, y: 0.86 }, pinky: { x: 0.41, y: 0.85 } },
      rightHand: { wrist: { x: 0.62, y: 0.78 }, index: { x: 0.62, y: 0.86 }, middle: { x: 0.61, y: 0.87 }, thumb: { x: 0.64, y: 0.81 }, ring: { x: 0.60, y: 0.86 }, pinky: { x: 0.59, y: 0.85 } }
    };

    // Current interpolated joint positions
    this.currentPose = JSON.parse(JSON.stringify(this.neutralPose));
    this.previousPose = JSON.parse(JSON.stringify(this.neutralPose));
    this.targetPose = JSON.parse(JSON.stringify(this.neutralPose));

    // Trajectory history for path trail rendering
    this.motionTrail = [];

    // Callbacks
    this.onSignChangeCallback = null;
    this.onSequenceCompleteCallback = null;

    if (this.canvas) {
      this.initCanvas();
      this.renderLoop = this.renderLoop.bind(this);
      requestAnimationFrame(this.renderLoop);
    }
  }

  initCanvas() {
    // Handle Retina / HiDPI crisp scaling
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = (rect.width || 600) * dpr;
    this.canvas.height = (rect.height || 500) * dpr;
    this.ctx.scale(dpr, dpr);
    this.width = rect.width || 600;
    this.height = rect.height || 500;
  }

  setSpeed(speed) {
    this.playbackSpeed = speed;
  }

  /**
   * Load an ISL sign sequence into the avatar player
   */
  loadSequence(signIds, onSignChange, onComplete) {
    this.onSignChangeCallback = onSignChange;
    this.onSequenceCompleteCallback = onComplete;

    this.sequence = [];
    signIds.forEach(id => {
      const cleanId = id.toLowerCase();
      if (typeof ISL_BY_ID !== 'undefined' && ISL_BY_ID[cleanId]) {
        this.sequence.push(ISL_BY_ID[cleanId]);
      } else {
        // Fallback generic sign
        this.sequence.push({
          id: cleanId,
          english: cleanId.toUpperCase(),
          hindi: cleanId,
          category: 'general',
          handUsage: 'one-handed',
          description: `Finger-spelling / general sign for "${cleanId}"`,
          motionTrajectory: 'front_gesture',
          landmarkTarget: {
            leftHand: null,
            rightHand: { wrist: { x: 0.58, y: 0.55 }, index: { x: 0.55, y: 0.40 }, middle: { x: 0.54, y: 0.42 }, thumb: { x: 0.60, y: 0.48 }, ring: { x: 0.53, y: 0.46 }, pinky: { x: 0.52, y: 0.50 } }
          }
        });
      }
    });

    this.currentIndex = 0;
    this.progress = 0;
    this.previousPose = JSON.parse(JSON.stringify(this.currentPose));
    this.updateTargetForCurrentSign();
    this.motionTrail = [];
    this.isPlaying = true;

    if (this.onSignChangeCallback && this.sequence[0]) {
      this.onSignChangeCallback(this.sequence[0], 0, this.sequence.length);
    }
  }

  play() {
    this.isPlaying = true;
  }

  pause() {
    this.isPlaying = false;
  }

  replay() {
    this.currentIndex = 0;
    this.progress = 0;
    this.previousPose = JSON.parse(JSON.stringify(this.neutralPose));
    this.updateTargetForCurrentSign();
    this.motionTrail = [];
    this.isPlaying = true;

    if (this.onSignChangeCallback && this.sequence[0]) {
      this.onSignChangeCallback(this.sequence[0], 0, this.sequence.length);
    }
  }

  seek(index) {
    if (index >= 0 && index < this.sequence.length) {
      this.currentIndex = index;
      this.progress = 0;
      this.previousPose = JSON.parse(JSON.stringify(this.currentPose));
      this.updateTargetForCurrentSign();
      this.motionTrail = [];

      if (this.onSignChangeCallback && this.sequence[this.currentIndex]) {
        this.onSignChangeCallback(this.sequence[this.currentIndex], this.currentIndex, this.sequence.length);
      }
    }
  }

  updateTargetForCurrentSign() {
    if (this.currentIndex < this.sequence.length) {
      const currentSign = this.sequence[this.currentIndex];
      const target = currentSign.landmarkTarget;

      // Check if sign is question: raise eyebrows
      this.eyeBrowRaise = currentSign.category === 'questions' ? 1.0 : 0.0;

      // If one-handed sign, keep non-dominant hand in neutral rest position
      this.targetPose = {
        leftHand: target.leftHand ? JSON.parse(JSON.stringify(target.leftHand)) : JSON.parse(JSON.stringify(this.neutralPose.leftHand)),
        rightHand: target.rightHand ? JSON.parse(JSON.stringify(target.rightHand)) : JSON.parse(JSON.stringify(this.neutralPose.rightHand))
      };
    } else {
      // Transition back to neutral rest pose at end of sequence
      this.targetPose = JSON.parse(JSON.stringify(this.neutralPose));
      this.eyeBrowRaise = 0.0;
    }
  }

  /**
   * Smooth easing function (Cubic In-Out)
   */
  easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  /**
   * Main Render and Animation Loop
   */
  renderLoop(timestamp) {
    const deltaTime = (timestamp - this.lastFrameTime) / 1000;
    this.lastFrameTime = timestamp;

    // Handle blinking logic
    this.blinkTimer += deltaTime;
    if (this.blinkTimer > 3.8) {
      this.isBlinking = true;
      if (this.blinkTimer > 4.0) {
        this.isBlinking = false;
        this.blinkTimer = 0;
      }
    }

    // Advance sign animation progress
    if (this.isPlaying && this.sequence.length > 0) {
      const stepDuration = 1.4 / this.playbackSpeed; // ~1.4 seconds per sign
      this.progress += deltaTime / stepDuration;

      if (this.progress >= 1.0) {
        // Move to next sign
        this.progress = 0;
        this.currentIndex++;

        if (this.currentIndex >= this.sequence.length) {
          // Finished entire sentence
          this.isPlaying = false;
          this.previousPose = JSON.parse(JSON.stringify(this.currentPose));
          this.targetPose = JSON.parse(JSON.stringify(this.neutralPose));
          if (this.onSequenceCompleteCallback) {
            this.onSequenceCompleteCallback();
          }
        } else {
          this.previousPose = JSON.parse(JSON.stringify(this.currentPose));
          this.updateTargetForCurrentSign();
          this.motionTrail = [];

          if (this.onSignChangeCallback && this.sequence[this.currentIndex]) {
            this.onSignChangeCallback(this.sequence[this.currentIndex], this.currentIndex, this.sequence.length);
          }
        }
      }
    }

    // Interpolate joint positions
    const easedT = this.easeInOutCubic(Math.min(1.0, this.progress));
    this.interpolatePoses(this.previousPose, this.targetPose, easedT);

    // Record motion trail
    if (this.currentPose.rightHand && this.currentPose.rightHand.wrist) {
      this.motionTrail.push({
        x: this.currentPose.rightHand.wrist.x * this.width,
        y: this.currentPose.rightHand.wrist.y * this.height,
        alpha: 1.0
      });
      if (this.motionTrail.length > 20) this.motionTrail.shift();
    }

    // Draw scene
    this.drawScene();

    requestAnimationFrame(this.renderLoop);
  }

  interpolatePoses(fromPose, toPose, t) {
    ['leftHand', 'rightHand'].forEach(hand => {
      if (!fromPose[hand] || !toPose[hand]) return;

      Object.keys(toPose[hand]).forEach(joint => {
        const p1 = fromPose[hand][joint] || toPose[hand][joint];
        const p2 = toPose[hand][joint];
        this.currentPose[hand][joint] = {
          x: p1.x + (p2.x - p1.x) * t,
          y: p1.y + (p2.y - p1.y) * t
        };
      });
    });
  }

  /**
   * Draw complete Avatar frame
   */
  drawScene() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    ctx.clearRect(0, 0, w, h);

    // Modern studio gradient backdrop
    const bgGradient = ctx.createLinearGradient(0, 0, 0, h);
    bgGradient.addColorStop(0, '#0f172a'); // slate-900
    bgGradient.addColorStop(1, '#1e293b'); // slate-800
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, w, h);

    // Subtle signing space boundary guide (dotted oval)
    ctx.beginPath();
    ctx.ellipse(w * 0.5, h * 0.56, w * 0.38, h * 0.36, 0, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.12)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 5]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw motion trail of dominant hand
    this.drawMotionTrail();

    // Anatomical Anchor Reference points
    const headCenter = { x: w * 0.5, y: h * 0.22 };
    const leftShoulder = { x: w * 0.36, y: h * 0.40 };
    const rightShoulder = { x: w * 0.64, y: h * 0.40 };
    const chestCenter = { x: w * 0.5, y: h * 0.48 };

    // 1. Draw Torso & Collar
    this.drawTorso(chestCenter, leftShoulder, rightShoulder);

    // 2. Draw Head, Eyes, Eyebrows & Smile
    this.drawHead(headCenter);

    // 3. Draw Arms and Hands (Left Hand then Right Hand)
    this.drawArmAndHand('left', leftShoulder, this.currentPose.leftHand);
    this.drawArmAndHand('right', rightShoulder, this.currentPose.rightHand);
  }

  drawMotionTrail() {
    const ctx = this.ctx;
    if (this.motionTrail.length < 2) return;

    ctx.save();
    for (let i = 1; i < this.motionTrail.length; i++) {
      const pt1 = this.motionTrail[i - 1];
      const pt2 = this.motionTrail[i];
      const alpha = (i / this.motionTrail.length) * 0.5;

      ctx.beginPath();
      ctx.moveTo(pt1.x, pt1.y);
      ctx.lineTo(pt2.x, pt2.y);
      ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`; // sky-400
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.stroke();
    }
    ctx.restore();
  }

  drawHead(center) {
    const ctx = this.ctx;
    const r = this.width * 0.085;

    // Head Base Shadow / Skin tone
    ctx.save();
    ctx.beginPath();
    ctx.arc(center.x, center.y, r, 0, Math.PI * 2);
    const skinGrad = ctx.createRadialGradient(center.x - r * 0.2, center.y - r * 0.2, r * 0.1, center.x, center.y, r);
    skinGrad.addColorStop(0, '#ffd8b5'); // Indian warm skin highlight
    skinGrad.addColorStop(1, '#e29b64'); // Indian warm skin shade
    ctx.fillStyle = skinGrad;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.restore();

    // Stylized Dark Hair
    ctx.beginPath();
    ctx.arc(center.x, center.y - r * 0.15, r * 1.05, Math.PI * 0.85, Math.PI * 2.15);
    ctx.fillStyle = '#1e293b';
    ctx.fill();

    // Eyebrows (raise on questions for authentic ISL non-manual grammar)
    const browOffset = this.eyeBrowRaise * 5;
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';

    // Left Brow
    ctx.beginPath();
    ctx.moveTo(center.x - r * 0.5, center.y - r * 0.25 - browOffset);
    ctx.lineTo(center.x - r * 0.15, center.y - r * 0.28 - browOffset);
    ctx.stroke();

    // Right Brow
    ctx.beginPath();
    ctx.moveTo(center.x + r * 0.15, center.y - r * 0.28 - browOffset);
    ctx.lineTo(center.x + r * 0.5, center.y - r * 0.25 - browOffset);
    ctx.stroke();

    // Eyes (with natural blinking)
    if (this.isBlinking) {
      ctx.beginPath();
      ctx.moveTo(center.x - r * 0.45, center.y - r * 0.1);
      ctx.lineTo(center.x - r * 0.2, center.y - r * 0.1);
      ctx.moveTo(center.x + r * 0.2, center.y - r * 0.1);
      ctx.lineTo(center.x + r * 0.45, center.y - r * 0.1);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2.5;
      ctx.stroke();
    } else {
      // Open eyes
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(center.x - r * 0.32, center.y - r * 0.1, 4.5, 0, Math.PI * 2);
      ctx.arc(center.x + r * 0.32, center.y - r * 0.1, 4.5, 0, Math.PI * 2);
      ctx.fill();

      // Eye reflections
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(center.x - r * 0.34, center.y - r * 0.12, 1.5, 0, Math.PI * 2);
      ctx.arc(center.x + r * 0.30, center.y - r * 0.12, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Warm, welcoming smile
    ctx.beginPath();
    ctx.arc(center.x, center.y + r * 0.28, r * 0.35, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.strokeStyle = '#c2410c';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.stroke();
  }

  drawTorso(chest, leftShoulder, rightShoulder) {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    // Neck
    ctx.beginPath();
    ctx.rect(w * 0.46, h * 0.28, w * 0.08, h * 0.1);
    ctx.fillStyle = '#d97736';
    ctx.fill();

    // Modern Navy / Teal Shirt Body
    ctx.beginPath();
    ctx.moveTo(leftShoulder.x, leftShoulder.y);
    ctx.quadraticCurveTo(chest.x, chest.y - 10, rightShoulder.x, rightShoulder.y);
    ctx.lineTo(w * 0.74, h);
    ctx.lineTo(w * 0.26, h);
    ctx.closePath();

    const shirtGrad = ctx.createLinearGradient(0, leftShoulder.y, 0, h);
    shirtGrad.addColorStop(0, '#1e3a8a'); // royal indigo
    shirtGrad.addColorStop(1, '#0f172a');
    ctx.fillStyle = shirtGrad;
    ctx.fill();

    // Stylish Collar V-Neck
    ctx.beginPath();
    ctx.moveTo(w * 0.44, leftShoulder.y - 5);
    ctx.lineTo(w * 0.5, h * 0.46);
    ctx.lineTo(w * 0.56, rightShoulder.y - 5);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2.5;
    ctx.stroke();
  }

  /**
   * Articulated Kinematic Arm & Hand with 5 Distinct Fingers
   */
  drawArmAndHand(side, shoulder, handTarget) {
    if (!handTarget || !handTarget.wrist) return;
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    const wrist = {
      x: handTarget.wrist.x * w,
      y: handTarget.wrist.y * h
    };

    // Calculate natural elbow position via geometric inverse kinematics bend
    const midX = (shoulder.x + wrist.x) / 2;
    const midY = (shoulder.y + wrist.y) / 2;
    const elbowOffset = side === 'left' ? -w * 0.07 : w * 0.07;
    const elbow = {
      x: midX + elbowOffset,
      y: midY + 15
    };

    // 1. Draw Upper Arm (Shoulder -> Elbow)
    ctx.beginPath();
    ctx.moveTo(shoulder.x, shoulder.y);
    ctx.lineTo(elbow.x, elbow.y);
    ctx.strokeStyle = '#1e3a8a';
    ctx.lineWidth = 22;
    ctx.lineCap = 'round';
    ctx.stroke();

    // 2. Draw Forearm (Elbow -> Wrist)
    ctx.beginPath();
    ctx.moveTo(elbow.x, elbow.y);
    ctx.lineTo(wrist.x, wrist.y);
    ctx.strokeStyle = '#e29b64'; // Forearm skin
    ctx.lineWidth = 16;
    ctx.lineCap = 'round';
    ctx.stroke();

    // 3. Draw Palm / Hand Base
    ctx.beginPath();
    ctx.arc(wrist.x, wrist.y, 14, 0, Math.PI * 2);
    ctx.fillStyle = '#f0a369';
    ctx.fill();
    ctx.strokeStyle = '#c9783c';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // 4. Draw 5 Articulated Fingers (Thumb, Index, Middle, Ring, Pinky)
    const fingers = ['thumb', 'index', 'middle', 'ring', 'pinky'];
    const fingerColors = ['#f5ab73', '#ffd8b5', '#ffd8b5', '#ffd8b5', '#ffd8b5'];

    fingers.forEach((fingerName, fIdx) => {
      const tipData = handTarget[fingerName];
      if (tipData) {
        const tipX = tipData.x * w;
        const tipY = tipData.y * h;

        // Draw finger segment from wrist to tip
        ctx.beginPath();
        ctx.moveTo(wrist.x, wrist.y);
        ctx.lineTo(tipX, tipY);
        ctx.strokeStyle = fingerColors[fIdx];
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Finger joint node tip
        ctx.beginPath();
        ctx.arc(tipX, tipY, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#ffeedd';
        ctx.fill();
        ctx.strokeStyle = '#d97736';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    });
  }
}
