// Basic interactivity: nav toggle, active section highlight, form handling
(function () {
  const navToggle = document.querySelector('.nav-toggle');
  const navList = document.querySelector('.site-nav ul');
  const links = document.querySelectorAll('.site-nav a[href^="#"]');
  const status = document.querySelector('.form-status');
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Mobile nav toggle
  if (navToggle && navList) {
    navToggle.addEventListener('click', () => {
      const open = navList.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
  }

  // Close menu on link click (mobile)
  links.forEach((a) => a.addEventListener('click', () => navList && navList.classList.remove('open')));

  // Active link on scroll
  const sections = Array.from(document.querySelectorAll('main section[id]'));
  const setActive = () => {
    let activeId = '';
    const scrollY = window.scrollY + 120; // offset for sticky header
    for (const sec of sections) {
      const rect = sec.getBoundingClientRect();
      const top = rect.top + window.scrollY;
      if (scrollY >= top) activeId = sec.id;
    }
    links.forEach((a) => {
      const href = a.getAttribute('href') || '';
      if (!href.startsWith('#')) return;
      a.classList.toggle('active', href.slice(1) === activeId);
    });
  };
  window.addEventListener('scroll', setActive, { passive: true });
  window.addEventListener('load', setActive);

  // Contact form handling (no backend): simple validation + mailto fallback
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = /** @type {HTMLInputElement} */(document.getElementById('name')).value.trim();
      const email = /** @type {HTMLInputElement} */(document.getElementById('email')).value.trim();
      const message = /** @type {HTMLTextAreaElement} */(document.getElementById('message')).value.trim();

      if (!name || !email || !message) {
        if (status) status.textContent = 'Please fill in all required fields.';
        return;
      }

      // create a mailto link
      const subject = encodeURIComponent('Portfolio contact');
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
      const mailto = `mailto:punyasps1020@gmail.com?subject=${subject}&body=${body}`;
      window.location.href = mailto;
      if (status) status.textContent = 'Opening your email client...';
      form.reset();
    });
  }

  // Social placeholders
  const li = document.getElementById('linkedin-link');
  const gh = document.getElementById('github-link');
  if (li) li.href = '#'; // Replace with actual LinkedIn URL
  if (gh) gh.href = '#'; // Replace with actual GitHub URL
})();
