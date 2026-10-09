/**
 * The blocks an email is made of, each rendered twice: as table-friendly
 * inline-styled HTML (Outlook on Windows renders through Word, so no
 * flexbox, no grid, and padding only on table cells), and as plain text
 * for the same email's text part.
 *
 * Every value is escaped where it lands; every link goes through
 * `safeUrl`, and a link that isn't safe is left out, never printed.
 *
 * @module blocks
 */

import { escapeHtml, safeUrl } from './escape.js';

/** @typedef {import('./colours.js').Palette} Palette */
/** @typedef {import('./theme.js').Theme} Theme */
/** @typedef {{ palette: Palette, theme: Theme }} Style */

/** @typedef {string | { text: string, url?: string, strong?: boolean }} Inline */
/** @typedef {{ label: string, url: string, note?: string }} LinkItem */

/**
 * @typedef {{ type: 'heading', text: string }
 *   | { type: 'paragraph', text: Inline | Inline[] }
 *   | { type: 'note', text: Inline | Inline[] }
 *   | { type: 'button', label: string, url: string }
 *   | { type: 'links', title?: string, subtitle?: string, items: LinkItem[], empty?: string }
 *   | { type: 'details', rows: [string, string][] }
 *   | { type: 'codes', items: { label?: string, code: string }[] }
 *   | { type: 'divider' }} Block
 */

/**
 * Inline content (text, with links and bold) as HTML.
 *
 * @param {Inline | Inline[]} content The content.
 * @param {Style} style The style.
 * @returns {string} HTML.
 */
function inlineHtml(content, { palette }) {
	return (Array.isArray(content) ? content : [content])
		.map((part) => {
			if (typeof part === 'string') return escapeHtml(part);
			const text = part.strong ? `<strong>${escapeHtml(part.text)}</strong>` : escapeHtml(part.text);
			const url = part.url ? safeUrl(part.url) : '';
			return url ? `<a href="${url}" style="color:${palette.text};font-weight:600">${text}</a>` : text;
		})
		.join('');
}

/**
 * Inline content as plain text: a link keeps its target, as `text (url)`.
 *
 * @param {Inline | Inline[]} content The content.
 * @returns {string} Text.
 */
function inlineText(content) {
	return (Array.isArray(content) ? content : [content])
		.map((part) => (typeof part === 'string' ? part : part.url && safeUrl(part.url) && part.url !== part.text ? `${part.text} (${part.url})` : part.text))
		.join('');
}

/**
 * A list of links as HTML: a title (and muted subtitle) over the list.
 *
 * @param {Extract<Block, { type: 'links' }>} block The block.
 * @param {Style} style The style.
 * @returns {string} HTML.
 */
function linksHtml({ title, subtitle, items, empty }, { palette }) {
	const heading = title ? `<p style="margin:20px 0 4px;font-weight:600">${escapeHtml(title)}${subtitle ? ` <span style="color:${palette.muted};font-weight:400">· ${escapeHtml(subtitle)}</span>` : ''}</p>` : '';
	const rows = items
		.map(({ label, url, note }) => {
			const href = safeUrl(url);
			const text = href ? `<a href="${href}" style="color:${palette.text};font-weight:600">${escapeHtml(label)}</a>` : escapeHtml(label);
			return `<li style="margin:6px 0">${text}${note ? ` <span style="color:${palette.muted}">· ${escapeHtml(note)}</span>` : ''}</li>`;
		})
		.join('');
	return `${heading}<ul style="margin:${title ? 0 : '12px 0'};padding-left:20px">${rows || `<li>${escapeHtml(empty ?? 'Nothing here.')}</li>`}</ul>`;
}

/**
 * A list of links as plain text: each `label: url`, indented under the title.
 *
 * @param {Extract<Block, { type: 'links' }>} block The block.
 * @returns {string} Text.
 */
function linksText({ title, subtitle, items, empty }) {
	const lines = items.map(({ label, url, note }) => `  ${label}${note ? ` (${note})` : ''}: ${url}`);
	return [title ? `${title}${subtitle ? ` (${subtitle})` : ''}` : '', ...(lines.length ? lines : [`  ${empty ?? 'Nothing here.'}`])].filter(Boolean).join('\n');
}

/**
 * Each block type's two renderings.
 *
 * @type {{ [K in Block['type']]: { html: (block: Extract<Block, { type: K }>, style: Style) => string, text: (block: Extract<Block, { type: K }>) => string } }}
 */
export const BLOCKS = {
	heading: {
		html: ({ text }, { theme }) => `<h1 style="margin:0 0 8px;font-size:${theme.fontSize + 5}px;line-height:1.3">${escapeHtml(text)}</h1>`,
		text: ({ text }) => text,
	},
	paragraph: {
		html: ({ text }, style) => `<p style="margin:0 0 12px">${inlineHtml(text, style)}</p>`,
		text: ({ text }) => inlineText(text),
	},
	note: {
		html: ({ text }, style) => `<p style="margin:20px 0 0;color:${style.palette.muted};font-size:${style.theme.smallSize}px">${inlineHtml(text, style)}</p>`,
		text: ({ text }) => inlineText(text),
	},
	button: {
		// A table cell, not a styled <a>: Word-rendered Outlook drops padding on inline elements.
		html: ({ label, url }, { palette, theme }) => {
			const href = safeUrl(url);
			if (!href) return '';
			return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:18px 0"><tr><td style="background:${palette.accent};border-radius:${theme.buttonRadius}px"><a href="${href}" style="display:inline-block;padding:11px 20px;font-size:${theme.fontSize}px;font-weight:600;color:${palette.accentText};text-decoration:none">${escapeHtml(label)}</a></td></tr></table>`;
		},
		text: ({ label, url }) => (safeUrl(url) ? `${label}:\n${url}` : ''),
	},
	links: { html: linksHtml, text: linksText },
	details: {
		html: ({ rows }, { palette }) =>
			`<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:16px 0;border-collapse:collapse">${rows
				.map(([label, value]) => `<tr><td style="padding:6px 0;border-bottom:1px solid ${palette.border};color:${palette.muted}">${escapeHtml(label)}</td><td style="padding:6px 0;border-bottom:1px solid ${palette.border};text-align:right">${escapeHtml(value)}</td></tr>`)
				.join('')}</table>`,
		text: ({ rows }) => rows.map(([label, value]) => `${label}: ${value}`).join('\n'),
	},
	codes: {
		html: ({ items }, { palette, theme }) =>
			items
				.map(({ label, code }) => `<div style="margin:12px 0">${label ? `<p style="margin:0 0 4px;color:${palette.muted};font-size:${theme.smallSize}px">${escapeHtml(label)}</p>` : ''}<p style="margin:0;padding:10px 12px;background:${palette.surface};border:1px solid ${palette.border};border-radius:${theme.buttonRadius}px;font-family:${theme.monoFont};word-break:break-all">${escapeHtml(code)}</p></div>`)
				.join(''),
		text: ({ items }) => items.map(({ label, code }) => (label ? `${label}: ${code}` : code)).join('\n'),
	},
	divider: {
		html: (_block, { palette }) => `<hr style="margin:24px 0;border:0;border-top:1px solid ${palette.border}">`,
		text: () => '———',
	},
};

/**
 * One block as HTML.
 *
 * @param {Block} block The block.
 * @param {Style} style The style.
 * @returns {string} HTML.
 * @throws {TypeError} For an unknown block type.
 */
export function blockHtml(block, style) {
	return renderer(block).html(/** @type {never} */ (block), style);
}

/**
 * One block as plain text.
 *
 * @param {Block} block The block.
 * @returns {string} Text.
 * @throws {TypeError} For an unknown block type.
 */
export function blockText(block) {
	return renderer(block).text(/** @type {never} */ (block));
}

/**
 * A block type's renderers.
 *
 * @param {Block} block The block.
 * @returns {{ html: Function, text: Function }} The renderers.
 * @throws {TypeError} For an unknown block type.
 */
function renderer(block) {
	const found = BLOCKS[/** @type {Block['type']} */ (block?.type)];
	if (!found) throw new TypeError(`Unknown email block: ${String(block?.type)}`);
	return found;
}
