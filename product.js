document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const product = productsData.find(p => p.id == productId);

    const container = document.getElementById('product-page');

    if (!product) {
        container.innerHTML = `<h2 style="text-align:center; padding: 50px;">Товар не найден</h2>`;
        return;
    }

    document.title = product.title + " — ELECTRONIC";

    // Берем первые 100 символов для короткого описания
    const shortDesc = product.description ? product.description.substring(0, 100) + '...' : '';

    /* cобираем характеристики */
    let specsHtml = "";
    if (product.specs && product.specs.length > 0) {
        product.specs.forEach(spec => {
            const parts = spec.split(':');
            if (parts.length >= 2) {
                specsHtml += `<tr><td>${parts[0].trim()}</td><td>${parts[1].trim()}</td></tr>`;
            } else {
                specsHtml += `<tr><td colspan="2">${spec}</td></tr>`;
            }
        });
    }

    container.innerHTML = `
        <div class="product-card-top">
            <div class="product-image-block">
                <img src="${product.image}" alt="${product.title}">
            </div>
            
            <div class="product-info-block">
                <h1 class="product-title">${product.title}</h1>
                
                <div class="product-price-row">
                    <span class="price-current">${product.price}</span>
                </div>
                
                                <div class="action-buttons" style="display: flex; flex-direction: column; gap: 10px;">
                    <button class="btn-add-cart" onclick="addToCart(${product.id})">🛒 Добавить в корзину</button>
                    <button class="btn-add-fav" onclick="toggleFavorite(${product.id})">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px; vertical-align: middle;">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                        Добавить в избранное
                    </button>
                </div>
            </div>
        </div>

        <div class="product-details">
            <h2>Описание</h2>
            <div class="product-description">
                ${product.description || 'Отличный товар для вашего дома. Качественные материалы и стильный дизайн.'}
            </div>

            <h2>Характеристики</h2>
            <table class="specs-table">
                ${specsHtml}
            </table>
        </div>
    `;

    const isFav = getFavorites().includes(product.id);
    const favBtn = document.querySelector('.btn-add-fav');
    
    if (isFav && favBtn) {
        favBtn.style.backgroundColor = '#e62e6b';
        const svg = favBtn.querySelector('svg');
        if (svg) svg.style.fill = 'white';
    }

    /* смена цвета */
    if (favBtn) {
        favBtn.addEventListener('click', () => {
            const nowFav = getFavorites().includes(product.id);
            if (nowFav) {
                favBtn.style.backgroundColor = '#e62e6b';
                favBtn.querySelector('svg').style.fill = 'white';
            } else {
                favBtn.style.backgroundColor = '#1a1a1a';
                favBtn.querySelector('svg').style.fill = 'none';
            }
        });
    }
});