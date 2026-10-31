/* Функция для пересчета цены из строки в число */
function parsePrice(priceStr) {
    const cleanStr = priceStr.replace(/[^\d]/g, '');
    return parseInt(cleanStr) || 0;
}

/* Функция для отрисовки корзины */
function renderCartPage() {
    const cart = getCart();
    const container = document.getElementById('cart-items');
    const summary = document.getElementById('cart-summary');
    const emptyMessage = document.getElementById('empty-cart-message');
    const totalElement = document.getElementById('cart-total-price');

    if (cart.length === 0) {
        container.innerHTML = "";
        summary.style.display = 'none';
        emptyMessage.style.display = 'block';
        return;
    }

    emptyMessage.style.display = 'none';
    summary.style.display = 'flex';
    container.innerHTML = "";

    let totalPrice = 0;

    cart.forEach(cartItem => {
        const product = productsData.find(p => p.id == cartItem.id);
        if (!product) return;

        const priceNumber = parsePrice(product.price);
        totalPrice += priceNumber * cartItem.quantity;

        const itemHtml = `
            <div class="cart-item">
                <div class="cart-item-info">
                    <img src="${product.image}" alt="${product.title}" class="cart-item-image">
                    <div>
                        <div class="cart-item-title">${product.title}</div>
                        <div class="cart-item-price">${product.price}</div>
                    </div>
                </div>
                <div class="cart-item-controls">
                    <button class="quantity-btn" onclick="changeQuantity(${product.id}, -1)">−</button>
                    <span>${cartItem.quantity}</span>
                    <button class="quantity-btn" onclick="changeQuantity(${product.id}, 1)">+</button>
                    <button class="remove-btn" onclick="removeFromCart(${product.id})">🗑️</button>
                </div>
            </div>
        `;
        container.innerHTML += itemHtml;
    });

    totalElement.textContent = totalPrice.toLocaleString('ru-RU') + ' руб';
}

function changeQuantity(productId, delta) {
    let cart = getCart();
    const item = cart.find(i => i.id == productId);
    
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id != productId);
        }
        saveCart(cart);
        renderCartPage();
    }
}

/* удаление товара */
function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(i => i.id != productId);
    saveCart(cart);
    renderCartPage();
}

function checkout() {
    alert("Спасибо за заказ! Наш менеджер скоро свяжется с вами.");
    saveCart([]);
    renderCartPage();
}

document.addEventListener("DOMContentLoaded", renderCartPage);