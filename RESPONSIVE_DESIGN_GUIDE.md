# Dashboard Responsive Design Guide

## Breakpoint Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│ Mobile-First Progressive Enhancement                             │
├─────────────────────────────────────────────────────────────────┤
│ xs: 320px  ──→  sm: 375px  ──→  md: 640px  ──→  lg: 1024px      │
└─────────────────────────────────────────────────────────────────┘
```

## Component Responsiveness Examples

### Stats Cards Layout

**Mobile (320px - 374px)**
```
┌──────────────┐
│ Total        │
│ Savings      │
│ K4,550       │
└──────────────┘
┌──────────────┐
│ Active       │
│ Groups       │
│ 2            │
└──────────────┘
```

**Small Mobile (375px - 639px)**
```
┌──────────────┬──────────────┐
│ Total        │ Active       │
│ Savings      │ Groups       │
│ K4,550       │ 2            │
└──────────────┴──────────────┘
┌──────────────┬──────────────┐
│ Up.          │ Total        │
│ Payments     │ Members      │
│ 3            │ 25           │
└──────────────┴──────────────┘
```

**Tablet (640px - 1023px)**
```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│ Total        │ Active       │ Up.          │ Total        │
│ Savings      │ Groups       │ Payments     │ Members      │
│ K4,550       │ 2            │ 3            │ 25           │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

**Desktop (1024px+)**
```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│ Total Savings│ Active Groups│ Up. Payments │ Total Members│
│ K4,550       │ 2            │ 3            │ 25           │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

---

### Header Layout

**Mobile (320px)**
```
┌────────────────────────────┐
│ ☰  Pollen  🌙 🔔 👤       │
└────────────────────────────┘
```

**Small Mobile (375px)**
```
┌─────────────────────────────┐
│ ☰  Pollen  🔍 🌙 🔔 👤    │
└─────────────────────────────┘
```

**Tablet (640px)**
```
┌──────────────────────────────────────┐
│ < Pollen    🔍 🌙 🔔 👤            │
└──────────────────────────────────────┘
```

---

### Charts Layout

**Mobile & Tablet (up to 639px)**
```
┌────────────────────┐
│ Savings Overview   │
│                    │
│   Bar Chart        │
│  (250px height)    │
└────────────────────┘

┌────────────────────┐
│ Group Distribution │
│                    │
│   Pie Chart        │
│  (250px height)    │
└────────────────────┘
```

**Desktop (640px+)**
```
┌──────────────────────────────┬──────────────┐
│ Savings Overview             │ Group Dist.  │
│                              │              │
│   Bar Chart (300px height)   │ Pie Chart    │
│                              │ (300px h)    │
└──────────────────────────────┴──────────────┘
```

---

## Padding & Spacing System

```
Mobile:  p-2    (8px)   - Very compact
         p-3    (12px)  - Small phones
Tablet:  p-4    (16px)  - Tablets
Desktop: p-6    (24px)  - Full screens

Gap System:
Mobile:  gap-1  (4px)   or gap-2 (8px)
Tablet:  gap-3  (12px)  or gap-4 (16px)
Desktop: gap-6  (24px)
```

---

## Typography Scaling

```
Labels:       text-xs sm:text-sm md:text-base lg:text-lg
Body Text:    text-sm sm:text-base md:text-lg
Card Titles:  text-base sm:text-lg md:text-xl
Main Title:   text-lg sm:text-xl md:text-2xl
```

---

## Icon Sizing

```
Header Icons:    h-4 w-4 sm:h-5 sm:w-5
Card Icons:      h-10 w-10 sm:h-12 sm:w-12
Activity Icons:  h-8 w-8 sm:h-10 sm:w-10
Small Icons:     h-3 w-3 sm:h-4 sm:w-4
```

---

## Touch-Friendly Targets

**Button Sizes**
```
Mobile:   h-8 w-8 (32px) minimum
Tablet:   h-9 w-9 (36px) minimum
Desktop:  h-9+ w-9+ (36px+)

All buttons meet WCAG minimum of 44x44px when including padding
```

---

## Activity Feed Responsiveness

**Mobile (320px)**
```
┌──────────────────────────┐
│ 🎯 Weekly Meeting        │
│   Apr 25                 │
│   10:00 AM • Savings...  │
└──────────────────────────┘
```

**Tablet+ (640px)**
```
┌─────────────────────────────────────────┐
│ 🎯 Weekly Meeting          │ Apr 25, 2023│
│ 10:00 AM • Savings Group 1              │
└─────────────────────────────────────────┘
```

---

## Viewport Width Classes Used

| Class | Width    | Use Case |
|-------|----------|----------|
| `xs`  | 320px+   | Very small phones |
| `sm`  | 375px+   | Standard phones |
| `md`  | 640px+   | Tablets |
| `lg`  | 1024px+  | Desktops |
| `xl`  | 1280px+  | Large desktops |

---

## CSS Utility Patterns

### Responsive Grid Pattern
```css
/* Stacks on mobile, 2 cols on tablet, 4 cols on desktop */
grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4
```

### Responsive Padding Pattern
```css
/* Progressive padding increase */
p-2 xs:p-3 sm:p-4 md:p-6
```

### Responsive Typography Pattern
```css
/* Text scales with screen size */
text-xs sm:text-sm md:text-base lg:text-lg
```

### Responsive Spacing Pattern
```css
/* Gap increases with screen size */
gap-2 sm:gap-3 md:gap-4 lg:gap-6
```

---

## Mobile-Specific Optimizations

### Text Truncation
```css
truncate           /* Single line with ellipsis */
line-clamp-2       /* Two lines with ellipsis */
min-w-0            /* Fixes flex text overflow */
```

### Hidden Elements
```css
hidden xs:block    /* Hidden on mobile, visible at xs+ */
hidden sm:inline   /* Divider dots hidden on mobile */
```

### Responsive Sizing
```css
h-10 sm:h-12       /* Icons scale up on larger screens */
h-8 sm:h-10        /* Smaller icons scale proportionally */
```

---

## Performance Tips

1. **Prevent Layout Shift**: Use `min-w-0` on flex items with text
2. **Touch Targets**: Minimum 32px (8x8 units) for interactive elements
3. **Readable Text**: Never less than 12px on mobile
4. **Adequate Spacing**: Use consistent gap system
5. **Chart Optimization**: Reduce chart height on mobile for performance

---

## Color & Contrast

- All text meets WCAG AA contrast requirements
- Colors remain consistent across all screen sizes
- Dark mode properly supported on all breakpoints
- Accent colors (badges, icons) scale appropriately

---

## Future Responsive Enhancements

- [ ] Landscape mode optimization
- [ ] Gesture support (swipe to navigate)
- [ ] Virtual scrolling for long lists
- [ ] Animated transitions on mobile
- [ ] PWA-specific optimizations
- [ ] Print-friendly responsive layouts

