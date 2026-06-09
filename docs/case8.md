# Case 8: Надлишкова мемоізація (Over-memoization) & Обчислювальний Оверхед

**Категорія:** Computing / State Management
**Тумблер:** Computing → Over-memoization
**Метрика:** INP

## Короткий опис
Безконтрольне огортання кожного компонента в `React.memo`, а кожної функції/об'єкта в `useCallback`/`useMemo` не покращує перформанс, а навпаки — створює обчислювальний оверхед і погіршує INP через постійні порівняння пропсів.

---

## Контент, який бере участь

- **Сторінка:** Dashboard — секція KPI Micro-cards Grid.
- **Слайдер "Поріг маржинальності"** (0–50%): горизонтальний Shadcn Slider над сіткою карток. `onChange` спрацьовує десятки разів на секунду під час руху → батьківський компонент ре-рендериться на кожен піксель.
- **100 мікро-карток KPI** (grid 4–5 в ряд на десктопі), кожна містить:
  - Назва розрізу (наприклад, "Smartphones — Kyiv")
  - Фінансове число + тренд-бейдж
  - Sparkline (recharts, 7 точок)
  - Куточок: mini live spinner (`animate-ping`) — завмирає при фризі main thread
- **Візуальний ефект порогу:** картки з `marginality < threshold` → `opacity-40` + сірий бордер; решта — підсвічуються зеленим.
- **Mobile:** `grid-cols-1`, перші 10 карток видимі за замовчуванням, кнопка "Показати всі 100", Sparkline приховано.

---

## Дані (однакові для обох варіантів)

**Запит:**
```
GET /products?limit=100&select=title,price,discountPercentage,rating,stock,category,brand
```

**Трансформація:** 100 продуктів → 100 карток (1:1). Регіон: `regions[product.id % 5]`, де `regions = ['Kyiv', 'Lviv', 'Kharkiv', 'Odesa', 'Dnipro']`.

**Деривація полів:**
- `title` = `${product.category} — ${region}`
- `currentValue` = `Math.round(product.price * product.stock)`
- `previousValue` = `Math.round(currentValue * product.rating / 5)`
- `trends.percentage` = `Math.round((currentValue - previousValue) / previousValue * 100)`
- `marginality` = `product.discountPercentage` (реальне поле DummyJSON, діапазон ~0–67%)
- `sparklineData` = 7 детермінованих чисел на основі `product.id` та `product.price`

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
  marginality: number;     // = product.discountPercentage
  sparklineData: number[]; // 7 точок, детерміновані
}
```

---

## Гарний код (Тумблер OFF)

**Реалізація:**
```tsx
// Простий функціональний компонент БЕЗ React.memo
function AnalyticCard({ card, threshold }: { card: AnalyticCardData; threshold: number }) {
  const isDimmed = card.marginality < threshold;
  return (
    <div style={{ opacity: isDimmed ? 0.4 : 1 }}>
      ...
    </div>
  );
}

// Рендеринг через звичайний .map() — без мемоізації
{cards.map(card => (
  <AnalyticCard key={card.id} card={card} threshold={threshold} />
))}
```

**Чому це працює швидко:**
- При русі слайдера React ре-рендерить 100 карток напряму через Virtual DOM.
- Кожен компонент легкий — чистий рендер займає мікросекунди.
- Немає додаткового кроку порівняння пропсів.
- Слайдер рухається на 60 FPS, mini spinner у кожній картці крутиться рівно.

---

## Поганий код (Тумблер ON)

**Реалізація:**
```tsx
// Компонент загорнутий у React.memo
const AnalyticCard = React.memo(
  function AnalyticCard({ card, threshold, onCardClick }: Props) {
    const isDimmed = card.marginality < threshold;
    return (
      <div style={{ opacity: isDimmed ? 0.4 : 1 }}>
        ...
      </div>
    );
  }
);

// Батько передає inline-колбек — новий об'єкт на КОЖЕН рендер
{cards.map(card => (
  <AnalyticCard
    key={card.id}
    card={card}                          // нова референція об'єкта щоразу
    threshold={threshold}                // примітив — ОК
    onCardClick={() => log(card.id)}     // нова функція щоразу ← головна помилка
  />
))}
```

**Помилка розробника:**
- Картку загорнуто в `React.memo`, але `card` — новий об'єкт при кожному ре-рендері батька (масив `cards` не мемоізований).
- `onCardClick` — inline-стрілка, нова референція при кожному рендері.
- `React.memo` порівнює `prevProps !== nextProps` → завжди `true` (різні референції) → картка все одно ре-рендериться.

**Чому це гальмує (без штучних симуляцій):**
- На кожен мікро-рух слайдера: React обходить 100 карток і для кожної виконує функцію порівняння пропсів.
- Порівняння дає `false` (змінились референції) → React все одно повністю ре-рендерить картку.
- Подвійне навантаження: **100× порівняння пропсів** + **100× повний ре-рендер** = чистий JS overhead без жодної користі.
- Main thread блокується, INP підскакує.

**Поведінка інтерфейсу:**
- Слайдер "липне" і відстає від курсора.
- Mini spinner у картках завмирає під час лагів.
- Панель фіксує: `"INP: degraded (⚠️ Memo Overhead)"`.

---

## Аналіз

**Ймовірність успішної демонстрації: 8/10**
Overhead від React.memo з non-memoized object props є реальним і вимірюваним на 100 картках з Sparkline. Відсутність штучних затримок — це перевага: проблема чиста і природна. На слабких девайсах і мобільному ефект буде ще виразнішим.

**Відповідність UI та кейсу:** ✅ Повна після оновлення ui.md та case8.md. KPI Micro-cards Grid описаний в обох документах.

**API:** ✅ `GET /products?limit=100&select=...` — існує. `discountPercentage` — реальне поле DummyJSON.

**Нюанс з `threshold` як примітивом:** `threshold` — це `number`, тому React.memo правильно порівнює його і бачить зміну. Картки ре-рендеряться через зміну `threshold` (легітимно) + через зміну `card` і `onCardClick` (зайво). Саме це поєднання і є "фанатичним" неправильним використанням мемоізації.
