# Luxury Bilingual Islamic Productivity App - Design Guidelines

## Design Approach
**Selected Approach:** Material Design foundation with heavy luxury Islamic customization
**Justification:** Material Design provides excellent RTL support and robust component patterns, which we'll elevate with premium aesthetics suitable for a luxury Islamic productivity application.

---

## Core Design Principles
1. **Elegance & Restraint:** Clean, spacious layouts with purposeful whitespace
2. **Cultural Authenticity:** Respect Islamic design heritage through subtle geometric patterns and calligraphic excellence
3. **Bilingual Excellence:** Seamless RTL/LTR transitions with equal visual weight for both languages
4. **Premium Feel:** Refined details, smooth micro-interactions, elevated material quality

---

## Typography

**Arabic Primary:** Noto Sans Arabic (Google Fonts)
- Headings: 600-700 weight
- Body: 400-500 weight
- Display: 700 weight for hero text

**English Primary:** Inter (Google Fonts)
- Headings: 600-700 weight
- Body: 400-500 weight

**Quranic Text:** Amiri or Scheherazade New (traditional Islamic calligraphy feel)
- Weight: 400-700
- Used exclusively for Quranic verses and sacred text

**Scale:**
- Display: text-5xl to text-6xl (Dashboard greeting)
- H1: text-4xl
- H2: text-3xl
- H3: text-2xl
- H4: text-xl
- Body: text-base
- Small: text-sm

---

## Layout System

**Spacing Primitives:** Use Tailwind units of **2, 4, 6, 8, 12, 16**
- Component padding: p-6, p-8
- Section spacing: space-y-8, gap-6
- Tight spacing: gap-2, gap-4
- Generous spacing: p-12, p-16 (Dashboard hero area)

**Breakpoints:**
- Mobile-first approach
- md: 768px, lg: 1024px, xl: 1280px

**RTL/LTR Critical Implementation:**
- Sidebar: `fixed ${dir === 'rtl' ? 'right-0' : 'left-0'}` with w-64
- Flex containers: `flex-row${dir === 'rtl' ? '-reverse' : ''}`
- Text alignment: dynamic `text-${dir === 'rtl' ? 'right' : 'left'}`

---

## Luxury Theme System

**Gold Theme (الذهبي):**
- Accents: Warm gold tones (#D4AF37, #F4E4C1)
- Backgrounds: Warm cream (#FFF9F0), soft beige
- Text: Rich charcoal (#2C2416)

**Green Theme (الأخضر):**
- Accents: Deep emerald (#047857), sage green (#10B981)
- Backgrounds: Soft mint (#F0FDF4), cream white
- Text: Dark forest green (#064E3B)

**Dark Theme (الداكن):**
- Backgrounds: Deep navy (#0F172A), charcoal (#1E293B)
- Accents: Muted gold (#C9A961), soft green (#34D399)
- Text: Warm white (#F8FAFC)

**Theme Application:**
- Cards: Elevated with subtle shadows (shadow-lg, shadow-xl)
- Borders: Minimal, 1px with accent colors at 20% opacity
- Glassmorphism: For overlay elements (backdrop-blur-sm, bg-opacity-95)

---

## Component Library

**Navigation Sidebar:**
- Fixed position (RTL-aware)
- Icons from Heroicons (outline style)
- Active state: Subtle background fill with accent color
- Hover: Gentle scale (hover:scale-105)

**Cards:**
- Rounded corners: rounded-xl
- Padding: p-6 to p-8
- Shadow: shadow-lg with hover:shadow-xl transition
- Border: 1px accent color at low opacity

**Dashboard Growth Tree:**
- SVG-based, centered
- Height: 400-500px
- Animated leaf/flower/fruit additions (simple opacity fade-ins)

**Pomodoro Timer:**
- Circular progress indicator (SVG circle)
- Large centered time display (text-6xl)
- Start/Pause/Reset buttons below
- Session count indicator

**Dhikr Counter:**
- Large centered number (text-7xl)
- Circular progress ring showing target percentage
- Predefined dhikr dropdown (styled select)
- Increment button: Large, rounded-full, prominent
- Reset/Custom target controls below

**Prayer Tracking:**
- 5 cards in grid (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
- Each card: Prayer name, time, checkbox
- Checkmark animation on completion
- Visual differentiation for completed prayers

**Task Cards:**
- Priority indicator: Left border (4px) in priority color
- Tag pills: Rounded-full, small text, accent backgrounds
- Checkbox: Custom styled, accent color on check
- Action buttons: Hover reveals (edit/delete)

**Forms:**
- Input fields: Rounded-lg, p-3, border with focus ring
- Labels: text-sm, font-medium, mb-2
- Buttons: px-6 py-3, rounded-lg, font-medium
- Primary button: Full accent color with white text
- Secondary: Outline with accent color

**Charts (Calendar & Stats):**
- Line/Bar charts using Chart.js
- Accent colors match theme
- Subtle grid lines
- Rounded corners on bars
- Tooltip: Glassmorphic style

**Achievement Badges:**
- Grid layout (grid-cols-2 md:grid-cols-3 lg:grid-cols-4)
- Circular badge icons (w-20 h-20)
- Title below badge
- Locked state: Grayscale with opacity-50
- Unlocked: Full color with subtle glow

**Settings Sections:**
- Grouped cards for Theme, Language, Data
- Toggle switches: Custom styled with accent colors
- Export/Import buttons: Secondary style
- Reset button: Warning red color

---

## Images

**No large hero images required.** This is a productivity application focused on functional clarity.

**Icon System:** Heroicons (outline style throughout)
- Prayer icons from icon set
- Navigation icons
- Action icons (edit, delete, add)

**Decorative Elements:**
- Subtle Islamic geometric patterns as background watermarks (opacity-5 to opacity-10)
- Used sparingly in Dashboard hero area and Settings page headers
- SVG-based, scalable, theme-colored

---

## Authentication Pages

**Layout:** Centered card (max-w-md) on full-height page
**Background:** Subtle gradient matching theme with geometric pattern overlay
**Card:** Elevated (shadow-2xl), glassmorphic background
**Form spacing:** space-y-6
**Button:** Full width (w-full), prominent
**Language toggle:** Top-right corner, subtle

---

## Responsive Behavior

**Mobile (< md):**
- Sidebar: Hidden, hamburger menu reveals overlay
- Grid layouts: Collapse to single column
- Reduced padding (p-4 instead of p-8)
- Smaller typography scale

**Tablet (md):**
- Sidebar: Visible, condensed icons only
- 2-column grids for cards
- Standard padding

**Desktop (lg+):**
- Full sidebar with text labels
- Multi-column grids (3-4 columns)
- Maximum content width: max-w-7xl
- Generous spacing

---

**Animation Budget:** Minimal. Smooth transitions (300ms) on interactive elements only. No scroll animations or complex motion graphics. Focus on instant responsiveness and clarity.