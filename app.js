/* app.js – Portfolio de Sandra Barba */

document.addEventListener('DOMContentLoaded', () => {
  /* ------------------------------------------------------------------
     1. Navegación con scroll suave
     ------------------------------------------------------------------ */
  const navLinks = document.querySelectorAll('a[href^="#"]');
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      const targetId = link.getAttribute('href').replace('#', '');
      if (!targetId) return;
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ------------------------------------------------------------------
     2. Reveal on scroll (fade‑in)
     ------------------------------------------------------------------ */
  const revealElements = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1 }
  );
  revealElements.forEach(el => observer.observe(el));

  /* ------------------------------------------------------------------
     3. Formulario de contacto
        - mailto: (abre cliente de correo)
        - WhatsApp link con mismo mensaje
     ------------------------------------------------------------------ */
  const form = document.getElementById('contactForm');
  const statusMessage = document.getElementById('formStatus');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const data = new FormData(form);
      const url = form.getAttribute('action');

      // If placeholder is used, just simulate success or show message
      if (url.includes('TU_CODIGO_AQUI')) {
        statusMessage.textContent = 'Aviso: Falta poner tu código de Formspree en el HTML.';
        statusMessage.style.display = 'block';
        return;
      }

      try {
        const response = await fetch(url, {
          method: 'POST',
          body: data,
          headers: { 'Accept': 'application/json' }
        });
        if (response.ok) {
          form.reset();
          statusMessage.textContent = '¡Mensaje enviado correctamente!';
          statusMessage.style.display = 'block';
        } else {
          statusMessage.textContent = 'Oops! Hubo un problema al enviar tu mensaje.';
          statusMessage.style.color = 'red';
          statusMessage.style.display = 'block';
        }
      } catch (error) {
        statusMessage.textContent = 'Oops! Hubo un problema de red.';
        statusMessage.style.color = 'red';
        statusMessage.style.display = 'block';
      }
    });
  }

  /* ------------------------------------------------------------------
     4. Theme Toggle (Dark / Light)
     ------------------------------------------------------------------ */
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;
  const icon = themeToggle ? themeToggle.querySelector('i') : null;

  // Check saved theme
  const savedTheme = localStorage.getItem('portfolioTheme');
  if (savedTheme === 'dark') {
    body.classList.add('dark-theme');
    if (icon) icon.className = 'fa-solid fa-sun';
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      body.classList.toggle('dark-theme');
      const isDark = body.classList.contains('dark-theme');
      localStorage.setItem('portfolioTheme', isDark ? 'dark' : 'light');
      
      if (icon) {
        icon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
      }
    });
  }

  /* ------------------------------------------------------------------
     5. 3D Tilt Effect on Project Cards
     ------------------------------------------------------------------ */
  const cards = document.querySelectorAll('.project-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -5; // max 5 deg rotation
      const rotateY = ((x - centerX) / centerX) * 5;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
  });
});
