const gpuData = ["RTX 3060 12GB", "RTX 4060 Ti 8GB", "RTX 4070 Super 12GB", "RTX 4080 16GB", "RTX 4090 24GB"];
const cpuData = ["Intel Core i5-12400F", "AMD Ryzen 5 7500F", "Intel Core i7-14700K", "AMD Ryzen 7 7800X3D", "Intel Core i9-14900K"];
const boardData = ["B760M Gaming", "B650 Carbon WiFi", "Z790 Steel Legend", "X670E Taichi", "Z790 Maximus Hero"];
const ramData = ["16GB DDR4 3200MHz", "32GB DDR5 6000MHz"];
const ssdData = ["1TB NVMe Gen4", "2TB NVMe Gen4"];
const pcNames = ["RASSOKHA START", "RASSOKHA ECO", "RASSOKHA BASE", "RASSOKHA PRO", "RASSOKHA ELITE", "RASSOKHA GAMER", "RASSOKHA STREAM", "RASSOKHA WORK", "RASSOKHA ULTRA", "RASSOKHA MAX", "RASSOKHA NEO", "RASSOKHA PRIME", "RASSOKHA CORE", "RASSOKHA TITAN", "RASSOKHA BEAST", "RASSOKHA LEGEND", "RASSOKHA HERO", "RASSOKHA MASTER", "RASSOKHA KING", "RASSOKHA GOD", "RASSOKHA LITE", "RASSOKHA PLUS", "RASSOKHA SUPER", "RASSOKHA HYPER", "RASSOKHA ULTIMATE"];

const models = [];
for (let i = 0; i < 25; i++) {
    const level = Math.floor(i / 5);
    const hasDiscount = i % 3 === 0;
    models.push({
        id: i + 1,
        name: pcNames[i],
        price: 55000 + (i * 8500) + (level * 5000),
        oldPrice: hasDiscount ? Math.floor((55000 + (i * 8500) + (level * 5000)) * 1.15) : null,
        img: `https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&sig=${i}`,
        badge: i >= 20 ? "new" : i >= 15 && i < 20 ? "hot" : null,
        specs: {
            cpu: cpuData[level],
            gpu: gpuData[level],
            ram: i > 12 ? ramData[1] : ramData[0],
            board: boardData[level],
            ssd: i > 15 ? ssdData[1] : ssdData[0],
            psu: (650 + (level * 150)) + "W 80+ Gold",
            case: ["Deepcool MATREXX", "NZXT H5 Flow", "Fractal Design Meshify", "Lian Li O11", "Corsair 7000D"][level],
            cooler: ["ID-Cooling SE-214", "Deepcool AK400", "be quiet! Dark Rock 4", "NZXT Kraken X63", "Corsair H150i"][level]
        }
    });
}

let cart = JSON.parse(localStorage.getItem('rassokha_cart')) || [];
let currentFilter = {};
let currentSort = 'default';
let searchQuery = '';
let promoApplied = null;
let history = ['home'];

document.addEventListener('DOMContentLoaded', () => {
    renderCatalog();
    updateCartBadge();
    initScrollReveal();
    initTheme();
});

function initTheme() {
    const saved = localStorage.getItem('rassokha_theme');
    if (saved) {
        document.documentElement.setAttribute('data-theme', saved);
        document.getElementById('theme-icon').className = saved === 'light' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('rassokha_theme', next);
    document.getElementById('theme-icon').className = next === 'light' ? 'fas fa-sun' : 'fas fa-moon';
}

function navigateTo(id) {
    if (history[history.length - 1] !== id) history.push(id);
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-links li').forEach(l => l.classList.remove('active'));
    document.querySelectorAll('.btn-tab').forEach(b => b.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    if (document.getElementById('n-' + id)) document.getElementById('n-' + id).classList.add('active');
    if (document.getElementById('b-' + id)) document.getElementById('b-' + id).classList.add('active');
    if (id === 'cart') renderCart();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderCatalog() {
    const grid = document.getElementById('main-grid');
    let filtered = models.filter(m => {
        if (searchQuery && !m.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        if (currentFilter.minPrice && m.price < currentFilter.minPrice) return false;
        if (currentFilter.maxPrice && m.price > currentFilter.maxPrice) return false;
        if (currentFilter.gpu && !m.specs.gpu.includes(currentFilter.gpu)) return false;
        if (currentFilter.cpu && !m.specs.cpu.includes(currentFilter.cpu)) return false;
        if (currentFilter.ram && !m.specs.ram.includes(currentFilter.ram)) return false;
        return true;
    });
    if (currentSort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
    else if (currentSort === 'price-desc') filtered.sort((a, b) => b.price - a.price);
    else if (currentSort === 'name') filtered.sort((a, b) => a.name.localeCompare(b.name));
    document.getElementById('no-results').style.display = filtered.length === 0 ? 'block' : 'none';
    grid.innerHTML = filtered.map(m => `<div class="card" onclick="openModal(${m.id})">${m.badge ? `<div class="card-badge ${m.badge}">${m.badge === 'new' ? 'NEW' : 'HOT'}</div>` : ''}<div class="card-img-wrapper"><img src="${m.img}" alt="${m.name}" loading="lazy" onerror="this.src='https://via.placeholder.com/500x300?text=${m.name}'"></div><div class="card-content"><h3>${m.name}</h3><div class="card-specs"><div><i class="fas fa-microchip"></i>${m.specs.cpu}</div><div><i class="fas fa-tv"></i>${m.specs.gpu}</div><div><i class="fas fa-memory"></i>${m.specs.ram}</div></div><div class="card-footer"><div class="price">${m.price.toLocaleString()} ₽${m.oldPrice ? `<span class="old">${m.oldPrice.toLocaleString()} ₽</span>` : ''}</div><div class="card-actions"><button class="card-btn" onclick="event.stopPropagation();addToCart(${m.id})" title="В корзину"><i class="fas fa-cart-plus"></i></button></div></div></div></div>`).join('');
}

let searchTimeout;
function debouncedSearch() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        searchQuery = document.getElementById('search-input').value;
        renderCatalog();
    }, 300);
}

function toggleFilters() {
    const panel = document.getElementById('filters-panel');
    const btn = document.getElementById('filter-btn');
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    btn.classList.toggle('active');
}

function applyFilters() {
    currentFilter = {
        minPrice: document.getElementById('price-min').value || null,
        maxPrice: document.getElementById('price-max').value || null,
        gpu: document.getElementById('filter-gpu').value || null,
        cpu: document.getElementById('filter-cpu').value || null,
        ram: document.getElementById('filter-ram').value || null
    };
    renderCatalog();
    showToast('info', 'Фильтры применены', `Найдено: ${document.querySelectorAll('.card').length} товаров`);
}

function resetFilters() {
    document.getElementById('price-min').value = '';
    document.getElementById('price-max').value = '';
    document.getElementById('filter-gpu').value = '';
    document.getElementById('filter-cpu').value = '';
    document.getElementById('filter-ram').value = '';
    currentFilter = {};
    renderCatalog();
}

function sortCatalog() {
    currentSort = document.getElementById('sort-select').value;
    renderCatalog();
}

function openModal(id) {
    const m = models.find(x => x.id === id);
    const btn = document.getElementById('m-add-btn');
    document.getElementById('m-img').src = m.img;
    document.getElementById('m-title').innerText = m.name;
    document.getElementById('m-subtitle').innerText = `${m.specs.cpu} + ${m.specs.gpu}`;
    document.getElementById('m-price').innerText = m.price.toLocaleString() + " ₽";
    const oldPriceEl = document.getElementById('m-old-price');
    if (m.oldPrice) {
        oldPriceEl.innerText = m.oldPrice.toLocaleString() + " ₽";
        oldPriceEl.style.display = 'inline';
    } else {
        oldPriceEl.style.display = 'none';
    }
    document.getElementById('m-specs').innerHTML = `<div class="spec-row"><span class="spec-label">Процессор</span><span class="spec-value">${m.specs.cpu}</span></div><div class="spec-row"><span class="spec-label">Видеокарта</span><span class="spec-value">${m.specs.gpu}</span></div><div class="spec-row"><span class="spec-label">Оперативная память</span><span class="spec-value">${m.specs.ram}</span></div><div class="spec-row"><span class="spec-label">Материнская плата</span><span class="spec-value">${m.specs.board}</span></div><div class="spec-row"><span class="spec-label">Накопитель</span><span class="spec-value">${m.specs.ssd}</span></div><div class="spec-row"><span class="spec-label">Блок питания</span><span class="spec-value">${m.specs.psu}</span></div><div class="spec-row"><span class="spec-label">Корпус</span><span class="spec-value">${m.specs.case}</span></div><div class="spec-row"><span class="spec-label">Охлаждение</span><span class="spec-value">${m.specs.cooler}</span></div>`;
    btn.innerHTML = '<i class="fas fa-cart-plus"></i> В корзину';
    btn.classList.remove('btn-green');
    btn.classList.add('btn-purple');
    btn.onclick = () => {
        addToCart(m.id);
        btn.innerHTML = '<i class="fas fa-check"></i> Добавлено!';
        btn.classList.remove('btn-purple');
        btn.classList.add('btn-green');
        setTimeout(() => {
            closeModal();
            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-cart-plus"></i> В корзину';
                btn.classList.add('btn-purple');
                btn.classList.remove('btn-green');
            }, 300);
        }, 800);
    };
    document.getElementById('modal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('modal').classList.remove('active');
    document.body.style.overflow = '';
}

function switchTab(tab) {
    document.querySelectorAll('.modal-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.modal-tab-content').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    document.getElementById('tab-' + tab).classList.add('active');
}

function changeGalleryImage(idx) {
    document.querySelectorAll('.gallery-dot').forEach((d, i) => d.classList.toggle('active', i === idx));
}

function addToCart(id) {
    const item = models.find(x => x.id === id);
    const existing = cart.find(x => x.id === id);
    if (existing) {
        existing.qty = (existing.qty || 1) + 1;
    } else {
        cart.push({ ...item, qty: 1 });
    }
    saveCart();
    updateCartBadge();
    showToast('success', 'Добавлено в корзину', `${item.name}`);
}

function removeFromCart(idx) {
    const item = cart[idx];
    cart.splice(idx, 1);
    saveCart();
    updateCartBadge();
    renderCart();
    showToast('info', 'Удалено из корзины', item.name);
}

function updateQty(idx, delta) {
    cart[idx].qty = (cart[idx].qty || 1) + delta;
    if (cart[idx].qty <= 0) {
        removeFromCart(idx);
        return;
    }
    saveCart();
    updateCartBadge();
    renderCart();
}

function saveCart() {
    localStorage.setItem('rassokha_cart', JSON.stringify(cart));
}

function updateCartBadge() {
    const count = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
    document.getElementById('cart-count').innerText = count;
    document.getElementById('bottom-cart-badge').innerText = count;
    document.getElementById('bottom-cart-badge').style.display = count > 0 ? 'flex' : 'none';
    renderCartDropdown();
}

function renderCartDropdown() {
    const items = document.getElementById('cart-dropdown-items');
    const footer = document.getElementById('cart-dropdown-footer');
    const count = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
    document.getElementById('cart-dropdown-count').innerText = count + ' товар' + (count % 10 === 1 && count % 100 !== 11 ? '' : count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20) ? 'а' : 'ов');
    if (cart.length === 0) {
        items.innerHTML = '<div style="text-align:center;padding:30px;opacity:0.5"><i class="fas fa-shopping-basket" style="font-size:2rem;margin-bottom:10px;display:block"></i>Корзина пуста</div>';
        footer.style.display = 'none';
        return;
    }
    footer.style.display = 'block';
    items.innerHTML = cart.map((item, idx) => `<div class="cart-dropdown-item"><img src="${item.img}" alt="${item.name}"><div class="cart-dropdown-item-info"><div class="name">${item.name}</div><div class="price">${(item.price * (item.qty || 1)).toLocaleString()} ₽</div></div><div class="cart-qty-control"><button class="cart-qty-btn" onclick="event.stopPropagation();updateQty(${idx},-1)">-</button><span>${item.qty || 1}</span><button class="cart-qty-btn" onclick="event.stopPropagation();updateQty(${idx},1)">+</button></div></div>`).join('');
    const total = cart.reduce((sum, item) => sum + item.price * (item.qty || 1), 0);
    document.getElementById('cart-dropdown-total').innerText = total.toLocaleString() + ' ₽';
}

function toggleCartDropdown() {
    document.getElementById('cart-dropdown').classList.toggle('active');
}

function closeCartDropdown() {
    document.getElementById('cart-dropdown').classList.remove('active');
}

function renderCart() {
    const list = document.getElementById('cart-items-list');
    const footer = document.getElementById('cart-footer');
    const empty = document.getElementById('cart-empty');
    const subtitle = document.getElementById('cart-subtitle');
    if (cart.length === 0) {
        list.innerHTML = '';
        footer.style.display = 'none';
        empty.style.display = 'block';
        subtitle.innerText = 'Тут пока тихо...';
        return;
    }
    empty.style.display = 'none';
    footer.style.display = 'block';
    const count = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
    subtitle.innerText = `${count} товар${count % 10 === 1 && count % 100 !== 11 ? '' : count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20) ? 'а' : 'ов'} в корзине`;
    list.innerHTML = cart.map((item, idx) => `<div class="cart-item"><img src="${item.img}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/80?text=PC'"><div class="cart-item-info"><div class="name">${item.name}</div><div class="specs">${item.specs.cpu} / ${item.specs.gpu} / ${item.specs.ram}</div><div class="price">${item.price.toLocaleString()} ₽ × ${item.qty || 1}</div></div><div class="cart-item-controls"><div class="cart-item-qty"><button onclick="updateQty(${idx},-1)">-</button><span>${item.qty || 1}</span><button onclick="updateQty(${idx},1)">+</button></div><button class="cart-item-remove" onclick="removeFromCart(${idx})" title="Удалить"><i class="fas fa-trash-alt"></i></button></div></div>`).join('');
    updateCartSummary();
}

function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => sum + item.price * (item.qty || 1), 0);
    let discount = 0;
    if (promoApplied) {
        discount = Math.floor(subtotal * promoApplied.discount);
        document.getElementById('discount-row').style.display = 'flex';
        document.getElementById('discount-sum').innerText = '-' + discount.toLocaleString() + ' ₽';
    } else {
        document.getElementById('discount-row').style.display = 'none';
    }
    const total = subtotal - discount;
    document.getElementById('subtotal-sum').innerText = subtotal.toLocaleString() + ' ₽';
    document.getElementById('total-sum').innerText = total.toLocaleString() + ' ₽';
}

function applyPromo() {
    const code = document.getElementById('promo-code').value.trim().toUpperCase();
    const msg = document.getElementById('promo-message');
    const promos = { 'BEAST2024': { discount: 0.10, name: 'BEAST2024' }, 'WELCOME': { discount: 0.05, name: 'WELCOME' }, 'SUMMER': { discount: 0.15, name: 'SUMMER' } };
    if (promos[code]) {
        if (promoApplied && promoApplied.name === code) {
            msg.innerHTML = '<span style="color:#ff5e62">Промокод уже применён</span>';
            msg.style.display = 'block';
            return;
        }
        promoApplied = promos[code];
        msg.innerHTML = `<span style="color:var(--accent-green)">Промокод ${code} применён! Скидка ${promos[code].discount * 100}%</span>`;
        msg.style.display = 'block';
        updateCartSummary();
        showToast('success', 'Промокод применён', `Скидка ${promos[code].discount * 100}%`);
    } else {
        promoApplied = null;
        msg.innerHTML = '<span style="color:#ff5e62">Неверный промокод</span>';
        msg.style.display = 'block';
        updateCartSummary();
    }
}

function checkout() {
    if (cart.length === 0) return;
    showToast('success', 'Заказ оформлен!', 'Спасибо за покупку в Рассоха ПК');
    cart = [];
    promoApplied = null;
    saveCart();
    updateCartBadge();
    renderCart();
}

function sendIdea() {
    const text = document.getElementById('idea-text').value.trim();
    if (!text) { showToast('error', 'Ошибка', 'Опишите вашу идею'); return; }
    document.getElementById('ideas-form').style.display = 'none';
    document.getElementById('ideas-success').style.display = 'block';
    showToast('success', 'Идея отправлена!', 'Спасибо за обратную связь');
}

function resetIdeaForm() {
    document.getElementById('ideas-form').style.display = 'block';
    document.getElementById('ideas-success').style.display = 'none';
    document.getElementById('idea-name').value = '';
    document.getElementById('idea-contact').value = '';
    document.getElementById('idea-text').value = '';
}

function sendSupport() {
    const name = document.getElementById('support-name').value.trim();
    const contact = document.getElementById('support-contact').value.trim();
    const text = document.getElementById('support-text').value.trim();
    if (!name || !contact || !text) { showToast('error', 'Ошибка', 'Заполните все обязательные поля'); return; }
    document.getElementById('support-form').style.display = 'none';
    document.getElementById('support-success').style.display = 'block';
    showToast('success', 'Заявка принята!', 'Мастер свяжется с вами');
}

function resetSupportForm() {
    document.getElementById('support-form').style.display = 'block';
    document.getElementById('support-success').style.display = 'none';
    document.getElementById('support-name').value = '';
    document.getElementById('support-contact').value = '';
    document.getElementById('support-topic').value = '';
    document.getElementById('support-text').value = '';
}

function showToast(type, title, message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle' };
    toast.innerHTML = `<i class="fas ${icons[type]}"></i><div class="toast-content"><div class="toast-title">${title}</div><div class="toast-message">${message}</div></div><button class="toast-close" onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) { entry.target.classList.add('active'); }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('cart-dropdown');
    const cartBtn = document.getElementById('n-cart');
    if (!dropdown.contains(e.target) && e.target !== cartBtn && !cartBtn.contains(e.target)) {
        dropdown.classList.remove('active');
    }
});