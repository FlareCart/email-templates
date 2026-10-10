/**
 * Emails a seller writes: plain text with `{placeholders}`, made into
 * blocks for {@link renderEmail}. Kept small on purpose; a seller edits it
 * in a text box.
 *
 * - A blank line starts a new paragraph.
 * - `# Heading` is a heading; `> text` is a small note; `---` is a divider.
 * - `**bold**` and `[a link](https://…)` work inside a line.
 * - `{name}` is replaced by the value given for it (escaped where it lands,
 *   like everything else). A line that is only `{name}`, when blocks are
 *   given for that name, becomes those blocks: a list of downloads, a
 *   button.
 * - An unknown `{name}` is left as written, so a typo shows in a preview.
 *
 * @module template
 */

/** @typedef {import('./index.js').Block} Block */
/** @typedef {import('./index.js').Inline} Inline */

/** A placeholder: letters, digits and underscores in braces. */
const PLACEHOLDER = /\{([a-z][a-z0-9_]*)\}/gi;

/**
 * The placeholders a template uses.
 *
 * @param {string} template The template.
 * @returns {string[]} Their names, once each, in order.
 */
export function placeholdersIn(template) {
	return [...new Set([...String(template).matchAll(PLACEHOLDER)].map((m) => m[1]))];
}

/**
 * Text with its placeholders filled in.
 *
 * @param {string} text The text.
 * @param {Record<string, string>} values The values.
 * @returns {string} The text, unknown placeholders left as they are.
 */
export function fillPlaceholders(text, values) {
	return String(text).replace(PLACEHOLDER, (whole, name) => (Object.prototype.hasOwnProperty.call(values, name) ? String(values[name]) : whole));
}

/**
 * A line's inline content: text, `**bold**` and `[links](url)`, with
 * placeholders filled.
 *
 * @param {string} line The line.
 * @param {Record<string, string>} values The values.
 * @returns {Inline[]} The pieces.
 */
function inline(line, values) {
	/** @type {Inline[]} */
	const out = [];
	const pattern = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
	let at = 0;
	for (const match of line.matchAll(pattern)) {
		if (match.index > at) out.push(fillPlaceholders(line.slice(at, match.index), values));
		if (match[1] !== undefined) out.push({ text: fillPlaceholders(match[1], values), strong: true });
		else out.push({ text: fillPlaceholders(match[2], values), url: fillPlaceholders(match[3], values) });
		at = match.index + match[0].length;
	}
	if (at < line.length) out.push(fillPlaceholders(line.slice(at), values));
	return out;
}

/**
 * A template as blocks.
 *
 * @param {string} template What the seller wrote.
 * @param {{ values?: Record<string, string>, blocks?: Record<string, Block[]> }} [fill]
 *   `values`: text for inline placeholders. `blocks`: what a line of only `{name}` becomes.
 * @returns {Block[]} The blocks, for `renderEmail`.
 */
export function fromTemplate(template, { values = {}, blocks = {} } = {}) {
	/** @type {Block[]} */
	const out = [];
	/** @type {string[]} */
	let paragraph = [];
	const flush = () => {
		if (!paragraph.length) return;
		out.push({ type: 'paragraph', text: paragraph.flatMap((line, i) => (i ? [' ', ...inline(line, values)] : inline(line, values))) });
		paragraph = [];
	};
	for (const raw of String(template).replace(/\r\n?/g, '\n').split('\n')) {
		const line = raw.trim();
		const only = /^\{([a-z][a-z0-9_]*)\}$/i.exec(line);
		if (!line) flush();
		else if (only && Object.prototype.hasOwnProperty.call(blocks, only[1])) (flush(), out.push(...blocks[only[1]]));
		else if (line.startsWith('# ')) (flush(), out.push({ type: 'heading', text: fillPlaceholders(line.slice(2).trim(), values) }));
		else if (line.startsWith('> ')) (flush(), out.push({ type: 'note', text: inline(line.slice(2).trim(), values) }));
		else if (/^-{3,}$/.test(line)) (flush(), out.push({ type: 'divider' }));
		else paragraph.push(line);
	}
	flush();
	return out;
}
