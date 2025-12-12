// ===== SELECCIÓN DE ELEMENTOS =====
const contadorElement = document.getElementById("contador");
const btnIncrementar = document.getElementById("btnIncrementar");
const btnDecrementar = document.getElementById("btnDecrementar");
const btnResetear = document.getElementById("btnResetear");
const btnIncrementar5 = document.getElementById("btnIncrementar5");
const btnDecrementar5 = document.getElementById("btnDecrementar5");
const mensajeElement = document.getElementById("mensaje");
const displayContador = document.querySelector(".contador-display");

// ===== VARIABLE DEL CONTADOR =====
let contador = parseInt(localStorage.getItem("contador")) || 0;

// ===== FUNCIONES =====
/**
 * Actualiza el display del contador en el DOM
 */
function actualizarDisplay() {
    contadorElement.textContent = contador;
    contadorElement.classList.remove("positivo", "negativo", "neutro");

    if (contador > 0) {
        contadorElement.classList.add("positivo");
        actualizarMensaje("positivo");
    } else if (contador < 0) {
        contadorElement.classList.add("negativo");
        actualizarMensaje("negativo");
    } else {
        contadorElement.classList.add("neutro");
        actualizarMensaje("neutro");
    }

    localStorage.setItem("contador", contador);
}

/**
 * Actualiza el mensaje informativo según el estado
 */
function actualizarMensaje(estado) {
    let mensaje = "";
    let color = "";

    switch (estado) {
        case "positivo":
            mensaje = `El contador está en <strong>positivo</strong> (+${contador})`;
            color = "var(--neon-green)";
            break;
        case "negativo":
            mensaje = `El contador está en <strong>negativo</strong> (${contador})`;
            color = "var(--neon-pink)";
            break;
        case "neutro":
            mensaje = "El contador está en <strong>cero</strong>";
            color = "var(--neon-purple)";
            break;
    }

    mensajeElement.innerHTML = mensaje;
    mensajeElement.querySelector("strong").style.color = color;
}

/**
 * Incrementa el contador
 */
function incrementar(cantidad = 1) {
    contador += cantidad;
    actualizarDisplay();
}

/**
 * Decrementa el contador
 */
function decrementar(cantidad = 1) {
    contador -= cantidad;
    actualizarDisplay();
}

/**
 * Resetea el contador
 */
function resetear() {
    contador = 0;
    actualizarDisplay();
}

// ===== EVENT LISTENERS =====
btnIncrementar.addEventListener("click", () => incrementar(1));
btnDecrementar.addEventListener("click", () => decrementar(1));
btnResetear.addEventListener("click", resetear);
btnIncrementar5.addEventListener("click", () => incrementar(5));
btnDecrementar5.addEventListener("click", () => decrementar(5));

// Atajos de teclado
document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "ArrowUp":
            incrementar(1);
            break;
        case "ArrowDown":
            decrementar(1);
            break;
        case "r":
        case "R":
            resetear();
            break;
        case "+":
            incrementar(5);
            break;
        case "-":
            decrementar(5);
            break;
    }
});

// ===== INICIALIZACIÓN =====
actualizarDisplay();

// Mensaje de bienvenida en consola
console.log("%c🎮 Contador Neón Morado iniciado", "color: #9d00ff; font-weight: bold;");
console.log("%c💡 Atajos de teclado:", "color: #9d00ff; font-weight: bold;");
console.log("%c  ↑ : +1", "color: #05c46b;");
console.log("%c  ↓ : -1", "color: #ff2e63;");
console.log("%c  + : +5", "color: #9d00ff;");
console.log("%c  - : -5", "color: #9d00ff;");
console.log("%c  R : Resetear", "color: #ffd93d;");
