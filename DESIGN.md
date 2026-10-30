# Design Direction

## Approval rule

This file is approved design direction. Ask the user for explicit permission before changing `DESIGN.md`. UI work must follow this file unless the user approves a documented change first.

## Direction

Khmer School Memory Ledger: a Cambodian oral-history archive shaped by school registers, editorial newspapers, and physical archive material. Interface should feel like a professional cultural institution, not a blog, dashboard, or generic AI landing page.

## Principles

- Content leads the design.
- Use structure, scale, and rhythm instead of decoration.
- Prefer sharp geometry over soft cards.
- Use Khmer-compatible typography and avoid layouts that clip Khmer text.
- Treat records as archive material, not product cards.
- Do not invent photographs, audio, interview facts, or statistics.

## Visual language

- Warm aged-paper background and archive-paper surfaces.
- Dark ink text, muted ink supporting text, and restrained vermilion record marks.
- Thin ledger rules, column boundaries, and double rules for publication endings.
- Editorial mastheads use native condensed display fallback for English only.
- Khmer uses Khmer-compatible type without compression, forced uppercase, or tight tracking.
- Real school-memory photos appear in square archival frames with restrained sepia treatment.

## Avoid

- Gradients used as decoration.
- Gradient colors on components unless explicitly needed.
- Heavy shadows.
- Pills and badges as default UI language.
- Dashboard statistics unless supported by meaningful project data.
- Generic hero art, blobs, or repeated AI-looking containers.

## Typography

Content stack:

```css
"Noto Sans Khmer", "Khmer OS Siemreap", "Khmer Sangam MN", Georgia, serif
```

Interface stack:

```css
ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
```

Use uppercase only for English interface labels. Do not force uppercase on Khmer content.

### Type scale

| Role | Token | Use |
| --- | --- | --- |
| Caption | `--text-caption` | Image captions, small metadata |
| Label | `--text-label` | Eyebrows, record numbers, control labels |
| Navigation | `--text-nav` | Header and compact navigation |
| Body | `--text-body` | Reading text, form values, help text |
| Lead | `--text-lead` | Introductions and supporting copy |
| Section | `--text-section` | Section headings |
| Display | `--text-display` | Page and record titles; use responsive `clamp()` values |

- Content uses `--font-content`. Interface text uses `--font-interface`.
- Reading text needs line-height from `1.6` to `1.75`.
- Display titles may use tight line-height and negative tracking. Do not use those settings for Khmer body text.
- English-only labels may be uppercase with `0.025em` to `0.045em` tracking. Bilingual labels must not force uppercase because Khmer has no uppercase.

## Tokens

Use CSS variables from `app/globals.css`. New UI must use semantic tokens instead of new hex values or arbitrary repeated dimensions.

### Color

| Token | Light value | Use |
| --- | --- | --- |
| `--concrete` | `#ded5c3` | Site background |
| `--paper` | `#f3ead5` | Content surfaces |
| `--carbon` | `#292521` | Primary text, strong borders, primary actions |
| `--muted` | `#706858` | Supporting text |
| `--vermilion` | `#a63d35` | Active state, errors, structural emphasis |
| `--indigo` | `#18314a` | Institutional contrast and secondary emphasis |
| `--rule` | `#aaa08d` | Thin dividers and quiet borders |

Site uses light mode only. Keep new colors within this token set.

### Spacing and layout

| Token | Value | Use |
| --- | --- | --- |
| `--space-1` | `4px` | Tight internal gap |
| `--space-2` | `8px` | Label/control gap |
| `--space-3` | `12px` | Compact control padding |
| `--space-4` | `16px` | Standard internal spacing |
| `--space-5` | `24px` | Field and component spacing |
| `--space-6` | `32px` | Section-internal spacing |
| `--space-8` | `48px` | Desktop column or section spacing |
| `--space-10` | `64px` | Major page spacing |

- `--layout-wide` controls site-width shell.
- `--layout-reading` controls readable story width.
- `--layout-rail` controls metadata columns.
- `--layout-form` controls form-page width.
- Desktop uses structural grids. At narrow widths, grids become compact single-column reading blocks.

### Structure and elevation

- Default divider: `--border-thin` with `--rule`.
- Structural divider: `--border-strong` with `--carbon`.
- Archive records, forms, metadata rails, buttons, and inputs use square corners.
- Rounded shapes are limited to temporary controls and media: account controls, language controls, mobile navigation controls, hero media, and status indicators.
- Shadows are limited to temporary elevated UI: account menu, mobile drawer, and hero surface. No shadow on archive rows, fields, or ordinary content panels.
- Primary control height uses `--control-height`. Use `--focus-ring` for visible keyboard focus.

## Component rules

### Pages and sections

- Page shells use `--layout-wide` and align header, main content, and footer.
- Detail and contribute pages pair a metadata rail with a reading column on desktop.
- Archive listings use ruled index rows, not card grids.
- Gallery-paper surfaces need a reason: hero, temporary menu, or clear grouped content.

### Controls

- Primary action: carbon background, paper text, square edge.
- Secondary action: transparent background, carbon border and text.
- Destructive action: vermilion background and border.
- Inputs and selects: paper background, quiet rule border, square edge, explicit label.
- File upload: clear image surface, visible replacement action, local preview before submit.
- Do not use pills for normal buttons, filters, or status labels.

### Images

- Use real archive images only. Never add fake image placeholders.
- Use `object-fit: cover` for cropped record and preview images.
- Every meaningful image needs useful alternative text. Decorative images need empty alternative text.

## Responsive behavior

- Keep reading widths comfortable before increasing type size.
- Preserve label-control association and keyboard order when columns stack.
- At `880px`, primary page grids may collapse.
- At `700px`, compact form and filter grids collapse.
- Do not hide essential labels on mobile.

## Accessibility

- Links and controls need visible focus states using `--focus-ring`.
- Search labels stay explicit.
- Error text must stay connected to its control through `aria-describedby`.
- Color cannot be only status signal; use text, structure, or icons too.
- Color contrast must remain readable in light mode.
- Honor `prefers-reduced-motion`.
- Keep Khmer text intact. Never transliterate, strip, or uppercase it.

## Layout

- Desktop uses a strict max-width grid.
- Header is a flat architectural bar with text navigation.
- Home uses oversized title as the main visual object.
- Archive uses index rows, not cards.
- Detail pages use a metadata rail and reading column.
- Interview Collection uses name-led profiles, not avatar placeholders.
- Mobile layouts are composed as compact reading blocks, not only stacked desktop columns.