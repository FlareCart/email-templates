# @arraypress/email-templates

Transactional emails that render in every client: describe the email as a list of blocks, get back a complete HTML document and its plain-text twin. Every value is escaped where it lands, an unsafe link is left out rather than printed, and nothing in the markup needs a CSS feature Outlook lacks. Zero dependencies.

The JavaScript twin of [`sugarcommerce/email-templates`](https://github.com/sugarcommerce/email-templates), without its operator-edited `{{tag}}` bodies: here the code describes the email.

## Why

Most broken transactional email comes from HTML concatenated at the call site: a receipt built from a template string, then a password reset copied from it, each slightly different, none tested, and a customer's name interpolated unescaped. And every one needs a plain-text part that somebody forgets to keep in step.

Here an email is data: a branding and a list of blocks. The HTML and the text come from the same description, so they can't drift, and escaping is the renderer's job, not each call site's.

## Features

- 🧱 **Blocks, not markup.** Heading, paragraph, note, button, links, details, codes, divider.
- 📄 **HTML and text from one description.** The text part keeps every link's target as `text (url)`.
- 🔒 **Escaped where it lands.** Text and attributes alike; links only to http, https and mailto. The accent colour must be `#rrggbb`, because it's interpolated into `style`.
- 📬 **Renders everywhere.** Table layout, inline styles, a button that's a table cell (Word-rendered Outlook drops padding on links), a hidden preheader.
- 🎨 **Light and dark, card and plain.** Every colour from a palette, every size from a theme you can override.

## Install

```bash
npm install @arraypress/email-templates
```

## Usage

```js
import { renderEmail } from '@arraypress/email-templates';

const { html, text } = renderEmail({
	branding: { name: 'Wave Shop', accent: '#635bff', footer: 'You bought from Wave Shop.' },
	subject: 'Your downloads from Wave Shop',
	preheader: 'Your files are ready',
	blocks: [
		{ type: 'heading', text: 'Thanks for your order' },
		{ type: 'paragraph', text: 'Here are your files. Each can be downloaded 10 times.' },
		{ type: 'links', title: 'Night Shift', subtitle: 'Studio', items: [{ label: 'Night Shift.zip', url, note: '84 MB' }] },
		{ type: 'note', text: ['Order ', { text: 'ord_42', strong: true }, '. Lost this email? Ask again on ', { text: 'our site', url: shopUrl }, '.'] },
	],
});
```

Send it with [`@arraypress/mailer`](https://github.com/arraypress/mailer):

```js
await mailer.send({ to: buyer, subject: 'Your downloads from Wave Shop', html, text });
```

## API

### `renderEmail(input)` → `{ html, text }`

| Field | |
|---|---|
| `branding` | `{ name, accent?, logoUrl?, footer?, address? }`. The logo shows instead of the name when it's a safe URL. |
| `blocks` | The content, top to bottom (below). |
| `subject` | The document's `<title>`. |
| `preheader` | The preview line inboxes show after the subject. |
| `layout` | `card` (a bordered card on a tinted page; default) or `plain` (no container: reads as personal, good for security mail). |
| `dark` | The dark palette, for every reader. Mail clients' `prefers-color-scheme` support is too patchy to rely on. |
| `theme` | Overrides for `font`, `monoFont`, `width`, `fontSize`, `smallSize`, `lineHeight`, `padding`, `radius`, `buttonRadius`. |
| `lang` | Defaults to `en`. |

Throws a `TypeError` for an accent that isn't `#rrggbb`, or an unknown block.

### Blocks

| Block | |
|---|---|
| `{ type: 'heading', text }` | |
| `{ type: 'paragraph', text }` | `text` is a string, or inline parts: strings and `{ text, url?, strong? }`. |
| `{ type: 'note', text }` | Small and muted: an order number, "didn't ask for this?". |
| `{ type: 'button', label, url }` | Left out of both parts when the URL isn't safe. |
| `{ type: 'links', title?, subtitle?, items, empty? }` | `items` are `{ label, url, note? }`; `empty` shows when there are none. |
| `{ type: 'details', rows }` | `[label, value]` pairs. |
| `{ type: 'codes', items }` | `{ label?, code }`, monospaced in a panel: licence keys. |
| `{ type: 'divider' }` | |

### Helpers

`escapeHtml(value)`, `safeUrl(url)`, `assertAccent(hex)`, `accentForeground(hex)` (`#ffffff` or `#111111`, by luma), `lightPalette(accent)`, `darkPalette(accent)`, `styleOf(input)`, `blockHtml(block, style)`, `blockText(block)`, `DEFAULT_THEME`.

## Testing

```bash
npm test
```

12 tests: escaping in text and attributes, unsafe links and logos, accent validation, the dark palette, the document's structure, and the exact plain-text output.

## License

MIT
