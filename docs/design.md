# Thiết kế UI/UX — LangBook

> Hệ thống thiết kế cho web học Anh/Trung/Nhật, dành cho người Việt.

---

## 1. Triết lý thiết kế

- **Tối giản, tập trung:** Content là trung tâm. UI không cạnh tranh với bài học.
- **Cá nhân, ấm áp:** Màu sắc và spacing tạo cảm giác thoải mái, khuyến khích học tập lâu dài.
- **Nhất quán:** Mọi component tuân thủ 1 hệ thống token. Không ngoại lệ.
- **Dễ tiếp cận:** WCAG AA cho mọi component, dark mode có sẵn.

**Design read:** Web app học tập (product UI) — không phải landing page. Dashboard-feel với sidebar, tập trung vào content.

---

## 2. Hệ thống màu sắc

Nguyên tắc **60–30–10**:

| Vai trò | Tỉ lệ | Màu | Mô tả |
|---|---|---|---|
| **Neutral** | 60% | Slate | Nền, border, text chính |
| **Brand** | 30% | Violet (Purple) | Primary button, link, active state |
| **Accent** | 10% | Cyan | CTA nổi bật, achievement, progress |

### 2.1 Neutral (60%) — Slate

Sử dụng cho nền, text, border, và mọi thành phần trung tính.

| Token | Hex | Tailwind | Usage |
|---|---|---|---|
| `--neutral-50` | `#F8FAFC` | `slate-50` | Nền page / section |
| `--neutral-100` | `#F1F5F9` | `slate-100` | Nền card, sidebar, dropdown |
| `--neutral-200` | `#E2E8F0` | `slate-200` | Border, divider |
| `--neutral-300` | `#CBD5E1` | `slate-300` | Border muted, disabled |
| `--neutral-500` | `#64748B` | `slate-500` | Text secondary, placeholder |
| `--neutral-700` | `#334155` | `slate-700` | Text body |
| `--neutral-900` | `#0F172A` | `slate-900` | Text heading |
| `--neutral-white` | `#FFFFFF` | `white` | Nền elevated (modal, popover) |

### 2.2 Brand (30%) — Violet

Sử dụng cho primary actions, links, active indicators.

| Token | Hex | Tailwind | Usage |
|---|---|---|---|
| `--brand-50` | `#F5F3FF` | `violet-50` | Nền trạng thái hover nhẹ |
| `--brand-100` | `#EDE9FE` | `violet-100` | Badge nhẹ, trạng thái selected |
| `--brand-200` | `#DDD6FE` | `violet-200` | Border focus, selected |
| `--brand-500` | `#8B5CF6` | `violet-500` | **Primary** — button, link, icon |
| `--brand-600` | `#7C3AED` | `violet-600` | **Hover** — primary button hover |
| `--brand-700` | `#6D28D9` | `violet-700` | **Active/Pressed** |
| `--brand-800` | `#5B21B6` | `violet-800` | Text on dark bg |

### 2.3 Accent (10%) — Cyan

Sử dụng cho CTA nổi bật, gamification (achievement, streak, XP).

| Token | Hex | Tailwind | Usage |
|---|---|---|---|
| `--accent-500` | `#06B6D4` | `cyan-500` | **Accent** — CTA, badge XP, achievement |
| `--accent-600` | `#0891B2` | `cyan-600` | Hover accent |
| `--accent-700` | `#0E7490` | `cyan-700` | Active accent |

### 2.4 Status

| Trạng thái | Hex | Tailwind | Usage |
|---|---|---|---|
| **Success** | `#22C55E` | `green-500` | Hoàn thành, đúng, active |
| **Warning** | `#F59E0B` | `amber-500` | Sắp hết hạn, cần chú ý |
| **Error** | `#EF4444` | `red-500` | Lỗi, sai, blocked |
| **Info** | `#3B82F6` | `blue-500` | Thông tin, hướng dẫn |

### 2.5 Dark Mode Mapping

| Token | Light | Dark |
|---|---|---|
| `--neutral-50` | `#F8FAFC` | `#0F172A` (slate-900) |
| `--neutral-100` | `#F1F5F9` | `#1E293B` (slate-800) |
| `--neutral-200` | `#E2E8F0` | `#334155` (slate-700) |
| `--neutral-300` | `#CBD5E1` | `#475569` (slate-600) |
| `--neutral-500` | `#64748B` | `#94A3B8` (slate-400) |
| `--neutral-700` | `#334155` | `#CBD5E1` (slate-300) |
| `--neutral-900` | `#0F172A` | `#F8FAFC` (slate-50) |
| `--neutral-white` | `#FFFFFF` | `#1E293B` (slate-800) |
| Brand | Giữ nguyên | Giữ nguyên (sáng hơn 1 bậc nếu cần contrast) |

---

## 3. Typography

### 3.1 Font Family

| Ngữ cảnh | Font | Fallback |
|---|---|---|
| **UI (Tiếng Việt, Anh)** | `Geist` | `system-ui, sans-serif` |
| **Code / Mono** | `Geist Mono` | `monospace` |
| **Tiếng Trung (nội dung)** | `Noto Sans SC` | `sans-serif` |
| **Tiếng Nhật (nội dung)** | `Noto Sans JP` | `sans-serif` |

Geist được load qua `next/font/google`. Noto Sans SC/JP load khi cần (dynamic import).

### 3.2 Type Scale

| Level | Size | Line Height | Weight | Usage |
|---|---|---|---|---|
| **h1** | `text-3xl md:text-4xl` | `leading-tight` | `font-bold` | Page title |
| **h2** | `text-2xl md:text-3xl` | `leading-tight` | `font-semibold` | Section title |
| **h3** | `text-xl md:text-2xl` | `leading-snug` | `font-semibold` | Card title |
| **h4** | `text-lg md:text-xl` | `leading-snug` | `font-medium` | Subsection |
| **body** | `text-base` | `leading-relaxed` | `font-normal` | Paragraph |
| **body-sm** | `text-sm` | `leading-normal` | `font-normal` | Secondary text |
| **caption** | `text-xs` | `leading-normal` | `font-normal` | Label, badge, meta |
| **overline** | `text-xs` | `leading-normal` | `font-medium` | Uppercase label |
| **mono** | `text-sm` | `leading-normal` | `font-mono` | Code, keyboard |

**Max width body:** `max-w-prose` (65ch) cho readability.

---

## 4. Spacing

Sử dụng Tailwind spacing scale (rem-based):

| Token | rem | px | Usage |
|---|---|---|---|
| `space-1` | 0.25rem | 4px | Icon gap nhỏ |
| `space-2` | 0.5rem | 8px | Inner padding nhỏ |
| `space-3` | 0.75rem | 12px | Gap giữa label + input |
| `space-4` | 1rem | 16px | Padding card, gap section items |
| `space-6` | 1.5rem | 24px | Padding page, gap cards |
| `space-8` | 2rem | 32px | Gap section lớn |
| `space-12` | 3rem | 48px | Section padding |
| `space-16` | 4rem | 64px | Page section lớn |

---

## 5. Border Radius

| Token | Value | Component |
|---|---|---|
| `radius-sm` | `6px` | Input, button small |
| `radius-md` | `10px` | Button, badge, alert |
| `radius-lg` | `14px` | Card, modal, dropdown menu |
| `radius-xl` | `18px` | Sidebar, large panel |
| `radius-full` | `9999px` | Avatar, pill, dot |

---

## 6. Shadows (Elevation)

| Level | Light | Dark |
|---|---|---|
| **sm** | `0 1px 2px 0 rgb(0 0 0 / 0.05)` | `0 1px 2px 0 rgb(0 0 0 / 0.3)` |
| **md** | `0 4px 6px -1px rgb(0 0 0 / 0.07)` | `0 4px 6px -1px rgb(0 0 0 / 0.35)` |
| **lg** | `0 10px 15px -3px rgb(0 0 0 / 0.08)` | `0 10px 15px -3px rgb(0 0 0 / 0.4)` |
| **xl** | `0 20px 25px -5px rgb(0 0 0 / 0.1)` | `0 20px 25px -5px rgb(0 0 0 / 0.45)` |

**Important:** Không dùng pure black shadow. Luôn tint theo màu nền. Light mode dùng `shadow-color: slate-900/10`.

---

## 7. Component Tokens

### 7.1 Button

| Variant | BG | Text | Border | Hover | Active |
|---|---|---|---|---|---|
| **Primary** | `brand-500` | `white` | — | `brand-600` | `brand-700` |
| **Secondary** | `neutral-white` | `neutral-900` | `neutral-200` | `neutral-100` | `neutral-200` |
| **Ghost** | transparent | `neutral-700` | — | `neutral-100` | `neutral-200` |
| **Accent** | `accent-500` | `white` | — | `accent-600` | `accent-700` |
| **Danger** | `error` | `white` | — | `#DC2626` | `#B91C1C` |
| **Disabled** | `neutral-100` | `neutral-300` | — | — | — |

- **Padding:** `px-5 py-2.5` (md), `px-4 py-2` (sm), `px-6 py-3` (lg)
- **Radius:** `radius-md` (10px)
- **Font:** `text-sm font-medium`
- **Transition:** `transition-all duration-150 ease-in-out`
- **Pressed:** `scale-[0.97]` tactile feedback

### 7.2 Input

| State | BG | Text | Border | Notes |
|---|---|---|---|---|
| Default | `neutral-white` | `neutral-900` | `neutral-200` | |
| Focus | `neutral-white` | `neutral-900` | `brand-500` + ring `brand-500/20` | `ring-2` |
| Hover | `neutral-white` | — | `neutral-300` | |
| Error | `neutral-white` | `neutral-900` | `error` + ring `error/20` | |
| Disabled | `neutral-100` | `neutral-300` | `neutral-200` | `cursor-not-allowed` |

- **Padding:** `px-4 py-3`
- **Radius:** `radius-md` (10px)
- **Label:** `text-sm font-medium text-neutral-700` (above input, `mb-1.5`)
- **Placeholder:** `text-neutral-500`

### 7.3 Card

| Token | Value |
|---|---|
| BG | `neutral-white` (light) / `neutral-100` (dark) |
| Radius | `radius-lg` (14px) |
| Shadow | `shadow-sm` |
| Padding | `p-6` |
| Border | `border border-neutral-200` (light) / `neutral-700` (dark) |

**Card hover:** `shadow-md` + `border-neutral-300` (nếu interactive).

### 7.4 Sidebar

| Token | Value |
|---|---|
| Width | `w-64` (256px), collapse mobile |
| BG | `neutral-100` (light) / `neutral-900` (dark) |
| Border-right | `border-r border-neutral-200` |
| Item padding | `px-4 py-2.5` |
| Item radius | `radius-md` |
| Active item | `bg-brand-50 text-brand-700 font-medium` (light) |
| Hover item | `bg-neutral-200` (light) / `bg-neutral-800` (dark) |

### 7.5 Top Bar

| Token | Value |
|---|---|
| Height | `h-16` (64px) |
| BG | `neutral-white` (light) / `neutral-100` (dark) |
| Border-bottom | `border-b border-neutral-200` |
| Padding | `px-6` |

### 7.6 Badge

| Variant | BG | Text |
|---|---|---|
| Brand | `brand-100` | `brand-700` |
| Success | `green-100` | `green-700` |
| Warning | `amber-100` | `amber-700` |
| Error | `red-100` | `red-700` |
| Accent | `cyan-100` | `cyan-700` |
| Neutral | `neutral-100` | `neutral-700` |

- **Radius:** `radius-md` (10px)
- **Padding:** `px-2.5 py-0.5`
- **Font:** `text-xs font-medium`

### 7.7 Alert

| Variant | BG | Border | Text | Icon |
|---|---|---|---|---|
| Info | `blue-50` | `blue-200` | `blue-700` | Info icon |
| Success | `green-50` | `green-200` | `green-700` | Check icon |
| Warning | `amber-50` | `amber-200` | `amber-700` | Warning icon |
| Error | `red-50` | `red-200` | `red-700` | X icon |

- **Radius:** `radius-lg` (14px)
- **Padding:** `p-4`
- **Font:** `text-sm`

### 7.8 Progress Bar

| Token | Value |
|---|---|
| Track BG | `neutral-200` (light) / `neutral-700` (dark) |
| Fill BG | `brand-500` (default), `accent-500` (gamification) |
| Radius | `radius-full` |
| Height | `h-2` (default), `h-3` (gamification) |

### 7.9 Tabs

| Token | Value |
|---|---|
| Active border | `border-b-2 border-brand-500` |
| Active text | `text-brand-600 font-medium` |
| Inactive text | `text-neutral-500` |
| Hover text | `text-neutral-700` |

---

## 8. Dark Mode

- **Strategy:** CSS class-based (`dark` class trên `<html>`)
- **Toggle:** Góc phải TopBar — icon sun/moon
- **Default:** Theo system preference (`prefers-color-scheme`), có thể override bằng toggle

**Quy tắc Dark Mode:**
- Nền tối: không dùng pure `#000000`, dùng `slate-900` hoặc `slate-800`
- Text tối: không dùng pure `#FFFFFF`, dùng `slate-50` hoặc `slate-100`
- Border tối: dùng `slate-700` thay `slate-200`
- Brand color giữ nguyên, không desaturate
- Shadow tint về dark (dùng `rgb(0 0 0 / 0.3-0.45)`)
- Card nền: `slate-800`, elevated card: `slate-700`

---

## 9. Layout (Sidebar + Top Bar)

```
┌──────────────────────────────────────────┐
│ Top Bar (h-16)                           │
│ ┌──────┐ ┌─────────────────────────────┐ │
│ │Logo  │ │ Search  Profile  DarkToggle │ │
│ └──────┘ └─────────────────────────────┘ │
├────────┬─────────────────────────────────┤
│        │                                 │
│ Sidebar│        Main Content             │
│ (w-64) │                                 │
│        │                                 │
│ ● Home │                                 │
│ ● Learn│                                 │
│ ● Quiz │                                 │
│ ● Vocab│                                 │
│ ● ...  │                                 │
│        │                                 │
│        │                                 │
└────────┴─────────────────────────────────┘
```

- **Mobile (< 768px):** Sidebar ẩn, hiện qua hamburger menu (overlay drawer)
- **Content max-width:** `max-w-7xl` (1280px), centered khi màn hình lớn
- **Background:** `neutral-50` (light) / `slate-900` (dark) toàn page
- **Gap giữa sidebar + content:** `border-r` ngăn cách

---

## 10. Accessibility (WCAG AA)

| Yêu cầu | Tiêu chuẩn |
|---|---|
| **Contrast ratio** | Body text ≥ 4.5:1, Large text ≥ 3:1 |
| **Focus indicator** | `ring-2 ring-brand-500/50` — không bao giờ tắt outline |
| **Touch target** | Tối thiểu 44×44px cho interactive elements |
| **Label** | Mọi input phải có label (không placeholder-as-label) |
| **Error** | Error text + icon + `aria-invalid` + `aria-describedby` |
| **Reduced motion** | Tôn trọng `prefers-reduced-motion` — tắt animation |
| **Dark mode** | Tôn trọng `prefers-color-scheme`, có toggle |
| **Keyboard nav** | Tab order hợp lý, skip-to-content link |

---

## 11. Grid & Breakpoints

| Breakpoint | Min width | Columns | Gutter |
|---|---|---|---|
| **sm** | 640px | 4 | 16px |
| **md** | 768px | 8 | 24px |
| **lg** | 1024px | 12 | 24px |
| **xl** | 1280px | 12 | 32px |
| **2xl** | 1536px | 12 | 32px |

---

## 12. Iconography

- **Library:** `@phosphor-icons/react` (hoặc `@radix-ui/react-icons` cho components nhỏ)
- **Kích thước:** `w-5 h-5` (20px) cho UI icons, `w-6 h-6` (24px) cho navigation
- **Stroke weight:** Đồng bộ 1.5px (bold) hoặc 2px (fill) — dùng 1 family duy nhất

---

## 13. Animation & Motion

| Loại | Duration | Easing | Ghi chú |
|---|---|---|---|
| Hover | 150ms | `ease-in-out` | Button, link, card |
| Enter | 200-300ms | `ease-out` | Modal, dropdown, sidebar drawer |
| Page transition | 200ms | `ease-in-out` | Next.js built-in |
| Progress fill | 300ms | `ease-out` | Progress bar |
| Reduced motion | 0ms | — | Tất cả animation tắt |

---

## 14. shadcn/ui Integration

Khi dùng shadcn/ui, custom theme qua `globals.css`:

```css
@theme {
  /* Neutral */
  --color-neutral-50: #F8FAFC;
  --color-neutral-100: #F1F5F9;
  --color-neutral-200: #E2E8F0;
  --color-neutral-300: #CBD5E1;
  --color-neutral-500: #64748B;
  --color-neutral-700: #334155;
  --color-neutral-900: #0F172A;

  /* Brand */
  --color-brand-50: #F5F3FF;
  --color-brand-100: #EDE9FE;
  --color-brand-200: #DDD6FE;
  --color-brand-500: #8B5CF6;
  --color-brand-600: #7C3AED;
  --color-brand-700: #6D28D9;
  --color-brand-800: #5B21B6;

  /* Accent */
  --color-accent-500: #06B6D4;
  --color-accent-600: #0891B2;
  --color-accent-700: #0E7490;

  /* Status */
  --color-success: #22C55E;
  --color-warning: #F59E0B;
  --color-error: #EF4444;
  --color-info: #3B82F6;

  /* Radius */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
  --radius-xl: 18px;
}

/* Dark mode: override CSS variables */
.dark {
  --neutral-50: #0F172A;
  --neutral-100: #1E293B;
  /* ...etc */
}
```

Sau đó map shadcn/ui CSS variables (`--primary`, `--background`, `--foreground`, ...) vào các token trên.

---

## 15. File Structure (Components)

```
frontend/
└── app/
    └── _components/
        ├── ui/              ← shadcn/ui components
        │   ├── button.tsx
        │   ├── card.tsx
        │   ├── input.tsx
        │   ├── badge.tsx
        │   ├── alert.tsx
        │   ├── progress.tsx
        │   └── ...
        ├── layout/
        │   ├── sidebar.tsx
        │   ├── topbar.tsx
        │   └── main-layout.tsx
        └── shared/
            ├── flashcard/
            ├── quiz/
            └── ...
```
