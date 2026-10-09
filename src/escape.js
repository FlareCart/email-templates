/**
 * Escaping for the two places a value lands in an email: text and
 * attributes (including links).
 *
 * @module escape
 */

/** Characters that mean something in HTML, and their entities. */
const ENTITIES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/**
 * Text or an attribute value, safe to put in HTML.
 *
 * @param {unknown} value Any value; `null` and `undefined` become ''.
 * @returns {string} The escaped text.
 * @example
 * escapeHtml('Tom & "Jerry"'); // 'Tom &amp; &quot;Jerry&quot;'
 */
export function escapeHtml(value) {
	return String(value ?? '').replace(/[&<>"']/g, (c) => ENTITIES[/** @type {keyof typeof ENTITIES} */ (c)]);
}

/**
 * A URL safe to link to: http, https or mailto only, no control
 * characters. Webmail is a browser, so a `javascript:` link in an email is
 * a real risk in exactly the clients you can't audit.
 *
 * @param {unknown} url The URL.
 * @returns {string} The URL, escaped for an attribute, or '' when it isn't safe.
 */
export function safeUrl(url) {
	const text = String(url ?? '').trim();
	if (!text || /[\x00-\x1F\x7F]/.test(text)) return '';
	const scheme = /^([a-z][a-z0-9+.-]*):/i.exec(text)?.[1]?.toLowerCase();
	return scheme === 'http' || scheme === 'https' || scheme === 'mailto' ? escapeHtml(text) : '';
}
