# Редизайн фронтенда «Маяк» — план реализации

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Заменить нейтральный generic-стиль фронтенда «Маяк» (React 19 + Vite + Tailwind 4, `web/`) на дизайн-систему «ночное море + янтарный луч маяка», описанную в `docs/superpowers/specs/2026-07-27-frontend-redesign-design.md`, не меняя структуру компонентов, роутинг и бизнес-логику.

**Architecture:** Единый набор CSS custom properties в `web/src/assets/styles/index.css` (уже используется проектом как источник цвета через `bg-[var(--x)]`) расширяется новыми токенами `--beacon`, `--beacon-strong`, `--alarm`, `--alarm-strong`, `--safe`, `--safe-strong` и тремя шрифтовыми переменными. Tailwind получает `fontFamily.display` / `fontFamily.mono` / `fontFamily.sans` через `theme.extend` в `tailwind.config.js`. Дальше редизайн — механическая замена цветовых Tailwind-классов (`blue-*`, `red-*`, `green-*`) на классы вида `[var(--beacon)]` и т.п. по всем компонентам, плюс точечные структурные правки: layout `Login`, «пульс маяка» в `SystemStatus`/`AlarmControlPanel`.

**Tech Stack:** React 19, Vite 7, Tailwind CSS 4 (`@tailwindcss/postcss`), `@fontsource/*` для self-hosted шрифтов (без внешних CDN — важно для офлайн/docker-деплоя).

## Global Constraints

- Не менять структуру компонентов, пропсы, роутинг, API-вызовы — только визуальный слой (className, CSS, шрифты, разметка внутри существующих контейнеров).
- Никаких внешних CDN для шрифтов — только self-hosted npm-пакеты `@fontsource/*`, импортированные локально.
- Обе темы (`dark`/`light`) должны работать после каждой задачи — токены определены для обеих в `index.css` через `:root[data-theme="dark"]` / `:root[data-theme="light"]`.
- Анимация «пульс маяка» обязана уважать `prefers-reduced-motion: reduce` (статичное состояние вместо анимации).
- Цветовая замена: везде, где раньше стоял `blue-600`/`blue-700`/`blue-500` (акцент/CTA/фокус) → токен `--beacon` (обычное состояние) / `--beacon-strong` (hover/active/focus-ring); `red-500/600/700` (тревога/удаление/ошибка) → `--alarm` / `--alarm-strong`; `green-500/600` (успех/онлайн/безопасно) → `--safe` / `--safe-strong`.
- Скругления: `rounded-2xl` → `rounded-lg`, `rounded-xl` → `rounded-md` везде в редизайненных файлах (приборная эстетика вместо мягкого SaaS-вида), кроме `rounded-full` (без изменений) и `rounded-md`/`rounded-lg`, которые уже были такими.
- Каждая задача заканчивается: `npm run build` в `web/` без ошибок, и визуальной проверкой через скриншот (dev-сервер на `localhost:3000`, обе темы) — тестового фреймворка в проекте нет, поэтому это единственный способ проверки для UI-задач.

---

## Файловая карта

Модифицируются только файлы в `web/`:

- `web/package.json` — добавляются `@fontsource/inter`, `@fontsource/big-shoulders-display`, `@fontsource/ibm-plex-mono`
- `web/tailwind.config.js` — `theme.extend.fontFamily`
- `web/src/assets/styles/index.css` — токены цвета (перезапись), импорт шрифтов, keyframes пульса
- `web/src/pages/login.jsx` — split-layout (переписывается)
- `web/src/components/Navbar.jsx`, `ProfileMenu.jsx`, `ErrorModal.jsx`, `ConfirmActivateModal.jsx`, `components/ui/BigSelect.jsx`, `StyledCheckbox.jsx`, `StyledSelect.jsx`, `TimePicker.jsx` — токены/типографика
- `web/src/components/SystemStatus.jsx`, `AlarmControlPanel.jsx` — токены + «пульс маяка»
- `web/src/components/ChangeDutyPanel.jsx`, `web/src/pages/Dashboard.jsx` — токены
- `web/src/pages/Alarms.jsx`, `web/src/components/Alarms/*.jsx` — токены
- `web/src/pages/Devices.jsx`, `web/src/components/Devices/*.jsx` — токены
- `web/src/pages/PlannedAlerts.jsx`, `web/src/components/Alerts/*.jsx`, `web/src/components/Alerts/schoolRings/**/*.jsx` — токены
- `web/src/pages/Settings.jsx`, `web/src/components/Settings/*.jsx` — токены

---

### Task 1: Шрифты и цветовые токены (фундамент)

**Files:**
- Modify: `web/package.json`
- Modify: `web/tailwind.config.js`
- Modify: `web/src/assets/styles/index.css`

**Interfaces:**
- Produces: CSS-переменные `--beacon`, `--beacon-strong`, `--alarm`, `--alarm-strong`, `--safe`, `--safe-strong` (доступны через `[var(--x)]` в Tailwind arbitrary values во всех следующих задачах); Tailwind `font-display`, `font-mono`, `font-sans` классы; CSS-классы `.beacon-pulse--idle`, `.beacon-pulse--alarm`, `.beacon-pulse--safe` (кольцо-пульс, используется в Task 4).

- [ ] **Step 1: Установить шрифтовые пакеты**

```bash
cd web
npm install @fontsource/inter @fontsource/big-shoulders-display @fontsource/ibm-plex-mono
```

- [ ] **Step 2: Расширить `tailwind.config.js` шрифтовыми семействами**

Заменить содержимое `web/tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["\"Big Shoulders Display\"", "system-ui", "sans-serif"],
        mono: ["\"IBM Plex Mono\"", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 3: Переписать `web/src/assets/styles/index.css`**

Заменить блок токенов и добавить импорт шрифтов + keyframes пульса. Полное новое содержимое файла:

```css
@import "tailwindcss";
@import "@fontsource/inter/400.css";
@import "@fontsource/inter/500.css";
@import "@fontsource/inter/600.css";
@import "@fontsource/inter/700.css";
@import "@fontsource/big-shoulders-display/600.css";
@import "@fontsource/big-shoulders-display/700.css";
@import "@fontsource/big-shoulders-display/800.css";
@import "@fontsource/ibm-plex-mono/400.css";
@import "@fontsource/ibm-plex-mono/500.css";

/* ===== Цветовые токены темы ===== */
:root,
:root[data-theme="dark"] {
  --bg: #0A0F16;
  --surface: #111925;
  --surface-2: #182130;
  --surface-3: #212B3A;
  --input: #0D131C;
  --border: #26323F;
  --text: #EAF1F5;
  --text-soft: #C3CDD6;
  --text-muted: #7C8A96;

  --beacon: #FFB454;
  --beacon-strong: #FFA53D;
  --alarm: #FF5C4D;
  --alarm-strong: #FF4433;
  --safe: #34D399;
  --safe-strong: #22B686;

  --scrollbar-track: #111925;
  --scrollbar-thumb: #212B3A;
  --scrollbar-thumb-hover: #2C3A4C;

  color-scheme: dark;
}

:root[data-theme="light"] {
  --bg: #F0F4F7;
  --surface: #ffffff;
  --surface-2: #E8EDF1;
  --surface-3: #DCE3E9;
  --input: #ffffff;
  --border: #D3DCE3;
  --text: #101820;
  --text-soft: #3C4A56;
  --text-muted: #6B7885;

  --beacon: #C97A1E;
  --beacon-strong: #B3690F;
  --alarm: #DC3B2C;
  --alarm-strong: #C22A1C;
  --safe: #1D9A7C;
  --safe-strong: #158066;

  --scrollbar-track: #E8EDF1;
  --scrollbar-thumb: #C7D0D8;
  --scrollbar-thumb-hover: #AEB9C3;

  color-scheme: light;
}

:root {
  font-family: "Inter", system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;
  width: 100%;
  height: 100%;
  user-select: none;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  background-color: var(--bg);
  color: var(--text);
  transition: background-color 0.2s ease, color 0.2s ease;
}

/* Кнопки со сплошным акцентным фоном всегда со светлым текстом (в обеих темах) */
button.bg-\[var\(--beacon\)\],
button.bg-\[var\(--alarm\)\],
button.bg-\[var\(--safe\)\] {
  color: #0A0F16;
}

img {
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
}

@keyframes modalEnter {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-modalEnter {
  animation: modalEnter 0.25s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fadeIn {
  animation: fadeIn 0.4s ease-out;
}

/* ===== "Пульс маяка" — статус-индикатор ===== */
@keyframes beaconPulse {
  0% { box-shadow: 0 0 0 0 var(--pulse-color, var(--beacon)); }
  70% { box-shadow: 0 0 0 14px transparent; }
  100% { box-shadow: 0 0 0 0 transparent; }
}

.beacon-pulse {
  position: relative;
  border-radius: 9999px;
}

.beacon-pulse::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  animation: beaconPulse 2.2s ease-out infinite;
}

.beacon-pulse--idle { --pulse-color: var(--beacon); }
.beacon-pulse--idle::after { animation-duration: 2.2s; }

.beacon-pulse--alarm { --pulse-color: var(--alarm); }
.beacon-pulse--alarm::after { animation-duration: 0.9s; }

.beacon-pulse--safe { --pulse-color: var(--safe); }
.beacon-pulse--safe::after { animation-duration: 2.6s; }

@media (prefers-reduced-motion: reduce) {
  .beacon-pulse::after {
    animation: none;
    box-shadow: 0 0 0 3px var(--pulse-color, var(--beacon));
  }
}

.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: var(--scrollbar-thumb);
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: var(--scrollbar-thumb-hover);
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: var(--scrollbar-track);
}

.custom-scrollbar-2::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar-2::-webkit-scrollbar-thumb {
  background-color: var(--scrollbar-thumb);
  border-radius: 4px;
}

.custom-scrollbar-2::-webkit-scrollbar-thumb:hover {
  background-color: var(--scrollbar-thumb-hover);

}

.custom-scrollbar-2::-webkit-scrollbar-track {
  background: var(--scrollbar-track);
}

.custom-scrollbar-3::-webkit-scrollbar {
  height: 6px;
}

.custom-scrollbar-3::-webkit-scrollbar-thumb {
  background-color: var(--scrollbar-thumb);
  border-radius: 4px;
}

.custom-scrollbar-3::-webkit-scrollbar-thumb:hover {
  background-color: var(--scrollbar-thumb-hover);

}

.custom-scrollbar-3::-webkit-scrollbar-track {
  background: var(--scrollbar-track);
}
```

Примечание: старое правило `button.bg-blue-600, ...  { color: #fff; }` заменено на правило по новым токен-классам, потому что после Task 3+ эти классы (`bg-blue-600` и т.д.) в коде исчезают.

- [ ] **Step 4: Проверить сборку**

```bash
npm run build
```
Expected: сборка проходит без ошибок (могут быть варнинги о размере бандла — это не ошибка).

- [ ] **Step 5: Commit**

```bash
git add web/package.json web/package-lock.json web/tailwind.config.js web/src/assets/styles/index.css
git commit -m "Добавить шрифты и цветовые токены «ночное море + луч маяка»"
```

---

### Task 2: Редизайн экрана логина (split-layout)

**Files:**
- Modify: `web/src/pages/login.jsx`

**Interfaces:**
- Consumes: токены из Task 1 (`--beacon`, `--beacon-strong`), классы `font-display`/`font-mono`, `.beacon-pulse--idle`.
- Produces: ничего, потребляется только конечным пользователем (страница `/login`).

- [ ] **Step 1: Переписать `web/src/pages/login.jsx`**

Логика (`useState`, `handleChange`, `handleSubmit`, `useAuth`, `useNavigate`) остаётся без изменений, меняется только JSX внутри `return`:

```jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";
import { useAuth } from "../context/AuthContext.jsx";
import { useEffect } from "react";

export default function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    document.title = "Вход в систему | Маяк";
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await loginUser(formData);

      if (data.token) {
        login(data.token);
      }

      navigate("/dashboard")
    } catch (err) {
      console.error("Ошибка авторизации:", err);
      setError(err.message || "Ошибка при входе");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[var(--bg)] text-[var(--text)]">
      {/* Брендовая панель */}
      <div className="relative flex flex-col justify-center items-start px-8 py-8 lg:py-0 lg:w-1/2 overflow-hidden border-b lg:border-b-0 lg:border-r border-[var(--border)]">
        <div
          aria-hidden="true"
          className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-25 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, var(--beacon), transparent 70%)" }}
        />
        <div className="relative flex items-center gap-3 mb-4 lg:mb-8">
          <span className="beacon-pulse beacon-pulse--idle">
            <img
              src="/icon.png"
              alt="Маяк"
              className="relative w-12 h-12 pointer-events-none select-none"
              draggable={false}
            />
          </span>
          <h1 className="font-display text-3xl lg:text-4xl font-bold tracking-wide uppercase text-[var(--text)]">
            Маяк
          </h1>
        </div>
        <p className="relative max-w-sm text-[var(--text-soft)] text-sm lg:text-base">
          Система управления звуковыми оповещениями. Панель дежурного диспетчера.
        </p>
      </div>

      {/* Форма входа */}
      <main className="flex flex-1 justify-center items-center px-4 py-10">
        <div className="w-full max-w-sm">
          <h2 className="font-display text-2xl font-semibold mb-6 text-center uppercase tracking-wide">
            Вход
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <div>
              <label className="block mb-1 text-sm text-[var(--text-soft)]">Логин</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md bg-[var(--input)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--beacon)]"
                placeholder="Введите логин"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm text-[var(--text-soft)]">Пароль</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md bg-[var(--input)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--beacon)]"
                placeholder="Введите пароль"
                required
              />
            </div>

            {error && (
              <p className="text-[var(--alarm)] text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`mt-4 py-2 rounded-md font-medium transition ${
                loading
                  ? "bg-[var(--surface-3)] text-[var(--text-muted)] cursor-not-allowed"
                  : "bg-[var(--beacon)] hover:bg-[var(--beacon-strong)] text-[#0A0F16]"
              }`}
            >
              {loading ? "Вход..." : "Войти"}
            </button>
          </form>

          <p className="mt-8 text-center text-xs font-mono text-[var(--text-muted)]">
            Версия 1.0.0
          </p>
        </div>
      </main>
    </div>
  );
}
```

- [ ] **Step 2: Запустить dev-сервер и проверить визуально**

```bash
npm run dev
```
Открыть `http://localhost:3000/login` в headless-браузере (Playwright, см. ниже) и сделать скриншот для обеих тем (`data-theme` переключается через localStorage, как в исследовании перед брейнштормингом). Ожидается: split-layout, брендовая панель слева с пульсирующей иконкой, форма справа, оба поля и кнопка используют новые токены (без `blue-*`).

```bash
node -e "
const { chromium } = require('playwright-core');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'login-dark.png' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: 'login-dark-mobile.png' });
  await browser.close();
})();
"
```
(Если `playwright-core` не установлен в `web/`, использовать глобально установленный из предыдущего исследования пакет — путь к `node_modules` подсказать через `npm ls playwright-core` или установить `npm install --no-save playwright-core` во временной директории.)

- [ ] **Step 3: Собрать проект**

```bash
npm run build
```
Expected: без ошибок.

- [ ] **Step 4: Commit**

```bash
git add web/src/pages/login.jsx
git commit -m "Редизайн экрана логина: split-layout с брендовой панелью"
```

---

### Task 3: Общие компоненты навигации и UI-примитивы

**Files:**
- Modify: `web/src/components/Navbar.jsx`
- Modify: `web/src/components/ProfileMenu.jsx`
- Modify: `web/src/components/ErrorModal.jsx`
- Modify: `web/src/components/ConfirmActivateModal.jsx`
- Modify: `web/src/components/ui/BigSelect.jsx`
- Modify: `web/src/components/ui/StyledCheckbox.jsx`
- Modify: `web/src/components/ui/StyledSelect.jsx`
- Modify: `web/src/components/ui/TimePicker.jsx`

**Interfaces:**
- Consumes: токены из Task 1.
- Produces: визуально согласованные общие элементы (навбар, модалки, инпуты), которые видны на каждой странице — последующие задачи (4–9) на них не полагаются программно, только визуально.

Мэппинг классов (применяется механически по всем файлам этой задачи):

| Было | Стало |
|---|---|
| `bg-blue-600`, `bg-blue-700` (фон кнопки) | `bg-[var(--beacon)]` (обычное), hover → `hover:bg-[var(--beacon-strong)]` |
| `text-blue-600`, `text-blue-500`, `text-blue-400` | `text-[var(--beacon)]` |
| `border-blue-500`, `border-blue-600` | `border-[var(--beacon)]` |
| `focus:ring-blue-500`, `focus:ring-blue-600` | `focus:ring-[var(--beacon)]` |
| `bg-red-600`, `bg-red-700`, `text-red-500`, `text-red-400`, `border-red-500` | аналогично на `--alarm` / `--alarm-strong` |
| `bg-green-600`, `text-green-500` | аналогично на `--safe` / `--safe-strong` |
| `rounded-2xl` | `rounded-lg` |
| `rounded-xl` | `rounded-md` |
| текст на кнопках со сплошной заливкой (`text-white`) | `text-[#0A0F16]` (тёмный текст читается на янтаре/зелёном/красном лучше, чем белый) |

- [ ] **Step 1: Обновить `web/src/components/Navbar.jsx`**

Заменить логотип-блок и активные состояния, добавить `font-display` для бренд-текста (в текущем Navbar текста «Маяк» нет — есть только иконка, поэтому здесь меняется только hover-акцент пунктов меню при необходимости). Конкретное изменение — hover-цвет пунктов меню и цвет иконок темы уже используют `--text-soft`/`--text`, менять не нужно; проверить и убрать jsx-комментарии на русском, если мешают (не обязательно). Единственное реальное изменение — нет `blue-*`/`red-*`/`green-*` классов в этом файле (подтверждается grep в Step на файле), значит файл достаточно проверить, а не переписывать: убедиться, что нет остаточных `rounded-xl`/`rounded-2xl` — их тоже нет. **Действие:** файл не требует изменений по цвету/скруглениям; пропустить правки Navbar.jsx в этой задаче (файл остаётся как есть, т.к. использует только нейтральные токены).

- [ ] **Step 2: Обновить `web/src/components/ui/StyledCheckbox.jsx`**

```jsx
import React from "react";

export default function StyledCheckbox({ label, checked, onChange }) {
  const toggle = () => onChange(!checked);

  return (
    <label
      className="flex items-center gap-3 cursor-pointer select-none"
      onClick={toggle}
    >
      <div
        className={`w-6 h-6 rounded-md border transition-all duration-200 flex items-center justify-center
        ${checked ? "bg-[var(--beacon)] border-[var(--beacon)]" : "bg-[var(--bg)] border-[var(--border)] hover:border-[var(--border)]"}`}
      >
        {checked && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5 text-[#0A0F16]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span className="text-[var(--text-soft)]">{label}</span>
    </label>
  );
}
```

- [ ] **Step 3: Применить тот же мэппинг к `BigSelect.jsx`, `StyledSelect.jsx`, `TimePicker.jsx`, `ProfileMenu.jsx`, `ErrorModal.jsx`, `ConfirmActivateModal.jsx`**

Для каждого файла:
1. `grep -n "blue-\|red-\|green-\|rounded-2xl\|rounded-xl" web/src/components/ui/BigSelect.jsx web/src/components/ui/StyledSelect.jsx web/src/components/ui/TimePicker.jsx web/src/components/ProfileMenu.jsx web/src/components/ErrorModal.jsx web/src/components/ConfirmActivateModal.jsx` — получить список точных строк.
2. Заменить каждое вхождение по таблице мэппинга выше (Edit-инструментом, точечно по найденной строке — не переписывать файл целиком, чтобы не задеть логику).
3. Проверить, что `text-white` на кнопках со сплошной заливкой акцентного/тревожного/safe-цвета заменён на `text-[#0A0F16]`.

- [ ] **Step 4: Верифицировать, что старые классы не остались**

```bash
cd web
grep -rn "blue-[0-9]\|bg-red-[0-9]\|text-red-[0-9]\|border-red-[0-9]\|bg-green-[0-9]\|text-green-[0-9]" src/components/ui src/components/ProfileMenu.jsx src/components/ErrorModal.jsx src/components/ConfirmActivateModal.jsx
```
Expected: пусто (нет совпадений) — кроме случаев, где `red`/`green` являются частью не-Tailwind слова (маловероятно в этом наборе файлов).

- [ ] **Step 5: Собрать и визуально проверить**

```bash
npm run build
```
Скриншот `Dashboard` (после логина через существующий backend, либо визуальная проверка через `npm run dev` + ручной вход) — общие модалки и селекты используют янтарный/красный/зелёный вместо синего.

- [ ] **Step 6: Commit**

```bash
git add web/src/components/Navbar.jsx web/src/components/ProfileMenu.jsx web/src/components/ErrorModal.jsx web/src/components/ConfirmActivateModal.jsx web/src/components/ui
git commit -m "Перекрасить общие UI-компоненты и модалки в токены «Маяка»"
```

---

### Task 4: «Пульс маяка» в SystemStatus и AlarmControlPanel

**Files:**
- Modify: `web/src/components/SystemStatus.jsx`
- Modify: `web/src/components/AlarmControlPanel.jsx`

**Interfaces:**
- Consumes: `.beacon-pulse`, `.beacon-pulse--idle/--alarm/--safe` из Task 1.
- Produces: ничего наружу — конечные компоненты.

- [ ] **Step 1: Обновить `web/src/components/SystemStatus.jsx`**

Заменить JSX внутри `return` (логика `useState`/`useEffect` не меняется):

```jsx
  import React, { useState, useEffect } from "react";
  import { getServerStatus } from "../api/server/getServerStatus";
  import ClockBar from "./ClockBar";

  export default function SystemStatus({ token, logout, navigate, activeAlarm, setActiveAlarm }) {

    const [devicesList, setDevicesList] = useState([]);
    const [serverConnected, setServerConnected] = useState(false);

    useEffect(() => {
      const fetchStatus = async () => {
        const status = await getServerStatus(token, logout, navigate);
        setDevicesList(status.devicesList ?? []);
        setActiveAlarm(status.activeAlarm);
        setServerConnected(status.serverConnected);
      };

      fetchStatus();
      const interval = setInterval(fetchStatus, 5000);
      return () => clearInterval(interval);
    }, [token, logout, navigate]);

    const isAlarmActive = activeAlarm !== "Нет активных тревог";
    const pulseClass = isAlarmActive
      ? "beacon-pulse--alarm"
      : serverConnected
        ? "beacon-pulse--safe"
        : "beacon-pulse--idle";

    return (
      <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-lg shadow-lg w-full max-w-sm text-[var(--text)] max-h-110">
        <h2 className="font-display text-xl font-semibold text-center uppercase tracking-wide flex items-center justify-center gap-3">
          <span className={`beacon-pulse ${pulseClass} inline-block w-2.5 h-2.5 rounded-full`} style={{ background: "var(--pulse-color)" }} />
          Состояние системы
        </h2>

        <p className={`text-center text-sm font-medium mb-5 ${
          serverConnected ? "text-[var(--safe)]" : "text-[var(--alarm)]"
        }`}>
          {serverConnected ? "Сервер подключен" : "Сервер недоступен"}
        </p>

        <div className="border-t border-[var(--border)] pt-3 mb-5">
          <ClockBar
              token={token}
              logout={logout}
              navigate={navigate}/>
        </div>

        <div className="border-t border-[var(--border)] pt-3 mb-5">
          <p className="text-center text-[var(--text-muted)] uppercase tracking-wide text-xs font-mono">Активная тревога</p>
          <p
            className={`text-center mt-2 font-bold text-l py-2 rounded-md ${
              activeAlarm === "Нет активных тревог"
                ? "text-[var(--safe)] bg-[var(--safe)]/10"
                : "text-[var(--alarm)] bg-[var(--alarm)]/10"
            }`}
          >
            {activeAlarm}
          </p>
        </div>

      <div className="border-t border-[var(--border)] pt-3 mb-4">
    <p className="text-center text-[var(--text-muted)] uppercase tracking-wide mb-2 text-xs font-mono">Устройства</p>
    {Array.isArray(devicesList) && devicesList.length > 0 ? (
      devicesList.map((device, i) => (
        <div key={i} className="flex justify-between font-mono text-sm">
          <span>{i + 1}) {device.name}</span>
          <span className={device.is_online ? "text-[var(--safe)]" : "text-[var(--alarm)]"}>
            {device.is_online ? "В сети" : "Не в сети"}
          </span>
        </div>
      ))
    ) : (
      <p className="text-center text-[var(--alarm)]">Не удалось получить список устройств</p>
    )}
  </div>

      </div>
    );
  }
```

- [ ] **Step 2: Обновить `web/src/components/AlarmControlPanel.jsx`**

Логика (`useEffect`, `useState`, `handleConfirmActivate` и т.д.) не меняется. В JSX-части (после объявлений стейтов, там, где рендерятся карточка панели и список тревог):
1. `grep -n "blue-\|red-\|rounded-2xl\|rounded-xl" web/src/components/AlarmControlPanel.jsx` — получить точные строки.
2. Заменить по таблице мэппинга из Task 3.
3. В заголовке панели (`<h2>...</h2>` с названием секции) добавить `font-display uppercase tracking-wide` к существующему `className`, аналогично `SystemStatus`.
4. Кнопка активации тревоги (сплошная заливка) — заменить на `bg-[var(--alarm)] hover:bg-[var(--alarm-strong)] text-[#0A0F16]`, т.к. активация тревоги — это explicit alarm-действие (семантически ближе к `--alarm`, чем к `--beacon`, — это единственное отступление от мэппинга «CTA → beacon», обоснованное тем, что кнопка выполняет реальную активацию сигнала тревоги, а не просто CTA-навигацию).

- [ ] **Step 3: Собрать и проверить**

```bash
npm run build
```
Скриншот Dashboard: точка рядом с «Состояние системы» пульсирует (или статична при `prefers-reduced-motion`), цвет зависит от `activeAlarm`/`serverConnected`.

- [ ] **Step 4: Commit**

```bash
git add web/src/components/SystemStatus.jsx web/src/components/AlarmControlPanel.jsx
git commit -m "Добавить «пульс маяка» в индикаторы статуса и управление тревогами"
```

---

### Task 5: ChangeDutyPanel и обёртка Dashboard

**Files:**
- Modify: `web/src/components/ChangeDutyPanel.jsx`
- Modify: `web/src/pages/Dashboard.jsx`

**Interfaces:**
- Consumes: токены из Task 1.

- [ ] **Step 1: Обновить `web/src/components/ChangeDutyPanel.jsx`**

`grep -n "blue-\|red-\|green-\|rounded-2xl\|rounded-xl" web/src/components/ChangeDutyPanel.jsx`, заменить точечно по таблице мэппинга из Task 3 (панель использует `rounded-2xl` и, вероятно, синюю кнопку — заменить на `rounded-lg` и `bg-[var(--beacon)] hover:bg-[var(--beacon-strong)] text-[#0A0F16]`).

- [ ] **Step 2: Обновить `web/src/pages/Dashboard.jsx`**

`document.title` заменить `"Панель управления | СУЗО"` → `"Панель управления | Маяк"` (устаревшее название СУЗО — по спеке проект уже переименован в «Маяк», см. `README.md`). Классов цвета в файле нет (только `bg-[var(--bg)] text-[var(--text)]`) — изменение ограничивается заголовком вкладки.

- [ ] **Step 3: Собрать и проверить**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add web/src/components/ChangeDutyPanel.jsx web/src/pages/Dashboard.jsx
git commit -m "Перекрасить панель смены дежурного, обновить заголовок вкладки"
```

---

### Task 6: Страница «Тревоги» (Alarms)

**Files:**
- Modify: `web/src/pages/Alarms.jsx`
- Modify: `web/src/components/Alarms/AlarmItem.jsx`
- Modify: `web/src/components/Alarms/CreateAlarmModal.jsx`
- Modify: `web/src/components/Alarms/ConfirmDeleteModal.jsx`

**Interfaces:**
- Consumes: токены из Task 1, таблица мэппинга из Task 3.

- [ ] **Step 1: Найти все вхождения для замены**

```bash
cd web
grep -n "blue-\|red-\|green-\|rounded-2xl\|rounded-xl" src/pages/Alarms.jsx src/components/Alarms/AlarmItem.jsx src/components/Alarms/CreateAlarmModal.jsx src/components/Alarms/ConfirmDeleteModal.jsx
```

- [ ] **Step 2: Заменить каждое найденное вхождение по таблице мэппинга (Task 3)**

Точечно через Edit по каждой найденной строке в каждом из 4 файлов. Правила:
- CTA/основные кнопки, ссылки, чекбоксы, фокус-кольца → `--beacon`/`--beacon-strong`.
- Удаление/деструктивные кнопки (`ConfirmDeleteModal.jsx`, кнопки «Удалить») → `--alarm`/`--alarm-strong`.
- Индикаторы «активна»/«онлайн»/успех → `--safe`/`--safe-strong`.
- `rounded-2xl` → `rounded-lg`, `rounded-xl` → `rounded-md`.
- `text-white` на сплошных цветных кнопках → `text-[#0A0F16]`.

- [ ] **Step 3: Верифицировать**

```bash
grep -rn "blue-[0-9]\|bg-red-[0-9]\|text-red-[0-9]\|border-red-[0-9]\|bg-green-[0-9]\|text-green-[0-9]\|rounded-2xl\|rounded-xl" src/pages/Alarms.jsx src/components/Alarms
```
Expected: пусто.

- [ ] **Step 4: Собрать и скриншотить страницу `/alarms` (обе темы)**

```bash
npm run build
```

- [ ] **Step 5: Commit**

```bash
git add web/src/pages/Alarms.jsx web/src/components/Alarms
git commit -m "Перекрасить страницу «Тревоги» в токены «Маяка»"
```

---

### Task 7: Страница «Устройства» (Devices)

**Files:**
- Modify: `web/src/pages/Devices.jsx`
- Modify: `web/src/components/Devices/DeviceItem.jsx`
- Modify: `web/src/components/Devices/CreateDeviceModal.jsx`
- Modify: `web/src/components/Devices/ConfirmDeleteModal.jsx`

Тот же процесс, что в Task 6 (Steps 1–5), применённый к файлам этой задачи:

- [ ] **Step 1:** `grep -n "blue-\|red-\|green-\|rounded-2xl\|rounded-xl" src/pages/Devices.jsx src/components/Devices/DeviceItem.jsx src/components/Devices/CreateDeviceModal.jsx src/components/Devices/ConfirmDeleteModal.jsx`
- [ ] **Step 2:** Заменить каждое вхождение по таблице мэппинга из Task 3 (статус «в сети»/«не в сети» на `DeviceItem.jsx` → `--safe`/`--alarm`).
- [ ] **Step 3:** Верифицировать: `grep -rn "blue-[0-9]\|bg-red-[0-9]\|text-red-[0-9]\|border-red-[0-9]\|bg-green-[0-9]\|text-green-[0-9]\|rounded-2xl\|rounded-xl" src/pages/Devices.jsx src/components/Devices` → пусто.
- [ ] **Step 4:** `npm run build`, скриншот `/devices` (обе темы).
- [ ] **Step 5:** Commit:
```bash
git add web/src/pages/Devices.jsx web/src/components/Devices
git commit -m "Перекрасить страницу «Устройства» в токены «Маяка»"
```

---

### Task 8: Страница «Запланированные оповещения» (PlannedAlerts)

**Files:**
- Modify: `web/src/pages/PlannedAlerts.jsx`
- Modify: `web/src/components/Alerts/PlannedTab.jsx`
- Modify: `web/src/components/Alerts/SchoolTab.jsx`
- Modify: `web/src/components/Alerts/schoolRings/CreateScheduleModal.jsx`
- Modify: `web/src/components/Alerts/schoolRings/DayCard.jsx`
- Modify: `web/src/components/Alerts/schoolRings/Editable/AddLessonModal.jsx`
- Modify: `web/src/components/Alerts/schoolRings/Editable/EditableDayColumn.jsx`
- Modify: `web/src/components/Alerts/schoolRings/Editable/EditableEventRow.jsx`
- Modify: `web/src/components/Alerts/schoolRings/Editable/EditScheduleMenu.jsx`
- Modify: `web/src/components/Alerts/schoolRings/Editable/ConfirmDeleteScheduleModal.jsx`

Самая большая по числу файлов задача — выполнять группами по 2–3 файла, коммит после каждой группы, чтобы диффы оставались обозримыми.

- [ ] **Step 1: Группа A — верхнеуровневые страницы/вкладки**

```bash
cd web
grep -n "blue-\|red-\|green-\|rounded-2xl\|rounded-xl" src/pages/PlannedAlerts.jsx src/components/Alerts/PlannedTab.jsx src/components/Alerts/SchoolTab.jsx
```
Заменить по таблице мэппинга (Task 3). Верифицировать: та же grep-команда → пусто.

- [ ] **Step 2: Commit группы A**

```bash
git add web/src/pages/PlannedAlerts.jsx web/src/components/Alerts/PlannedTab.jsx web/src/components/Alerts/SchoolTab.jsx
git commit -m "Перекрасить вкладки запланированных оповещений в токены «Маяка»"
```

- [ ] **Step 3: Группа B — schoolRings (карточки/модалки расписания)**

```bash
grep -n "blue-\|red-\|green-\|rounded-2xl\|rounded-xl" src/components/Alerts/schoolRings/CreateScheduleModal.jsx src/components/Alerts/schoolRings/DayCard.jsx
```
Заменить по таблице мэппинга. Верифицировать той же командой → пусто.

- [ ] **Step 4: Commit группы B**

```bash
git add web/src/components/Alerts/schoolRings/CreateScheduleModal.jsx web/src/components/Alerts/schoolRings/DayCard.jsx
git commit -m "Перекрасить карточки расписания звонков в токены «Маяка»"
```

- [ ] **Step 5: Группа C — Editable/* (редактор расписания)**

```bash
grep -n "blue-\|red-\|green-\|rounded-2xl\|rounded-xl" src/components/Alerts/schoolRings/Editable/AddLessonModal.jsx src/components/Alerts/schoolRings/Editable/EditableDayColumn.jsx src/components/Alerts/schoolRings/Editable/EditableEventRow.jsx src/components/Alerts/schoolRings/Editable/EditScheduleMenu.jsx src/components/Alerts/schoolRings/Editable/ConfirmDeleteScheduleModal.jsx
```
Заменить по таблице мэппинга (удаление в `ConfirmDeleteScheduleModal.jsx` → `--alarm`). Верифицировать той же командой → пусто.

- [ ] **Step 6: Собрать проект**

```bash
npm run build
```

- [ ] **Step 7: Commit группы C**

```bash
git add web/src/components/Alerts/schoolRings/Editable
git commit -m "Перекрасить редактор расписания звонков в токены «Маяка»"
```

- [ ] **Step 8: Скриншотить `/plannedalerts` (обе вкладки — Planned и School, обе темы)**

---

### Task 9: Страница «Настройки» (Settings)

**Files:**
- Modify: `web/src/pages/Settings.jsx`
- Modify: `web/src/components/Settings/AppearanceTab.jsx`
- Modify: `web/src/components/Settings/LogsTab.jsx`
- Modify: `web/src/components/Settings/PasswordTab.jsx`
- Modify: `web/src/components/Settings/ProfileTab.jsx`
- Modify: `web/src/components/Settings/RolesTab.jsx`
- Modify: `web/src/components/Settings/UsersTab.jsx`

- [ ] **Step 1: Группа A — Settings.jsx, AppearanceTab.jsx, ProfileTab.jsx**

```bash
cd web
grep -n "blue-\|red-\|green-\|rounded-2xl\|rounded-xl" src/pages/Settings.jsx src/components/Settings/AppearanceTab.jsx src/components/Settings/ProfileTab.jsx
```
Заменить по таблице мэппинга (Task 3). В `AppearanceTab.jsx` (переключатель темы) активное состояние переключателя → `bg-[var(--beacon)]`.

- [ ] **Step 2: Commit группы A**

```bash
git add web/src/pages/Settings.jsx web/src/components/Settings/AppearanceTab.jsx web/src/components/Settings/ProfileTab.jsx
git commit -m "Перекрасить общие настройки и профиль в токены «Маяка»"
```

- [ ] **Step 3: Группа B — LogsTab.jsx, PasswordTab.jsx**

```bash
grep -n "blue-\|red-\|green-\|rounded-2xl\|rounded-xl" src/components/Settings/LogsTab.jsx src/components/Settings/PasswordTab.jsx
```
Заменить по таблице мэппинга (в `LogsTab.jsx` статусы успех/ошибка операций → `--safe`/`--alarm`).

- [ ] **Step 4: Commit группы B**

```bash
git add web/src/components/Settings/LogsTab.jsx web/src/components/Settings/PasswordTab.jsx
git commit -m "Перекрасить вкладки логов и смены пароля в токены «Маяка»"
```

- [ ] **Step 5: Группа C — RolesTab.jsx, UsersTab.jsx**

```bash
grep -n "blue-\|red-\|green-\|rounded-2xl\|rounded-xl" src/components/Settings/RolesTab.jsx src/components/Settings/UsersTab.jsx
```
Заменить по таблице мэппинга (удаление роли/пользователя → `--alarm`).

- [ ] **Step 6: Верифицировать весь Settings**

```bash
grep -rn "blue-[0-9]\|bg-red-[0-9]\|text-red-[0-9]\|border-red-[0-9]\|bg-green-[0-9]\|text-green-[0-9]\|rounded-2xl\|rounded-xl" src/pages/Settings.jsx src/components/Settings
```
Expected: пусто.

- [ ] **Step 7: Собрать проект**

```bash
npm run build
```

- [ ] **Step 8: Commit группы C**

```bash
git add web/src/components/Settings/RolesTab.jsx web/src/components/Settings/UsersTab.jsx
git commit -m "Перекрасить управление ролями и пользователями в токены «Маяка»"
```

- [ ] **Step 9: Скриншотить `/settings` (все вкладки, обе темы)**

---

### Task 10: Финальная проверка

**Files:** нет изменений файлов (только верификация).

- [ ] **Step 1: Полный grep-аудит по всему `web/src`**

```bash
cd web
grep -rn "blue-[0-9]\|bg-red-[0-9]\|text-red-[0-9]\|border-red-[0-9]\|bg-green-[0-9]\|text-green-[0-9]\|rounded-2xl\|rounded-xl" src
```
Expected: пусто. Если что-то найдено — точечно исправить по таблице мэппинга из Task 3 и закоммитить отдельным коммитом с сообщением `"Дозачистить остаточные цветовые классы"`.

- [ ] **Step 2: Финальная сборка**

```bash
npm run build
```
Expected: без ошибок.

- [ ] **Step 3: Полный визуальный прогон всех страниц, обе темы**

Запустить `npm run dev`, залогиниться (или использовать уже открытую сессию), пройти скриншотами: `/login`, `/dashboard`, `/alarms`, `/devices`, `/plannedalerts`, `/settings` (по одной вкладке на раздел настроек) — для `data-theme="dark"` и `data-theme="light"`. Проверить:
- нет обрезанного/наезжающего текста в split-layout логина на мобильной ширине (390px);
- «пульс маяка» анимируется в `SystemStatus`/`AlarmControlPanel` и останавливается при эмуляции `prefers-reduced-motion: reduce` (Playwright: `page.emulateMedia({ reducedMotion: 'reduce' })`);
- на обеих темах текст читаем на всех сплошных кнопках (контраст текста `#0A0F16` на `--beacon`/`--alarm`/`--safe`).

- [ ] **Step 4: Отчитаться пользователю**

Собрать список скриншотов (путь к файлам) и кратко описать, что изменилось, для финального ревью перед переходом к портфолио-оформлению репозитория.
