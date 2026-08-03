'use strict';

function initBurger() {
  const burger = document.querySelector('.burger');
  const overlay = document.querySelector('.menu-overlay');
  const closeButton = document.querySelector('.menu-overlay__close');
  const links = document.querySelectorAll('.menu-link');
  if (!burger || !overlay) return;

  function open() {
    burger.classList.add('is-open');
    burger.setAttribute('aria-expanded', 'true');
    overlay.style.display = 'flex';
    requestAnimationFrame(() => overlay.classList.add('is-open'));
    document.body.style.overflow = 'hidden';
  }

  function close() {
    burger.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
    overlay.addEventListener('transitionend', function handler() {
      overlay.style.display = 'none';
      overlay.removeEventListener('transitionend', handler);
    });
  }

  burger.addEventListener('click', () => {
    burger.classList.contains('is-open') ? close() : open();
  });
  closeButton?.addEventListener('click', close);
  links.forEach((link) => link.addEventListener('click', close));
}

function initHeroVideo() {
  const video = document.querySelector('.hero-card__video');
  if (!video) return;

  video.playbackRate = 0.5;
}

function initPageReveal() {
  const revealItems = [
    ...document.querySelectorAll(
      '.alt-site-header, .hero-card, .about-section__label, .about-section__copy, .about-section__details, .about-section__media, .portfolio-section__label, .portfolio-section h2, .portfolio-work-card'
    ),
  ];
  if (!revealItems.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, {
    rootMargin: '0px 0px -12% 0px',
    threshold: 0.12,
  });

  revealItems.forEach((item) => observer.observe(item));
}

function initHeroTypewriter() {
  const title = document.querySelector('.hero-card__title');
  const subtitle = document.querySelector('.hero-card__subtitle');
  const hi = document.querySelector('[data-type-target="hero-hi"]');
  const name = document.querySelector('[data-type-target="hero-name"]');
  const subtitleMain = document.querySelector('[data-type-target="hero-subtitle-main"]');
  const subtitlePrefix = document.querySelector('[data-type-target="hero-subtitle-prefix"]');
  const subtitleAccent = document.querySelector('[data-type-target="hero-subtitle-accent"]');
  const targets = [title, subtitle, hi, name, subtitleMain, subtitlePrefix, subtitleAccent];
  if (targets.some((target) => !target)) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const copy = {
    hi: 'Hi!',
    name: ' I\u2019m Anastasiia!',
    subtitleMain: 'Lead Product Designer',
    subtitlePrefix: 'specializing in\u00a0',
    subtitleAccent: 'high-load systems',
  };

  function setFinalText() {
    hi.textContent = copy.hi;
    name.textContent = copy.name;
    subtitleMain.textContent = copy.subtitleMain;
    subtitlePrefix.textContent = copy.subtitlePrefix;
    subtitleAccent.textContent = copy.subtitleAccent;
  }

  function wait(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }

  async function typeText(element, text, speed = 54) {
    for (const character of text) {
      element.textContent += character;
      await wait(speed);
    }
  }

  async function run() {
    title.classList.add('is-typing');
    await typeText(hi, copy.hi, 70);
    await wait(520);
    await typeText(name, copy.name, 48);
    await wait(620);
    title.classList.remove('is-typing');

    subtitle.classList.add('is-typing');
    await typeText(subtitleMain, copy.subtitleMain, 38);
    await wait(220);
    await typeText(subtitlePrefix, copy.subtitlePrefix, 38);
    await typeText(subtitleAccent, copy.subtitleAccent, 38);
    await wait(480);
    subtitle.classList.remove('is-typing');
  }

  if (prefersReducedMotion) {
    setFinalText();
    return;
  }

  run();
}

function initHeroHoverGrid() {
  const hero = document.querySelector('.hero-card');
  const grid = document.querySelector('.hero-card__hover-grid');
  const markerGrid = document.querySelector('.hero-card__marker-grid');
  if (!hero || !grid || !markerGrid) return;

  let cells = [];
  let markers = [];
  let markerCols = 0;
  let markerRows = 0;

  function getCellSize() {
    const value = getComputedStyle(hero).getPropertyValue('--hero-grid-step').trim();
    return parseFloat(value) || 220;
  }

  function getGridOffset() {
    const value = getComputedStyle(hero).getPropertyValue('--hero-grid-offset').trim();
    return parseFloat(value) || 0;
  }

  function build() {
    const rect = hero.getBoundingClientRect();
    const cellSize = getCellSize();
    const gridOffset = getGridOffset();
    const cols = Math.ceil((rect.width - gridOffset) / cellSize);
    const rows = Math.ceil((rect.height - gridOffset) / cellSize);
    const total = cols * rows;

    grid.style.setProperty('--hero-grid-cols', cols);
    grid.innerHTML = '';
    cells = Array.from({ length: total }, () => {
      const cell = document.createElement('span');
      cell.className = 'hero-card__hover-cell';
      grid.appendChild(cell);
      return cell;
    });

    markerCols = Math.floor((rect.width - gridOffset) / cellSize) + 1;
    markerRows = Math.floor((rect.height - gridOffset) / cellSize) + 1;
    markerGrid.innerHTML = '';
    markers = [];
    for (let row = 0; row < markerRows; row += 1) {
      for (let col = 0; col < markerCols; col += 1) {
        const marker = document.createElement('span');
        marker.className = 'hero-card__marker';
        marker.style.left = `${gridOffset + col * cellSize}px`;
        marker.style.top = `${gridOffset + row * cellSize}px`;
        markerGrid.appendChild(marker);
        markers.push(marker);
      }
    }
  }

  function hover(event) {
    const rect = hero.getBoundingClientRect();
    const cellSize = getCellSize();
    const gridOffset = getGridOffset();
    const col = Math.floor((event.clientX - rect.left - gridOffset) / cellSize);
    const row = Math.floor((event.clientY - rect.top - gridOffset) / cellSize);
    const cols = parseInt(grid.style.getPropertyValue('--hero-grid-cols'), 10);
    const cell = cells[row * cols + col];
    if (!cell) return;

    cell.classList.remove('is-hovered', 'is-hovered-fast');
    void cell.offsetWidth;
    cell.classList.add('is-hovered');
    cell.classList.add('is-hovered-fast');
  }

  build();
  window.addEventListener('resize', build);
  hero.addEventListener('pointermove', hover);
}

function initAboutImageSlider() {
  const slider = document.querySelector('.about-section__media');
  const frame = slider?.querySelector('.about-section__media-frame');
  const image = frame?.querySelector('.about-section__media-image');
  if (!slider || !frame || !image) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const images = (slider.dataset.images || '')
    .split(',')
    .map((src) => src.trim())
    .filter(Boolean);
  if (images.length < 2) return;

  images.forEach((src) => {
    const preload = new Image();
    preload.src = src;
  });

  let index = 0;
  let currentImage = image;
  let isAnimating = false;

  function animateNext() {
    if (isAnimating) return;
    isAnimating = true;

    index = (index + 1) % images.length;
    const nextImage = document.createElement('img');
    nextImage.className = 'about-section__media-image is-entering';
    nextImage.src = images[index];
    nextImage.alt = currentImage.alt;

    function startAnimation() {
      frame.appendChild(nextImage);
      nextImage.getBoundingClientRect();
      nextImage.classList.add('is-active');
      nextImage.classList.remove('is-entering');

      window.setTimeout(() => {
        currentImage.remove();
        currentImage = nextImage;
        isAnimating = false;
      }, 820);
    }

    if (nextImage.complete) {
      startAnimation();
      return;
    }

    nextImage.addEventListener('load', startAnimation, { once: true });
  }

  window.setInterval(animateNext, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
  initBurger();
  initHeroVideo();
  initPageReveal();
  initHeroTypewriter();
  initHeroHoverGrid();
  initAboutImageSlider();
});
