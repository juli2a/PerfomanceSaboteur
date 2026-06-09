# Data Fetching & Processing

## Загальне

- Джерело даних: **DummyJSON** public API — `https://dummyjson.com`
- Агрегація та трансформація виконуються на сервері (Next.js Server Components або Server Actions) для реалістичного B2B-середовища.

---

## Dashboard — запити та обробка

Dashboard має **4 незалежних запити**, які демонструють паралельний vs послідовний фетчинг (Case 5). Кожен запит у Route Handler має штучну затримку, що симулює реалістичний DB-запит у мікросервісній архітектурі.

| Функція | Ендпоінт | Затримка | UI-секція |
|---|---|---|---|
| `getProducts()` | `GET /products?limit=100` | 800ms | KPI-картки, категорії, мікро-картки |
| `getCarts()` | `GET /carts?limit=100` | 700ms | KPI замовлення, графік продажів |
| `getUsers()` | `GET /users?limit=100` | 600ms | KPI клієнти, Top Customers |
| `getCategories()` | `GET /products/categories` | 400ms | Категорійна колонка |

- **Паралельно (`Promise.all`):** ~800ms (час найдовшого запиту)
- **Послідовно (sequential await):** ~2500ms

### getProducts — KPI / Statistics
Обробка на сервері:
- **Загальний дохід** = сума всіх `total` з кошиків (`carts`)
- **Кількість замовлень** = загальна кількість записів у `carts`
- **Активні клієнти** = дедуплікація масиву `userId` з кошиків
- **Середній чек** = Загальний дохід / Кількість замовлень

### getCarts — Головний графік продажів
- Базується на агрегації дат з масиву замовлень.
- Оскільки API повертає статичні дані: сервер динамічно **мапить** замовлення, додаючи поточні дати поточного місяця → формуються точки графіка по Днях / Тижнях.

### getCategories — Швидка аналітика категорій
**Запит:** `GET /products/categories` (окремий, незалежний від getProducts).
- Повертає список назв категорій.
- Сервер збагачує їх даними про вартість складу з масиву `getProducts()` → `sum(price × stock)` → прогрес-бар.

### getUsers — Top Customers
**Запит:** `GET /users?limit=100`.
- Відображаються перші 5 користувачів.
- `image` → аватар; ініціали як fallback.
- Lifetime Value дерувується детерміновано: `Math.round(user.id * 1250 + user.age * 300)`.

---

## Inventory Control — запити та обробка

### Отримання розширеної бази (2000+ рядків)
**Запит:** `GET /products?limit=100` (або `limit=0`)

### Data Amplification (трансформація на сервері)
Щоб отримати 2000+ записів без навантаження на мережу — сервер бере 100 товарів і реплікує їх у 20 ітераціях:

```ts
const amplifiedProducts = [];
for (let i = 0; i < 20; i++) {
  baseProducts.forEach(item => {
    const newId = item.id + i * 100;
    let status = "In Stock";
    if (newId % 4 === 0) status = "To Order";
    else if (newId % 4 === 1) status = "Ordered";
    else if (newId % 4 === 2) status = "In Transit";
    else if (newId % 4 === 3) status = "Out of Stock";

    amplifiedProducts.push({
      ...item,
      id: newId,
      title: `${item.title} (Batch ${i + 1})`,
      sku: `SKU-${item.category.substring(0, 3).toUpperCase()}-${newId}`,
      logisticStatus: status
    });
  });
}
```

- Логістичний статус визначається **детерміновано** через `newId % 4`.
- SKU генерується з першіх 3 літер категорії + `newId`.

### Bulk Status Update (мутація)
- Реалізується через **Next.js Server Action**.
- Клієнт відправляє: масив `productIds` + новий статус (наприклад, `In Transit`).
- Сервер емулює реальний запит: штучна затримка `setTimeout(400ms)`.
- Після "збереження" — `revalidatePath('/inventory')` або `router.refresh()` для демонстрації інвалідації кешу.
- DummyJSON не зберігає стан між сесіями → успішний запит імітується.

---

## Case 8 — KPI Micro-cards Grid

**Запит:** `GET /products?limit=100&select=title,price,discountPercentage,rating,stock,category,brand`

**Трансформація:** 100 продуктів → 100 аналітичних карток (1:1). Регіон призначається детерміновано: `regions[product.id % regions.length]`, де `regions = ['Kyiv', 'Lviv', 'Kharkiv', 'Odesa', 'Dnipro']`.

**Деривація полів:**
- `title` = `${product.category} — ${region}`
- `currentValue` = `Math.round(product.price * product.stock)`
- `previousValue` = `Math.round(currentValue * product.rating / 5)` (детерміновано через rating)
- `trends.percentage` = `Math.round((currentValue - previousValue) / previousValue * 100)`
- `marginality` = `product.discountPercentage` (реальне поле DummyJSON, діапазон ~0–67%, добре лягає на слайдер 0–50%)
- `sparklineData` = масив з 7 чисел, генерується детерміновано на основі `product.id` та `product.price`

**Структура картки:**
```ts
interface AnalyticCardData {
  id: string;
  meta: {
    title: string;   // "Smartphones — Kyiv"
    region: string;
  };
  metrics: {
    currentValue: number;
    previousValue: number;
    trends: { percentage: number; direction: 'up' | 'down' };
  };
  marginality: number;   // = product.discountPercentage
  sparklineData: number[]; // 7 точок, детерміновані
}
```
