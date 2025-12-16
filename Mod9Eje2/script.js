// Estado de la aplicación
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';
let currentUser = localStorage.getItem('currentUser') || null;

// Elementos del DOM
const loginContainer = document.getElementById('loginContainer');
const appContainer = document.getElementById('appContainer');
const usernameInput = document.getElementById('username');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const filterBtns = document.querySelectorAll('.filter-btn');
const clearCompletedBtn = document.getElementById('clearCompleted');

// Funciones de autenticación
function login() {
    const username = usernameInput.value.trim();
    if (username === '') return;

    currentUser = username;
    localStorage.setItem('currentUser', currentUser);
    loginContainer.style.display = 'none';
    appContainer.style.display = 'block';
    loadUserTodos();
}

function logout() {
    localStorage.removeItem('currentUser');
    currentUser = null;
    loginContainer.style.display = 'flex';
    appContainer.style.display = 'none';
    todoInput.value = '';
}

function loadUserTodos() {
    const userTodos = JSON.parse(localStorage.getItem(`todos_${currentUser}`)) || [];
    todos = userTodos;
    renderTodos();
}

function saveUserTodos() {
    localStorage.setItem(`todos_${currentUser}`, JSON.stringify(todos));
}

// Funciones principales
function addTodo() {
    const text = todoInput.value.trim();
    if (text === '') return;

    const todo = {
        id: Date.now(),
        text: text,
        completed: false
    };

    todos.push(todo);
    todoInput.value = '';
    saveUserTodos();
    renderTodos();
}

function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveUserTodos();
    renderTodos();
}

function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveUserTodos();
        renderTodos();
    }
}

function clearCompleted() {
    todos = todos.filter(todo => !todo.completed);
    saveUserTodos();
    renderTodos();
}

function renderTodos() {
    let filteredTodos = todos;
    if (currentFilter === 'active') {
        filteredTodos = todos.filter(t => !t.completed);
    } else if (currentFilter === 'completed') {
        filteredTodos = todos.filter(t => t.completed);
    }

    todoList.innerHTML = '';

    filteredTodos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;

        li.innerHTML = `
            <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
            <span class="todo-text">${todo.text}</span>
            <button class="delete-btn">Eliminar</button>
        `;

        li.querySelector('.todo-checkbox').addEventListener('change', () => toggleTodo(todo.id));
        li.querySelector('.delete-btn').addEventListener('click', () => deleteTodo(todo.id));

        todoList.appendChild(li);
    });

    updateCounts();
}

function updateCounts() {
    const activeCount = todos.filter(t => !t.completed).length;
    const completedCount = todos.filter(t => t.completed).length;

    document.getElementById('allCount').textContent = todos.length;
    document.getElementById('activeCount').textContent = activeCount;
    document.getElementById('completedCount').textContent = completedCount;
    document.getElementById('itemsLeft').textContent = `${activeCount} tareas pendientes`;
}

// Event listeners
loginBtn.addEventListener('click', login);
logoutBtn.addEventListener('click', logout);
addBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTodo();
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderTodos();
    });
});

clearCompletedBtn.addEventListener('click', clearCompleted);

// Inicializar
if (currentUser) {
    loginContainer.style.display = 'none';
    appContainer.style.display = 'block';
    loadUserTodos();
} else {
    loginContainer.style.display = 'flex';
    appContainer.style.display = 'none';
}
