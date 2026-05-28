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
  const themeToggleBtn = document.getElementById('themeToggle');
  const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;

  if (themeToggleBtn && themeIcon) {
    let savedTheme = localStorage.getItem('portfolio_theme_v2');
    if (!savedTheme) {
      savedTheme = 'dark'; // Set dark mode as default
    }

    if (savedTheme === 'dark') {
      document.body.classList.add('dark-theme');
      themeIcon.classList.replace('fa-moon', 'fa-sun');
    } else {
      document.body.classList.remove('dark-theme');
      themeIcon.classList.replace('fa-sun', 'fa-moon');
    }

    themeToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-theme');
      if (document.body.classList.contains('dark-theme')) {
        localStorage.setItem('portfolio_theme_v2', 'dark');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
      } else {
        localStorage.setItem('portfolio_theme_v2', 'light');
        themeIcon.classList.replace('fa-sun', 'fa-moon');
      }
    });
  }

  /* ------------------------------------------------------------------
     5. Neon Stars Background
     ------------------------------------------------------------------ */
  const canvas = document.getElementById('starfield');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height, stars;

    const initStars = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      stars = [];
      const numStars = window.innerWidth < 768 ? 30 : 60; // Fewer on mobile
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: Math.random() * 1.5 + 0.5,
          dy: Math.random() * 0.3 + 0.1,
          color: Math.random() > 0.5 ? '#ff6ec7' : '#6affb5', // Pink & Aqua
          alpha: Math.random() * 0.5 + 0.3
        });
      }
    };

    const drawStars = () => {
      ctx.clearRect(0, 0, width, height);
      stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = star.alpha;
        ctx.shadowBlur = 8;
        ctx.shadowColor = star.color;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1.0;
        
        star.y -= star.dy;
        if (star.y < 0) {
          star.y = height;
          star.x = Math.random() * width;
        }
      });
      requestAnimationFrame(drawStars);
    };

    initStars();
    drawStars();
    window.addEventListener('resize', initStars);
  }

  /* ------------------------------------------------------------------
     6. 3D Tilt Effect on Project Cards
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
