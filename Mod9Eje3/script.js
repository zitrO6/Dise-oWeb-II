// Datos de las imágenes (ahora con favoritos y comentarios)
let images = [
    {
        id: 1,
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500',
        title: 'Montañas al Amanecer',
        category: 'naturaleza',
        description: 'Hermoso paisaje montañoso al amanecer',
        favorite: false,
        comments: []
    },
    {
        id: 2,
        url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=500',
        title: 'Ciudad Moderna',
        category: 'ciudad',
        description: 'Rascacielos en una gran ciudad',
        favorite: false,
        comments: []
    },
    {
        id: 3,
        url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500',
        title: 'Tecnología Digital',
        category: 'tecnologia',
        description: 'Circuitos y tecnología moderna',
        favorite: false,
        comments: []
    },
    {
        id: 4,
        url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=500',
        title: 'Retrato Profesional',
        category: 'personas',
        description: 'Fotografía de retrato profesional',
        favorite: false,
        comments: []
    },
    {
        id: 5,
        url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500',
        title: 'Bosque Mágico',
        category: 'naturaleza',
        description: 'Sendero en un bosque encantado',
        favorite: false,
        comments: []
    },
    {
        id: 6,
        url: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=500',
        title: 'Skyline Nocturno',
        category: 'ciudad',
        description: 'Ciudad iluminada de noche',
        favorite: false,
        comments: []
    },
    {
        id: 7,
        url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500',
        title: 'Gadgets Modernos',
        category: 'tecnologia',
        description: 'Dispositivos tecnológicos',
        favorite: false,
        comments: []
    },
    {
        id: 8,
        url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500',
        title: 'Equipo de Trabajo',
        category: 'personas',
        description: 'Grupo de personas trabajando',
        favorite: false,
        comments: []
    }
];

// Variables globales
let currentFilter = 'all';
let currentView = 'grid';
let currentLightboxIndex = 0;
let filteredImages = [...images];

// Elementos del DOM
const gallery = document.getElementById('gallery');
const searchInput = document.getElementById('searchInput');
const filterBtns = document.querySelectorAll('.filter-btn');
const viewBtns = document.querySelectorAll('.view-btn');
const imageCount = document.getElementById('imageCount');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxCategory = document.getElementById('lightboxCategory');
const favoriteBtn = document.getElementById('favoriteBtn');
const commentsList = document.getElementById('commentsList');
const commentInput = document.getElementById('commentInput');
const addCommentBtn = document.getElementById('addCommentBtn');
const uploadInput = document.getElementById('uploadInput');

// Funciones
function renderGallery(imagesToRender = filteredImages) {
    gallery.innerHTML = '';
    imagesToRender.forEach((image, index) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.dataset.id = image.id;
        item.dataset.index = index;
        item.dataset.category = image.category;

        const favoriteClass = image.favorite ? 'favorited' : '';
        const favoriteIcon = image.favorite ? 'fas' : 'far';

        item.innerHTML = `
            <i class="${favoriteIcon} fa-heart favorite-icon" data-id="${image.id}"></i>
            <img src="${image.url}" alt="${image.title}" loading="lazy">
            <div class="gallery-info">
                <span class="gallery-category">${image.category}</span>
                <h3>${image.title}</h3>
                <p class="gallery-description">${image.description}</p>
            </div>
        `;

        item.querySelector('.favorite-icon').addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFavorite(image.id);
        });

        item.addEventListener('click', () => openLightbox(index));
        gallery.appendChild(item);
    });

    imageCount.textContent = imagesToRender.length;
}

function toggleFavorite(id) {
    const image = images.find(img => img.id === id);
    if (image) {
        image.favorite = !image.favorite;
        applyFilters(searchInput.value);
    }
}

function filterByCategory(category) {
    currentFilter = category;
    applyFilters(searchInput.value);
}

function searchImages(query) {
    applyFilters(query);
}

function applyFilters(searchQuery = '') {
    filteredImages = images.filter(image => {
        const matchesCategory = currentFilter === 'all' || image.category === currentFilter || (currentFilter === 'favorites' && image.favorite);
        const matchesSearch = searchQuery === '' ||
            image.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            image.description.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesCategory && matchesSearch;
    });

    renderGallery(filteredImages);
}

function changeView(view) {
    currentView = view;
    if (view === 'list') {
        gallery.classList.add('list-view');
    } else {
        gallery.classList.remove('list-view');
    }
}

function openLightbox(index) {
    currentLightboxIndex = index;
    updateLightbox();
    lightbox.style.opacity = "0";
    lightbox.style.display = "flex";
    setTimeout(() => {
        lightbox.style.opacity = "1";
        lightbox.classList.add('active');
    }, 10);
}

function closeLightbox() {
    lightbox.style.opacity = "0";
    setTimeout(() => {
        lightbox.style.display = "none";
        lightbox.classList.remove('active');
    }, 300);
}

function updateLightbox() {
    const image = filteredImages[currentLightboxIndex];
    lightboxImg.src = image.url;
    lightboxTitle.textContent = image.title;
    lightboxCategory.textContent = image.category;

    // Actualizar botón de favoritos
    if (image.favorite) {
        favoriteBtn.innerHTML = '<i class="fas fa-heart"></i>';
    } else {
        favoriteBtn.innerHTML = '<i class="far fa-heart"></i>';
    }

    // Actualizar comentarios
    renderComments(image.comments);
}

function renderComments(comments) {
    commentsList.innerHTML = '';
    comments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.className = 'comment';
        commentElement.textContent = comment;
        commentsList.appendChild(commentElement);
    });
}

function addComment() {
    const commentText = commentInput.value.trim();
    if (commentText === '') return;

    const image = filteredImages[currentLightboxIndex];
    image.comments.push(commentText);
    renderComments(image.comments);
    commentInput.value = '';
}

function uploadImage(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        const newImage = {
            id: Date.now(),
            url: event.target.result,
            title: `Imagen ${images.length + 1}`,
            category: 'subida',
            description: 'Imagen subida por el usuario',
            favorite: false,
            comments: []
        };

        images.push(newImage);
        applyFilters(searchInput.value);
    };
    reader.readAsDataURL(file);
}

// Event Listeners
searchInput.addEventListener('input', (e) => searchImages(e.target.value));

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterByCategory(btn.dataset.filter);
    });
});

viewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        viewBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        changeView(btn.dataset.view);
    });
});

document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
document.querySelector('.lightbox-next').addEventListener('click', () => {
    currentLightboxIndex = (currentLightboxIndex + 1) % filteredImages.length;
    updateLightbox();
});
document.querySelector('.lightbox-prev').addEventListener('click', () => {
    currentLightboxIndex = (currentLightboxIndex - 1 + filteredImages.length) % filteredImages.length;
    updateLightbox();
});

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') {
        currentLightboxIndex = (currentLightboxIndex + 1) % filteredImages.length;
        updateLightbox();
    }
    if (e.key === 'ArrowLeft') {
        currentLightboxIndex = (currentLightboxIndex - 1 + filteredImages.length) % filteredImages.length;
        updateLightbox();
    }
});

favoriteBtn.addEventListener('click', () => {
    const image = filteredImages[currentLightboxIndex];
    image.favorite = !image.favorite;
    updateLightbox();
    applyFilters(searchInput.value);
});

addCommentBtn.addEventListener('click', addComment);
commentInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addComment();
});

uploadInput.addEventListener('change', uploadImage);

// Inicializar
renderGallery();
