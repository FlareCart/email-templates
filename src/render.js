/**
 * An email from a description: the branding, the blocks, and which layout
 * frames them, rendered as a complete HTML document and its plain-text
 * twin.
 *
 * @module render
 */

import { blockHtml, blockText } from './blocks.js';
import { assertAccent, darkPalette, lightPalette } from './colours.js';
import { escapeHtml, safeUrl } from './escape.js';
import { DEFAULT_THEME } from './theme.js';

/** @typedef {import('./blocks.js').Block} Block */
/** @typedef {import('./blocks.js').Style} Style */

/**
 * @typedef {object} Branding
 * @property {string} name Who it's from, shown at the top.
 * @property {string} [accent] `#rrggbb`; buttons use it. Defaults to `#1a1f36`.
 * @property {string} [logoUrl] An https image shown instead of the name.
 * @property {string} [footer] A line at the bottom (why they got this).
 * @property {string} [address] A postal address, under the footer.
 */

/**
 * @typedef {object} EmailInput
 * @property {Branding} branding
 * @property {Block[]} blocks The content, top to bottom.
 * @property {string} [subject] The document's title (some clients show it).
 * @property {string} [preheader] The preview line inboxes show after the subject.
 * @property {'card' | 'plain'} [layout] A bordered card on a tinted page (default), or no container (reads as personal: good for security mail).
 * @property {boolean} [dark] The dark palette.
 * @property {Partial<import('./theme.js').Theme>} [theme] Overrides for type, sizes and spacing.
 * @property {string} [lang] The document's language. Defaults to `en`.
 */

/**
 * The palette and theme an email renders with.
 *
 * @param {EmailInput} input The email.
 * @returns {Style} The style.
 * @throws {TypeError} For an accent that isn't a six-digit hex colour.
 */
export function styleOf({ branding, dark = false, theme }) {
	const accent = assertAccent(branding.accent ?? '#1a1f36');
	return { palette: dark ? darkPalette(accent) : lightPalette(accent), theme: { ...DEFAULT_THEME, ...theme } };
}

/**
 * The brand at the top: the logo when there's a safe one, else the name.
 *
 * @param {Branding} branding The branding.
 * @param {Style} style The style.
 * @returns {string} HTML.
 */
function brandHtml({ name, logoUrl }, { palette, theme }) {
	const logo = logoUrl ? safeUrl(logoUrl) : '';
	if (logo) return `<img src="${logo}" alt="${escapeHtml(name)}" height="32" style="display:block;height:32px;width:auto;border:0">`;
	return `<span style="font-size:${theme.fontSize}px;font-weight:600;color:${palette.text}">${escapeHtml(name)}</span>`;
}

/**
 * The footer: the brand's line and address.
 *
 * @param {Branding} branding The branding.
 * @returns {string} HTML, or '' when there's nothing to say.
 */
function footerHtml({ footer, address }) {
	return [footer, address].filter(Boolean).map((line) => escapeHtml(line)).join('<br>');
}

/**
 * The page around the content: a card on a tinted page, or no container.
 *
 * @param {{ content: string, input: EmailInput, style: Style }} parts What goes in it.
 * @returns {string} The whole document.
 */
function documentHtml({ content, input, style }) {
	const { palette, theme } = style;
	const card = (input.layout ?? 'card') === 'card';
	const footer = footerHtml(input.branding);
	const frame = card ? `background:${palette.card};border:1px solid ${palette.border};border-radius:${theme.radius}px;` : '';
	return `<!doctype html>
<html lang="${escapeHtml(input.lang ?? 'en')}">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="x-apple-disable-message-reformatting"><title>${escapeHtml(input.subject ?? '')}</title></head>
<body style="margin:0;padding:0;background:${card ? palette.background : palette.card}">
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;opacity:0">${escapeHtml(input.preheader ?? '')}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${card ? palette.background : palette.card};padding:32px 16px">
<tr><td align="center">
<table role="presentation" width="${theme.width}" cellpadding="0" cellspacing="0" border="0" style="max-width:${theme.width}px;width:100%;${frame}font-family:${theme.font}">
<tr><td style="padding:${theme.padding}px ${theme.padding}px 0">${brandHtml(input.branding, style)}</td></tr>
<tr><td style="padding:20px ${theme.padding}px ${theme.padding}px;color:${palette.text};font-size:${theme.fontSize}px;line-height:${theme.lineHeight}">${content}</td></tr>
${footer ? `<tr><td style="padding:16px ${theme.padding}px;border-top:1px solid ${palette.border};color:${palette.muted};font-size:${theme.smallSize}px;line-height:1.6">${footer}</td></tr>` : ''}
</table>
</td></tr>
</table>
</body>
</html>`;
}

/**
 * Render an email: a complete HTML document and its plain-text twin, from
 * one description.
 *
 * @param {EmailInput} input The email.
 * @returns {{ html: string, text: string }} The two parts.
 * @throws {TypeError} For an accent that isn't a hex colour, or an unknown block.
 * @example
 * renderEmail({
 *   branding: { name: 'Wave Shop', accent: '#635bff' },
 *   preheader: 'Your files are ready',
 *   blocks: [
 *     { type: 'heading', text: 'Thanks for your order' },
 *     { type: 'links', title: 'Prism', items: [{ label: 'Prism.zip', url, note: '84 MB' }] },
 *   ],
 * });
 */
export function renderEmail(input) {
	const style = styleOf(input);
	const content = input.blocks.map((block) => blockHtml(block, style)).join('\n');
	const body = input.blocks.map(blockText).filter(Boolean).join('\n\n');
	const footer = [input.branding.footer, input.branding.address].filter(Boolean).join('\n');
	return { html: documentHtml({ content, input, style }), text: footer ? `${body}\n\n${footer}` : body };
}
