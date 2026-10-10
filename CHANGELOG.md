# Changelog

## [2.1.0] — 2026-10-10 (2026-10-10)

- `fromTemplate(text, { values, blocks })`: emails a seller writes as plain text with `{placeholders}`: paragraphs, `# heading`, `> note`, `---`, `**bold**`, `[link](url)`, values filled (escaped where they land), and a line of only `{name}` replaced by blocks (a list of downloads, a button). Unknown placeholders are left as written.
- `placeholdersIn`, `fillPlaceholders`.

## [2.0.0] — 2026-10-09

A new design, replacing 1.0.0's ready-made templates (never published to
npm; still in this repository's history). Emails are now described as
blocks and rendered to HTML and plain text together.

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
