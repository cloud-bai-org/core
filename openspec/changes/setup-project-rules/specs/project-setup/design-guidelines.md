# 台灣廟宇莊嚴風格 Design Guidelines (Dark Theme / shadcn-vue)

## 1. Design Principles（設計原則）

- **莊嚴沉穩 (Solemnity)**：深色模式下，避免使用純黑（#000000），改用帶有暖色調的「玄黑」作為基底，營造深邃、靜謐的廟宇內殿氛圍。
- **視覺無障礙 (Accessibility / a11y)**：在深色背景上，文字避免使用純白（#FFFFFF），改用「香灰白」以降低 Halation（光暈效應）造成的視覺疲勞。
- **層次分明 (Visual Hierarchy)**：依賴 Surface（卡片層）與 Background（底層）的明度差異來建立 Z-axis 空間感，而非強烈的陰影。

---

## 2. Color Palette（色彩系統 & Design Tokens）

### 品牌主色 (Brand Colors)

| Token | 名稱 | Hex | HSL | 用途 |
|-------|------|-----|-----|------|
| `primary` | 絳紅 (Temple Red) | `#9E2A2B` | `359 58% 39%` | Primary Buttons, 強調性 Icon, Active State |
| `secondary` | 琉璃金 (Glaze Gold) | `#D4AF37` | `46 65% 52%` | 重點 Badge, 裝飾線條, Secondary Actions |
| `accent` | 蒼綠 (Stone Green) | `#2D6A59` | `163 40% 30%` | 輔助標籤, Success State, 分隔區塊背景 |

### 背景與表面色 (Background & Surface)

| Token | 名稱 | Hex | HSL | 用途 |
|-------|------|-----|-----|------|
| `background` | 玄黑 (Deep Ink) | `#1C1919` | `0 5% 10%` | App 基礎背景，取代純黑 |
| `card` / `popover` | 暗灰 (Dark Ash) | `#2A2525` | `0 6% 15%` | 卡片 (Cards), 對話框 (Dialogs), 選單 |

### 文字與邊框 (Text & Border)

| Token | 名稱 | Hex | HSL | 用途 |
|-------|------|-----|-----|------|
| `foreground` | 香灰白 (Ash White) | `#F0EBE1` | `40 33% 91%` | 標題 (Headings), 主要文字 (Body Text) |
| `muted` | 殘灰 (Muted Gray) | `#A8A398` | `42 9% 63%` | 輔助說明 (Captions), Placeholder |
| `border` | 沉石 (Heavy Stone) | `#403A3A` | `0 5% 24%` | 分隔線 (Dividers), Input Borders |

---

## 3. Typography（排版設定）

> 在深色模式下，字體的渲染視覺上會比淺色模式略粗。

- **Font Family**: `'Noto Sans TC', 'Microsoft JhengHei', sans-serif`
- **Font Weight Tuning**:
  - 內文維持 **Regular (400)**
  - 標題建議使用 **Medium (500)** 即可，避免使用 Black (900) 造成字形糊化

---

## 4. Implementation（實作指南 - shadcn-vue + Tailwind CSS）

### 4.1 CSS Variables (`src/styles/index.css`)

配合 shadcn-vue 的預設邏輯，將深色主題配置寫入 `:root`：

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* 深色主題配置 (HSL) */
    --background: 0 5% 10%;       /* #1C1919 玄黑 */
    --foreground: 40 33% 91%;     /* #F0EBE1 香灰白 */

    --muted: 0 6% 15%;            /* 同表面色，用於次要區塊背景 */
    --muted-foreground: 42 9% 63%;/* #A8A398 殘灰 */

    --popover: 0 6% 15%;          /* #2A2525 暗灰 */
    --popover-foreground: 40 33% 91%;

    --card: 0 6% 15%;             /* #2A2525 暗灰 */
    --card-foreground: 40 33% 91%;

    --border: 0 5% 24%;           /* #403A3A 沉石 */
    --input: 0 5% 24%;

    --primary: 359 58% 39%;       /* #9E2A2B 絳紅 */
    --primary-foreground: 40 33% 91%; /* 香灰白字體 */

    --secondary: 46 65% 52%;      /* #D4AF37 琉璃金 */
    --secondary-foreground: 0 5% 10%; /* 金底黑字 */

    --accent: 163 40% 30%;        /* #2D6A59 蒼綠 */
    --accent-foreground: 40 33% 91%;

    --destructive: 0 62.8% 30.6%; /* 保留 shadcn 預設的危險色，調暗 */
    --destructive-foreground: 40 33% 91%;

    --ring: 359 58% 39%;          /* Focus ring 使用主色絳紅 */
    --radius: 0.35rem;            /* 稍微方正的圓角，維持莊重感 */
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
}
```

### 4.2 Tailwind Configuration (`tailwind.config.js`)

shadcn-vue 的 CLI 預設會自動對應 CSS 變數，確認 `theme.extend.colors` 設定如下：

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{vue}',
    './components/**/*.{vue}',
    './app/**/*.{vue}',
    './src/**/*.{vue}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
}
```
