// Elementos del DOM
const timeDisplay = document.getElementById('time');
const periodDisplay = document.getElementById('period');
const dateDisplay = document.getElementById('date');
const greetingDisplay = document.getElementById('greeting');
const formatBtn = document.getElementById('formatBtn');
const formatText = document.getElementById('formatText');
const timezoneDisplay = document.getElementById('timezone');
const dayOfYearDisplay = document.getElementById('dayOfYear');
const weekNumberDisplay = document.getElementById('weekNumber');
const secondsTodayDisplay = document.getElementById('secondsToday');
const weatherIcon = document.getElementById('weatherIcon');
const weatherTemp = document.getElementById('weatherTemp');
const weatherDesc = document.getElementById('weatherDesc');
const weatherLocation = document.getElementById('weatherLocation');

// Manecillas del reloj analógico
const hourHand = document.querySelector('.neon-hour-hand');
const minuteHand = document.querySelector('.neon-minute-hand');
const secondHand = document.querySelector('.neon-second-hand');

// Estado: formato de 12h o 24h
let is24HourFormat = false;

// Coordenadas para Santa Cruz, Bolivia
const latitude = -17.7833;
const longitude = -63.1833;

// Actualizar reloj analógico
function updateAnalogClock() {
    const now = new Date();
    const hours = now.getHours() % 12;
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    const hourDegrees = (hours * 30) + (minutes * 0.5);
    const minuteDegrees = minutes * 6;
    const secondDegrees = seconds * 6;

    hourHand.style.transform = `rotate(${hourDegrees}deg) translateX(-50%)`;
    minuteHand.style.transform = `rotate(${minuteDegrees}deg) translateX(-50%)`;
    secondHand.style.transform = `rotate(${secondDegrees}deg) translateX(-50%)`;
}

/**
 * Actualizar el reloj digital
 */
function updateClock() {
    const now = new Date();

    // Obtener componentes de tiempo
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    // Determinar período (AM/PM)
    const period = hours >= 12 ? 'PM' : 'AM';

    // Convertir a formato 12h si es necesario
    if (!is24HourFormat) {
        hours = hours % 12 || 12;
        periodDisplay.textContent = period;
        periodDisplay.style.display = 'block';
    } else {
        periodDisplay.style.display = 'none';
    }

    // Formatear con ceros a la izquierda
    const hoursStr = String(hours).padStart(2, '0');
    const minutesStr = String(minutes).padStart(2, '0');
    const secondsStr = String(seconds).padStart(2, '0');

    // Mostrar tiempo
    timeDisplay.textContent = `${hoursStr}:${minutesStr}:${secondsStr}`;

    // Actualizar reloj analógico
    updateAnalogClock();

    // Actualizar fecha
    updateDate(now);

    // Actualizar saludo
    updateGreeting(now.getHours());

    // Actualizar estadísticas
    updateStats(now);
}

/**
 * Actualizar la fecha
 */
function updateDate(date) {
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    const dateString = date.toLocaleDateString('es-ES', options);
    dateDisplay.textContent = dateString.charAt(0).toUpperCase() + dateString.slice(1);
}

/**
 * Actualizar saludo según la hora
 */
function updateGreeting(hour) {
    let greeting;

    if (hour >= 5 && hour < 12) {
        greeting = '☀️ Buenos días';
    } else if (hour >= 12 && hour < 19) {
        greeting = '🌤️ Buenas tardes';
    } else {
        greeting = '🌙 Buenas noches';
    }

    greetingDisplay.textContent = greeting;
}

/**
 * Obtener zona horaria
 */
function getTimezone() {
    const offset = new Date().getTimezoneOffset();
    const hours = Math.abs(Math.floor(offset / 60));
    const minutes = Math.abs(offset % 60);
    const sign = offset <= 0 ? '+' : '-';

    return `UTC${sign}${hours}${minutes > 0 ? ':' + minutes : ''}`;
}

/**
 * Calcular día del año
 */
function getDayOfYear(date) {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date - start;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
}

/**
 * Calcular número de semana
 */
function getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

/**
 * Calcular segundos transcurridos hoy
 */
function getSecondsToday(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return (hours * 3600) + (minutes * 60) + seconds;
}

/**
 * Actualizar estadísticas
 */
function updateStats(date) {
    dayOfYearDisplay.textContent = getDayOfYear(date);
    weekNumberDisplay.textContent = getWeekNumber(date);
    secondsTodayDisplay.textContent = getSecondsToday(date).toLocaleString();
}

/**
 * Cambiar formato de 12h a 24h y viceversa
 */
function toggleFormat() {
    is24HourFormat = !is24HourFormat;

    if (is24HourFormat) {
        formatText.textContent = 'Cambiar a 12h';
    } else {
        formatText.textContent = 'Cambiar a 24h';
    }

    updateClock();
}

/**
 * Obtener clima usando API (Santa Cruz, Bolivia)
 */
async function fetchWeather() {
    try {
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=auto`
        );
        const data = await response.json();
        const { temperature, weathercode } = data.current_weather;
        const { timezone } = data;

        // Actualizar DOM con datos del clima
        weatherTemp.textContent = `${Math.round(temperature)}°C`;
        weatherLocation.textContent = `Santa Cruz, BO (${timezone.split('/')[1]})`;

        // Código a emoji
        const weatherIcons = {
            0: '☀️', // Despejado
            1: '🌤️', // Mayormente despejado
            2: '🌤️', // Parcialmente nublado
            3: '☁️', // Nublado
            45: '🌫️', // Niebla
            48: '🌫️', // Niebla helada
            51: '🌧️', // Llovizna ligera
            53: '🌧️', // Llovizna moderada
            55: '🌧️', // Llovizna densa
            56: '🌧️', // Llovizna helada ligera
            57: '🌧️', // Llovizna helada densa
            61: '🌧️', // Lluvia ligera
            63: '🌧️', // Lluvia moderada
            65: '🌧️', // Lluvia intensa
            66: '🌧️', // Lluvia helada ligera
            67: '🌧️', // Lluvia helada intensa
            71: '❄️', // Nieve ligera
            73: '❄️', // Nieve moderada
            75: '❄️', // Nieve intensa
            77: '❄️', // Granos de nieve
            80: '🌧️', // Chaparrones ligeros
            81: '🌧️', // Chaparrones moderados
            82: '🌧️', // Chaparrones violentos
            85: '❄️', // Nevadas ligeras
            86: '❄️', // Nevadas intensas
            95: '⛈️', // Tormenta
            96: '⛈️', // Tormenta con granizo ligero
            99: '⛈️'  // Tormenta con granizo intenso
        };

        weatherIcon.textContent = weatherIcons[weathercode] || '🌦️';
        weatherDesc.textContent = getWeatherDescription(weathercode);
    } catch (error) {
        console.error("Error al obtener el clima:", error);
        weatherDesc.textContent = "Error al cargar";
    }
}

/**
 * Descripción del clima según código
 */
function getWeatherDescription(code) {
    const descriptions = {
        0: "Despejado",
        1: "Mayormente despejado",
        2: "Parcialmente nublado",
        3: "Nublado",
        45: "Niebla",
        48: "Niebla helada",
        51: "Llovizna ligera",
        53: "Llovizna moderada",
        55: "Llovizna densa",
        56: "Llovizna helada ligera",
        57: "Llovizna helada densa",
        61: "Lluvia ligera",
        63: "Lluvia moderada",
        65: "Lluvia intensa",
        66: "Lluvia helada ligera",
        67: "Lluvia helada intensa",
        71: "Nieve ligera",
        73: "Nieve moderada",
        75: "Nieve intensa",
        77: "Granos de nieve",
        80: "Chaparrones ligeros",
        81: "Chaparrones moderados",
        82: "Chaparrones violentos",
        85: "Nevadas ligeras",
        86: "Nevadas intensas",
        95: "Tormenta",
        96: "Tormenta con granizo ligero",
        99: "Tormenta con granizo intenso"
    };
    return descriptions[code] || "Clima variable";
}

// Event Listeners
formatBtn.addEventListener('click', toggleFormat);

// Mostrar zona horaria
timezoneDisplay.textContent = getTimezone();

// Actualizar reloj inmediatamente
updateClock();
fetchWeather();

// Actualizar reloj cada segundo
setInterval(updateClock, 1000);

// Log de inicio
console.log('🌌 Reloj digital neón iniciado');
console.log(`Zona horaria: ${getTimezone()}`);
console.log(`Formato: ${is24HourFormat ? '24 horas' : '12 horas'}`);
