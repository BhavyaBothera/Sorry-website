/* =====================================================
   KAVYA APOLOGY WEBSITE — INTERACTIONS & ANIMATIONS
   ===================================================== */

(function () {
  'use strict';

  // ---- Utility Helpers ----
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const prefersReducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rand = (min, max) => Math.random() * (max - min) + min;

  // ---- DOM References ----
  const intro = $('#intro');
  const mainContent = $('#main-content');
  const envelope = $('#envelope');
  const openBtn = $('#open-btn');
  const introParticles = $('#intro-particles');
  const letterText = $('#letter-text');
  const repairFill = $('#repair-fill');
  const repairLabel = $('#repair-label');
  const gameMessage = $('#game-message');
  const btnChoco = $('#btn-choco');
  const btnHug = $('#btn-hug');
  const btnPuppy = $('#btn-puppy');
  const heartBurstBtn = $('#heart-burst-btn');
  const finalAftermath = $('#final-aftermath');
  const apologyCharacter = $('#apology-character');

  // ---- State ----
  let repairProgress = 15;
  let isGameCooldown = false;
  let heartBurstFired = false;
  let activeAnimElements = [];

  // =====================================================
  // INTRO FLOATING PARTICLES
  // =====================================================
  function createIntroParticles() {
    if (prefersReducedMotion()) return;
    const emojis = ['💗', '✨', '💕', '🌸', '♡', '⭐', '💖'];
    const count = window.innerWidth < 600 ? 10 : 18;

    for (let i = 0; i < count; i++) {
      const span = document.createElement('span');
      span.className = 'intro-particle';
      span.textContent = emojis[Math.floor(rand(0, emojis.length))];
      span.setAttribute('aria-hidden', 'true');
      span.style.left = rand(5, 95) + '%';
      span.style.animationDelay = rand(0, 8) + 's';
      span.style.animationDuration = rand(5, 9) + 's';
      span.style.fontSize = rand(0.8, 1.6) + 'rem';
      introParticles.appendChild(span);
    }
  }

  // =====================================================
  // ENVELOPE OPEN & TRANSITION
  // =====================================================
  function openEnvelope() {
    if (envelope.classList.contains('opened')) return;

    // Animate envelope
    envelope.classList.add('opened');

    // Release burst of hearts
    if (!prefersReducedMotion()) {
      spawnBurstParticles(envelope, 8, ['💗', '💖', '✨', '💕']);
    }

    // After a beat, transition to main content
    setTimeout(() => {
      intro.classList.add('hidden');
      mainContent.classList.add('visible');
      document.body.style.overflow = '';

      // Start letter paragraph reveals after main becomes visible
      setTimeout(() => revealLetterParagraphs(), 600);
    }, 1200);
  }

  // Bind envelope interactions
  openBtn.addEventListener('click', openEnvelope);
  envelope.addEventListener('click', openEnvelope);
  envelope.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openEnvelope();
    }
  });

  // =====================================================
  // SPAWN BURST PARTICLES (reusable)
  // =====================================================
  function spawnBurstParticles(anchorEl, count, emojis) {
    const rect = anchorEl.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    for (let i = 0; i < count; i++) {
      const span = document.createElement('span');
      span.className = 'burst-heart';
      span.textContent = emojis[Math.floor(rand(0, emojis.length))];
      span.setAttribute('aria-hidden', 'true');
      const angle = (Math.PI * 2 * i) / count + rand(-0.3, 0.3);
      const dist = rand(80, 200);
      const tx = Math.cos(angle) * dist;
      const ty = Math.sin(angle) * dist;
      const size = rand(1, 2.2);

      span.style.left = cx + 'px';
      span.style.top = cy + 'px';
      span.style.fontSize = size + 'rem';
      span.style.setProperty('--tx', tx + 'px');
      span.style.setProperty('--ty', ty + 'px');
      span.style.animation = `burstFlyCustom ${rand(1.5, 3)}s ease-out forwards`;

      document.body.appendChild(span);
      activeAnimElements.push(span);

      // Clean up
      setTimeout(() => {
        span.remove();
        activeAnimElements = activeAnimElements.filter((el) => el !== span);
      }, 3200);
    }
  }

  // Add dynamic keyframes for burst
  const burstStyle = document.createElement('style');
  burstStyle.textContent = `
    @keyframes burstFlyCustom {
      0% { transform: translate(0, 0) scale(0) rotate(0deg); opacity: 0; }
      15% { opacity: 1; transform: translate(0, 0) scale(1.2) rotate(15deg); }
      100% { transform: translate(var(--tx), var(--ty)) scale(0.3) rotate(360deg); opacity: 0; }
    }
  `;
  document.head.appendChild(burstStyle);

  // =====================================================
  // SCROLL REVEAL (IntersectionObserver)
  // =====================================================
  function initScrollReveal() {
    const reveals = $$('.reveal');
    if (!reveals.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    reveals.forEach((el) => observer.observe(el));
  }

  // =====================================================
  // LETTER PARAGRAPH LINE-BY-LINE REVEAL
  // =====================================================
  function revealLetterParagraphs() {
    const paragraphs = $$('p', letterText);
    paragraphs.forEach((p, i) => {
      setTimeout(() => {
        p.classList.add('revealed');
      }, i * 250);
    });
  }

  // Also trigger on scroll visibility
  function initLetterObserver() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            revealLetterParagraphs();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    if (letterText) observer.observe(letterText);
  }

  // =====================================================
  // CARD TILT EFFECT (desktop only)
  // =====================================================
  function initCardTilt() {
    if (prefersReducedMotion()) return;
    const isTouchDevice =
      'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const cards = $$('.improve-card');
    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rotateX = ((y - cy) / cy) * -5;
        const rotateY = ((x - cx) / cx) * 5;
        card.style.transform = `translateY(-6px) perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // =====================================================
  // MINI-GAME: CHOCOLATE
  // =====================================================
  function deployChocolates() {
    if (isGameCooldown) return;
    isGameCooldown = true;

    if (!prefersReducedMotion()) {
      const emojis = ['🍫', '🍫', '🍫', '🍬', '🍩'];
      for (let i = 0; i < 8; i++) {
        const span = document.createElement('span');
        span.className = 'falling-item';
        span.textContent = emojis[Math.floor(rand(0, emojis.length))];
        span.setAttribute('aria-hidden', 'true');
        span.style.left = rand(10, 90) + '%';
        span.style.animationDelay = rand(0, 0.8) + 's';
        span.style.animationDuration = rand(2.5, 4) + 's';
        document.body.appendChild(span);
        activeAnimElements.push(span);

        setTimeout(() => {
          span.remove();
          activeAnimElements = activeAnimElements.filter((el) => el !== span);
        }, 5000);
      }
    }

    updateRepairProgress(12);
    showGameMessage(
      'Chocolate delivery complete. Unfortunately, I cannot bribe my way out of being wrong. 🍫'
    );

    setTimeout(() => {
      isGameCooldown = false;
    }, 1500);
  }

  // =====================================================
  // MINI-GAME: HUGS
  // =====================================================
  function sendHugs() {
    if (isGameCooldown) return;
    isGameCooldown = true;

    if (!prefersReducedMotion()) {
      const emojis = ['🧸', '🫶', '💗', '🤗', '💕'];
      const gameWrapper = $('.game-wrapper');
      const rect = gameWrapper.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      for (let i = 0; i < 10; i++) {
        const span = document.createElement('span');
        span.className = 'hug-item';
        span.textContent = emojis[Math.floor(rand(0, emojis.length))];
        span.setAttribute('aria-hidden', 'true');
        span.style.left = cx + rand(-120, 120) + 'px';
        span.style.top = cy + rand(-80, 80) + 'px';
        span.style.animationDelay = rand(0, 0.6) + 's';
        document.body.appendChild(span);
        activeAnimElements.push(span);

        setTimeout(() => {
          span.remove();
          activeAnimElements = activeAnimElements.filter((el) => el !== span);
        }, 4000);
      }
    }

    updateRepairProgress(10);
    showGameMessage(
      'Sending a virtual hug, only if you want one. No pressure. 🫶'
    );

    setTimeout(() => {
      isGameCooldown = false;
    }, 1500);
  }

  // =====================================================
  // MINI-GAME: PUPPY EYES
  // =====================================================
  function activatePuppyEyes() {
    if (isGameCooldown) return;
    isGameCooldown = true;

    // Add puppy mode to character
    if (apologyCharacter) {
      apologyCharacter.classList.add('puppy-mode');
      setTimeout(() => {
        apologyCharacter.classList.remove('puppy-mode');
      }, 4000);
    }

    // Also spawn a few pleading emojis
    if (!prefersReducedMotion()) {
      const emojis = ['🥹', '🥺', '👉👈', '😢'];
      for (let i = 0; i < 5; i++) {
        const span = document.createElement('span');
        span.className = 'hug-item';
        span.textContent = emojis[Math.floor(rand(0, emojis.length))];
        span.setAttribute('aria-hidden', 'true');
        span.style.left = rand(20, 80) + '%';
        span.style.top = rand(30, 70) + '%';
        span.style.animationDelay = rand(0, 0.5) + 's';
        document.body.appendChild(span);
        activeAnimElements.push(span);

        setTimeout(() => {
          span.remove();
          activeAnimElements = activeAnimElements.filter((el) => el !== span);
        }, 4000);
      }
    }

    updateRepairProgress(8);
    showGameMessage(
      'This expression has zero legal power. My apology still stands. 🥹'
    );

    setTimeout(() => {
      isGameCooldown = false;
    }, 1500);
  }

  // ---- Game helpers ----
  function updateRepairProgress(add) {
    repairProgress = Math.min(repairProgress + add, 85);
    repairFill.style.width = repairProgress + '%';

    const bar = repairFill.parentElement;
    bar.setAttribute('aria-valuenow', repairProgress);

    if (repairProgress >= 85) {
      repairLabel.textContent =
        'Repair status: Getting there… but only you get to decide. 💗';
    } else if (repairProgress >= 50) {
      repairLabel.textContent =
        'Repair status: Making progress… maybe?';
    } else if (repairProgress >= 30) {
      repairLabel.textContent =
        'Repair status: Still working on it…';
    }
  }

  function showGameMessage(msg) {
    gameMessage.classList.remove('visible');
    // Force reflow to restart transition
    void gameMessage.offsetHeight;
    gameMessage.textContent = msg;
    gameMessage.classList.add('visible');
  }

  // Bind mini-game buttons
  btnChoco.addEventListener('click', deployChocolates);
  btnHug.addEventListener('click', sendHugs);
  btnPuppy.addEventListener('click', activatePuppyEyes);

  // =====================================================
  // HEART BURST (Final Section)
  // =====================================================
  function triggerHeartBurst() {
    if (!prefersReducedMotion()) {
      const emojis = ['💗', '💖', '✨', '💕', '⭐', '🌸', '♡', '💛', '💜'];
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;

      // Large center burst
      for (let i = 0; i < 30; i++) {
        const span = document.createElement('span');
        span.className = 'burst-heart';
        span.textContent = emojis[Math.floor(rand(0, emojis.length))];
        span.setAttribute('aria-hidden', 'true');
        const angle = (Math.PI * 2 * i) / 30 + rand(-0.2, 0.2);
        const dist = rand(60, Math.min(window.innerWidth, window.innerHeight) * 0.45);
        const tx = Math.cos(angle) * dist;
        const ty = Math.sin(angle) * dist;
        const size = rand(0.8, 2.5);

        span.style.left = cx + 'px';
        span.style.top = cy + 'px';
        span.style.fontSize = size + 'rem';
        span.style.setProperty('--tx', tx + 'px');
        span.style.setProperty('--ty', ty + 'px');
        span.style.animation = `burstFlyCustom ${rand(2, 4)}s ease-out forwards`;
        span.style.animationDelay = rand(0, 0.5) + 's';

        document.body.appendChild(span);
        activeAnimElements.push(span);

        setTimeout(() => {
          span.remove();
          activeAnimElements = activeAnimElements.filter((el) => el !== span);
        }, 5000);
      }
    }

    // Show aftermath message
    setTimeout(() => {
      finalAftermath.classList.add('visible');
    }, 800);

    // Update button state
    heartBurstBtn.textContent = '💗 Sent with love ✨';
    heartBurstBtn.style.opacity = '0.7';
    heartBurstBtn.style.pointerEvents = 'none';
    heartBurstFired = true;
  }

  heartBurstBtn.addEventListener('click', () => {
    if (heartBurstFired) return;
    triggerHeartBurst();
  });

  // =====================================================
  // INIT
  // =====================================================
  function init() {
    // Prevent scroll while intro is active
    document.body.style.overflow = 'hidden';

    // Create intro particles
    createIntroParticles();

    // Init scroll reveal
    initScrollReveal();

    // Init letter observer
    initLetterObserver();

    // Init card tilt
    initCardTilt();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
