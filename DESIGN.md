# Design Direction

## Approval rule

This file is approved design direction. Ask the user for explicit permission before changing `DESIGN.md`. UI work must follow this file unless the user approves a documented change first.

## Direction

Khmer Modernist Archive: a Cambodian oral-history site shaped by strong geometry, editorial restraint, and bilingual-ready typography. The interface should feel like a professional cultural institution, not a blog, dashboard, or generic AI landing page.

## Principles

- Content leads the design.
- Use structure, scale, and rhythm instead of decoration.
- Prefer sharp geometry over soft cards.
- Use Khmer-compatible typography and avoid layouts that clip Khmer text.
- Treat records as archive material, not product cards.
- Do not invent photographs, audio, interview facts, or statistics.

## Visual language

- Flat warm concrete background.
- Gallery-paper content surfaces.
- Carbon text.
- Vermilion accents for record numbers, active actions, and structural emphasis.
- Deep indigo for institutional contrast.
- Thin rules and column boundaries.
- Large titles and numbered record rows.

## Avoid

- Notebook-paper backgrounds.
- Ruled paper lines.
- Gradients used as decoration.
- Rounded card grids.
- Heavy shadows.
- Pills and badges as default UI language.
- Fake image placeholders.
- Dashboard statistics unless supported by meaningful project data.
- Generic hero art, blobs, or repeated AI-looking containers.

## Typography

Primary stack:

```css
"Noto Serif Khmer", "Khmer OS Siemreap", "Khmer Sangam MN", Georgia, serif
```

Interface labels:

```css
ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
```

Use uppercase only for English interface labels. Do not force uppercase on Khmer content.

## Layout

- Desktop uses a strict max-width grid.
- Header is a flat architectural bar with text navigation.
- Home uses oversized title as the main visual object.
- Archive uses index rows, not cards.
- Detail pages use a metadata rail and reading column.
- Interview Collection uses name-led profiles, not avatar placeholders.
- Mobile layouts are composed as compact reading blocks, not only stacked desktop columns.

## Accessibility

- Links and controls need visible focus states.
- Search labels stay explicit.
- Color contrast must remain readable.
- Reduced-motion support stays in CSS if transitions exist.