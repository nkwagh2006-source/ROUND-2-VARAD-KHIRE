/**
 * RageBaiting — Opposite Edition & Screen Inverter System
 * Pure Vanilla JavaScript with Web Audio API sound synthesis
 */

// Application State
const state = {
  loginAttempts: 0,
  maxLoginAttempts: 3,
  username: "SpeedRacer",
  isLoggingIn: false,
  popupIndex: 1,
  maxPopups: 55,
  soundMuted: false,
  lifetimeYears: 250,
  isPopupActive: false,
  isInvertedMode: false,
  gradIndex: 0
};

// Sarcastic Graduating Statements (Normal vs Inverted Truths)
const graduatingStatements = [
  {
    normal: "🎓 You are officially enrolled in the prestigious Academy of Digital Sufferers.",
    inverted: "TRANSLATION: You have zero patience and this website knows it."
  },
  {
    normal: "🎓 Conferred: Bachelor of Arts in Clicking Broken Popups (Summa Cum Rage).",
    inverted: "TRANSLATION: You could have finished laundry, but chose this instead."
  },
  {
    normal: "🎓 Thesis Defense Approved: 'Why Does 'Close' Actually Mean 'Keep'?'",
    inverted: "TRANSLATION: The developer is giggling uncontrollably right now."
  },
  {
    normal: "🎓 Dean's List Honor: 3 Vehicle Ignition Stalls Endured Without Smashing Mouse.",
    inverted: "TRANSLATION: Your blood pressure is reaching historic astronomical heights."
  },
  {
    normal: "🎓 Official Diploma Conferred: Lifetime Doctorate in Pointless Digital Endurance.",
    inverted: "TRANSLATION: Congratulations! You unlocked absolutely nothing useful."
  }
];

// Web Audio API Sound Synthesizer
class SoundFX {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Dual chime "ting ting" sound
  playTingTing() {
    if (state.soundMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Note 1 (880Hz)
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(880, now);
      gain1.gain.setValueAtTime(0.25, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.3);

      // Note 2 (1320Hz)
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1320, now + 0.12);
      gain2.gain.setValueAtTime(0.3, now + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now + 0.12);
      osc2.stop(now + 0.45);
    } catch (e) {}
  }

  // Error buzzer for the "Close" trap button
  playBuzzer() {
    if (state.soundMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, now);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) {}
  }

  // Inverter switch tone
  playInvertTone() {
    if (state.soundMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.25);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    } catch (e) {}
  }

  // Fanfare celebration
  playFanfare() {
    if (state.soundMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = this.ctx.currentTime + (idx * 0.09);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.2, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.35);
      });
    } catch (e) {}
  }
}

const sound = new SoundFX();

// DOM References
const loginView = document.getElementById('login-view');
const profileView = document.getElementById('profile-view');
const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const loginSubmitBtn = document.getElementById('login-submit-btn');
const loginLoadingOverlay = document.getElementById('login-loading-overlay');
const loginProgressBar = document.getElementById('login-progress-bar');
const loginProgressPercent = document.getElementById('login-progress-percent');
const progressStepMsg = document.getElementById('progress-step-msg');
const loadingStatusText = document.getElementById('loading-status-text');
const loginErrorMsg = document.getElementById('login-error-msg');
const attemptStatusText = document.getElementById('attempt-status-text');

// Graduation and Inverter Elements
const gradStatementText = document.getElementById('grad-statement-text');
const invertedStatementText = document.getElementById('inverted-statement-text');
const toggleFullInvertBtn = document.getElementById('toggle-full-invert-btn');
const invertBtnLabel = document.getElementById('invert-btn-label');
const diplomaStatement = document.getElementById('diploma-statement');

// Modals
const achievementModal = document.getElementById('achievement-modal');
const achievementContinueBtn = document.getElementById('achievement-continue-btn');
const welcomePopupsLayer = document.getElementById('welcome-popups-layer');
const welcomePopupBox = document.getElementById('welcome-popup-box');
const popupCounterText = document.getElementById('popup-counter-text');
const popupProgressFill = document.getElementById('popup-progress-fill');
const popupSnarkText = document.getElementById('popup-snark-text');
const popupKeepBtn = document.getElementById('popup-keep-btn');
const popupCloseBtn = document.getElementById('popup-close-btn');
const closePrankModal = document.getElementById('close-prank-modal');
const prankStayBtn = document.getElementById('prank-stay-btn');
const prankLeaveBtn = document.getElementById('prank-leave-btn');
const escapeScreenModal = document.getElementById('escape-screen-modal');
const escapeRestartBtn = document.getElementById('escape-restart-btn');
const navRestartBtn = document.getElementById('nav-restart-btn');

// Fake Laptop Window Controls
const fakeLaptopWindow = document.getElementById('fake-laptop-window');
const winBtnMinimize = document.getElementById('win-btn-minimize');
const winBtnMaximize = document.getElementById('win-btn-maximize');
const winBtnClose = document.getElementById('win-btn-close');
const restoreTinyWinBtn = document.getElementById('restore-tiny-win-btn');
const displayUsername = document.getElementById('display-username');
const lifetimeCounterNumber = document.getElementById('lifetime-counter-number');
const closeWebsitePrankBtn = document.getElementById('close-website-prank-btn');

// Sound Toggle
const globalSoundToggle = document.getElementById('global-sound-toggle');
const soundIcon = document.getElementById('sound-icon');
const soundLabel = document.getElementById('sound-label');

// Toast Notification Helper
function showToast(title, message, type = 'info', duration = 3500) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div class="toast-content">
      <strong>${title}</strong>
      <p>${message}</p>
    </div>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideToastOut 0.3s ease forwards';
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, duration);
}

// Sound Toggle Handler
globalSoundToggle.addEventListener('click', () => {
  state.soundMuted = !state.soundMuted;
  if (state.soundMuted) {
    soundIcon.className = 'fa-solid fa-volume-xmark';
    soundLabel.textContent = 'Sound: OFF';
    globalSoundToggle.classList.add('muted');
    showToast('Sound Muted', 'Audio effects disabled.', 'info', 2000);
  } else {
    soundIcon.className = 'fa-solid fa-volume-high';
    soundLabel.textContent = 'Sound: ON';
    globalSoundToggle.classList.remove('muted');
    sound.init();
    sound.playTingTing();
    showToast('Sound Active', 'Opposite chimes enabled!', 'info', 2000);
  }
});

// Sound activation on first user interaction
document.addEventListener('pointerdown', () => {
  sound.init();
}, { once: true });

// ==========================================================================
// GRADUATING STATEMENTS & HALF-SCREEN INVERTER SYSTEM
// ==========================================================================
function cycleGraduationStatement() {
  state.gradIndex = (state.gradIndex + 1) % graduatingStatements.length;
  const item = graduatingStatements[state.gradIndex];
  gradStatementText.textContent = item.normal;
  invertedStatementText.textContent = item.inverted;
}

// Toggle Screen Inverter Button
toggleFullInvertBtn.addEventListener('click', () => {
  state.isInvertedMode = !state.isInvertedMode;
  document.body.classList.toggle('inverted-mode', state.isInvertedMode);
  sound.playInvertTone();

  if (state.isInvertedMode) {
    invertBtnLabel.textContent = 'Invert Screen: ON';
    showToast('Inverter Activated', 'Opposite reality exposed. What was dark is light, what was true is fake!', 'warning', 3000);
  } else {
    invertBtnLabel.textContent = 'Invert Screen: OFF';
    showToast('Normal Reality', 'Returned to standard digital suffering.', 'info', 2500);
  }
});

// ==========================================================================
// 1. LOGIN SYSTEM — 3 RAGE VEHICLE STALLS
// ==========================================================================
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (state.isLoggingIn) return;

  const enteredName = usernameInput.value.trim() || 'SpeedRacer';
  state.username = enteredName;

  runVehicleLogin();
});

function runVehicleLogin() {
  state.isLoggingIn = true;
  loginSubmitBtn.disabled = true;

  // Reset overlay
  loginLoadingOverlay.classList.remove('hidden');
  loginErrorMsg.classList.add('hidden');
  loginProgressBar.style.width = '1%';
  loginProgressPercent.textContent = '1%';
  loadingStatusText.textContent = `Ignition Lap #${state.loginAttempts + 1}: Accelerating engine...`;
  progressStepMsg.textContent = 'Injecting fuel into the rage carburetor...';

  let currentSpeed = 1;
  const targetSpeed = 99;

  // Rapid acceleration from 1% to 99%
  const speedInterval = setInterval(() => {
    currentSpeed += Math.floor(Math.random() * 8) + 4;

    if (currentSpeed >= 50 && currentSpeed < 80) {
      progressStepMsg.textContent = 'Turbos spooling! Screaming past 70 MPH...';
    } else if (currentSpeed >= 80) {
      progressStepMsg.textContent = 'Redlining at 99 MPH! Prepare for stall...';
    }

    if (currentSpeed >= targetSpeed) {
      currentSpeed = targetSpeed;
      clearInterval(speedInterval);
      loginProgressBar.style.width = '99%';
      loginProgressPercent.textContent = '99%';

      // 4-SECOND FREEZE AT 99% (ENGINE STALL)
      progressStepMsg.textContent = 'Engine coughing! Stalled at 99% (4-second lockup)...';

      setTimeout(() => {
        handlePost99Stall();
      }, 4000);
    } else {
      loginProgressBar.style.width = `${currentSpeed}%`;
      loginProgressPercent.textContent = `${currentSpeed}%`;
    }
  }, 40);
}

function handlePost99Stall() {
  state.loginAttempts++;
  updateLapPills();
  cycleGraduationStatement();

  if (state.loginAttempts < state.maxLoginAttempts) {
    // Show Error Message: "Shit! Something went wrong. Please log in again."
    sound.playBuzzer();
    loginErrorMsg.classList.remove('hidden');
    showToast('Engine Stalled', 'Shit! Something went wrong. Please log in again.', 'error', 4500);

    setTimeout(() => {
      loginLoadingOverlay.classList.add('hidden');
      state.isLoggingIn = false;
      loginSubmitBtn.disabled = false;
      attemptStatusText.textContent = `Lap ${state.loginAttempts} failed. Re-enter credentials (${state.loginAttempts}/${state.maxLoginAttempts}).`;
    }, 2000);

  } else {
    // 3rd Attempt Successful! Show Achievement Modal
    sound.playFanfare();
    loginLoadingOverlay.classList.add('hidden');
    state.isLoggingIn = false;
    loginSubmitBtn.disabled = false;
    achievementModal.classList.remove('hidden');
  }
}

function updateLapPills() {
  for (let i = 1; i <= 3; i++) {
    const pill = document.getElementById(`pill-${i}`);
    if (!pill) continue;

    if (i < state.loginAttempts) {
      pill.className = 'gauge-pill failed';
      pill.innerHTML = `<i class="fa-solid fa-ban"></i> Lap ${i}: Stalled`;
    } else if (i === state.loginAttempts) {
      if (state.loginAttempts === state.maxLoginAttempts) {
        pill.className = 'gauge-pill passed';
        pill.innerHTML = `<i class="fa-solid fa-flag-checkered"></i> Lap 3: Passed!`;
      } else {
        pill.className = 'gauge-pill failed';
        pill.innerHTML = `<i class="fa-solid fa-ban"></i> Lap ${i}: Stalled`;
      }
    } else if (i === state.loginAttempts + 1) {
      pill.className = 'gauge-pill active';
      pill.innerHTML = `<i class="fa-solid fa-car-side"></i> Lap ${i}: Ready`;
    }
  }
}

achievementContinueBtn.addEventListener('click', () => {
  achievementModal.classList.add('hidden');
  loginView.classList.add('hidden');
  startReversePopupSequence();
});

// ==========================================================================
// 2. WELCOME POPUP RAGEBAIT — THE OPPOSITE FUNCTION
// ==========================================================================
function startReversePopupSequence() {
  state.isPopupActive = true;
  state.popupIndex = 1;
  welcomePopupsLayer.classList.remove('hidden');
  renderReversePopup();
}

function renderReversePopup() {
  if (!state.isPopupActive) return;

  popupCounterText.innerHTML = `<i class="fa-solid fa-bell"></i> Welcome Popup: ${state.popupIndex}/${state.maxPopups}`;
  
  const fillWidth = (state.popupIndex / state.maxPopups) * 100;
  popupProgressFill.style.width = `${fillWidth}%`;

  // Snarky hint explaining the opposite trick
  if (state.popupIndex === 1) {
    popupSnarkText.textContent = "Remember: This is Opposite Day. 'KEEP POPUP' dismisses it. 'CLOSE POPUP' traps you!";
  } else if (state.popupIndex % 10 === 0) {
    popupSnarkText.textContent = `Popup ${state.popupIndex} of 55! Still pressing 'Keep' to dismiss? Good hacker.`;
  } else {
    popupSnarkText.textContent = `Popup #${state.popupIndex}: Click 'KEEP POPUP' or anywhere on this card to dismiss!`;
  }

  // Chime sound on each popup
  sound.playTingTing();
}

// THE OPPOSITE BEHAVIOR:
// 1. "KEEP POPUP 😊" -> Actually CLOSES / Advances the popup!
popupKeepBtn.addEventListener('click', (e) => {
  e.stopPropagation(); // Avoid double trigger
  dismissPopupAndAdvance();
});

// Clicking on the popup card body also closes it!
welcomePopupBox.addEventListener('click', (e) => {
  // If user didn't click the Close button directly
  if (e.target.closest('#popup-close-btn')) return;
  dismissPopupAndAdvance();
});

function dismissPopupAndAdvance() {
  if (!state.isPopupActive) return;

  if (state.popupIndex < state.maxPopups) {
    state.popupIndex++;
    cycleGraduationStatement();
    renderReversePopup();
  } else {
    // All 55 popups cleared!
    finishPopups();
  }
}

// 2. "CLOSE POPUP ❌" -> Refuses to close, shakes, and KEEPS IT!
popupCloseBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  sound.playBuzzer();

  // Furious shake animation
  welcomePopupBox.classList.remove('shake-anim');
  void welcomePopupBox.offsetWidth; // Reflow
  welcomePopupBox.classList.add('shake-anim');

  showToast(
    'Opposite Day Activated! ❌',
    "You clicked CLOSE! So on this website, that means KEEP IT! Click 'KEEP POPUP' if you want it gone!",
    'error',
    3500
  );
});

function finishPopups() {
  state.isPopupActive = false;
  welcomePopupsLayer.classList.add('hidden');
  showToast(
    'Survivor Honors 🤡',
    'Finally! You survived 55 welcome messages and decoded the opposite buttons. Welcome to your profile.',
    'success',
    5000
  );
  openProfilePage();
}

// ==========================================================================
// 3. PROFILE PAGE & FAKE LAPTOP WINDOW
// ==========================================================================
function openProfilePage() {
  loginView.classList.add('hidden');
  profileView.classList.remove('hidden');

  displayUsername.textContent = state.username || 'SpeedRacer';
  diplomaStatement.innerHTML = `"Be it known that <strong>${state.username}</strong> has officially graduated with Honors from the School of Endless Delays. You survived 3 vehicle ignition stalls, decoded the opposite popup trap, and earned a permanent place in our hall of fame."`;

  animateLifetimeDisplay(state.lifetimeYears);
}

// Fake Laptop Window Controls
// Minimize Button
winBtnMinimize.addEventListener('click', () => {
  showToast('Minimize Denied', 'You wanted to minimize your problems?', 'warning', 3500);
});

// Maximize Button -> Shrinks to tiny box!
winBtnMaximize.addEventListener('click', () => {
  fakeLaptopWindow.classList.add('is-tiny');
  showToast('Maximized', 'Maximum disappointment achieved.', 'error', 4000);
});

// Restore Window Button
restoreTinyWinBtn.addEventListener('click', () => {
  fakeLaptopWindow.classList.remove('is-tiny');
  showToast('Restored', 'Window brought back from the micro-verse.', 'success', 2500);
});

// Close Button
winBtnClose.addEventListener('click', () => {
  showToast('Restricted', 'Closing is a premium feature.', 'error', 3500);
});

// ==========================================================================
// 4. 250 YEARS LIFETIME SECTION
// ==========================================================================
function animateLifetimeDisplay(targetYears) {
  lifetimeCounterNumber.textContent = `${targetYears} YEARS`;
}

// ==========================================================================
// 5. BOSS SURVEILLANCE & OPPOSITE EXIT LOGIC
// ==========================================================================
closeWebsitePrankBtn.addEventListener('click', () => {
  closePrankModal.classList.remove('hidden');
});

// "OK, KEEP ME ON THIS WEBSITE 😭" -> Actually LEAVES the website (Opposite Function!)
// Shows: "YOU ARE LEAVING... BUT I WILL GRAB YOU AGAIN! 🪝😈"
prankStayBtn.addEventListener('click', () => {
  closePrankModal.classList.add('hidden');
  state.isPopupActive = false;
  sound.playFanfare();
  escapeScreenModal.classList.remove('hidden');
  showToast(
    'Opposite Escape Triggered! 👔',
    "You said 'Keep me', so we threw you out! But we will grab you again!",
    'success',
    4000
  );
});

// "I'M LEAVING ANYWAY 🏃‍♂️" -> TRAPS YOU and refuses to let you leave!
prankLeaveBtn.addEventListener('click', () => {
  sound.playBuzzer();
  
  // Shake prank modal
  const box = closePrankModal.querySelector('.modal-box');
  if (box) {
    box.classList.remove('shake-anim');
    void box.offsetWidth;
    box.classList.add('shake-anim');
  }

  state.lifetimeYears += 250;
  animateLifetimeDisplay(state.lifetimeYears);

  showToast(
    'Boss Intercepted You! 👔📈',
    `Leaving denied! Your manager caught you Alt-Tabbing! Mandatory overtime: +250 years added (Total: ${state.lifetimeYears} Years)!`,
    'error',
    5000
  );

  setTimeout(() => {
    closePrankModal.classList.add('hidden');
  }, 1600);
});

// ==========================================================================
// RESTART & RESET EVERYTHING
// ==========================================================================
function resetApplication() {
  state.isPopupActive = false;
  state.loginAttempts = 0;
  state.popupIndex = 1;
  state.lifetimeYears = 250;
  state.isLoggingIn = false;
  state.isInvertedMode = false;

  document.body.classList.remove('inverted-mode');
  invertBtnLabel.textContent = 'Invert Screen: OFF';

  achievementModal.classList.add('hidden');
  welcomePopupsLayer.classList.add('hidden');
  closePrankModal.classList.add('hidden');
  escapeScreenModal.classList.add('hidden');

  fakeLaptopWindow.classList.remove('is-tiny');

  for (let i = 1; i <= 3; i++) {
    const pill = document.getElementById(`pill-${i}`);
    if (pill) {
      if (i === 1) {
        pill.className = 'gauge-pill active';
        pill.innerHTML = `<i class="fa-solid fa-car-side"></i> Lap 1: Ready`;
      } else {
        pill.className = 'gauge-pill';
        pill.innerHTML = `<i class="fa-solid fa-car-side"></i> Lap ${i}: Locked`;
      }
    }
  }

  attemptStatusText.textContent = 'Vehicle ignition test: 3 attempts strictly mandatory.';
  profileView.classList.add('hidden');
  loginView.classList.remove('hidden');
  loginSubmitBtn.disabled = false;
  loginLoadingOverlay.classList.add('hidden');

  showToast('Reset Complete', 'Returned to Lap 1. Start your engine!', 'info', 2500);
}

escapeRestartBtn.addEventListener('click', resetApplication);
navRestartBtn.addEventListener('click', resetApplication);

// Init first pill states
updateLapPills();
