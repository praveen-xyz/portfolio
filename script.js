/* ═══════════════════════════════════════════
   PRAVEENRAJ — Portfolio Animations & Interactions
   ═══════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── CURSOR GLOW ───
  const cursorGlow = document.getElementById('cursorGlow');
  let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursor() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    if (cursorGlow) {
      cursorGlow.style.left = glowX + 'px';
      cursorGlow.style.top = glowY + 'px';
    }
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hide cursor glow on touch devices
  if ('ontouchstart' in window) {
    if (cursorGlow) cursorGlow.style.display = 'none';
  }

  // ─── SCROLL PROGRESS RAIL ───
  const scrollFill = document.getElementById('scrollFill');

  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (scrollFill) scrollFill.style.height = progress + '%';
  }

  // ─── NAVBAR SCROLL BEHAVIOR ───
  const navbar = document.getElementById('navbar');
  function handleNavbar() {
    if (navbar) {
      if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  }

  // ─── MOBILE MENU ───
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      menuToggle.classList.toggle('active');
    });

    window.closeMenu = function () {
      navLinks.classList.remove('active');
      menuToggle.classList.remove('active');
    };
  }

  // ─── HERO TEXT REVEAL ───
  function revealHero() {
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
      const spans = heroTitle.querySelectorAll('.line-inner');
      spans.forEach((span, i) => {
        setTimeout(() => {
          span.style.transform = 'translateY(0)';
          span.style.opacity = '1';
        }, 300 + i * 150);
      });
    }

    const heroSub = document.querySelector('.hero-sub');
    const heroBtns = document.querySelector('.hero-btns');
    if (heroSub) setTimeout(() => heroSub.classList.add('visible'), 800);
    if (heroBtns) setTimeout(() => heroBtns.classList.add('visible'), 1000);
  }

  // ─── INTERSECTION OBSERVER — REVEAL ELEMENTS ───
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach((el) => {
    revealObserver.observe(el);
  });

  // ─── QUOTE WORD-BY-WORD REVEAL ───
  const quoteEl = document.getElementById('quoteText');
  if (quoteEl) {
    const words = quoteEl.innerText.split(' ');
    quoteEl.innerHTML = words.map(word => `<span class="word">${word}</span>`).join(' ');
    
    const quoteObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const spans = quoteEl.querySelectorAll('.word');
          spans.forEach((s, i) => {
            setTimeout(() => s.classList.add('visible'), i * 100);
          });
          quoteObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    quoteObserver.observe(quoteEl);
  }

  // ─── DIGITAL SOLUTIONS CAROUSEL (Restored & Enhanced) ───
  const sTrack = document.getElementById('solutionsTrack');
  const sCards = Array.from(document.querySelectorAll('.sol-card'));
  const sDots = document.querySelectorAll('.sol-dot');
  let sIndex = 0;
  let sAutoPlayInterval;

  function updateSolutions() {
    if (!sTrack || sCards.length === 0) return;
    
    sCards.forEach((card, i) => {
      card.classList.remove('is-active', 'is-prev', 'is-next', 'is-hidden-left', 'is-hidden-right');
      
      // Calculate circular distance
      const total = sCards.length;
      const diff = (i - sIndex + total) % total;
      
      if (diff === 0) {
        card.classList.add('is-active');
      } else if (diff === 1) {
        card.classList.add('is-next');
      } else if (diff === total - 1) {
        card.classList.add('is-prev');
      } else if (diff < total / 2) {
        card.classList.add('is-hidden-right');
      } else {
        card.classList.add('is-hidden-left');
      }
    });

    sDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === sIndex);
    });
  }

  function startAutoPlay() {
    stopAutoPlay();
    sAutoPlayInterval = setInterval(() => {
      sIndex = (sIndex + 1) % sCards.length;
      updateSolutions();
    }, 1000); // Change card every 1 second
  }

  function stopAutoPlay() {
    if (sAutoPlayInterval) clearInterval(sAutoPlayInterval);
  }

  if (sTrack) {
    sDots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        sIndex = i;
        updateSolutions();
        startAutoPlay(); // Reset timer on manual click
      });
    });

    // Touch/Drag for Solutions
    let sStartX = 0;
    sTrack.addEventListener('touchstart', (e) => { 
      sStartX = e.touches[0].clientX; 
      stopAutoPlay();
    }, { passive: true });

    sTrack.addEventListener('touchend', (e) => {
      const diff = sStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) sIndex = (sIndex + 1) % sCards.length;
        else sIndex = (sIndex - 1 + sCards.length) % sCards.length;
        updateSolutions();
      }
      startAutoPlay();
    });

    // Pause on hover
    sTrack.addEventListener('mouseenter', stopAutoPlay);
    sTrack.addEventListener('mouseleave', startAutoPlay);

    updateSolutions();
    startAutoPlay();
  }

  // ─── IMAGE STRIP LOOP ───
  const imgStripTrack = document.getElementById('imgStripTrack');
  if (imgStripTrack) {
    const items = Array.from(imgStripTrack.children);
    items.forEach(item => {
      const clone = item.cloneNode(true);
      imgStripTrack.appendChild(clone);
    });
  }

  // ─── PROJECTS MARQUEE LOOP ───
  const projectsMarqueeTrack = document.getElementById('projectsMarqueeTrack');
  if (projectsMarqueeTrack) {
    const items = Array.from(projectsMarqueeTrack.children);
    items.forEach(item => {
      const clone = item.cloneNode(true);
      projectsMarqueeTrack.appendChild(clone);
    });
  }

  // ─── MAGNETIC BUTTONS (Premium Feature) ───
  const magBtns = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-glow, .f-icon');
  magBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = `translate(0, 0)`;
    });
  });

  // ─── PARALLAX ON SCROLL ───
  window.addEventListener('scroll', () => {
    updateScrollProgress();
    handleNavbar();
    
    document.querySelectorAll('[data-parallax]').forEach(el => {
      const speed = el.getAttribute('data-parallax') || 0.05;
      const rect = el.getBoundingClientRect();
      const offset = (window.innerHeight / 2 - (rect.top + rect.height / 2)) * speed;
      el.style.transform = `translateY(${offset}px)`;
    });
  });

  // ─── INITIALIZE ───
  window.addEventListener('DOMContentLoaded', () => {
    revealHero();
    updateScrollProgress();
    handleNavbar();
  });

})();
