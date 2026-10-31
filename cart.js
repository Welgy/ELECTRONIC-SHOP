function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

/* Сохраняем корзину в память */
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

/* Обновляем cчетчик */
function updateCartCount() {
    const cart = getCart();
    const countElement = document.getElementById('cart-count');
    if (countElement) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        countElement.textContent = totalItems;
    }
}

/* Добавление товара в корзину */
function addToCart(productId) {
    const cart = getCart();
    const existingItem = cart.find(item => item.id == productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id: productId, quantity: 1 });
    }
    saveCart(cart);
    alert("Товар добавлен в корзину!");
}
document.addEventListener("DOMContentLoaded", updateCartCount);

/* избранное */
function getFavorites() {
    const favs = localStorage.getItem('favorites');
    return favs ? JSON.parse(favs) : [];
}

function saveFavorites(favs) {
    localStorage.setItem('favorites', JSON.stringify(favs));
    updateFavCount();
}

function updateFavCount() {
    const favs = getFavorites();
    const countElements = document.querySelectorAll('.fav-count');
    countElements.forEach(el => {
        el.textContent = favs.length;
    });
}

function toggleFavorite(productId) {
    let favs = getFavorites();
    const index = favs.indexOf(productId);
    
    if (index === -1) {
        favs.push(productId);
    } else {
        favs.splice(index, 1);
    }
    
    saveFavorites(favs);
    const btn = document.getElementById(`fav-btn-${productId}`);
    if (btn) {
        btn.classList.toggle('active');
    }
}
document.addEventListener("DOMContentLoaded", updateFavCount);