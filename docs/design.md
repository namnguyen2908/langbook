# Thiết kế UI/UX — LangBook

> Hệ thống thiết kế cho web học Anh/Trung/Nhật, dành cho người Việt.

---

## 1. Triết lý thiết kế

- **Tối giản, tập trung:** Content là trung tâm. UI không cạnh tranh với bài học.
- **Cá nhân, ấm áp:** Màu sắc và spacing tạo cảm giác thoải mái, khuyến khích học tập lâu dài.
- **Nhất quán:** Mọi component tuân thủ 1 hệ thống token. Không ngoại lệ.
- **Dễ tiếp cận:** WCAG AA cho mọi component.

### 1.1 Hai chế độ layout

| Chế độ | Áp dụng | Layout | Background |
|---|---|---|---|
| **Dashboard** | Trang có sidebar (learn, quiz, flashcard, vocabulary) | Sidebar + TopBar + content | `neutral-50` |
| **Public/Editorial** | Trang không sidebar (login, placement, landing) | Full-page hero, editorial grid | Mesh gradient + pattern |

**Nguyên tắc:** Trang public là "brand moment" — dùng nhiều màu sắc, hiệu ứng, decorative art. Trang dashboard tập trung vào content, giữ tối giản.

---

## 2. Hệ thống màu sắc

Nguyên tắc **60–30–10**:

| Vai trò | Tỉ lệ | Màu | Mô tả |
|---|---|---|---|
| **Neutral** | 60% | Slate | Nền, border, text chính |
| **Brand** | 30% | Violet (Purple) | Primary button, link, active state |
| **Accent** | 10% | Cyan | CTA nổi bật, achievement, progress |

### 2.1 Neutral (60%) — Slate

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

| Token | Hex | Tailwind | Usage |
|---|---|---|---|
| `--brand-50` | `#F5F3FF` | `violet-50` | Nền hover nhẹ, ambient glow |
| `--brand-100` | `#EDE9FE` | `violet-100` | Badge nhẹ, selected state, pill bg |
| `--brand-200` | `#DDD6FE` | `violet-200` | Border focus, decorative shapes |
| `--brand-300` | `#C4B5FD` | `violet-300` | Floating circles, decorative dots |
| `--brand-400` | `#A78BFA` | `violet-400` | Gradient accent strip |
| `--brand-500` | `#8B5CF6` | `violet-500` | **Primary** — button, link, icon |
| `--brand-600` | `#7C3AED` | `violet-600` | **Hover** — primary button hover |
| `--brand-700` | `#6D28D9` | `violet-700` | **Active/Pressed** |
| `--brand-800` | `#5B21B6` | `violet-800` | Text trên dark bg |

### 2.3 Accent (10%) — Cyan

| Token | Hex | Tailwind | Usage |
|---|---|---|---|
| `--accent-50` | `#ECFEFF` | `cyan-50` | Ambient glow, hover bg nhẹ |
| `--accent-100` | `#CFFAFE` | `cyan-100` | Badge, pill bg |
| `--accent-200` | `#A5F3FC` | `cyan-200` | Decorative shapes, ring hover |
| `--accent-300` | `#67E8F9` | `cyan-300` | Floating circles |
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

### 2.5 Gradient combinations

| Mục đích | Gradient | Dùng ở |
|---|---|---|
| **Brand bar** | `from-brand-500 via-accent-500 to-brand-500` | Gradient bar trên card login |
| **Text accent** | `from-brand-500 to-accent-500` | Text gradient cho "với AI" |
| **Logo bg** | `from-brand-500 to-brand-600` | Icon LangBook logo |
| **Mesh nền public** | `brand-50 + accent-50 + brand-100/40` blur | Background public page |
| **Accent strip** | `from-brand-400 via-brand-500 to-accent-500` | Dải dọc decorative |

> Chỉ hỗ trợ light mode. Không triển khai dark mode.

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
| **hero** | `text-[clamp(28px,5vw,52px)]` | `leading-[1.1]` | `font-bold` | Public page headline |
| **h1** | `text-3xl md:text-4xl` | `leading-tight` | `font-bold` | Page title (dashboard) |
| **h2** | `text-2xl md:text-3xl` | `leading-tight` | `font-semibold` | Section title |
| **h3** | `text-xl md:text-2xl` | `leading-snug` | `font-semibold` | Card title |
| **body** | `text-base` | `leading-relaxed` | `font-normal` | Paragraph |
| **body-lg** | `text-base sm:text-lg` | `leading-relaxed` | `font-normal` | Public page body |
| **caption** | `text-xs` | `leading-normal` | `font-normal` | Label, badge, meta |

**Max width body:** `max-w-prose` (65ch) cho readability.
**Responsive headline:** Dùng `text-[clamp(min,preferred,max)]` thay vì nhiều breakpoint.

### 3.3 Gradient Text

Dùng cho từ khoá quan trọng trong headline:

```tsx
<span className="bg-gradient-to-r from-brand-500 to-accent-500 bg-clip-text text-transparent">
  với AI
</span>
```

Utility: `text-gradient-brand` (defined trong globals.css)

---

## 4. Spacing

| Token | rem | px | Usage |
|---|---|---|---|
| `space-1` | 0.25rem | 4px | Icon gap nhỏ |
| `space-2` | 0.5rem | 8px | Inner padding nhỏ |
| `space-3` | 0.75rem | 12px | Gap giữa label + input |
| `space-4` | 1rem | 16px | Padding card, gap section items |
| `space-6` | 1.5rem | 24px | Padding page, gap cards |
| `space-8` | 2rem | 32px | Gap section lớn |
| `space-10` | 2.5rem | 40px | Space giữa logo và headline |
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
| `radius-2xl` | `16px` | OAuth button, feature pill |
| `radius-full` | `9999px` | Avatar, pill, dot |

---

## 6. Shadows (Elevation)

| Level | Value |
|---|---|
| **sm** | `0 1px 2px 0 rgb(0 0 0 / 0.05)` |
| **md** | `0 4px 6px -1px rgb(0 0 0 / 0.07)` |
| **lg** | `0 10px 15px -3px rgb(0 0 0 / 0.08)` |
| **xl** | `0 20px 25px -5px rgb(0 0 0 / 0.1)` |

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
| **OAuth** | `white` | `neutral-800` | `ring-1 neutral-200` | `brand-50` + `brand-200` ring | `scale-[0.98]` |

- **Padding (OAuth):** `h-13` (52px)
- **Radius:** `radius-2xl` (16px) cho OAuth, `radius-md` (10px) cho các variant khác
- **Font:** `text-sm font-semibold` (OAuth), `text-sm font-medium` (khác)
- **Transition:** `transition-all duration-200`
- **Pressed:** `scale-[0.97]` tactile feedback
- **OAuth hover:** `hover:shadow-lg hover:-translate-y-0.5`

**OAuth button template:**
```tsx
<motion.a
  whileHover={{ y: -2, scale: 1.01 }}
  whileTap={{ scale: 0.98 }}
  className="flex h-13 w-full items-center justify-center gap-3 rounded-xl bg-white text-sm font-semibold text-neutral-800 shadow-md ring-1 ring-neutral-200 transition-all duration-200 hover:shadow-lg"
>
  <AccurateSvgLogo />
  Tiếp tục với Google
</motion.a>
```

Google button hover: `hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700 hover:ring-brand-200`
Facebook button hover: `hover:border-accent-200 hover:bg-accent-50 hover:text-accent-700 hover:ring-accent-200`

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
| BG | `neutral-white` |
| Radius | `radius-lg` (14px) |
| Shadow | `shadow-sm` |
| Padding | `p-6` |
| Border | `border border-neutral-200` |

**Card hover:** `shadow-md` + `border-neutral-300` (nếu interactive).

### 7.4 Feature Pill (Chip)

Dùng để highlight tính năng ở public page:

| Hue | BG | Text | Ring | Hover |
|---|---|---|---|---|
| **Brand** | `brand-100` | `brand-700` | `brand-200/60` | `brand-200` + `shadow-md` |
| **Accent** | `accent-100` | `accent-700` | `accent-200/60` | `accent-200` + `shadow-md` |

- **Padding:** `px-4 py-2` (md), `px-3.5 py-1.5` (sm)
- **Radius:** `radius-full`
- **Font:** `text-sm font-medium`
- **Animation:** `hover:-translate-y-0.5` + `hover:shadow-md`

```tsx
<motion.span
  whileHover={{ y: -2, scale: 1.02 }}
  className="rounded-full bg-brand-100 px-4 py-2 text-sm font-medium text-brand-700 ring-1 ring-brand-200/60 hover:bg-brand-200 hover:shadow-md"
>
  <Icon className="h-4 w-4 text-brand-500" weight="fill" />
  Nội dung AI cá nhân hoá
</motion.span>
```

### 7.5 Sidebar

| Token | Value |
|---|---|
| Width | `w-64` (256px), collapse mobile |
| BG | `neutral-100` |
| Border-right | `border-r border-neutral-200` |
| Item padding | `px-4 py-2.5` |
| Item radius | `radius-md` |
| Active item | `bg-brand-50 text-brand-700 font-medium` |
| Hover item | `bg-neutral-200` |

### 7.6 Top Bar

| Token | Value |
|---|---|
| Height | `h-16` (64px) |
| BG | `neutral-white` |
| Border-bottom | `border-b border-neutral-200` |
| Padding | `px-6` |

### 7.7 Badge

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

### 7.8 Alert

| Variant | BG | Border | Text | Icon |
|---|---|---|---|---|
| Info | `blue-50` | `blue-200` | `blue-700` | Info icon |
| Success | `green-50` | `green-200` | `green-700` | Check icon |
| Warning | `amber-50` | `amber-200` | `amber-700` | Warning icon |
| Error | `red-50` | `red-200` | `red-700` | X icon |

- **Radius:** `radius-lg` (14px)
- **Padding:** `p-4`
- **Font:** `text-sm`

### 7.9 Progress Bar

| Token | Value |
|---|---|
| Track BG | `neutral-200` |
| Fill BG | `brand-500` (default), `accent-500` (gamification) |
| Radius | `radius-full` |
| Height | `h-2` (default), `h-3` (gamification) |

### 7.10 Tabs

| Token | Value |
|---|---|
| Active border | `border-b-2 border-brand-500` |
| Active text | `text-brand-600 font-medium` |
| Inactive text | `text-neutral-500` |
| Hover text | `text-neutral-700` |

---



## 9. Public Page Layout (Editorial)

Áp dụng cho các trang không có sidebar: login, placement wizard, landing page.

### 9.1 Cấu trúc tổng thể

```
┌──────────────────────────────────────────────────────┐
│ Background: mesh gradient + dot pattern              │
│ ┌──────────────────────────────────────────────────┐ │
│ │  Hero section (full viewport, centered)          │ │
│ │  ──────────────────────────────────────────────  │ │
│ │  Headline (hero size)                            │ │
│ │  Decorative SVG art                              │ │
│ │  Body text                                       │ │
│ │  CTA / OAuth buttons                            │ │
│ └──────────────────────────────────────────────────┘ │
│                                                      │
│ Background layers:                                    │
│ - Mesh gradient (brand-50, accent-50, brand-100 blur)│
│ - Dot pattern (brand-500/0.12 dots 28px)             │
│ - Floating circles (brand-300, accent-300 animated)  │
└──────────────────────────────────────────────────────┘
```

### 9.2 Background layers

Mỗi public page có 3 lớp nền chồng lên nhau:

**Layer 1 — Mesh gradient:**
```tsx
<div className="pointer-events-none fixed inset-0">
  <div className="absolute -left-32 top-0 h-[600px] w-[600px] rounded-full bg-brand-50 blur-[120px]" />
  <div className="absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-accent-50/60 blur-[100px]" />
  <div className="absolute left-1/3 top-1/4 h-64 w-64 rounded-full bg-brand-100/40 blur-[90px]" />
</div>
```

**Layer 2 — Dot pattern:**
```tsx
<div
  className="pointer-events-none fixed inset-0 opacity-[0.35]"
  style={{
    backgroundImage: 'radial-gradient(rgba(139,92,246,0.12) 1px, transparent 1px)',
    backgroundSize: '28px 28px',
  }}
/>
```

**Layer 3 — Floating decorative circles:**
```tsx
<div className="pointer-events-none absolute inset-0">
  <div className="absolute left-[15%] top-[12%] h-4 w-4 animate-float rounded-full bg-brand-300/60" />
  <div className="absolute right-[25%] top-[20%] h-3 w-3 animate-float-slow rounded-full bg-accent-300/50" />
  <div className="absolute bottom-[25%] left-[20%] h-5 w-5 animate-float-slower rounded-full bg-brand-200/60" />
  <div className="absolute bottom-[35%] right-[15%] h-2.5 w-2.5 animate-float rounded-full bg-accent-200/50" />
  <div className="absolute left-[40%] top-[60%] h-6 w-6 animate-float-slow rounded-full bg-brand-100/70" />
</div>
```

**Layer 4 — Vertical accent strip:**
```tsx
<div className="absolute bottom-0 left-0 top-0 w-1.5 bg-gradient-to-b from-brand-400 via-brand-500 to-accent-500" />
```

---

## 10. Decorative SVG Art

Sử dụng SVG inline với các vòng tròn overlap + radial gradient để tạo hiệu ứng nghệ thuật trừu tượng.

### 10.1 Template

```tsx
<svg viewBox="0 0 480 200" className="w-full max-w-sm" preserveAspectRatio="xMidYMid meet">
  <defs>
    <radialGradient id="bg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.12" />
      <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="ag" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.1" />
      <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
    </radialGradient>
  </defs>
  {/* Circles với motion animation */}
  <motion.circle cx="240" cy="100" r="110" fill="url(#bg)"
    animate={{ scale: [1, 1.04, 1] }} transition={{ duration: 7, repeat: Infinity }} />
  <motion.circle cx="300" cy="80" r="75" fill="url(#ag)"
    animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 9, repeat: Infinity }} />
  {/* Small floating dots */}
  <motion.circle cx="140" cy="70" r="20" fill="#06B6D4" fillOpacity="0.08"
    animate={{ y: [0, 5, 0] }} transition={{ duration: 8, repeat: Infinity }} />
</svg>
```

### 10.2 Animation mapping

| Element | Animation | Duration | Easing |
|---|---|---|---|
| Main circle (brand) | scale pulse 1→1.04→1 | 7s | easeInOut |
| Secondary circle (accent) | scale pulse 1→1.06→1 | 9s | easeInOut |
| Small dots | y float 0→±8→0 | 6-8s | easeInOut |
| Tiny specks | opacity 0.5→1→0.5 | 3-4s | easeInOut |

---

## 11. Layout (Sidebar + Top Bar)

```
┌──────────────────────────────────────────┐
│ Top Bar (h-16)                           │
│ ┌──────┐ ┌─────────────────────────────┐ │
│ │Logo  │ │ Search  Profile             │ │
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
- **Background:** `neutral-50` toàn page
- **Gap giữa sidebar + content:** `border-r` ngăn cách

---

## 12. Accessibility (WCAG AA)

| Yêu cầu | Tiêu chuẩn |
|---|---|
| **Contrast ratio** | Body text ≥ 4.5:1, Large text ≥ 3:1 |
| **Focus indicator** | `ring-2 ring-brand-500/50` — không bao giờ tắt outline |
| **Touch target** | Tối thiểu 44×44px cho interactive elements |
| **Label** | Mọi input phải có label (không placeholder-as-label) |
| **Error** | Error text + icon + `aria-invalid` + `aria-describedby` |
| **Reduced motion** | Tôn trọng `prefers-reduced-motion` — tắt animation |
| **Keyboard nav** | Tab order hợp lý, skip-to-content link |

---

## 13. Grid & Breakpoints

| Breakpoint | Min width | Columns | Gutter |
|---|---|---|---|
| **sm** | 640px | 4 | 16px |
| **md** | 768px | 8 | 24px |
| **lg** | 1024px | 12 | 24px |
| **xl** | 1280px | 12 | 32px |
| **2xl** | 1536px | 12 | 32px |

---

## 14. Iconography

### 14.1 UI icons

- **Library:** `@phosphor-icons/react`
- **Kích thước:** `w-5 h-5` (20px) cho UI icons, `w-6 h-6` (24px) cho navigation
- **Stroke weight:** Đồng bộ `weight="bold"` (1.5px)

### 14.2 Brand logos (Google, Facebook)

Không dùng Phosphor `GoogleLogo` / `FacebookLogo` (bản đơn giản hoá). Dùng inline SVG chính xác từ Simple Icons:

```tsx
function GoogleSvg() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92..." fill="#4285F4" />
      <path d="..." fill="#34A853" />
      <path d="..." fill="#FBBC05" />
      <path d="..." fill="#EA4335" />
    </svg>
  );
}
```

| Logo | Màu sắc | Nguồn |
|---|---|---|
| Google | `#4285F4` `#34A853` `#FBBC05` `#EA4335` | Simple Icons |
| Facebook | `#1877F2` | Simple Icons |

---

## 15. Animation & Motion

### 15.1 Timing

| Loại | Duration | Easing | Ghi chú |
|---|---|---|---|
| Hover | 150-200ms | `ease-in-out` | Button, link, card |
| Enter (component) | 400-600ms | `[0.16, 1, 0.3, 1]` (cubic-bezier) | Staggered entrance |
| Page transition | 200ms | `ease-in-out` | Next.js built-in |
| Decorative float | 6-12s | `ease-in-out infinite` | Floating circles |
| Decorative pulse | 3-9s | `ease-in-out infinite` | SVG circle scale |
| Reduced motion | 0ms | — | Tất cả animation tắt |

### 15.2 Easing

Easing mặc định cho entrance animation:
```tsx
ease: [0.16, 1, 0.3, 1]  // cubic-bezier — tự nhiên, không quá nhanh
```

### 15.3 Staggered entrance pattern

```tsx
const container = {
  hidden: { opacity: 0 },
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};
```

**Thứ tự delay cho public page hero:**
1. Brand logo: `delay: 0.1`
2. Headline: `delay: 0.15`
3. SVG art: `delay: 0.25`
4. Body text: `delay: 0.3`
5. CTA buttons: `delay: 0.4`

### 15.4 CSS animations

Defined trong `globals.css`:

```css
@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-12px) rotate(1deg); }
  66% { transform: translateY(6px) rotate(-0.5deg); }
}

@keyframes glow-pulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.8; }
}
```

| Class | Duration | Dùng cho |
|---|---|---|
| `animate-float` | 6s | Floating circles nhỏ |
| `animate-float-slow` | 9s | Floating circles vừa |
| `animate-float-slower` | 12s | Floating circles lớn |
| `animate-glow-pulse` | 3s | Logo glow |

---

## 16. shadcn/ui Integration

Khi dùng shadcn/ui, custom theme qua `globals.css`:

```css
@theme {
  /* Tokens như mục 2 */
}
```

Sau đó map shadcn/ui CSS variables (`--primary`, `--background`, `--foreground`, ...) vào các token trên.

---

## 17. File Structure (Components)

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

---

## 18. Checklist thiết kế cho page mới

Khi tạo page mới, kiểm tra:

- [ ] Xác định chế độ: **Dashboard** (có sidebar) hay **Public** (editorial full-page)
- [ ] Nếu Public: thêm mesh gradient background + dot pattern + SVG art
- [ ] Dùng đúng token màu, không hardcode hex
- [ ] Dùng radius token: card 14px, button/badge 10px, pill full
- [ ] Dùng `motion` cho entrance stagger animation
- [ ] Dùng Google/Facebook SVG chính xác (không Phosphor simplified)
- [ ] OAuth button height `h-13` (52px), `rounded-xl` (16px)
- [ ] Feature pill: `bg-brand-100 text-brand-700` hoặc `accent-100 accent-700`
- [ ] Gradient text: `from-brand-500 to-accent-500 bg-clip-text text-transparent`
- [ ] Body text max-width: `max-w-md` hoặc `max-w-prose`
- [ ] Tôn trọng `prefers-reduced-motion`
