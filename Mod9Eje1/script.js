// Elementos del DOM
const itemInput = document.getElementById('itemInput');
const addBtn = document.getElementById('addBtn');
const itemList = document.getElementById('itemList');
const itemCount = document.getElementById('itemCount');
const clearAllBtn = document.getElementById('clearAllBtn');
const addSound = document.getElementById('addSound');
const deleteSound = document.getElementById('deleteSound');
const editSound = document.getElementById('editSound');

// Contador de items
let count = 0;

/**
 * Reproducir sonido
 */
function playSound(sound) {
    sound.currentTime = 0;
    sound.play();
}

/**
 * Actualizar contador
 */
function updateCount() {
    count = itemList.children.length;
    itemCount.textContent = count;
}

/**
 * Crear un nuevo item de lista
 */
function createListItem(text) {
    const li = document.createElement('li');
    li.className = 'list-item';

    li.innerHTML = `
        <span class="item-text">${text}</span>
        <input type="text" class="edit-input" value="${text}">
        <div class="item-buttons">
            <button class="btn-icon btn-edit" title="Editar">✏️</button>
            <button class="btn-icon btn-save" title="Guardar">✓</button>
            <button class="btn-icon btn-delete" title="Eliminar">🗑️</button>
        </div>
    `;

    return li;
}

/**
 * Añadir nuevo item
 */
function addItem() {
    const text = itemInput.value.trim();

    if (text === '') {
        alert('✨ ¡Escribe algo con estilo antes de añadir!');
        itemInput.focus();
        return;
    }

    const listItem = createListItem(text);
    itemList.appendChild(listItem);
    itemInput.value = '';
    itemInput.focus();
    updateCount();
    playSound(addSound);

    // Animación de aparición
    listItem.style.animation = 'slideIn 0.5s ease';
}

/**
 * Eliminar item
 */
function deleteItem(listItem) {
    if (confirm('¿Estás seguro de eliminar este item?')) {
        listItem.style.opacity = '0';
        listItem.style.transform = 'translateX(20px)';
        setTimeout(() => {
            listItem.remove();
            updateCount();
            playSound(deleteSound);
        }, 300);
    }
}

/**
 * Activar modo edición
 */
function enableEditMode(listItem) {
    listItem.classList.add('editing');
    const editInput = listItem.querySelector('.edit-input');
    editInput.focus();
    editInput.select();
    playSound(editSound);
}

/**
 * Guardar edición
 */
function saveEdit(listItem) {
    const editInput = listItem.querySelector('.edit-input');
    const itemText = listItem.querySelector('.item-text');
    const newText = editInput.value.trim();

    if (newText === '') {
        alert('El texto no puede estar vacío');
        return;
    }

    itemText.textContent = newText;
    listItem.classList.remove('editing');
    playSound(editSound);
}

/**
 * Limpiar toda la lista
 */
function clearAll() {
    if (count === 0) {
        alert('La lista ya está vacía');
        return;
    }

    if (confirm(`¿Estás seguro de eliminar todos los ${count} items?`)) {
        itemList.innerHTML = '';
        updateCount();
        playSound(deleteSound);
    }
}

// Event Listeners
addBtn.addEventListener('click', addItem);
itemInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addItem();
    }
});

itemList.addEventListener('click', (e) => {
    const listItem = e.target.closest('.list-item');
    if (!listItem) return;

    if (e.target.classList.contains('btn-delete')) {
        deleteItem(listItem);
    }

    if (e.target.classList.contains('btn-edit')) {
        enableEditMode(listItem);
    }

    if (e.target.classList.contains('btn-save')) {
        saveEdit(listItem);
    }
});

itemList.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && e.target.classList.contains('edit-input')) {
        const listItem = e.target.closest('.list-item');
        saveEdit(listItem);
    }
});

itemList.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && e.target.classList.contains('edit-input')) {
        const listItem = e.target.closest('.list-item');
        listItem.classList.remove('editing');
    }
});

clearAllBtn.addEventListener('click', clearAll);

// Inicializar contador
updateCount();

// Añadir items de ejemplo (opcional)
function addExampleItems() {
    const examples = ['Crear un proyecto', 'Aprender JavaScript', 'Diseñar una app'];
    examples.forEach(text => {
        const listItem = createListItem(text);
        itemList.appendChild(listItem);
    });
    updateCount();
}

// addExampleItems(); // Descomenta para añadir ejemplos al cargar
