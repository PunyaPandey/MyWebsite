document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Dark Mode Toggle
  const themeToggle = document.querySelector('.theme-toggle');
  const body = document.body;
  const icon = themeToggle.querySelector('i');

  // Check local storage
  if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-mode');
    icon.classList.replace('fa-moon', 'fa-sun');
  }

  themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');
    icon.classList.replace(isDark ? 'fa-moon' : 'fa-sun', isDark ? 'fa-sun' : 'fa-moon');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });

  // 2. Scroll Reveal Animation
  const revealElements = document.querySelectorAll('[data-reveal]');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // If it's a skill bar, fill it
        if (entry.target.classList.contains('skill-category')) {
          entry.target.querySelectorAll('.fill').forEach(bar => {
            bar.style.width = bar.parentElement.previousElementSibling.lastElementChild.textContent;
          });
        }
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach(el => revealObserver.observe(el));

  // 3. Number Counter Animation (for 450+, 30%)
  const counters = document.querySelectorAll('.count');
  
  const countObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = +counter.getAttribute('data-target');
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        
        let current = 0;
        const updateCount = () => {
          current += increment;
          if (current < target) {
            counter.innerText = Math.ceil(current);
            requestAnimationFrame(updateCount);
          } else {
            counter.innerText = target;
          }
        };
        updateCount();
        observer.unobserve(counter);
      }
    });
  });

  counters.forEach(counter => countObserver.observe(counter));

  // 4. Mobile Nav Toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navList = document.querySelector('.site-nav ul');
  
  if(navToggle) {
    navToggle.addEventListener('click', () => {
      navList.style.display = navList.style.display === 'flex' ? 'none' : 'flex';
      navList.style.flexDirection = 'column';
      navList.style.position = 'absolute';
      navList.style.top = '70px';
      navList.style.right = '20px';
      navList.style.background = 'var(--bg)';
      navList.style.padding = '20px';
      navList.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
      navList.style.borderRadius = '12px';
    });
  }
});
