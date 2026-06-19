// ─── REVEAL OBSERVER (defined first so intro can use it) ───
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay || 0, 10) * 80;
        setTimeout(() => entry.target.classList.add('visible'), delay);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

function startReveal() {
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach((el, i) => {
    el.dataset.delay = i % 8;
    revealObserver.observe(el);
  });
}

// ─── INTRO / OPENING ANIMATION ───────────────────────────────
const introOverlay = document.getElementById('introOverlay');
if (introOverlay) {
  const dismissIntro = (instant) => {
    sessionStorage.setItem('introSeen', '1');
    if (instant) {
      introOverlay.classList.add('gone');
      document.body.classList.remove('is-intro');
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      startReveal();
      return;
    }
    introOverlay.classList.add('exit');
    setTimeout(() => {
      introOverlay.classList.add('gone');
      document.body.classList.remove('is-intro');
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      startReveal();
    }, 900);
  };

  // Skip intro if already seen this browser session
  if (sessionStorage.getItem('introSeen')) {
    dismissIntro(true);
  } else {
    document.body.style.overflow = 'hidden';
    const autoTimer = setTimeout(() => dismissIntro(false), 2700);
    // Tap/click to skip
    introOverlay.addEventListener('click', () => {
      clearTimeout(autoTimer);
      dismissIntro(false);
    });
  }
} else {
  // No intro on inner pages — start reveals immediately
  startReveal();
}

// ─── NAV SCROLL EFFECT ───────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

// ─── COUNTER ANIMATION ───────────────────────────────
function animateCounter(el, target) {
  const duration = 2200;
  const start = performance.now();
  const update = (time) => {
    const progress = Math.min((time - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target, parseInt(entry.target.dataset.target, 10));
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);
document.querySelectorAll('.stat-num[data-target]').forEach(el => counterObserver.observe(el));

// ─── SMOOTH SCROLL ───────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const id = link.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ─── ACTIVE NAV LINK ───────────────────────────────
const path = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === path) link.classList.add('active');
  else link.classList.remove('active');
});

// ─── SHOP COUNTDOWN (shop page only) ───────────────────────────────
function updateCountdown() {
  const now = new Date();
  const end = new Date(now);
  end.setDate(end.getDate() + ((7 - now.getDay()) % 7 || 7));
  end.setHours(23, 59, 59, 0);
  const diff = end - now;
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  document.querySelectorAll('.cd-days').forEach(el => el.textContent = String(d).padStart(2,'0'));
  document.querySelectorAll('.cd-hours').forEach(el => el.textContent = String(h).padStart(2,'0'));
  document.querySelectorAll('.cd-mins').forEach(el => el.textContent = String(m).padStart(2,'0'));
  document.querySelectorAll('.cd-secs').forEach(el => el.textContent = String(s).padStart(2,'0'));
}
if (document.querySelector('.cd-days')) {
  setInterval(updateCountdown, 1000);
  updateCountdown();
}

// ─── CATEGORY TABS (shop page only) ───────────────────────────────
document.querySelectorAll('.cat-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});
