// Seleccionar elementos del DOM
const btnOpen = document.querySelector('.btn-open');
const floatingBtn = document.querySelector('.floating-btn');
const btnClose = document.querySelector('.btn-close');
const modalOverlay = document.querySelector('#modalOverlay');
const btnModalAction = document.querySelector('.btn-modal-action');
const modalForm = document.querySelector('.modal-form');
const toast = document.querySelector('#toast');

/**
 * Función para abrir el modal
 */
function openModal() {
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    // Enfocar el primer input del formulario
    setTimeout(() => {
        const firstInput = modalForm.querySelector('input');
        if (firstInput) firstInput.focus();
    }, 300);
}

/**
 * Función para cerrar el modal
 */
function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
    showToast();
}

/**
 * Función para mostrar notificación toast
 */
function showToast() {
    toast.classList.add('active');
    setTimeout(() => {
        toast.classList.remove('active');
    }, 3000);
}

// Event listeners para abrir el modal
btnOpen.addEventListener('click', openModal);
floatingBtn.addEventListener('click', openModal);

// Event listeners para cerrar el modal
btnClose.addEventListener('click', closeModal);
btnModalAction.addEventListener('click', (e) => {
    e.preventDefault(); // Evitar envío del formulario (ejemplo)
    closeModal();
});

// Cerrar modal al hacer clic fuera
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        closeModal();
    }
});

// Cerrar modal con la tecla Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
        closeModal();
    }
});

// Prevenir que los clics dentro del modal cierren el modal
document.querySelector('.modal').addEventListener('click', (e) => {
    e.stopPropagation();
});
