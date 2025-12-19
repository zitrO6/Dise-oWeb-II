// Elementos
const fileInput = document.getElementById('fileInput');
const browseBtn = document.getElementById('browseBtn');
const uploadArea = document.getElementById('uploadArea');
const gallery = document.getElementById('gallery');
const stats = document.getElementById('stats');
const totalImages = document.getElementById('totalImages');
const totalSize = document.getElementById('totalSize');
const clearAllBtn = document.getElementById('clearAllBtn');
const sortBtn = document.getElementById('sortBtn');
const modal = document.getElementById('modal');
const modalImage = document.getElementById('modalImage');
const modalInfo = document.getElementById('modalInfo');
const modalClose = document.getElementById('modalClose');
const downloadBtn = document.getElementById('downloadBtn');
const shareBtn = document.getElementById('shareBtn');

let images = [];
let sortDirection = 'desc'; // Para ordenar por fecha

/**
 * Formatear tamaño de archivo
 */
function formatSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Procesar archivos
 */
function handleFiles(files) {
    Array.from(files).forEach(file => {
        if (!file.type.startsWith('image/')) {
            alert(`⚠️ ${file.name} no es una imagen válida`);
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const imageData = {
                id: Date.now() + Math.random(),
                src: e.target.result,
                name: file.name,
                size: file.size,
                type: file.type,
                lastModified: file.lastModified
            };

            images.push(imageData);
            renderGallery();
            updateStats();
        };
        reader.readAsDataURL(file);
    });
}

/**
 * Renderizar galería
 */
function renderGallery() {
    if (images.length === 0) {
        gallery.innerHTML = '<p class="empty-gallery">No hay imágenes aún. Sube algunas para empezar.</p>';
        stats.style.display = 'none';
        return;
    }

    // Ordenar imágenes
    images.sort((a, b) => {
        return sortDirection === 'desc' ? b.lastModified - a.lastModified : a.lastModified - b.lastModified;
    });

    stats.style.display = 'flex';
    gallery.innerHTML = images.map(img => `
        <div class="gallery-item">
            <img src="${img.src}" alt="${img.name}" class="gallery-image" onclick="openModal(${img.id})">
            <button class="btn-remove" onclick="removeImage(${img.id})">×</button>
            <div class="gallery-info">
                <div class="image-name" title="${img.name}">${img.name}</div>
                <div class="image-size">${formatSize(img.size)}</div>
            </div>
        </div>
    `).join('');
}

/**
 * Actualizar estadísticas
 */
function updateStats() {
    totalImages.textContent = images.length;
    const total = images.reduce((sum, img) => sum + img.size, 0);
    totalSize.textContent = formatSize(total);
}

/**
 * Eliminar imagen
 */
function removeImage(id) {
    images = images.filter(img => img.id !== id);
    renderGallery();
    updateStats();
}

/**
 * Abrir modal
 */
function openModal(id) {
    const img = images.find(i => i.id === id);
    if (img) {
        modalImage.src = img.src;
        modalInfo.innerHTML = `
            <strong>${img.name}</strong>
            <span>${formatSize(img.size)} • ${img.type}</span>
        `;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

/**
 * Cerrar modal
 */
function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

/**
 * Descargar imagen
 */
function downloadImage() {
    const img = images.find(i => i.id === parseInt(modalImage.dataset.id));
    if (img) {
        const link = document.createElement('a');
        link.download = img.name;
        link.href = img.src;
        link.click();
    }
}

/**
 * Compartir imagen (copiar enlace)
 */
function shareImage() {
    const img = images.find(i => i.id === parseInt(modalImage.dataset.id));
    if (img) {
        navigator.clipboard.writeText(img.src)
            .then(() => alert('✅ Enlace copiado al portapapeles'))
            .catch(() => alert('❌ Error al copiar'));
    }
}

/**
 * Alternar orden
 */
function toggleSort() {
    sortDirection = sortDirection === 'desc' ? 'asc' : 'desc';
    sortBtn.textContent = sortDirection === 'desc' ? 'Ordenar ▼' : 'Ordenar ▲';
    renderGallery();
}

// Event listeners
browseBtn.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', (e) => {
    handleFiles(e.target.files);
    e.target.value = '';
});

// Drag and drop
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('drag-over');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('drag-over');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
    handleFiles(e.dataTransfer.files);
});

// Botones
clearAllBtn.addEventListener('click', () => {
    if (confirm('¿Eliminar todas las imágenes?')) {
        images = [];
        renderGallery();
        updateStats();
    }
});

sortBtn.addEventListener('click', toggleSort);
downloadBtn.addEventListener('click', downloadImage);
shareBtn.addEventListener('click', shareImage);

// Modal
modalClose.addEventListener('click', closeModal);
modal.querySelector('.modal-overlay').addEventListener('click', closeModal);

// ESC para cerrar modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

// Inicializar
console.log('📸 Galería Pastel inicializada');
