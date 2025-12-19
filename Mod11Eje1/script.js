// ================================
// GEOLOCATION API
// ================================
document.getElementById('getLocation').addEventListener('click', () => {
    const result = document.getElementById('locationResult');
    result.innerHTML = '<p>🔍 Obteniendo ubicación...</p>';

    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                result.innerHTML = `
                    <p><strong>Latitud:</strong> <span style="color: var(--neon-blue)">${lat.toFixed(4)}</span></p>
                    <p><strong>Longitud:</strong> <span style="color: var(--neon-blue)">${lon.toFixed(4)}</span></p>
                    <p><strong>Precisión:</strong> <span style="color: var(--neon-blue)">${position.coords.accuracy.toFixed(0)}</span> metros</p>
                `;
            },
            (error) => {
                result.innerHTML = `<p style="color: #ff6b6b;">⚠️ Error: ${error.message}</p>`;
            }
        );
    } else {
        result.innerHTML = '<p>❌ Geolocation no soportado</p>';
    }
});

// ================================
// LOCALSTORAGE API
// ================================
const storageInput = document.getElementById('storageInput');
const storageResult = document.getElementById('storageResult');

document.getElementById('saveStorage').addEventListener('click', () => {
    const value = storageInput.value;
    if (value) {
        localStorage.setItem('userInput', value);
        localStorage.setItem('timestamp', new Date().toLocaleString());
        storageResult.innerHTML = '<p style="color: var(--neon-blue);">✓ Guardado exitosamente</p>';
        storageInput.value = '';
    } else {
        storageResult.innerHTML = '<p style="color: #ff6b6b;">⚠️ Ingresa un valor</p>';
    }
});

document.getElementById('loadStorage').addEventListener('click', () => {
    const saved = localStorage.getItem('userInput');
    const timestamp = localStorage.getItem('timestamp');

    if (saved) {
        storageInput.value = saved;
        storageResult.innerHTML = `<p><strong>Último guardado:</strong> <span style="color: var(--neon-blue)">${timestamp}</span></p>`;
    } else {
        storageResult.innerHTML = '<p>📂 No hay datos guardados</p>';
    }
});

document.getElementById('clearStorage').addEventListener('click', () => {
    localStorage.removeItem('userInput');
    localStorage.removeItem('timestamp');
    storageInput.value = '';
    storageResult.innerHTML = '<p style="color: var(--neon-blue);">🗑️ LocalStorage limpiado</p>';
});

// ================================
// FETCH API
// ================================
document.getElementById('fetchData').addEventListener('click', async () => {
    const result = document.getElementById('fetchResult');
    result.innerHTML = '<p>🔄 Cargando datos...</p>';

    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users/1');
        const data = await response.json();

        result.innerHTML = `
            <p><strong>Nombre:</strong> <span style="color: var(--neon-blue)">${data.name}</span></p>
            <p><strong>Email:</strong> <span style="color: var(--neon-blue)">${data.email}</span></p>
            <p><strong>Ciudad:</strong> <span style="color: var(--neon-blue)">${data.address.city}</span></p>
            <p><strong>Empresa:</strong> <span style="color: var(--neon-blue)">${data.company.name}</span></p>
        `;
    } catch (error) {
        result.innerHTML = `<p style="color: #ff6b6b;">⚠️ Error: ${error.message}</p>`;
    }
});

// ================================
// CANVAS API
// ================================
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

document.getElementById('drawRect').addEventListener('click', () => {
    const x = Math.random() * (canvas.width - 100);
    const y = Math.random() * (canvas.height - 100);
    const width = 50 + Math.random() * 50;
    const height = 50 + Math.random() * 50;

    ctx.fillStyle = `hsla(${Math.random() * 360}, 70%, 60%, 0.8)`;
    ctx.fillRect(x, y, width, height);
});

document.getElementById('drawCircle').addEventListener('click', () => {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const radius = 20 + Math.random() * 30;

    ctx.fillStyle = `hsla(${Math.random() * 360}, 70%, 60%, 0.8)`;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
});

document.getElementById('clearCanvas').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(10, 20, 40, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
});

// ================================
// DRAG AND DROP API
// ================================
const draggables = document.querySelectorAll('.draggable');
const zones = document.querySelectorAll('.zone');

draggables.forEach(draggable => {
    draggable.addEventListener('dragstart', () => {
        draggable.classList.add('dragging');
    });

    draggable.addEventListener('dragend', () => {
        draggable.classList.remove('dragging');
    });
});

zones.forEach(zone => {
    zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        zone.classList.add('dragover');
    });

    zone.addEventListener('dragleave', () => {
        zone.classList.remove('dragover');
    });

    zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('dragover');

        const dragging = document.querySelector('.dragging');
        if (dragging) {
            zone.appendChild(dragging);
        }
    });
});

// ================================
// NOTIFICATION API
// ================================
const requestBtn = document.getElementById('requestNotification');
const showBtn = document.getElementById('showNotification');
const notifResult = document.getElementById('notificationResult');

requestBtn.addEventListener('click', async () => {
    if ('Notification' in window) {
        const permission = await Notification.requestPermission();

        if (permission === 'granted') {
            showBtn.disabled = false;
            notifResult.innerHTML = '<p style="color: var(--neon-blue);">✓ Permiso concedido</p>';
        } else {
            notifResult.innerHTML = '<p style="color: #ff6b6b;">❌ Permiso denegado</p>';
        }
    } else {
        notifResult.innerHTML = '<p>❌ Notifications no soportadas</p>';
    }
});

showBtn.addEventListener('click', () => {
    new Notification('🚀 ¡Hola desde HTML5!', {
        body: 'Esta es una notificación de prueba con estilo neón.',
        icon: 'https://cdn-icons-png.flaticon.com/512/561/561127.png',
        badge: 'https://cdn-icons-png.flaticon.com/512/270/270799.png',
        vibrate: [200, 100, 200]
    });
});

// Cargar datos de LocalStorage al inicio
window.addEventListener('load', () => {
    const saved = localStorage.getItem('userInput');
    if (saved) {
        storageInput.value = saved;
    }
});
