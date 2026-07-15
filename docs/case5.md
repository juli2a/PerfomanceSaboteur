# Case 5: Водоспад запитів (Waterfall)

**Категорія:** Network / Серверна архітектура
**Тумблер:** Network → Request Waterfall
**Метрика:** LCP

## Короткий опис

Послідовне очікування (`await`) незалежних серверних запитів штучно затримує рендеринг сторінки — LCP зростає, бо нічого не може відрендеритись, поки не завершиться останній запит.

> **Примітка:** початково кейс демонстрував і TTFB, але на Vercel production ця метрика не відображає штучну затримку (Early Hints — див. `docs/production-issues.md`), тому TTFB прибрано з проєкту, і кейс демонструється лише через LCP.

---

## Реалізація (Route Handler)

Dashboard викликає єдиний Route Handler, який всередині виконує 4 незалежних запити. Toggle визначає режим: `/api/dashboard?mode=fast` або `/api/dashboard?mode=slow`.

Кожна `get*`-функція всередині Route Handler має штучну затримку (`await sleep(N)`) для симуляції реалістичних DB-запитів у мікросервісній архітектурі:

| Функція           | Ендпоінт                   | Затримка |
| ----------------- | -------------------------- | -------- |
| `getProducts()`   | `GET /products?limit=100`  | 800ms    |
| `getCarts()`      | `GET /carts?limit=100`     | 700ms    |
| `getUsers()`      | `GET /users?limit=100`     | 600ms    |
| `getCategories()` | `GET /products/categories` | 400ms    |

---

## Гарний код (Тумблер OFF)

**Реалізація:**

```ts
const [products, carts, users, categories] = await Promise.all([
  getProducts(),
  getCarts(),
  getUsers(),
  getCategories(),
]);
```

> Усі 4 запити стартують одночасно.

**Поведінка інтерфейсу:**

- Dashboard завантажується цілісно.
- Загальний час ≈ час найдовшого запиту (~800ms).
- Панель: `"LCP: 0.8s"` (зелений).

---

## Поганий код (Тумблер ON)

**Реалізація:**

```ts
const products = await getProducts(); // чекаємо 800ms
const carts = await getCarts(); // потім ще 700ms
const users = await getUsers(); // потім ще 600ms
const categories = await getCategories(); // потім ще 400ms
```

> Кожен запит блокує виконання наступного.

**Поведінка інтерфейсу:**

- Після переходу на Dashboard — білий екран або статичний layout ~2.5 секунди.
- Панель: `"LCP: 2.5s (⚠️ Critical Waterfall Detected)"`.

---

## Аналіз

**Ймовірність успішної демонстрації: 9/10**

**Архітектура toggle ↔ сервер:** Всі тумблери живуть у Zustand з `persist` middleware (→ localStorage), що дозволяє їх стану виживати при перезавантаженні сторінки. Case 5 toggle окремо: при зміні додатково пише cookie `waterfall=on|off` і викликає `router.refresh()`. Server Component читає cookie і обирає стратегію фетчингу. Після refresh клієнт реідратується з localStorage — стан усіх інших тумблерів відновлюється. `router.refresh()` обрано замість `router.push()`: не змінює URL і не скидає клієнтський стан. Підказка у UI при toggle: `"↻ Перезавантаження для застосування"`.

**Штучні затримки:** DummyJSON відповідає за ~150–300ms — без затримок різниця між паралельним і послідовним складе лише ~600ms і буде непомітна. Затримки симулюють реалістичні B2B-умови (складні DB aggregations, міжсервісні виклики) і є коректним педагогічним прийомом.

**API:** ✅ Всі 4 ендпоінти існують у DummyJSON:

- `GET /products?limit=100` ✅
- `GET /carts?limit=100` ✅
- `GET /users?limit=100` ✅
- `GET /products/categories` ✅

**Відповідність UI та кейсу:** ✅ Кожен з 4 запитів має свою UI-секцію на Dashboard.
