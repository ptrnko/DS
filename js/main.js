/* ============================================================
   Featured-case carousel + nav active state
   Anastasiia Petrenko portfolio
   ============================================================ */

// Edit this array to manage rotating cases.
// Set `img` to a path under assets/images/ — leave '' for a placeholder.
const CASES = [
  {
    tag: 'ERP & CRM',
    title: 'Enhancing the ERP & CRM flow',
    desc: 'Designed the interface for complex allocation of funds and resources, using a game-inspired visual language to make a dense system intuitive.',
    img: 'assets/images/case-erp.jpg',
  },
  {
    tag: 'FINTECH · MOBILE',
    title: 'Money Track wallet',
    desc: 'A personal finance wallet that turns messy transactions into clear, motivating insights.',
    img: 'assets/images/case-moneytrack.jpg',
  },
  {
    tag: 'E-COMMERCE · MOBILE',
    title: 'Turbo.ua delivery app',
    desc: 'Reworked the ordering flow for a high-volume delivery service: faster checkout, fewer drop-offs.',
    img: 'assets/images/case-turbo.jpg',
  },
];

const ROTATE_MS = 3800;
const FADE_MS   = 300;

const el = {
  count: document.querySelector('[data-count]'),
  cover: document.querySelector('[data-cover]'),
  body:  document.querySelector('[data-body]'),
  tag:   document.querySelector('[data-tag]'),
  title: document.querySelector('[data-title]'),
  desc:  document.querySelector('[data-desc]'),
  dots:  document.querySelector('[data-dots]'),
};

let index = 0;

const pad = (n) => String(n).padStart(2, '0');

function buildDots() {
  el.dots.innerHTML = '';
  CASES.forEach((_, i) => {
    const dot = document.createElement('span');
    if (i === index) dot.classList.add('is-active');
    el.dots.appendChild(dot);
  });
}

function renderCover(c) {
  if (c.img) {
    el.cover.innerHTML = '<img src="' + c.img + '" alt="' + c.title + '" />';
  } else {
    el.cover.innerHTML = '<span class="fcard__placeholder">[ case cover &middot; 1600&times;1000 ]</span>';
  }
}

function render() {
  const c = CASES[index];
  el.count.textContent = pad(index + 1) + ' / ' + pad(CASES.length);
  el.tag.textContent   = c.tag;
  el.title.textContent = c.title;
  el.desc.textContent  = c.desc;
  renderCover(c);
  buildDots();
}

render();

if (CASES.length > 1) {
  setInterval(function () {
    el.body.classList.add('is-fading');
    el.cover.classList.add('is-fading');
    setTimeout(function () {
      index = (index + 1) % CASES.length;
      render();
      el.body.classList.remove('is-fading');
      el.cover.classList.remove('is-fading');
    }, FADE_MS);
  }, ROTATE_MS);
}

// Nav active state on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((l) => l.classList.remove('active'));
        const active = document.querySelector('.nav-link[href="#' + entry.target.id + '"]');
        if (active) active.classList.add('active');
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach((s) => observer.observe(s));
