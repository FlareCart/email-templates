/**
 * @arraypress/email-templates
 *
 * Modern HTML email templates and components for transactional emails.
 * Pure functions that return HTML strings. Zero dependencies.
 *
 * Works in Node.js, Cloudflare Workers, Deno, Bun, and browsers.
 *
 * @module @arraypress/email-templates
 */

import * as templates from './templates/index.js';
import * as components from './components/index.js';

// ── Template Registry ───────────────────────

const TEMPLATES = {
  clean: templates.clean,
  branded: templates.branded,
  minimal: templates.minimal,
};

// ── Render ──────────────────────────────────

/**
 * Render an email template with content and replacements.
 *
 * @param {string} template - Template name: 'clean', 'branded', or 'minimal'.
 * @param {Object} options
 * @param {string} [options.title=''] - Email title / heading.
 * @param {string} [options.subtitle=''] - Subtitle below the heading.
 * @param {string} [options.content=''] - Main email body (HTML string with {placeholders}).
 * @param {string} [options.footer=''] - Footer content.
 * @param {string} [options.logo=''] - Logo HTML (e.g. an <img> tag).
 * @param {Object} [options.colors] - Color overrides.
 * @param {string} [options.colors.primary='#18181b'] - Primary/accent color.
 * @param {Object} [options.replacements={}] - Key-value pairs for {placeholder} replacement.
 * @returns {string} Complete HTML email document.
 *
 * @example
 * import { render, components } from '@arraypress/email-templates';
 *
 * const html = render('clean', {
 *   title: 'Order Confirmed',
 *   subtitle: 'Order #1234',
 *   content: `
 *     <p>Hi {customer_name},</p>
 *     <p>Thanks for your purchase!</p>
 *     {order_items}
 *     {download_button}
 *   `,
 *   footer: '© 2026 My Store',
 *   colors: { primary: '#06d6a0' },
 *   replacements: {
 *     customer_name: 'David',
 *     order_items: components.orderItems({ items: [...], currency: 'usd' }),
 *     download_button: components.button({ text: 'Download', url: 'https://...' }),
 *   },
 * });
 */
export function render(template, options = {}) {
  const {
    title = '',
    subtitle = '',
    content = '',
    footer = '',
    logo = '',
    colors = {},
    replacements = {},
  } = options;

  // Get template HTML
  let html = TEMPLATES[template];
  if (!html) {
    throw new Error(`Unknown template: "${template}". Available: ${Object.keys(TEMPLATES).join(', ')}`);
  }

  // Pass 1: Replace template structure placeholders
  const structureReplacements = {
    title,
    subtitle,
    content,
    footer,
    logo,
    color_primary: colors.primary || '#18181b',
  };

  html = html.replace(/\{(\w+)\}/g, (match, key) => {
    if (key in structureReplacements) {
      return String(structureReplacements[key]);
    }
    return match;
  });

  // Pass 2: Replace user content placeholders (inside content, title, etc.)
  if (Object.keys(replacements).length > 0) {
    html = html.replace(/\{(\w+)\}/g, (match, key) => {
      if (key in replacements) {
        return String(replacements[key]);
      }
      return match;
    });
  }

  return html;
}

/**
 * Get available template names.
 *
 * @returns {string[]} Template names.
 */
export function getTemplateNames() {
  return Object.keys(TEMPLATES);
}

/**
 * Register a custom template.
 *
 * @param {string} name - Template name.
 * @param {string} html - Template HTML with {placeholders}.
 */
export function registerTemplate(name, html) {
  TEMPLATES[name] = html;
}

// ── Re-export components ────────────────────

export { components };

// Named exports for direct import
export {
  button,
  alert,
  orderItems,
  downloadsList,
  licenseKey,
  keyValue,
  divider,
  spacer,
} from './components/index.js';
