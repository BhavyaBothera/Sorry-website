/* =====================================================
   KAVYA APOLOGY WEBSITE — INTERACTIONS & MOTION (10/10)
   Vanilla JavaScript — Defensive, Accessible & Memory-Safe
   ===================================================== */

(function () {
  'use strict';

  // ---- Safe Helper Utilities ----
  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];
  const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rand = (min, max) => Math.random() * (max - min) + min;

  // ---- Keyframe Injection for Dynamic Particles ----
  (function injectDynamicKeyframes() {
    if (document.getElementById('dynamic-particle-styles')) return;
    const styleEl = document.createElement('style');
    styleEl.id = 'dynamic-particle-styles';
    styleEl.textContent = `
      @keyframes burstParticleMotion {
        0% { transform: translate(0, 0) scale(0) rotate(0deg); opacity: 0; }
        15% { opacity: 1; transform: translate(0, 0) scale(1.15) rotate(12deg); }
        100% { transform: translate(var(--tx, 0), var(--ty, 0)) scale(0.35) rotate(360deg); opacity: 0; }
      }
    `;
    document.head.appendChild(styleEl);
  })();

  // ---- DOM Elements (Defensively Queried) ----
  const intro = $('#intro');
  const mainContent = $('#main-content');
  const envelopeBtn = $('#envelope-btn');
  const openBtn = $('#open-btn');
  const introSkipBtn = $('#intro-skip-btn');
  const globalSkipLink = $('#global-skip-link');
  const introParticles = $('#intro-particles');
  const letterText = $('#letter-text');
  const apologyCharacter = $('#apology-character');
  const memoryToggleBtn = $('#memory-toggle-btn');
  const memoryContent = $('#memory-content');
  const memoryBtnLabel = $('#memory-btn-label');
  const gameMessage = $('#game-message');
  const btnChoco = $('#btn-choco');
  const btnHug = $('#btn-hug');
  const btnPuppy = $('#btn-puppy');
  const heartBurstBtn = $('#heart-burst-btn');
  const finalAftermath = $('#final-aftermath');

  // ---- State Management ----
  let isEnvelopeOpened = false;
  let isTransitioning = false;
  let letterRevealed = false;
  let heartBurstFired = false;
  const runningActionTimeouts = new Map();

  // =====================================================
  // 1. INTRO AMBIENT PARTICLES
  // =====================================================
  function initIntroParticles() {
    if (!introParticles || prefersReducedMotion()) return;

    const emojis = ['💗', '✨', '💕', '🌸', '♡', '⭐', '💖'];
    const count = window.innerWidth < 600 ? 8 : 14;

    for (let i = 0; i < count; i++) {
      const span = document.createElement('span');
      span.className = 'intro-particle';
      span.textContent = emojis[Math.floor(rand(0, emojis.length))];
      span.setAttribute('aria-hidden', 'true');
      span.style.left = `${rand(5, 95)}%`;
      span.style.animationDelay = `${rand(0, 6)}s`;
      span.style.animationDuration = `${rand(6, 10)}s`;
      span.style.fontSize = `${rand(0.9, 1.5)}rem`;
      introParticles.appendChild(span);
    }
  }

  // =====================================================
  // 2. ENVELOPE OPENING & FOCUS MANAGEMENT (Smooth & Quick)
  // =====================================================
  function dismissIntro({ skipAnimation = false, targetFocusSelector = '#hero-heading' } = {}) {
    if (isTransitioning) return;
    isTransitioning = true;
    isEnvelopeOpened = true;

    // Immediately disable controls so user cannot double-trigger
    if (envelopeBtn) envelopeBtn.disabled = true;
    if (openBtn) openBtn.disabled = true;
    if (introSkipBtn) introSkipBtn.disabled = true;

    const completeDismissal = () => {
      if (intro) {
        intro.classList.add('hidden');
      }
      if (mainContent) {
        mainContent.classList.add('visible');
      }
      document.body.classList.remove('js-intro-active');

      // Move focus smoothly to the intended element
      const targetEl = $(targetFocusSelector);
      if (targetEl) {
        targetEl.setAttribute('tabindex', '-1');
        targetEl.focus({ preventScroll: skipAnimation });
      } else if (mainContent) {
        mainContent.focus();
      }

      // Trigger progressive letter reveals once main is visible
      triggerLetterReveal();
      isTransitioning = false;
    };

    if (skipAnimation || prefersReducedMotion()) {
      completeDismissal();
    } else {
      if (envelopeBtn) {
        envelopeBtn.classList.add('opened');
        spawnBurstParticles(envelopeBtn, 8, ['💗', '✨', '💕']);
      }
      // Quick, responsive transition (480ms)
      setTimeout(completeDismissal, 480);
    }
  }

  // Bind envelope interactions
  if (openBtn) {
    openBtn.addEventListener('click', () => dismissIntro({ skipAnimation: false, targetFocusSelector: '#hero-heading' }));
  }

  if (envelopeBtn) {
    envelopeBtn.addEventListener('click', () => dismissIntro({ skipAnimation: false, targetFocusSelector: '#hero-heading' }));
  }

  // Dedicated skip button inside intro
  if (introSkipBtn) {
    introSkipBtn.addEventListener('click', () => {
      dismissIntro({ skipAnimation: true, targetFocusSelector: '#apology-heading' });
    });
  }

  // Global skip link: if activated while intro is up, immediately skip to apology
  if (globalSkipLink) {
    globalSkipLink.addEventListener('click', () => {
      if (!isEnvelopeOpened) {
        dismissIntro({ skipAnimation: true, targetFocusSelector: '#apology-heading' });
      }
    });
  }

  // =====================================================
  // 3. APOLOGY LETTER REVEALS (Progressive Enhancement)
  // =====================================================
  function triggerLetterReveal() {
    if (letterRevealed || !letterText) return;
    letterRevealed = true;

    const paragraphs = $$('.letter-para', letterText);
    if (!paragraphs.length) return;

    if (prefersReducedMotion()) {
      paragraphs.forEach((p) => p.classList.add('revealed'));
      return;
    }

    // Opt into the progressive reveal styling
    letterText.classList.add('js-letter-reveals');

    // Stagger reveal paragraphs gently
    paragraphs.forEach((p, idx) => {
      setTimeout(() => {
        p.classList.add('revealed');
      }, idx * 150);
    });

    // Safety net: Guarantee all paragraphs are visible within 2.5s regardless of delays
    setTimeout(() => {
      paragraphs.forEach((p) => p.classList.add('revealed'));
    }, 2500);
  }

  function initLetterObserver() {
    if (!letterText) return;

    if (!('IntersectionObserver' in window)) {
      triggerLetterReveal();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            triggerLetterReveal();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(letterText);
  }

  // =====================================================
  // 4. APPRECIATION KEEPSAKE NOTE TOGGLE
  // =====================================================
  function initAppreciationToggle() {
    if (!memoryToggleBtn || !memoryContent) return;

    memoryToggleBtn.addEventListener('click', () => {
      const isExpanded = memoryToggleBtn.getAttribute('aria-expanded') === 'true';
      const newState = !isExpanded;

      memoryToggleBtn.setAttribute('aria-expanded', String(newState));
      if (newState) {
        memoryContent.classList.add('open');
        if (memoryBtnLabel) memoryBtnLabel.textContent = 'Close appreciation note';
      } else {
        memoryContent.classList.remove('open');
        if (memoryBtnLabel) memoryBtnLabel.textContent = 'Open a small appreciation note';
      }
    });
  }

  // =====================================================
  // 5. SHARED PARTICLE EMITTER (Bounded & Self-Cleaning)
  // =====================================================
  function spawnBurstParticles(anchorEl, count, emojis) {
    if (prefersReducedMotion() || !anchorEl) return;

    const rect = anchorEl.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const fragment = document.createDocumentFragment();
    const effectiveCount = Math.min(count, 28);

    for (let i = 0; i < effectiveCount; i++) {
      const span = document.createElement('span');
      span.className = 'burst-heart';
      span.textContent = emojis[Math.floor(rand(0, emojis.length))];
      span.setAttribute('aria-hidden', 'true');

      const angle = (Math.PI * 2 * i) / effectiveCount + rand(-0.25, 0.25);
      const dist = rand(60, Math.min(window.innerWidth, window.innerHeight) * 0.38);
      const tx = Math.cos(angle) * dist;
      const ty = Math.sin(angle) * dist;
      const size = rand(0.9, 1.8);
      const duration = rand(1.6, 2.6);

      span.style.left = `${cx}px`;
      span.style.top = `${cy}px`;
      span.style.fontSize = `${size}rem`;
      span.style.setProperty('--tx', `${tx}px`);
      span.style.setProperty('--ty', `${ty}px`);
      span.style.animation = `burstParticleMotion ${duration}s cubic-bezier(0.16, 1, 0.3, 1) forwards`;

      // Memory-safe cleanup via animationend event
      const cleanup = () => {
        span.removeEventListener('animationend', cleanup);
        span.remove();
      };
      span.addEventListener('animationend', cleanup, { once: true });

      // Fallback timer if animationend doesn't trigger
      setTimeout(cleanup, duration * 1000 + 300);

      fragment.appendChild(span);
    }

    document.body.appendChild(fragment);
  }

  // =====================================================
  // 6. PEACE OFFERINGS (Refined & Non-Quantified)
  // =====================================================
  function setActionCooldown(button, durationMs = 1500) {
    if (!button) return;
    button.disabled = true;
    button.setAttribute('aria-busy', 'true');

    if (runningActionTimeouts.has(button)) {
      clearTimeout(runningActionTimeouts.get(button));
    }

    const timeoutId = setTimeout(() => {
      button.disabled = false;
      button.removeAttribute('aria-busy');
      runningActionTimeouts.delete(button);
    }, durationMs);

    runningActionTimeouts.set(button, timeoutId);
  }

  function displayGameMessage(text) {
    if (!gameMessage) return;
    gameMessage.classList.remove('visible');
    // Force reflow for restart transition
    void gameMessage.offsetHeight;
    gameMessage.textContent = text;
    gameMessage.classList.add('visible');
  }

  // Action 1: Virtual Chocolates
  function deployChocolates() {
    setActionCooldown(btnChoco, 1400);

    if (!prefersReducedMotion()) {
      const emojis = ['🍫', '🍫', '🍬', '🍩', '🍫'];
      const fragment = document.createDocumentFragment();
      const count = window.innerWidth < 600 ? 5 : 8;

      for (let i = 0; i < count; i++) {
        const span = document.createElement('span');
        span.className = 'falling-item';
        span.textContent = emojis[Math.floor(rand(0, emojis.length))];
        span.setAttribute('aria-hidden', 'true');
        span.style.left = `${rand(12, 88)}%`;
        span.style.animationDelay = `${rand(0, 0.4)}s`;
        span.style.animationDuration = `${rand(2.2, 3.2)}s`;

        const cleanup = () => {
          span.removeEventListener('animationend', cleanup);
          span.remove();
        };
        span.addEventListener('animationend', cleanup, { once: true });
        setTimeout(cleanup, 3600);

        fragment.appendChild(span);
      }
      document.body.appendChild(fragment);
    }

    displayGameMessage('Chocolates delivered. Unfortunately, sweetness can’t substitute for accountability. My apology remains 100% genuine. 🍫');
  }

  // Action 2: Quiet Virtual Hug
  function sendHugs() {
    setActionCooldown(btnHug, 1400);

    if (!prefersReducedMotion() && btnHug) {
      const emojis = ['🧸', '🫶', '💗', '🤗', '💕'];
      const rect = btnHug.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const fragment = document.createDocumentFragment();
      const count = window.innerWidth < 600 ? 5 : 8;

      for (let i = 0; i < count; i++) {
        const span = document.createElement('span');
        span.className = 'hug-item';
        span.textContent = emojis[Math.floor(rand(0, emojis.length))];
        span.setAttribute('aria-hidden', 'true');
        span.style.left = `${cx + rand(-90, 90)}px`;
        span.style.top = `${cy + rand(-40, 40)}px`;
        span.style.animationDelay = `${rand(0, 0.3)}s`;

        const cleanup = () => {
          span.removeEventListener('animationend', cleanup);
          span.remove();
        };
        span.addEventListener('animationend', cleanup, { once: true });
        setTimeout(cleanup, 3200);

        fragment.appendChild(span);
      }
      document.body.appendChild(fragment);
    }

    displayGameMessage('A quiet, warm virtual hug. Only if you want one, and strictly on your terms. 🫶');
  }

  // Action 3: Puppy Eyes
  function activatePuppyEyes() {
    setActionCooldown(btnPuppy, 1600);

    if (apologyCharacter) {
      apologyCharacter.classList.add('puppy-mode');
      setTimeout(() => {
        apologyCharacter.classList.remove('puppy-mode');
      }, 3500);
    }

    displayGameMessage('Puppy eyes engaged. Please note: this carries exactly zero legal weight in Friendship Court. I am still completely at fault. 🥹');
  }

  // Bind peace offering events
  if (btnChoco) btnChoco.addEventListener('click', deployChocolates);
  if (btnHug) btnHug.addEventListener('click', sendHugs);
  if (btnPuppy) btnPuppy.addEventListener('click', activatePuppyEyes);

  // =====================================================
  // 7. FINAL WARMTH BURST (Gentle Send-Off)
  // =====================================================
  function triggerHeartBurst() {
    if (heartBurstFired || !heartBurstBtn) return;
    heartBurstFired = true;

    heartBurstBtn.disabled = true;
    heartBurstBtn.setAttribute('aria-disabled', 'true');
    heartBurstBtn.textContent = '💗 Warmth sent into the universe ✨';

    if (!prefersReducedMotion()) {
      const emojis = ['💗', '💖', '✨', '💕', '⭐', '🌸', '♡', '🌷'];
      spawnBurstParticles(heartBurstBtn, 24, emojis);
    }

    setTimeout(() => {
      if (finalAftermath) {
        finalAftermath.classList.add('visible');
      }
    }, 500);
  }

  if (heartBurstBtn) {
    heartBurstBtn.addEventListener('click', triggerHeartBurst);
  }

  // =====================================================
  // 8. CARD HOVER / TILT (Desktop non-touch only)
  // =====================================================
  function initCardTilt() {
    if (prefersReducedMotion()) return;
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouch) return;

    const cards = $$('.improve-card');
    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rotateX = ((y - cy) / cy) * -4;
        const rotateY = ((x - cx) / cx) * 4;
        card.style.transform = `translateY(-6px) perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // =====================================================
  // 9. SCROLL REVEALS (IntersectionObserver)
  // =====================================================
  function initScrollReveal() {
    const reveals = $$('.reveal');
    if (!reveals.length) return;

    if (!('IntersectionObserver' in window)) {
      reveals.forEach((el) => el.classList.add('revealed'));
      return;
    }

    document.body.classList.add('js-reveal-ready');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );

    reveals.forEach((el) => observer.observe(el));
  }

  // =====================================================
  // 10. INITIALIZATION
  // =====================================================
  function init() {
    document.body.classList.add('js-intro-active');

    initIntroParticles();
    initScrollReveal();
    initLetterObserver();
    initAppreciationToggle();
    initCardTilt();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
