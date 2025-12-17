// Base de datos de productos (con categorías y valoraciones)
const products = [
    {
        id: 1,
        name: 'Laptop Pro',
        price: 12999,
        description: 'Laptop de alto rendimiento, 16GB RAM, 512GB SSD',
        emoji: '💻',
        stock: 5,
        category: 'tecnologia',
        rating: 4.5,
        comments: [
            { user: 'Usuario1', text: 'Excelente producto, muy rápido.', rating: 5 },
            { user: 'Usuario2', 'text': 'Buena relación calidad-precio.', rating: 4 }
        ]
    },
    {
        id: 2,
        name: 'Smartphone X',
        price: 8999,
        description: 'Teléfono inteligente de última generación, 128GB',
        emoji: '📱',
        stock: 10,
        category: 'tecnologia',
        rating: 4.8,
        comments: [
            { user: 'Usuario3', text: 'La cámara es increíble.', rating: 5 }
        ]
    },
    {
        id: 3,
        name: 'Auriculares Inalámbricos',
        price: 2499,
        description: 'Auriculares con cancelación de ruido, 30h de batería',
        emoji: '🎧',
        stock: 15,
        category: 'tecnologia',
        rating: 4.2,
        comments: []
    },
    {
        id: 4,
        name: 'Sofá Cama',
        price: 6999,
        description: 'Sofá cama moderno, tela resistente, 3 plazas',
        emoji: '🛋️',
        stock: 8,
        category: 'hogar',
        rating: 4.0,
        comments: []
    },
    {
        id: 5,
        name: 'Smartwatch',
        price: 4999,
        description: 'Reloj inteligente con GPS y monitor de salud',
        emoji: '⌚',
        stock: 12,
        category: 'tecnologia',
        rating: 4.7,
        comments: []
    },
    {
        id: 6,
        name: 'Bicicleta Montaña',
        price: 15999,
        description: 'Bicicleta de montaña, 21 velocidades, suspensión',
        emoji: '🚵',
        stock: 3,
        category: 'deportes',
        rating: 4.9,
        comments: []
    }
];

// Carrito de compras
let cart = JSON.parse(localStorage.getItem('cart')) || [];
// Historial de pedidos
let orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];
// Producto seleccionado para comentarios
let selectedProductId = null;

// Constantes
const SHIPPING_COST = 50;
const TAX_RATE = 0.16;
const DISCOUNT_COUPONS = {
    'MERCADO10': 0.10,
    'MERCADO20': 0.20
};

// Elementos del DOM
const productsGrid = document.getElementById('productsGrid');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartSummary = document.getElementById('cartSummary');
const subtotal = document.getElementById('subtotal');
const tax = document.getElementById('tax');
const shipping = document.getElementById('shipping');
const discount = document.getElementById('discount');
const total = document.getElementById('total');
const checkoutBtn = document.getElementById('checkoutBtn');
const clearCartBtn = document.getElementById('clearCartBtn');
const confirmModal = document.getElementById('confirmModal');
const orderTotal = document.getElementById('orderTotal');
const orderHistoryDiv = document.getElementById('orderHistory');
const commentsModal = document.getElementById('commentsModal');
const productComments = document.getElementById('productComments');
const commentText = document.getElementById('commentText');
const submitCommentBtn = document.getElementById('submitCommentBtn');
const stars = document.querySelectorAll('.stars i');
const ratingValue = document.getElementById('ratingValue');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const priceFilter = document.getElementById('priceFilter');
const couponInput = document.getElementById('couponInput');
const applyCouponBtn = document.getElementById('applyCouponBtn');
const notification = document.getElementById('notification');

// Funciones
function renderProducts() {
    productsGrid.innerHTML = '';

    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;
    const selectedPrice = priceFilter.value;

    let filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
                              product.description.toLowerCase().includes(searchTerm);
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        let matchesPrice = true;

        if (selectedPrice === 'low') matchesPrice = product.price < 5000;
        if (selectedPrice === 'medium') matchesPrice = product.price >= 5000 && product.price <= 15000;
        if (selectedPrice === 'high') matchesPrice = product.price > 15000;

        return matchesSearch && matchesCategory && matchesPrice;
    });

    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';

        const stockClass = product.stock < 5 ? 'low' : '';
        const stockText = product.stock < 5 ? `¡Solo ${product.stock} disponibles!` : `${product.stock} disponibles`;

        productCard.innerHTML = `
            <div class="product-image">${product.emoji}</div>
            <div class="product-rating">
                <i class="fas fa-star"></i> ${product.rating.toFixed(1)}
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <p class="product-price">$${product.price.toLocaleString()}</p>
                <p class="product-stock ${stockClass}">${stockText}</p>
                <button class="btn-add-cart" onclick="addToCart(${product.id})" ${product.stock === 0 ? 'disabled' : ''}>
                    ${product.stock === 0 ? 'Agotado' : 'Añadir al Carrito'}
                </button>
                <button class="btn-comment" onclick="openCommentsModal(${product.id})">
                    Ver Comentarios (${product.comments.length})
                </button>
            </div>
        `;

        productsGrid.appendChild(productCard);
    });
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);

    if (!product || product.stock === 0) {
        showNotification('Producto no disponible', 'error');
        return;
    }

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        if (existingItem.quantity >= product.stock) {
            showNotification(`No hay más stock disponible de ${product.name}`, 'error');
            return;
        }
        existingItem.quantity++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            emoji: product.emoji,
            quantity: 1
        });
    }

    saveCart();
    renderCart();
    updateCartCount();
    animateCartIcon(productId);
    showNotification(`${product.name} añadido al carrito`, 'success');
}

function animateCartIcon(productId) {
    const productElement = document.querySelector(`.product-card[data-id="${productId}"] .product-image`);
    const cartIcon = document.getElementById('cartIcon');
    const productRect = productElement.getBoundingClientRect();
    const cartRect = cartIcon.getBoundingClientRect();

    const clone = productElement.cloneNode(true);
    clone.style.position = 'fixed';
    clone.style.width = '50px';
    clone.style.height = '50px';
    clone.style.borderRadius = '50%';
    clone.style.zIndex = '1000';
    clone.style.left = `${productRect.left + productRect.width / 2}px`;
    clone.style.top = `${productRect.top + productRect.height / 2}px`;
    clone.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    document.body.appendChild(clone);

    setTimeout(() => {
        clone.style.left = `${cartRect.left + cartRect.width / 2}px`;
        clone.style.top = `${cartRect.top + cartRect.height / 2}px`;
        clone.style.transform = 'scale(0.5)';
        clone.style.opacity = '0';
    }, 10);

    setTimeout(() => {
        document.body.removeChild(clone);
    }, 500);
}

function showNotification(message, type) {
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.add('active');

    setTimeout(() => {
        notification.classList.remove('active');
    }, 3000);
}

function renderCart() {
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Tu carrito está vacío</p>';
        cartSummary.style.display = 'none';
        return;
    }

    cartItems.innerHTML = '';
    cartSummary.style.display = 'block';

    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';

        cartItem.innerHTML = `
            <div class="cart-item-image">${item.emoji}</div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price.toLocaleString()}</div>
                <div class="cart-item-controls">
                    <button class="qty-btn" onclick="decreaseQuantity(${item.id})">-</button>
                    <span class="qty-display">${item.quantity}</span>
                    <button class="qty-btn" onclick="increaseQuantity(${item.id})">+</button>
                    <button class="btn-remove" onclick="removeFromCart(${item.id})">Eliminar</button>
                </div>
            </div>
        `;

        cartItems.appendChild(cartItem);
    });

    updateTotals();
}

function increaseQuantity(productId) {
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.id === productId);

    if (cartItem.quantity >= product.stock) {
        showNotification(`No hay más stock disponible de ${product.name}`, 'error');
        return;
    }

    cartItem.quantity++;
    saveCart();
    renderCart();
}

function decreaseQuantity(productId) {
    const cartItem = cart.find(item => item.id === productId);

    if (cartItem.quantity > 1) {
        cartItem.quantity--;
    } else {
        removeFromCart(productId);
        return;
    }

    saveCart();
    renderCart();
}

function removeFromCart(productId) {
    const product = products.find(p => p.id === productId);
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    renderCart();
    updateCartCount();
    showNotification(`${product.name} eliminado del carrito`, 'warning');
}

function updateTotals() {
    const subtotalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const taxAmount = subtotalAmount * TAX_RATE;
    const shippingAmount = cart.length > 0 ? SHIPPING_COST : 0;
    let discountAmount = 0;

    const couponCode = couponInput.value.trim();
    if (DISCOUNT_COUPONS[couponCode]) {
        discountAmount = subtotalAmount * DISCOUNT_COUPONS[couponCode];
    }

    const totalAmount = subtotalAmount + taxAmount + shippingAmount - discountAmount;

    subtotal.textContent = `$${subtotalAmount.toLocaleString('es-MX', {minimumFractionDigits: 2})}`;
    tax.textContent = `$${taxAmount.toLocaleString('es-MX', {minimumFractionDigits: 2})}`;
    shipping.textContent = `$${shippingAmount.toLocaleString('es-MX', {minimumFractionDigits: 2})}`;
    discount.textContent = `-$${discountAmount.toLocaleString('es-MX', {minimumFractionDigits: 2})}`;
    total.textContent = `$${totalAmount.toLocaleString('es-MX', {minimumFractionDigits: 2})}`;
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = count;
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function clearCart() {
    if (cart.length === 0) {
        showNotification('El carrito ya está vacío', 'warning');
        return;
    }

    if (confirm('¿Estás seguro de vaciar el carrito?')) {
        cart = [];
        saveCart();
        renderCart();
        updateCartCount();
        showNotification('Carrito vaciado', 'warning');
    }
}

function checkout() {
    if (cart.length === 0) {
        showNotification('El carrito está vacío', 'error');
        return;
    }

    const subtotalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const taxAmount = subtotalAmount * TAX_RATE;
    const shippingAmount = SHIPPING_COST;
    const couponCode = couponInput.value.trim();
    const discountAmount = DISCOUNT_COUPONS[couponCode] ? subtotalAmount * DISCOUNT_COUPONS[couponCode] : 0;
    const finalTotal = subtotalAmount + taxAmount + shippingAmount - discountAmount;

    const order = {
        id: Date.now(),
        date: new Date().toLocaleString(),
        items: [...cart],
        total: finalTotal
    };

    orderHistory.push(order);
    localStorage.setItem('orderHistory', JSON.stringify(orderHistory));

    orderTotal.textContent = `$${finalTotal.toLocaleString('es-MX', {minimumFractionDigits: 2})}`;
    confirmModal.classList.add('active');

    setTimeout(() => {
        cart = [];
        saveCart();
        renderCart();
        updateCartCount();
        couponInput.value = '';
        updateTotals();
    }, 500);
}

function closeModal() {
    confirmModal.classList.remove('active');
}

function renderOrderHistory() {
    if (orderHistory.length === 0) {
        orderHistoryDiv.innerHTML = '<p class="empty-history">No hay pedidos realizados.</p>';
        return;
    }

    orderHistoryDiv.innerHTML = '';
    orderHistory.reverse().forEach(order => {
        const orderElement = document.createElement('div');
        orderElement.className = 'order-item';

        orderElement.innerHTML = `
            <h3>Pedido #${order.id}</h3>
            <p class="order-date">${order.date}</p>
            <div class="order-products">
                ${order.items.map(item => `
                    <div class="order-product">
                        <span>${item.name} (x${item.quantity})</span>
                        <span>$${(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                `).join('')}
            </div>
            <p class="order-total">Total: $${order.total.toLocaleString('es-MX', {minimumFractionDigits: 2})}</p>
        `;

        orderHistoryDiv.appendChild(orderElement);
    });
}

function openCommentsModal(productId) {
    selectedProductId = productId;
    const product = products.find(p => p.id === productId);
    renderComments(product.comments);
    commentsModal.classList.add('active');
}

function closeCommentsModal() {
    commentsModal.classList.remove('active');
    commentText.value = '';
    stars.forEach(star => star.classList.remove('active'));
    ratingValue.value = 0;
}

function renderComments(comments) {
    productComments.innerHTML = '';
    if (comments.length === 0) {
        productComments.innerHTML = '<p>No hay comentarios aún.</p>';
        return;
    }

    comments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.className = 'comment-item';

        commentElement.innerHTML = `
            <div class="comment-rating">
                ${'★'.repeat(Math.round(comment.rating))}${'☆'.repeat(5 - Math.round(comment.rating))}
            </div>
            <p><strong>${comment.user}:</strong> ${comment.text}</p>
        `;

        productComments.appendChild(commentElement);
    });
}

function submitComment() {
    const text = commentText.value.trim();
    const rating = parseInt(ratingValue.value);

    if (text === '' || rating === 0) {
        showNotification('Por favor, escribe un comentario y selecciona una valoración', 'error');
        return;
    }

    const product = products.find(p => p.id === selectedProductId);
    product.comments.push({
        user: 'Usuario Anónimo',
        text: text,
        rating: rating
    });

    renderComments(product.comments);
    commentText.value = '';
    stars.forEach(star => star.classList.remove('active'));
    ratingValue.value = 0;
    showNotification('Comentario añadido', 'success');
}

// Event Listeners
searchInput.addEventListener('input', renderProducts);
categoryFilter.addEventListener('change', renderProducts);
priceFilter.addEventListener('change', renderProducts);
checkoutBtn.addEventListener('click', checkout);
clearCartBtn.addEventListener('click', clearCart);
applyCouponBtn.addEventListener('click', updateTotals);
submitCommentBtn.addEventListener('click', submitComment);

// Estrellas de valoración
stars.forEach(star => {
    star.addEventListener('click', () => {
        const value = parseInt(star.getAttribute('data-value'));
        ratingValue.value = value;

        stars.forEach((s, index) => {
            if (index < value) {
                s.classList.add('active');
            } else {
                s.classList.remove('active');
            }
        });
    });
});

// Inicializar
renderProducts();
renderCart();
updateCartCount();
renderOrderHistory();
