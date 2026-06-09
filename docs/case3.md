# Case 3: Блокування головного потоку / Heavy Mounting & Parsing

**Категорія:** Computing / Клієнтська маршрутизація
**Тумблер:** Computing → Heavy Mounting
**Метрика:** INP, DOM Elements

## Короткий опис
Фриз інтерфейсу та затримка навігації через синхронне монтування тисяч важких DOM-вузлів без пагінації чи віртуалізації.

---

## Гарний код (Тумблер OFF)

**Реалізація:**
```tsx
import { useWindowVirtualizer } from '@tanstack/react-virtual';

const rowVirtualizer = useWindowVirtualizer({
  count: products.length,
  estimateSize: () => 60,
});
```
> Рендерить у DOM лише видимі рядки.

**Поведінка інтерфейсу:**
- Перехід Dashboard → Inventory Control займає до 80мс.
- Живий індикатор (пульсуюча цятка) продовжує рухатись без ривків.
- Панель показує: `"INP: 15ms"`, `"DOM Elements: ~120"`, `"Virtualization: ACTIVE"`.

---

## Поганий код (Тумблер ON)

**Реалізація:**
```tsx
products.map(p => <ProductRow key={p.id} product={p} />)
```
> Кожен рядок містить складну ієрархію shadcn-компонентів. Всередині циклу — важкий синхронний розрахунок або парсинг дат через `new Intl.DateTimeFormat()`.

**Поведінка інтерфейсу:**
- Після кліку на пункт меню — повний фриз на ~2.5 секунди, старий екран залишається.
- Пульсуюча цятка "Система моніторингу: Live" зупиняє анімацію.
- Будь-які кліки ігноруються.
- Панель видає: `"INP: 2450ms (⚠️ High Navigation Blocking)"`, `"DOM Elements: 16000+"`.

---

## Аналіз

**Ймовірність успішної демонстрації: 9/10** — найнадійніший кейс.
2000 рядків × складна shadcn-ієрархія × `new Intl.DateTimeFormat()` у циклі — гарантований фриз. `@tanstack/react-virtual` гарантує миттєвий рендер.

**Відповідність UI та кейсу:** ✅ Повна. Inventory Control Data Table.

**API:** ✅ `GET /products?limit=100` існує. Data Amplification (×20) виконується на сервері.

**Необхідна дія:** Пакет `@tanstack/react-virtual` відсутній у `package.json` — потрібно встановити перед реалізацією.
