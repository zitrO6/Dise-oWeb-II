// Elementos del DOM
const modalTriggers = document.querySelectorAll('[data-modal]');
const modals = document.querySelectorAll('.modal');
const body = document.body;
const randomNumberBtn = document.getElementById('random-number-btn');
const randomNumberResult = document.getElementById('random-number-result');
const playBtn = document.querySelector('.play-btn');

// Funciones para modales
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        body.classList.add('modal-open');
    }
}

function closeModal(modal) {
    if (modal) {
        modal.classList.remove('active');
        body.classList.remove('modal-open');
    }
}

function closeAllModals() {
    modals.forEach(modal => {
        modal.classList.remove('active');
    });
    body.classList.remove('modal-open');
}

// Event listeners para abrir modales
modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
        const modalId = trigger.dataset.modal;
        openModal(modalId);
    });
});

// Event listeners para cerrar modales
modals.forEach(modal => {
    const closeBtn = modal.querySelector('.modal-close');
    const overlay = modal.querySelector('.modal-overlay');
    const cancelBtn = modal.querySelector('.cancel-btn');

    if (closeBtn) {
        closeBtn.addEventListener('click', () => closeModal(modal));
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => closeModal(modal));
    }

    if (overlay) {
        overlay.addEventListener('click', () => closeModal(modal));
    }

    const content = modal.querySelector('.modal-content');
    if (content) {
        content.addEventListener('click', (e) => e.stopPropagation());
    }
});

// Cerrar con ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeAllModals();
    }
});

// Formulario en Modal 1
const modalForm = document.querySelector('#modal1 .modal-form');
if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('¡Formulario enviado con éxito!');
        closeAllModals();
        modalForm.reset();
    });
}

// Confirmar acción en Modal 2
const confirmBtn = document.querySelector('#modal2 .btn-success');
if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
        alert('¡Acción confirmada!');
        closeAllModals();
    });
}

// Juego en Modal 5
if (randomNumberBtn && randomNumberResult) {
    randomNumberBtn.addEventListener('click', () => {
        const randomNum = Math.floor(Math.random() * 100) + 1;
        randomNumberResult.textContent = randomNum;
        randomNumberResult.style.animation = 'none';
        void randomNumberResult.offsetWidth;
        randomNumberResult.style.animation = 'pulse 0.5s ease';
    });
}

// Reproductor de música en Modal 6
if (playBtn) {
    let isPlaying = false;
    playBtn.addEventListener('click', () => {
        isPlaying = !isPlaying;
        if (isPlaying) {
            playBtn.innerHTML = '<i class="fas fa-pause"></i>';
            playBtn.style.background = 'var(--neon-pink)';
        } else {
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
            playBtn.style.background = 'rgba(157, 0, 255, 0.2)';
        }
    });
}

// Inicialización
console.log('Sistema de modales neon inicializado');
console.log(`Total de modales: ${modals.length}`);
