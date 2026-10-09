/**
 * The theme: type, sizes and spacing. Every value a layout or block uses
 * comes from here or the palette; nothing is hardcoded in the markup.
 *
 * @module theme
 */

/**
 * @typedef {object} Theme
 * @property {string} font
 * @property {string} monoFont For codes (licence keys).
 * @property {number} width The card's width, in px.
 * @property {number} fontSize
 * @property {number} smallSize For notes and the footer.
 * @property {string} lineHeight
 * @property {number} padding Inside the card, in px.
 * @property {number} radius The card's corners, in px.
 * @property {number} buttonRadius
 */

/** @type {Readonly<Theme>} */
export const DEFAULT_THEME = Object.freeze({
	font: "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif",
	monoFont: "ui-monospace,SFMono-Regular,Menlo,Consolas,'Liberation Mono',monospace",
	width: 560,
	fontSize: 15,
	smallSize: 13,
	lineHeight: '1.6',
	padding: 28,
	radius: 8,
	buttonRadius: 6,
});
