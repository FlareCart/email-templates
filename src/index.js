/**
 * @flarecart/email-templates: transactional emails that render in every
 * client, as HTML and plain text from one description.
 *
 * @module @flarecart/email-templates
 */

export { BLOCKS, blockHtml, blockText } from './blocks.js';
export { accentForeground, assertAccent, darkPalette, lightPalette } from './colours.js';
export { escapeHtml, safeUrl } from './escape.js';
export { renderEmail, styleOf } from './render.js';
export { DEFAULT_THEME } from './theme.js';
