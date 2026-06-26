'use strict';

/* =============================================================
   CONSTANTS
============================================================= */
const ACCENT = '#4493fa';

function mixHex(a, b, t) {
  const parse = (s) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16));
  const [r1, g1, b1] = parse(a);
  const [r2, g2, b2] = parse(b);
  const ch = (x, y) => Math.round(x + (y - x) * t).toString(16).padStart(2, '0');
  return '#' + ch(r1, r2) + ch(g1, g2) + ch(b1, b2);
}

const CONNECTED_FILL = mixHex(ACCENT, '#0f0f12', 0.7);
const NEW_PILL_BG    = mixHex(ACCENT, '#0f0f12', 0.8);

/* =============================================================
   FEATURED CASE CAROUSEL
============================================================= */
const CASES = [
  {
    tag:   'ERP & CRM',
    title: 'Enhancing the ERP & CRM flow',
    desc:  'Designed the interface for complex allocation of funds and resources, using a game-inspired visual language to make a dense system intuitive.',
    img:   'assets/images/case-erp.jpg',
  },
  {
    tag:   'FINTECH · MOBILE',
    title: 'Money Track wallet',
    desc:  'A personal finance wallet that turns messy transactions into clear, motivating insights.',
    img:   'assets/images/case-moneytrack.jpg',
  },
  {
    tag:   'E-COMMERCE · MOBILE',
    title: 'Turbo.ua delivery app',
    desc:  'Reworked the ordering flow for a high-volume delivery service: faster checkout, fewer drop-offs.',
    img:   'assets/images/case-turbo.jpg',
  },
];

class FeaturedCarousel {
  constructor() {
    this.index = 0;
    this.timer = null;

    this.$counter = document.getElementById('js-case-counter');
    this.$image   = document.getElementById('js-case-image');
    this.$body    = document.getElementById('js-case-body');
    this.$tag     = document.getElementById('js-case-tag');
    this.$title   = document.getElementById('js-case-title');
    this.$desc    = document.getElementById('js-case-desc');
    this.$dots    = document.getElementById('js-case-dots');

    this._render();
    this._start();
  }

  _pad(n) { return String(n).padStart(2, '0'); }

  _render() {
    const c = CASES[this.index];

    this.$counter.textContent = `${this._pad(this.index + 1)} / ${this._pad(CASES.length)}`;
    this.$tag.textContent     = c.tag;
    this.$title.textContent   = c.title;
    this.$desc.textContent    = c.desc;

    this.$image.innerHTML = '';
    if (c.img) {
      const img = document.createElement('img');
      img.src = c.img;
      img.alt = c.title;
      this.$image.appendChild(img);
    } else {
      const ph = document.createElement('span');
      ph.className   = 'case-card__placeholder';
      ph.textContent = '[ case cover · 1600×1000 ]';
      this.$image.appendChild(ph);
    }

    this.$dots.innerHTML = '';
    CASES.forEach((_, i) => {
      const dot = document.createElement('span');
      dot.className = 'case-dot' + (i === this.index ? ' case-dot--active' : '');
      this.$dots.appendChild(dot);
    });
  }

  _next() {
    this.$body.classList.add('fading');
    setTimeout(() => {
      this.index = (this.index + 1) % CASES.length;
      this._render();
      this.$body.classList.remove('fading');
    }, 300);
  }

  _start() {
    this.timer = setInterval(() => this._next(), 3800);
  }

  destroy() { clearInterval(this.timer); }
}

/* =============================================================
   TEAM GROWTH ANIMATION
============================================================= */
const HUB    = { x: 180, y: 146 };
const SVG_NS = 'http://www.w3.org/2000/svg';

const DISCIPLINES = [
  { x: 180, y:  51, label: 'Social media',   anchor: 'middle', lx: 180, ly:  33 },
  { x: 262, y:  98, label: 'UI/UX',          anchor: 'start',  lx: 278, ly:  98 },
  { x: 262, y: 194, label: 'Product',        anchor: 'start',  lx: 278, ly: 196 },
  { x: 180, y: 241, label: 'AI engineering', anchor: 'middle', lx: 180, ly: 261 },
  { x:  98, y: 194, label: 'Graphic',        anchor: 'end',    lx:  82, ly: 196 },
  { x:  98, y:  98, label: 'Motion',         anchor: 'end',    lx:  82, ly:  98 },
];

class TeamGrowthAnimation {
  constructor() {
    this.$svg    = document.getElementById('js-network-svg');
    this.$pills  = document.getElementById('js-network-pills');
    this.visible = 0;
    this._timers = [];

    this._buildSVG();
    this._buildPills();
    this._grow(1);
  }

  _el(tag, attrs = {}) {
    const el = document.createElementNS(SVG_NS, tag);
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    return el;
  }

  _buildSVG() {
    this._lengths = DISCIPLINES.map((d) => Math.hypot(d.x - HUB.x, d.y - HUB.y));

    this._lines = DISCIPLINES.map((d, i) => {
      const len = this._lengths[i].toFixed(1);
      const el  = this._el('line', {
        x1: HUB.x, y1: HUB.y, x2: d.x, y2: d.y,
        class: 'node-line',
        stroke: ACCENT,
        'stroke-width': '1.25',
        'stroke-dasharray': len,
        'stroke-dashoffset': len,
        opacity: '0',
      });
      this.$svg.appendChild(el);
      return el;
    });

    const polyPts = DISCIPLINES.map((d) => `${d.x} ${d.y}`).join(' L');
    let polyLen = 0;
    DISCIPLINES.forEach((d, k) => {
      const next = DISCIPLINES[(k + 1) % DISCIPLINES.length];
      polyLen += Math.hypot(d.x - next.x, d.y - next.y);
    });
    this._polyLen   = polyLen.toFixed(1);
    this._perimeter = this._el('path', {
      d: `M ${polyPts} Z`,
      class: 'perimeter',
      stroke: ACCENT,
      'stroke-width': '1',
      'stroke-dasharray': this._polyLen,
      'stroke-dashoffset': this._polyLen,
      opacity: '0',
    });
    this.$svg.appendChild(this._perimeter);

    this._pulseLines = DISCIPLINES.map((d, i) => {
      const el = this._el('line', {
        x1: HUB.x, y1: HUB.y, x2: d.x, y2: d.y,
        class: 'pulse-line',
        stroke: ACCENT,
        'stroke-width': '1.9',
        'animation-delay': `${(i * 0.34).toFixed(2)}s`,
        opacity: '0',
      });
      this.$svg.appendChild(el);
      return el;
    });

    this.$svg.appendChild(this._el('circle', { cx: HUB.x, cy: HUB.y, r: '44', fill: ACCENT, opacity: '0.09' }));
    this.$svg.appendChild(this._el('circle', { cx: HUB.x, cy: HUB.y, r: '25', class: 'hub-ring', fill: 'none', stroke: ACCENT, 'stroke-width': '1.25' }));
    this.$svg.appendChild(this._el('circle', { cx: HUB.x, cy: HUB.y, r: '25', class: 'hub-core', fill: ACCENT }));

    this._nodeRings = DISCIPLINES.map((d) => {
      const el = this._el('circle', { cx: d.x, cy: d.y, r: '14', class: 'node-ring', fill: ACCENT, opacity: '0' });
      this.$svg.appendChild(el);
      return el;
    });

    this._nodeCircles = DISCIPLINES.map((d) => {
      const el = this._el('circle', {
        cx: d.x, cy: d.y, r: '7.5',
        class: 'node-circle',
        fill: '#12121a',
        stroke: ACCENT, 'stroke-width': '1.75',
        opacity: '0',
        transform: 'scale(0.2)',
        filter: 'drop-shadow(0 0 7px rgba(68,147,250,0.5))',
      });
      this.$svg.appendChild(el);
      return el;
    });
  }

  _buildPills() {
    this._pills = DISCIPLINES.map((d) => {
      const pill = document.createElement('span');
      pill.className   = 'network-pill';
      pill.textContent = d.label;
      pill.style.left       = (d.lx / 360 * 100).toFixed(2) + '%';
      pill.style.top        = (d.ly / 300 * 100).toFixed(2) + '%';
      pill.style.opacity    = '0';
      pill.style.border     = '0.5px solid #2a2a2e';
      pill.style.background = '#0f0f12';
      pill.style.color      = '#cccccc';
      if      (d.anchor === 'start') pill.style.transform = 'translate(0,-50%)';
      else if (d.anchor === 'end')   pill.style.transform = 'translate(-100%,-50%)';
      else                           pill.style.transform = 'translate(-50%,-50%)';
      this.$pills.appendChild(pill);
      return pill;
    });
  }

  _update() {
    const n        = this.visible;
    const newest   = n - 1;
    const complete = n === DISCIPLINES.length;

    DISCIPLINES.forEach((_, idx) => {
      const on    = idx < n;
      const isNew = idx === newest;
      const len   = this._lengths[idx].toFixed(1);

      const line = this._lines[idx];
      line.setAttribute('stroke-dashoffset', on ? '0' : len);
      line.setAttribute('opacity', on ? (isNew ? '0.65' : '0.32') : '0');

      this._pulseLines[idx].setAttribute('opacity', on ? (isNew ? '0.95' : '0.5') : '0');

      this._nodeRings[idx].setAttribute('opacity', isNew ? '0.55' : '0');

      const circle = this._nodeCircles[idx];
      circle.setAttribute('opacity',   on ? '1' : '0');
      circle.setAttribute('transform', `scale(${on ? (isNew ? 1.18 : 1) : 0.2})`);
      circle.setAttribute('fill', !on ? '#12121a' : isNew ? ACCENT : CONNECTED_FILL);

      const pill = this._pills[idx];
      pill.style.opacity    = on ? '1' : '0';
      pill.style.color      = isNew ? '#ffffff' : '#cccccc';
      pill.style.background = isNew ? NEW_PILL_BG : '#0f0f12';
      pill.style.borderColor = isNew ? ACCENT : '#2a2a2e';
    });

    this._perimeter.setAttribute('stroke-dashoffset', complete ? '0' : this._polyLen);
    this._perimeter.setAttribute('opacity', complete ? '0.22' : '0');
  }

  _grow(n) {
    this.visible = n;
    this._update();

    if (n < DISCIPLINES.length) {
      this._timers.push(setTimeout(() => this._grow(n + 1), 620));
    } else {
      this._timers.push(setTimeout(() => {
        this.visible = 0;
        this._update();
        this._timers.push(setTimeout(() => this._grow(1), 760));
      }, 2200));
    }
  }

  destroy() { this._timers.forEach(clearTimeout); }
}

/* =============================================================
   INIT
============================================================= */
document.addEventListener('DOMContentLoaded', () => {
  new FeaturedCarousel();
  new TeamGrowthAnimation();
});
