# Changelog

## [1.0.0] — 2026-10-09

### Added

- `renderEmail({ branding, blocks, subject, preheader, layout, dark, theme, lang })`
  → `{ html, text }`: a complete, table-based, inline-styled HTML document
  and its plain-text twin, from one description.
- Blocks: `heading`, `paragraph` and `note` (with inline links and bold),
  `button` (a table cell, so Word-rendered Outlook keeps its padding),
  `links` (a titled list with muted notes: downloads), `details`
  (label–value rows), `codes` (licence keys), `divider`.
- Layouts: `card` (default) and `plain`; light and dark palettes; a theme
  for type, sizes and spacing.
- `escapeHtml()`, `safeUrl()` (http, https and mailto only),
  `assertAccent()`, `accentForeground()`.
