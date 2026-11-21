// Toby Cafe (demo). Navigasi ponsel dan animasi scroll (GSAP + Lenis). Tanpa JavaScript atau dengan reduced motion, semua konten tampil statis.
(function () {
  var header = document.getElementById('site-header');
  var toggle = header.querySelector('.nav-toggle');
  var nav = document.getElementById('main-nav');
  function setNav(open) {
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('open', open);
  }
  toggle.addEventListener('click', function () { setNav(toggle.getAttribute('aria-expanded') !== 'true'); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) setNav(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setNav(false); });

  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !window.gsap || !window.ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);
  var fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

  var lenis = null;
  if (window.Lenis) {
    lenis = new Lenis({ lerp: 0.09 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a || a.getAttribute('href') === '#') return;
      var target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -68 });
    });
  }

  gsap.to('.progress', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.2 } });

  // Split text.
  var h1 = document.querySelector('.split-lines');
  var lines = h1.innerHTML.split(/<br\s*\/?>/i);
  h1.setAttribute('aria-label', h1.textContent.replace(/\s+/g, ' ').trim());
  h1.innerHTML = lines.map(function (l) { return '<span class="l" aria-hidden="true"><span>' + l + '</span></span>'; }).join('');
  var heroLines = h1.querySelectorAll('.l > span');
  gsap.set(heroLines, { yPercent: 115 });
  gsap.set('.hero-in', { y: 28, opacity: 0 });

  var titles = [].slice.call(document.querySelectorAll('.section-title')).map(function (h) {
    var words = h.textContent.trim().split(/\s+/);
    h.setAttribute('aria-label', h.textContent.trim());
    h.classList.add('split-words');
    h.innerHTML = words.map(function (w) { return '<span class="w" aria-hidden="true"><span>' + w + '</span></span>'; }).join(' ');
    return { h: h, w: h.querySelectorAll('.w > span') };
  });

  // Hero intro.
  gsap.from('.hero-media', { scale: 1.2, duration: 1.8, ease: 'power2.out' });
  gsap.timeline({ delay: 0.2, defaults: { ease: 'power3.out' } })
    .to(heroLines, { yPercent: 0, duration: 1, stagger: 0.14 })
    .to('.hero-in', { y: 0, opacity: 1, duration: 0.8, stagger: 0.12 }, '<0.4');

  // Hero: leaves drift and fade away on scroll.
  gsap.to('.hero-media img', { yPercent: 12, scale: 1.1, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero-text', { yPercent: -14, opacity: 0.15, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom 25%', scrub: true } });

  // Icon panel rises in, columns stagger.
  gsap.from('.panel', { y: 70, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.panel', start: 'top 92%' } });
  gsap.from('.panel li', { y: 30, opacity: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: '.panel', start: 'top 85%' } });

  gsap.utils.toArray('.eyebrow').forEach(function (el) {
    gsap.from(el, { x: -24, opacity: 0, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%' } });
  });
  titles.forEach(function (t) {
    gsap.set(t.w, { yPercent: 115, rotate: 5 });
    gsap.to(t.w, { yPercent: 0, rotate: 0, duration: 0.9, stagger: 0.07, ease: 'power3.out', scrollTrigger: { trigger: t.h, start: 'top 88%' } });
  });

  // Menu tiles: stagger in, images float with scroll.
  gsap.from('.tile', { y: 70, opacity: 0, rotate: 1.5, duration: 0.9, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: '.tiles', start: 'top 85%' } });
  gsap.utils.toArray('.tile img').forEach(function (img, i) {
    gsap.fromTo(img, { y: 14 }, { y: -14, ease: 'none', scrollTrigger: { trigger: img, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  gsap.from('.full-menu', { y: 40, opacity: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: '.full-menu', start: 'top 92%' } });

  if (fine) {
    document.querySelectorAll('.tile').forEach(function (tile) {
      var rx = gsap.quickTo(tile, 'rotationX', { duration: 0.4 });
      var ry = gsap.quickTo(tile, 'rotationY', { duration: 0.4 });
      tile.addEventListener('pointermove', function (e) {
        var r = tile.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        tile.style.setProperty('--mx', x * 100 + '%');
        tile.style.setProperty('--my', y * 100 + '%');
        ry((x - 0.5) * 8); rx((0.5 - y) * 8);
      });
      tile.addEventListener('pointerleave', function () { rx(0); ry(0); });
    });
    document.querySelectorAll('.magnet').forEach(function (b) {
      var mx = gsap.quickTo(b, 'x', { duration: 0.4, ease: 'power3.out' });
      var my = gsap.quickTo(b, 'y', { duration: 0.4, ease: 'power3.out' });
      b.addEventListener('pointermove', function (e) {
        var r = b.getBoundingClientRect();
        mx((e.clientX - r.left - r.width / 2) * 0.25); my((e.clientY - r.top - r.height / 2) * 0.35);
      });
      b.addEventListener('pointerleave', function () { mx(0); my(0); });
    });
  }

  // Story card and FAQ.
  gsap.from('.story-card', { y: 80, opacity: 0, scale: 0.96, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.story-card', start: 'top 85%' } });
  gsap.fromTo('.story', { backgroundPosition: '50% 0%' }, { backgroundPosition: '50% 100%', ease: 'none', scrollTrigger: { trigger: '.story', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.from('.faq-list details', { y: 28, opacity: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: '.faq-list', start: 'top 88%' } });
  gsap.from('.footer-panel', { y: 70, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.footer-panel', start: 'top 90%' } });

  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
