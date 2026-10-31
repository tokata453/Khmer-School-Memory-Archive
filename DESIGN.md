# Design Direction

## Direction

Khmer School Memory Archive uses a logo-led heritage archive language adapted for a Cambodian oral-history collection. Real school-memory photography leads. Archive content, bilingual support, and contributor workflows stay central.

## Visual system

- Parchment `#f3e6c8` page background, archive paper `#fff8e8` surfaces, ink navy `#173342`, antique gold `#b77b27`, and ledger-brown `#cbb993` rules. Vermilion `#a63d35` remains errors and destructive actions.
- English display headings use Georgia serif. Interface uses system sans-serif. Khmer text uses Khmer-compatible system fallbacks with normal tracking and generous line height.
- Data counts and prominent numerals use system interface sans-serif with tabular figures for clean alignment; display headings remain Georgia serif.
- Sticky translucent archive-paper header, square catalog controls, archive-paper image cards, restrained paper shadows.
- Page shells fill available screen width with `24px` desktop gutters and `14px` mobile gutters. Listing grids: three columns, then one column below `880px`.
- Inputs, buttons, cards, and panels use `2px` radius. Thin ledger rules and selected double rules replace rounded UI.
- Home hero uses only `/public/hero-image.jpg`, with a warm parchment overlay. No stock media or fake statistics.
- Home hero centers archive identity, description, and working archive search over real photography. A supporting fact strip shows only computed archive records, provinces, school levels, and decades.

## Page patterns

- Home: image-backed archive introduction, archive search path, featured memories, archive context.
- Archive and My entries: clear page introduction, raised search/filter controls, image-led records.
- Detail: large real image, metadata panel, readable memory column, related records.
- Contribute, edit, and auth: archive-paper panels over parchment background.
- Footer: ink-navy archive band with parchment text, gold rule, archive identity, and provenance.

## Rules

- Read archive identity from `collection.config.js`; never hard-code it.
- Preserve existing data behavior, auth, validation, ownership, review state, and bilingual content.
- Never alter Khmer text, force its case, or apply condensed English display styles to it.
- Do not add dependencies, copied reference assets, fake social proof, university terms, or unsupported statistics.
- Keep visible keyboard focus, explicit form labels, useful image alt text, and reduced-motion support.