// Elementos
const dropzones = document.querySelectorAll('.dropzone');
const items = document.querySelectorAll('.item');
const resetBtn = document.getElementById('resetBtn');
const addBtn = document.getElementById('addBtn');
const prioritizeBtn = document.getElementById('prioritizeBtn');

let draggedItem = null;
let nextId = 6;

/**
 * Inicializar drag para todos los items
 */
function initDragEvents() {
    const allItems = document.querySelectorAll('.item');

    allItems.forEach(item => {
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragend', handleDragEnd);
    });
}

/**
 * Drag start
 */
function handleDragStart(e) {
    draggedItem = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

/**
 * Drag end
 */
function handleDragEnd(e) {
    this.classList.remove('dragging');
    dropzones.forEach(zone => zone.classList.remove('drag-over'));
    saveState();
}

// Eventos para dropzones
dropzones.forEach(zone => {
    zone.addEventListener('dragover', handleDragOver);
    zone.addEventListener('drop', handleDrop);
    zone.addEventListener('dragenter', handleDragEnter);
    zone.addEventListener('dragleave', handleDragLeave);
});

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDragEnter(e) {
    if (e.target.classList.contains('dropzone')) {
        e.target.classList.add('drag-over');
    }
}

function handleDragLeave(e) {
    if (e.target.classList.contains('dropzone')) {
        e.target.classList.remove('drag-over');
    }
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();

    const dropzone = e.target.closest('.dropzone');

    if (dropzone && draggedItem) {
        dropzone.appendChild(draggedItem);
        dropzone.classList.remove('drag-over');
    }

    return false;
}

/**
 * Guardar estado en localStorage
 */
function saveState() {
    const state = {};

    dropzones.forEach(zone => {
        const zoneId = zone.id;
        const itemsInZone = Array.from(zone.querySelectorAll('.item')).map(item => ({
            id: item.dataset.id,
            text: item.querySelector('span:nth-child(2)').textContent,
            priority: item.querySelector('.priority-indicator')?.textContent || '🟢'
        }));
        state[zoneId] = itemsInZone;
    });

    localStorage.setItem('dragDropState', JSON.stringify(state));
}

/**
 * Cargar estado
 */
function loadState() {
    const savedState = localStorage.getItem('dragDropState');

    if (savedState) {
        const state = JSON.parse(savedState);

        // Limpiar zonas
        dropzones.forEach(zone => zone.innerHTML = '');

        // Restaurar items
        Object.keys(state).forEach(zoneId => {
            const zone = document.getElementById(zoneId);
            state[zoneId].forEach(itemData => {
                const item = createItem(itemData.id, itemData.text, itemData.priority);
                zone.appendChild(item);
            });
        });

        initDragEvents();
    }
}

/**
 * Crear nuevo item
 */
function createItem(id, text, priority = '🟢') {
    const item = document.createElement('div');
    item.className = 'item';
    item.draggable = true;
    item.dataset.id = id;
    item.innerHTML = `
        <span class="drag-handle">☰</span>
        <span>${text}</span>
        <span class="priority-indicator">${priority}</span>
    `;
    // Clase según prioridad
    if (priority === '🔴') item.classList.add('priority-high');
    else if (priority === '🟡') item.classList.add('priority-medium');
    else item.classList.add('priority-low');
    return item;
}

/**
 * Resetear orden inicial
 */
function resetOrder() {
    if (confirm('¿Estás seguro de que quieres resetear el orden?')) {
        localStorage.removeItem('dragDropState');
        location.reload();
    }
}

/**
 * Agregar nueva tarea
 */
function addTask() {
    const text = prompt('Escribe la nueva tarea:');
    if (text && text.trim()) {
        const priority = prompt('Prioridad: (🔴 Alta, 🟡 Media, 🟢 Baja)').trim();
        const validPriorities = ['🔴', '🟡', '🟢'];
        const finalPriority = validPriorities.includes(priority) ? priority : '🟢';

        const todoZone = document.getElementById('todo');
        const newItem = createItem(nextId++, text.trim(), finalPriority);
        todoZone.appendChild(newItem);
        initDragEvents();
        saveState();
    } else {
        alert('Por favor, ingresa un texto válido para la tarea.');
    }
}

/**
 * Priorizar tareas
 */
function prioritizeTasks() {
    const allItems = document.querySelectorAll('.item');
    allItems.forEach(item => {
        const priority = item.querySelector('.priority-indicator').textContent;
        if (priority === '🔴') {
            const todoZone = document.getElementById('todo');
            todoZone.prepend(item);
        }
    });
    saveState();
    alert('Tareas priorizadas: Las tareas de alta prioridad (🔴) se movieron al inicio de "Por Hacer".');
}

// Event listeners
resetBtn.addEventListener('click', resetOrder);
addBtn.addEventListener('click', addTask);
prioritizeBtn.addEventListener('click', prioritizeTasks);

// Inicializar
initDragEvents();
loadState();
