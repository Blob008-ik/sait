-- ============================================
-- БАЗА ДАННЫХ: РАССОХА ПК
-- Магазин игровых компьютеров
-- ============================================

DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS promocodes;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS products;

CREATE TABLE products (
    id INTEGER PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price INTEGER NOT NULL,
    old_price INTEGER,
    badge VARCHAR(10),
    image_url VARCHAR(500),
    cpu VARCHAR(100),
    gpu VARCHAR(100),
    ram VARCHAR(50),
    motherboard VARCHAR(100),
    ssd VARCHAR(50),
    psu VARCHAR(50),
    case_name VARCHAR(100),
    cooler VARCHAR(100)
);

CREATE TABLE customers (
    id INTEGER PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    contact VARCHAR(100),
    phone VARCHAR(20),
    city VARCHAR(50)
);

CREATE TABLE orders (
    id INTEGER PRIMARY KEY,
    customer_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER DEFAULT 1,
    total_price INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'new',
    date DATE,
    promo VARCHAR(20),
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE reviews (
    id INTEGER PRIMARY KEY,
    customer_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    text TEXT,
    date DATE,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE promocodes (
    code VARCHAR(20) PRIMARY KEY,
    discount_percent INTEGER NOT NULL,
    max_uses INTEGER DEFAULT 0,
    used_count INTEGER DEFAULT 0,
    valid_until DATE,
    active BOOLEAN DEFAULT TRUE
);

INSERT INTO products (id, name, price, old_price, badge, image_url, cpu, gpu, ram, motherboard, ssd, psu, case_name, cooler) VALUES
(1, 'RASSOKHA START', 55000, 63249, NULL, 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&sig=0', 'Intel Core i5-12400F', 'RTX 3060 12GB', '16GB DDR4 3200MHz', 'B760M Gaming', '1TB NVMe Gen4', '650W 80+ Gold', 'Deepcool MATREXX', 'ID-Cooling SE-214'),
(2, 'RASSOKHA ECO', 63500, NULL, NULL, 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&sig=1', 'Intel Core i5-12400F', 'RTX 3060 12GB', '16GB DDR4 3200MHz', 'B760M Gaming', '1TB NVMe Gen4', '650W 80+ Gold', 'Deepcool MATREXX', 'ID-Cooling SE-214'),
(3, 'RASSOKHA BASE', 72000, NULL, NULL, 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&sig=2', 'Intel Core i5-12400F', 'RTX 3060 12GB', '16GB DDR4 3200MHz', 'B760M Gaming', '1TB NVMe Gen4', '650W 80+ Gold', 'Deepcool MATREXX', 'ID-Cooling SE-214'),
(4, 'RASSOKHA PRO', 80500, 92575, NULL, 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&sig=3', 'Intel Core i5-12400F', 'RTX 3060 12GB', '16GB DDR4 3200MHz', 'B760M Gaming', '1TB NVMe Gen4', '650W 80+ Gold', 'Deepcool MATREXX', 'ID-Cooling SE-214'),
(5, 'RASSOKHA ELITE', 89000, NULL, NULL, 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&sig=4', 'Intel Core i5-12400F', 'RTX 3060 12GB', '16GB DDR4 3200MHz', 'B760M Gaming', '1TB NVMe Gen4', '650W 80+ Gold', 'Deepcool MATREXX', 'ID-Cooling SE-214'),
(6, 'RASSOKHA GAMER', 102500, NULL, NULL, 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&sig=5', 'AMD Ryzen 5 7500F', 'RTX 4060 Ti 8GB', '16GB DDR4 3200MHz', 'B650 Carbon WiFi', '1TB NVMe Gen4', '800W 80+ Gold', 'NZXT H5 Flow', 'Deepcool AK400'),
(7, 'RASSOKHA STREAM', 111000, 127649, NULL, 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&sig=6', 'AMD Ryzen 5 7500F', 'RTX 4060 Ti 8GB', '16GB DDR4 3200MHz', 'B650 Carbon WiFi', '1TB NVMe Gen4', '800W 80+ Gold', 'NZXT H5 Flow', 'Deepcool AK400'),
(8, 'RASSOKHA WORK', 119500, NULL, NULL, 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&sig=7', 'AMD Ryzen 5 7500F', 'RTX 4060 Ti 8GB', '16GB DDR4 3200MHz', 'B650 Carbon WiFi', '1TB NVMe Gen4', '800W 80+ Gold', 'NZXT H5 Flow', 'Deepcool AK400'),
(9, 'RASSOKHA ULTRA', 128000, NULL, NULL, 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&sig=8', 'AMD Ryzen 5 7500F', 'RTX 4060 Ti 8GB', '16GB DDR4 3200MHz', 'B650 Carbon WiFi', '1TB NVMe Gen4', '800W 80+ Gold', 'NZXT H5 Flow', 'Deepcool AK400'),
(10, 'RASSOKHA MAX', 136500, 156975, NULL, 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&sig=9', 'AMD Ryzen 5 7500F', 'RTX 4060 Ti 8GB', '16GB DDR4 3200MHz', 'B650 Carbon WiFi', '1TB NVMe Gen4', '800W 80+ Gold', 'NZXT H5 Flow', 'Deepcool AK400'),
(11, 'RASSOKHA NEO', 150000, NULL, NULL, 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&sig=10', 'Intel Core i7-14700K', 'RTX 4070 Super 12GB', '16GB DDR4 3200MHz', 'Z790 Steel Legend', '1TB NVMe Gen4', '950W 80+ Gold', 'Fractal Design Meshify', 'be quiet! Dark Rock 4'),
(12, 'RASSOKHA PRIME', 158500, NULL, NULL, 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&sig=11', 'Intel Core i7-14700K', 'RTX 4070 Super 12GB', '16GB DDR4 3200MHz', 'Z790 Steel Legend', '1TB NVMe Gen4', '950W 80+ Gold', 'Fractal Design Meshify', 'be quiet! Dark Rock 4'),
(13, 'RASSOKHA CORE', 167000, 192049, NULL, 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&sig=12', 'Intel Core i7-14700K', 'RTX 4070 Super 12GB', '16GB DDR4 3200MHz', 'Z790 Steel Legend', '1TB NVMe Gen4', '950W 80+ Gold', 'Fractal Design Meshify', 'be quiet! Dark Rock 4'),
(14, 'RASSOKHA TITAN', 175500, NULL, NULL, 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&sig=13', 'Intel Core i7-14700K', 'RTX 4070 Super 12GB', '32GB DDR5 6000MHz', 'Z790 Steel Legend', '1TB NVMe Gen4', '950W 80+ Gold', 'Fractal Design Meshify', 'be quiet! Dark Rock 4'),
(15, 'RASSOKHA BEAST', 184000, NULL, NULL, 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&sig=14', 'Intel Core i7-14700K', 'RTX 4070 Super 12GB', '32GB DDR5 6000MHz', 'Z790 Steel Legend', '1TB NVMe Gen4', '950W 80+ Gold', 'Fractal Design Meshify', 'be quiet! Dark Rock 4'),
(16, 'RASSOKHA LEGEND', 197500, 227124, 'hot', 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&sig=15', 'AMD Ryzen 7 7800X3D', 'RTX 4080 16GB', '32GB DDR5 6000MHz', 'X670E Taichi', '1TB NVMe Gen4', '1100W 80+ Gold', 'Lian Li O11', 'NZXT Kraken X63'),
(17, 'RASSOKHA HERO', 206000, NULL, 'hot', 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&sig=16', 'AMD Ryzen 7 7800X3D', 'RTX 4080 16GB', '32GB DDR5 6000MHz', 'X670E Taichi', '2TB NVMe Gen4', '1100W 80+ Gold', 'Lian Li O11', 'NZXT Kraken X63'),
(18, 'RASSOKHA MASTER', 214500, NULL, 'hot', 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&sig=17', 'AMD Ryzen 7 7800X3D', 'RTX 4080 16GB', '32GB DDR5 6000MHz', 'X670E Taichi', '2TB NVMe Gen4', '1100W 80+ Gold', 'Lian Li O11', 'NZXT Kraken X63'),
(19, 'RASSOKHA KING', 223000, 256449, 'hot', 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&sig=18', 'AMD Ryzen 7 7800X3D', 'RTX 4080 16GB', '32GB DDR5 6000MHz', 'X670E Taichi', '2TB NVMe Gen4', '1100W 80+ Gold', 'Lian Li O11', 'NZXT Kraken X63'),
(20, 'RASSOKHA GOD', 231500, NULL, 'hot', 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&sig=19', 'AMD Ryzen 7 7800X3D', 'RTX 4080 16GB', '32GB DDR5 6000MHz', 'X670E Taichi', '2TB NVMe Gen4', '1100W 80+ Gold', 'Lian Li O11', 'NZXT Kraken X63'),
(21, 'RASSOKHA LITE', 245000, NULL, 'new', 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&sig=20', 'Intel Core i9-14900K', 'RTX 4090 24GB', '32GB DDR5 6000MHz', 'Z790 Maximus Hero', '2TB NVMe Gen4', '1250W 80+ Gold', 'Corsair 7000D', 'Corsair H150i'),
(22, 'RASSOKHA PLUS', 253500, 291525, 'new', 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&sig=21', 'Intel Core i9-14900K', 'RTX 4090 24GB', '32GB DDR5 6000MHz', 'Z790 Maximus Hero', '2TB NVMe Gen4', '1250W 80+ Gold', 'Corsair 7000D', 'Corsair H150i'),
(23, 'RASSOKHA SUPER', 262000, NULL, 'new', 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&sig=22', 'Intel Core i9-14900K', 'RTX 4090 24GB', '32GB DDR5 6000MHz', 'Z790 Maximus Hero', '2TB NVMe Gen4', '1250W 80+ Gold', 'Corsair 7000D', 'Corsair H150i'),
(24, 'RASSOKHA HYPER', 270500, NULL, 'new', 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&sig=23', 'Intel Core i9-14900K', 'RTX 4090 24GB', '32GB DDR5 6000MHz', 'Z790 Maximus Hero', '2TB NVMe Gen4', '1250W 80+ Gold', 'Corsair 7000D', 'Corsair H150i'),
(25, 'RASSOKHA ULTIMATE', 279000, 320850, 'new', 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&sig=24', 'Intel Core i9-14900K', 'RTX 4090 24GB', '32GB DDR5 6000MHz', 'Z790 Maximus Hero', '2TB NVMe Gen4', '1250W 80+ Gold', 'Corsair 7000D', 'Corsair H150i');

INSERT INTO customers (id, name, contact, phone, city) VALUES
(1, 'Алексей К.', 'alexey@mail.ru', '+7 900 123-45-67', 'Москва'),
(2, 'Марина Д.', 'marina_d@yandex.ru', '+7 911 234-56-78', 'Санкт-Петербург'),
(3, 'Игорь С.', 'igor_s', '+7 922 345-67-89', 'Новосибирск'),
(4, 'Дмитрий В.', 'dmitry_v@gmail.com', '+7 933 456-78-90', 'Казань'),
(5, 'Елена П.', 'elena_p', '+7 944 567-89-01', 'Екатеринбург');

INSERT INTO orders (id, customer_id, product_id, quantity, total_price, status, date, promo) VALUES
(101, 1, 25, 1, 192500, 'delivered', '2026-05-15', NULL),
(102, 2, 5, 1, 60000, 'delivered', '2026-05-20', NULL),
(103, 3, 23, 1, 170000, 'delivered', '2024-06-01', NULL),
(104, 3, 24, 1, 181000, 'processing', '2026-06-05', 'BEAST2024'),
(105, 4, 10, 1, 140000, 'shipped', '2026-06-07', 'WELCOME'),
(106, 5, 15, 1, 177500, 'new', '2026-06-09', NULL);

INSERT INTO reviews (id, customer_id, product_id, rating, text, date) VALUES
(1, 1, 25, 5, 'Купил RASSOKHA ULTIMATE для работы с 3D. ПК пришёл через 2 дня, идеально упакован. Все компоненты оригинальные, сборка аккуратная. Рекомендую!', '2026-05-18'),
(2, 2, 5, 5, 'Заказывала для сына на день рождения. Поддержка помогла выбрать оптимальную конфигурацию под бюджет. Сын в восторге, Cyberpunk на ультрах летает!', '2026-05-22'),
(3, 3, 23, 4, 'Вторая покупка в Рассоха. Первый ПК работает без нареканий 2 года. Обновился на RTX 4070 — разница ощутима. Спасибо за качество!', '2026-06-03');

INSERT INTO promocodes (code, discount_percent, max_uses, used_count, valid_until, active) VALUES
('BEAST2024', 10, 100, 12, '2026-12-31', TRUE),
('WELCOME', 5, 500, 89, '2026-12-31', TRUE),
('SUMMER', 15, 50, 3, '2026-08-31', TRUE);