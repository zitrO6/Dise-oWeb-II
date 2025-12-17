// Elementos del DOM
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const contactForm = document.querySelector('.contact-form');

/**
 * Cambiar a una pestaña específica
 */
function switchTab(targetTabId) {
    tabButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
    });

    tabContents.forEach(content => {
        content.classList.remove('active');
    });

    const activeButton = document.querySelector(`[data-tab="${targetTabId}"]`);
    activeButton.classList.add('active');
    activeButton.setAttribute('aria-selected', 'true');

    const activeContent = document.getElementById(targetTabId);
    activeContent.classList.add('active');

    localStorage.setItem('activeTab', targetTabId);
}

/**
 * Obtener índice del tab activo
 */
function getActiveTabIndex() {
    const activeButton = document.querySelector('.tab-btn.active');
    return Array.from(tabButtons).indexOf(activeButton);
}

/**
 * Navegar al tab anterior
 */
function previousTab() {
    const currentIndex = getActiveTabIndex();
    const previousIndex = (currentIndex - 1 + tabButtons.length) % tabButtons.length;
    const previousTabId = tabButtons[previousIndex].dataset.tab;
    switchTab(previousTabId);
}

/**
 * Navegar al tab siguiente
 */
function nextTab() {
    const currentIndex = getActiveTabIndex();
    const nextIndex = (currentIndex + 1) % tabButtons.length;
    const nextTabId = tabButtons[nextIndex].dataset.tab;
    switchTab(nextTabId);
}

// Event listeners para los botones de tabs
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetTab = button.dataset.tab;
        switchTab(targetTab);
    });
});

// Navegación con teclado
document.addEventListener('keydown', (e) => {
    const isInputFocused = document.activeElement.tagName === 'INPUT' ||
                          document.activeElement.tagName === 'TEXTAREA';

    if (isInputFocused) return;

    switch(e.key) {
        case 'ArrowLeft':
            e.preventDefault();
            previousTab();
            break;
        case 'ArrowRight':
            e.preventDefault();
            nextTab();
            break;
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
            const tabIndex = parseInt(e.key) - 1;
            if (tabIndex >= 0 && tabIndex < tabButtons.length) {
                switchTab(tabButtons[tabIndex].dataset.tab);
            }
            break;
    }
});

// Prevenir envío del formulario de contacto (simulación)
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.');
        contactForm.reset();
    });
}

// Cargar tab guardado al iniciar
window.addEventListener('DOMContentLoaded', () => {
    const savedTab = localStorage.getItem('activeTab');
    if (savedTab && document.getElementById(savedTab)) {
        switchTab(savedTab);
    } else {
        switchTab('tab1');
    }
});
