/**
 * MENÚ HAMBURGUESA INTERACTIVO
 *
 * Funcionalidad para:
 * 1. Abrir/cerrar el menú en móviles.
 * 2. Cerrar el menú al hacer clic en un enlace.
 * 3. Cerrar el menú al hacer clic fuera de él.
 * 4. Marcar el enlace activo según la sección visible (BONUS).
 */

// Seleccionar elementos del DOM
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Toggle del menú (abrir/cerrar)
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Cerrar menú al hacer clic en un enlace
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        // Cerrar menú en móviles
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');

        // Remover clase 'active' de todos los enlaces
        navLinks.forEach(l => l.classList.remove('active'));

        // Añadir clase 'active' al enlace clickeado
        link.classList.add('active');
    });
});

// Cerrar menú al hacer clic fuera de él
document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
});

// Marcar enlace activo según la sección visible al hacer scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        // Verificar si la sección está en la vista
        if (window.pageYOffset >= (sectionTop - 200)) {
            currentSection = section.getAttribute('id');
        }
    });

    // Actualizar enlace activo
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
});

// Mensaje de consola para depuración (opcional)
console.log('🎮 Navegación interactiva cargada');
console.log('💡 Funcionalidades activas:');
console.log('  - Menú hamburguesa responsive');
console.log('  - Cierre automático al hacer clic en enlaces');
console.log('  - Cierre al hacer clic fuera del menú');
console.log('  - Marcado activo según scroll');
