// Toby Cafe (demo). Tab menu, navigasi ponsel, dan reveal-kit (fade + rise, sekali).
(function () {
  // Tab menu
  const menu = document.getElementById('menu');
  const tabs = [...document.querySelectorAll('.menu-tab')];
  if (menu && tabs.length) {
    menu.classList.add('js-tabs');
    const select = (tab, focus) => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      });
      menu.dataset.tab = tab.getAttribute('aria-controls');
      if (focus) tab.focus();
    };
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => select(tab));
      tab.addEventListener('keydown', (e) => {
        const map = { ArrowRight: tabs[(i + 1) % tabs.length], ArrowLeft: tabs[(i - 1 + tabs.length) % tabs.length], Home: tabs[0], End: tabs[tabs.length - 1] };
        if (!map[e.key]) return;
        e.preventDefault();
        select(map[e.key], true);
      });
    });
    select(tabs[0]);
  }

  // Navigasi ponsel
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('main-nav');
  if (toggle && nav) {
    const set = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
    };
    toggle.addEventListener('click', () => set(toggle.getAttribute('aria-expanded') !== 'true'));
    nav.addEventListener('click', (e) => { if (e.target.closest('a')) set(false); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { set(false); toggle.focus(); }
    });
  }

  // Reveal-kit: fade + rise, sekali, saat 15% terlihat.
  const items = [...document.querySelectorAll('.reveal')];
  const showAll = () => items.forEach((el) => el.classList.add('in'));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) { showAll(); return; }
  const timer = setTimeout(showAll, 4000);
  const io = new IntersectionObserver((entries) => {
    entries.filter((e) => e.isIntersecting).forEach((e, i) => {
      e.target.style.setProperty('--rd', i * 70 + 'ms');
      e.target.classList.add('in');
      io.unobserve(e.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });
  items.forEach((el) => io.observe(el));
  window.addEventListener('load', () => clearTimeout(timer), { once: true });
})();
