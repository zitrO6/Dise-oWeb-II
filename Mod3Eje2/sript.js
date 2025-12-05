// ===============================================
// ELEMENTOS DEL DOM
// ===============================================
const navbar = document.getElementById('navbar');
const btnTop = document.getElementById('btnTop');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const themeToggle = document.getElementById('themeToggle');

// ===============================================
// NAVBAR STICKY Y SCROLL
// ===============================================
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Añadir clase .scrolled al navbar
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Mostrar/Ocultar botón "Volver Arriba"
    if (currentScroll > 300) {
        btnTop.classList.add('visible');
    } else {
        btnTop.classList.remove('visible');
    }

    lastScroll = currentScroll;
});

// ===============================================
// BOTÓN "VOLVER ARRIBA"
// ===============================================
btnTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ===============================================
// MENÚ HAMBURGUESA (RESPONSIVE)
// ===============================================
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Cerrar menú al hacer click en un enlace
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Cerrar menú al hacer click fuera
document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
});

// ===============================================
// SMOOTH SCROLL PARA ENLACES DE NAVEGACIÓN
// ===============================================
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        if (link.getAttribute('href').startsWith('#')) {
            e.preventDefault();

            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ===============================================
// DESTACAR SECCIÓN ACTIVA EN EL NAVBAR
// ===============================================
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (window.pageYOffset >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ===============================================
// MODALIDAD DE TEMA (CLARO/OSCURO)
// ===============================================
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'dark') {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    }
});

// Cargar tema guardado al iniciar
if (localStorage.getItem('theme') === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
}

// ===============================================
// VALIDACIÓN BÁSICA DEL FORMULARIO DE CONTACTO
// ===============================================
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = contactForm.querySelector('input[type="text"]');
        const emailInput = contactForm.querySelector('input[type="email"]');
        const messageInput = contactForm.querySelector('textarea');

        if (!nameInput.value || !emailInput.value || !messageInput.value) {
            alert('Por favor, completa todos los campos.');
            return;
        }

        if (!/^\S+@\S+\.\S+$/.test(emailInput.value)) {
            alert('Por favor, ingresa un email válido.');
            return;
        }

        alert('¡Mensaje enviado con éxito!');
        contactForm.reset();
    });
}

// ===============================================
// LOG DE INICIO (OPCIONAL)
// ===============================================
console.log('🎯 StickyNav Rediseñado - Cargado');
console.log('✨ Características:');
console.log('  - Navbar con position: sticky');
console.log('  - Modo oscuro/claros');
console.log('  - Smooth scroll mejorado');
console.log('  - Validación de formulario');
console.log('  - Menú hamburguesa responsive');
