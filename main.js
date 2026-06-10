// main.js
// ---------------------------------------------
// De Arriba Car Detailing - JS moderno (2025)
// - Barra de progreso de scroll
// - Animaciones al hacer scroll (reveal)
// - Scroll suave en navegación
// - Manejo de menú móvil
// ---------------------------------------------

// 1. Inyección de estilos mínimos extra (barra de progreso + header scrolled)
(function injectDynamicStyles() {
  const style = document.createElement("style");
  style.textContent = `
    .scroll-progress {
      position: fixed;
      top: 0;
      left: 0;
      height: 3px;
      width: 0;
      background: linear-gradient(90deg, #ffcc33, #ff7b00);
      z-index: 9999;
      transform-origin: left;
      transition: width 0.1s ease-out;
    }

    .header--scrolled {
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.55);
    }
  `;
  document.head.appendChild(style);
})();

// 2. Barra de progreso de scroll + year en footer
(function setupScrollProgressAndYear() {
  const progressBar = document.createElement("div");
  progressBar.classList.add("scroll-progress");
  document.body.appendChild(progressBar);

  const header = document.querySelector(".header");
  const yearSpan = document.getElementById("year");

  if (yearSpan) {
    yearSpan.textContent = String(new Date().getFullYear());
  }

  const updateProgress = () => {
    const scrollTop = window.scrollY || window.pageYOffset;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    progressBar.style.width = `${progress}%`;

    if (header) {
      header.classList.toggle("header--scrolled", scrollTop > 10);
    }
  };

  window.addEventListener("scroll", updateProgress);
  window.addEventListener("resize", updateProgress);
  updateProgress();
})();

// 3. Animaciones reveal usando IntersectionObserver
(function setupRevealOnScroll() {
  const revealElements = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || revealElements.length === 0) {
    // Si el navegador es viejo o no hay elementos, salimos sin romper nada
    revealElements.forEach((el) => el.classList.add("reveal--visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal--visible");
          obs.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2,
    }
  );

  revealElements.forEach((el) => observer.observe(el));
})();

// 4. Scroll suave para links internos (#seccion)
(function setupSmoothScroll() {
  const OFFSET = 70; // compensación por el header

  const internalLinks = document.querySelectorAll('a[href^="#"]');

  function smoothScrollTo(targetId) {
    const target =
      targetId === "#top"
        ? document.body
        : document.querySelector(targetId);

    if (!target) return;

    const targetPosition =
      target.getBoundingClientRect().top + window.scrollY - OFFSET;

    window.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    });
  }

  internalLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href || href === "#") return;

      // Si apunta a una sección interna, evitamos el salto brusco
      if (href.startsWith("#")) {
        event.preventDefault();
        smoothScrollTo(href);
      }
    });
  });
})();

// 5. Menú móvil: cerrar al hacer click en un link
(function setupMobileMenuClose() {
  const navToggle = document.getElementById("nav-toggle");
  const navLinks = document.querySelectorAll(".nav a[href^='#']");

  if (!navToggle) return;

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navToggle.checked) {
        navToggle.checked = false;
      }
    });
  });
})();

// 6. Marcar link activo en el menú según la sección visible
(function setupActiveNavOnScroll() {
  const navLinks = document.querySelectorAll(".nav a[href^='#']");
  const sections = document.querySelectorAll("section[id]");

  if (navLinks.length === 0 || sections.length === 0) return;

  function updateActiveLink() {
    const scrollPos = window.scrollY || window.pageYOffset;
    const OFFSET = 100;

    // Si estamos al final de la página, marcar la última sección
    const nearBottom = window.innerHeight + scrollPos >= document.documentElement.scrollHeight - 10;
    if (nearBottom) {
      const lastSection = sections[sections.length - 1];
      navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${lastSection.id}`);
      });
      return;
    }

    let currentSectionId = "#inicio";

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const top = rect.top + window.scrollY - OFFSET;
      if (scrollPos >= top) {
        currentSectionId = `#${section.id}`;
      }
    });

    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (!href) return;
      if (href === currentSectionId) {
        link.classList.add("is-active");
      } else {
        link.classList.remove("is-active");
      }
    });
  }

  window.addEventListener("scroll", updateActiveLink);
  window.addEventListener("resize", updateActiveLink);
  updateActiveLink();
})();
