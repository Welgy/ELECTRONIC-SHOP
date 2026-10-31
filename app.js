/* логика вывода товаров */
function renderProducts(productsToRender = productsData) {
    productsToRender.sort((a, b) => {
        const getNumber = (title) => {
            const match = title.match(/iPhone\s+(\d+)|MacBook.*M(\d+)|AirPods\s+(\d+)/i);
            if (match) {
                return parseInt(match[1] || match[2] || match[3] || 0);
            }
            return 0;
        };
        const numA = getNumber(a.title);
        const numB = getNumber(b.title);
        return numB - numA;
    });

    const container = document.getElementById('products-container');
    if (!container) return;

    container.innerHTML = "";

    if (productsToRender.length === 0) {
        container.innerHTML = "<p style='padding: 20px; font-size: 16px; grid-column: 1 / -1;'>По вашему запросу ничего не найдено.</p>";
        return;
    }

    productsToRender.forEach(product => {
                const cardHtml = `
                        <div class="product-card" onclick="sessionStorage.setItem('scrollPosition', window.scrollY); window.location.href='product.html?id=${product.id}'">
                <span class="badge">${product.badge}</span>
                <div class="product-image">
                    <img src="${product.image}" alt="${product.title}">
                </div>
                <a href="product.html?id=${product.id}" class="product-title">${product.title}</a>
                <p class="product-price">${product.price}</p>
                <button class="buy-button" onclick="addToCart(${product.id})">В корзину</button>
            </div>
        `;
        container.innerHTML += cardHtml;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const savedScroll = sessionStorage.getItem('scrollPosition');
    if (savedScroll) {
        window.scrollTo(0, parseInt(savedScroll));
        sessionStorage.removeItem('scrollPosition');
    }
    renderProducts();
    const categoryRadios = document.querySelectorAll('.category-cb');
    const priceRange = document.getElementById('price-range');
    const priceValue = document.getElementById('price-value');
    const resetBtn = document.getElementById('reset-filters');
    const productsContainer = document.getElementById('products-container');
    if (!priceRange || !productsContainer) return;

    /* фильтры */
    function applyFilters() {
        const searchInput = document.getElementById('search-input');
        const searchQuery = searchInput ? searchInput.value.toLowerCase().trim() : "";
        const activeFilters = { model: [], memory: [], color: [], screen: [] };
        const selectedCategoryRadio = document.querySelector('.category-cb:checked');
        if (selectedCategoryRadio) {
            const categoryValue = selectedCategoryRadio.nextElementSibling.textContent.trim();
            activeFilters.model.push(categoryValue);
        }

        document.querySelectorAll('.filter-cb').forEach(cb => {
            if (cb.checked) {
                activeFilters[cb.dataset.filter].push(cb.value);
            }
        });

        const maxPrice = parseInt(priceRange.value);

        const filteredProducts = productsData.filter(product => {
            const priceStr = product.price.replace(/[^\d]/g, '');
            const price = parseInt(priceStr) || 0;
            if (price > maxPrice) return false;
            if (searchQuery && !product.title.toLowerCase().includes(searchQuery)) {
                return false;
            }

            if (activeFilters.model.length > 0) {
                const hasSpecificModels = activeFilters.model.some(m => m !== 'iPhone' && m !== 'MacBook' && m !== 'AirPods');
                if (hasSpecificModels) {
                    if (!activeFilters.model.some(m => {
                        if (m === 'iPhone' || m === 'MacBook' || m === 'AirPods') return false;             
                        const title = product.title;
                        if (!m.includes('Pro') && title.includes(m + ' Pro')) {
                            return false;
                        }
                        return title.includes(m);
                    })) return false;
                } else {
                    if (!activeFilters.model.some(m => product.title.includes(m))) return false;
                }
            }

            if (activeFilters.memory.length > 0) {
                if (!activeFilters.memory.some(m => product.title.includes(m))) return false;
            }

            if (activeFilters.color.length > 0) {
                if (!activeFilters.color.some(c => product.title.includes(c))) return false;
            }

            if (activeFilters.screen.length > 0) {
                const specsString = product.specs.join(' ');
                if (!activeFilters.screen.some(s => specsString.includes(s))) return false;
            }

            return true;
        });

        renderProducts(filteredProducts);
    }

    /* логика вкладок */
    categoryRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            const selectedCategory = e.target.dataset.category;
            
            document.querySelectorAll('.sub-filters').forEach(block => {
                block.style.display = 'none';
                block.querySelectorAll('.filter-cb').forEach(cb => cb.checked = false);
            });

            if (selectedCategory) {
                const subFilterBlock = document.getElementById(`sub-${selectedCategory}`);
                if (subFilterBlock) {
                    subFilterBlock.style.display = 'block';
                }
            }
            applyFilters();
        });
    });

    document.addEventListener('change', (e) => {
        if (e.target.classList.contains('filter-cb')) {
            applyFilters();
        }
    });

    /* ползунок цены */
    priceRange.addEventListener('input', (e) => {
        priceValue.textContent = e.target.value;
        applyFilters();
    });

    /* поиск */
    const searchElement = document.getElementById('search-input');
    if (searchElement) {
        searchElement.addEventListener('input', () => {
            applyFilters();
        });
    }

    /* Кнопка сброса */
    resetBtn.addEventListener('click', () => {
        document.querySelectorAll('.filter-cb').forEach(cb => cb.checked = false);
        
        categoryRadios.forEach(r => {
            r.checked = false;
            r.dataset.wasChecked = "false";
        });
        
        document.querySelectorAll('.sub-filters').forEach(block => {
            block.style.display = 'none';
        });

        if (searchElement) searchElement.value = "";

        priceRange.value = priceRange.max;
        priceValue.textContent = priceRange.max;
        
        applyFilters();
    });
});