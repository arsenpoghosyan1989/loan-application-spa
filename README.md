# Loan Application SPA

Одностраничное приложение с тремя последовательными формами для оформления заявки на займ. Данные всех шагов сохраняются в общем React-контексте и доступны на любом шаге; финальная модалка показывается после успешного `POST` на тестовый API `dummyjson.com`.

## Стек и обоснование выбора библиотек

| Библиотека | Зачем |
|---|---|
| **Vite 6 + React 19 + TypeScript 5.7** | Современная связка: быстрый dev-сервер, HMR, лучшая производительность билда и свежая система типов. |
| **React Router v7** | Требование ТЗ — переключение между формами через маршруты `/step-1`, `/step-2`, `/step-3`. |
| **Tailwind CSS v4 + `@tailwindcss/vite`** | Утилитарная стилизация без PostCSS-конфига. Новый Vite-плагин подключает Tailwind одним импортом (`@import "tailwindcss";`) и даёт zero-config-старт. |
| **shadcn/ui (new-york style)** | Набор доступных компонентов на базе Radix UI, копируемых в проект (не npm-зависимость). Подключены: `Button`, `Input`, `Label`, `Select`, `Slider`, `Dialog`, `Alert`, `Card`. |
| **Radix UI primitives** (`@radix-ui/react-*`) | Доступность (ARIA, фокус, клавиатура) «из коробки» — база для компонентов shadcn. |
| **lucide-react** | Иконки для shadcn (`Check`, `X`, `ChevronDown`, `Loader2`). |
| **TanStack Form (`@tanstack/react-form`)** | Современный headless менеджер форм с отличной типизацией TS. Интегрируется с Zod-схемой через `validators: { onChange: schema }` — единый источник правды и минимум ре-рендеров. |
| **Zod** | Декларативная схема валидации + вывод TS-типа через `z.infer`. |
| **TanStack Query (`@tanstack/react-query`)** | (а) Кэш списка категорий: `GET /products/category-list` выполняется один раз на сессию (staleTime = 10 мин) — это требуемое ТЗ «переиспользование результата». (б) Мутация `POST /products/add` на шаге 3 с единой обработкой `isPending / isError / onSuccess`. |
| **react-imask** | Маска телефона `0XXX XXX XXX` — готовое, хорошо поддерживаемое решение. |
| **class-variance-authority + clsx + tailwind-merge** | Канонические утилиты shadcn/ui для вариантов и объединения tailwind-классов без конфликтов. |
| **tw-animate-css** | Анимации для Radix-компонентов (open/close, fade, zoom) в Tailwind v4 без собственных keyframes. |

Обоснования продублированы комментариями в коде: `main.tsx`, `vite.config.ts`, `src/index.css`, `src/pages/*`, `src/hooks/useCategories.ts`, `src/api/products.ts`.

## Структура проекта

```
loan-application-spa/
├── components.json             # shadcn/ui конфиг
├── index.html
├── package.json
├── tsconfig.json / app / node  # TS проекты
├── vite.config.ts              # Vite + @tailwindcss/vite + alias "@/*"
└── src/
    ├── api/products.ts         # fetch-обёртки для dummyjson (+ типы)
    ├── components/
    │   ├── StepIndicator.tsx   # Прогресс шагов
    │   ├── SuccessModal.tsx    # Финальная модалка (shadcn Dialog)
    │   └── ui/                 # shadcn/ui — button, input, label, select,
    │                            #   slider, dialog, alert, card, field-error
    ├── context/FormDataContext.tsx  # Общий state трёх форм
    ├── hooks/useCategories.ts       # React Query-хук с кэшем
    ├── lib/utils.ts                 # cn() helper
    ├── pages/
    │   ├── Step1Personal.tsx   # Форма 1 — личные данные
    │   ├── Step2Address.tsx    # Форма 2 — адрес и место работы
    │   └── Step3Loan.tsx       # Форма 3 — параметры займа + submit
    ├── App.tsx                 # Роутер + layout
    ├── main.tsx                # Точка входа, провайдеры
    ├── index.css               # Tailwind + shadcn CSS-переменные
    ├── types.ts
    └── vite-env.d.ts
```

## Запуск

Требования: **Node.js 20.19+** или **22.12+**, **pnpm 10+**.

```bash
pnpm install
pnpm dev          # http://localhost:5173
```

### Другие команды

```bash
pnpm build        # tsc -b && vite build (с проверкой типов)
pnpm preview      # локальный предпросмотр production-сборки
```

## Как проверить работоспособность

1. **Форма 1 — Личные данные.**
   Заполните телефон (маска `0XXX XXX XXX`), имя, фамилию, пол. Попробуйте отправить с пустыми полями — появятся сообщения валидации от Zod.
2. **Форма 2 — Адрес и работа.**
   Подождите загрузку списка категорий с `https://dummyjson.com/products/category-list` (делается одним запросом и кэшируется React Query). Выберите место работы, введите адрес. Нажмите **Назад** — данные предыдущего шага сохранятся.
3. **Форма 3 — Параметры займа.**
   Подвигайте ползунки (сумма $200–$1000 шаг $100, срок 10–30 дней шаг 1). Нажмите **Подать заявку** — уйдёт `POST https://dummyjson.com/products/add` с телом `{"title": "Имя Фамилия"}`; после ответа появится модалка:

   > Поздравляем, `<Фамилия> <Имя>`. Вам одобрена `<сумма>` на `<срок>` дней.

4. **Проверка кэша API.**
   Откройте DevTools → Network → Fetch/XHR. Перейдите со step-3 назад на step-2 и снова вперёд — повторного `GET /products/category-list` быть не должно (используется кэш).

## Ограничения валидации (Zod)

- Телефон — обязательный, регулярка `^0\d{3} \d{3} \d{3}$`.
- Имя / фамилия / адрес — обязательные непустые строки (после `trim`).
- Пол, место работы — обязательный выбор из списка.
- Сумма и срок — гарантированы диапазонами `min/max/step` у `<Slider>` + Zod-проверка границ.

## Время выполнения

Ориентировочно **~3 часа** (первичный каркас → полная миграция на TanStack Form + Tailwind v4 + shadcn/ui с переписыванием всех форм и компонентов + документация).
