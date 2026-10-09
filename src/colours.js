/**
 * Colours: the brand's accent, the text that reads on it, and the light
 * and dark palettes every block draws from.
 *
 * @module colours
 */

/**
 * @typedef {object} Palette
 * @property {string} text
 * @property {string} muted
 * @property {string} border
 * @property {string} surface Panels inside the card (codes, details).
 * @property {string} card
 * @property {string} background The page around the card.
 * @property {string} accent
 * @property {string} accentText Text on the accent.
 */

/** A six-digit hex colour. */
const HEX = /^#[0-9a-f]{6}$/i;

/**
 * Check an accent colour. It's interpolated into `style` attributes, so
 * anything but `#rrggbb` is refused rather than trusted.
 *
 * @param {string} accent e.g. `#635bff`.
 * @returns {string} The accent, lower case.
 * @throws {TypeError} For anything that isn't a six-digit hex colour.
 */
export function assertAccent(accent) {
	if (typeof accent !== 'string' || !HEX.test(accent)) throw new TypeError('The accent must be a six-digit hex colour, e.g. #635bff.');
	return accent.toLowerCase();
}

/**
 * A readable colour on top of the accent, by ITU-R BT.601 luma (green
 * weighted most, as the eye is most sensitive to it; a flat average puts
 * white on yellow).
 *
 * @param {string} accent A six-digit hex colour.
 * @returns {'#ffffff' | '#111111'} The text colour.
 */
export function accentForeground(accent) {
	const [red, green, blue] = [1, 3, 5].map((at) => parseInt(accent.slice(at, at + 2), 16));
	return (red * 299 + green * 587 + blue * 114) / 1000 > 150 ? '#111111' : '#ffffff';
}

/**
 * The light palette (the default).
 *
 * @param {string} accent The brand's accent.
 * @returns {Palette} The palette.
 */
export function lightPalette(accent) {
	return { text: '#1a1f36', muted: '#697386', border: '#e3e8ee', surface: '#f6f8fa', card: '#ffffff', background: '#f6f7f9', accent, accentText: accentForeground(accent) };
}

/**
 * The dark palette: dark for every reader, not a response to their system
 * theme, because `prefers-color-scheme` support across mail clients is too
 * patchy to rely on, and a half-applied dark mode is worse than none.
 *
 * @param {string} accent The brand's accent.
 * @returns {Palette} The palette.
 */
export function darkPalette(accent) {
	return { text: '#e6e9ef', muted: '#98a1b3', border: '#2a303c', surface: '#1f2430', card: '#171b23', background: '#0f1218', accent, accentText: accentForeground(accent) };
}
