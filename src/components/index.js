/**
 * Email Components
 *
 * Pure functions that return HTML strings for use in email templates.
 * All components use inline styles for maximum email client compatibility.
 */

// ── Styles ──────────────────────────────────

const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const MONO = "ui-monospace,SFMono-Regular,'SF Mono',Menlo,Consolas,monospace";
const MUTED = '#71717a';
const BORDER = '#e4e4e7';
const TEXT = '#3f3f46';
const HEADING = '#18181b';

// ── Helpers ─────────────────────────────────

function esc(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function numberFormat(num, decimals) {
  const fixed = num.toFixed(decimals);
  const [intPart, decPart] = fixed.split('.');
  const withCommas = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return decPart !== undefined ? withCommas + '.' + decPart : withCommas;
}

/**
 * Simple currency formatter for components.
 * If you have @arraypress/stripe-currencies, use that instead
 * and pass pre-formatted strings.
 */
function formatAmount(amount, currency = 'usd', decimals = 2) {
  const symbols = {
    usd: 'US$', eur: '€', gbp: '£', jpy: '¥', cad: 'C$', aud: 'A$',
    chf: 'CHF', sek: 'kr', dkk: 'kr', nok: 'kr', nzd: 'NZ$', sgd: 'S$',
    hkd: 'HK$', krw: '₩', inr: '₹', brl: 'R$', mxn: '$', thb: '฿',
  };
  const zeroDecimal = ['jpy', 'krw', 'vnd', 'clp', 'pyg'];
  const c = currency.toLowerCase();
  const symbol = symbols[c] || currency.toUpperCase() + ' ';
  const dec = zeroDecimal.includes(c) ? 0 : decimals;
  const value = dec === 0 ? amount : amount / Math.pow(10, dec);
  return symbol + numberFormat(Math.abs(value), dec);
}

// ── Components ──────────────────────────────

/**
 * Call-to-action button.
 *
 * @param {Object} options
 * @param {string} options.text - Button label.
 * @param {string} options.url - Button URL.
 * @param {string} [options.color='#18181b'] - Background color.
 * @param {string} [options.textColor='#ffffff'] - Text color.
 * @param {string} [options.align='left'] - Alignment: left, center, right.
 * @returns {string} HTML string.
 */
export function button({ text, url, color = '#18181b', textColor = '#ffffff', align = 'left' } = {}) {
  if (!text || !url) return '';
  const alignment = align === 'center' ? 'center' : align === 'right' ? 'right' : 'left';
  return `<div style="text-align:${alignment};margin:28px 0;">
<a href="${esc(url)}" style="display:inline-block;background:${esc(color)};color:${esc(textColor)};padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:600;font-size:14px;font-family:${FONT};">${esc(text)}</a>
</div>`;
}

/**
 * Alert / notice box.
 *
 * @param {Object} options
 * @param {string} options.message - Alert message.
 * @param {string} [options.type='info'] - Type: info, success, warning, error.
 * @returns {string} HTML string.
 */
export function alert({ message, type = 'info' } = {}) {
  if (!message) return '';
  const colors = {
    info: '#3b82f6',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
  };
  const bgColors = {
    info: '#eff6ff',
    success: '#f0fdf4',
    warning: '#fffbeb',
    error: '#fef2f2',
  };
  const c = colors[type] || colors.info;
  const bg = bgColors[type] || bgColors.info;
  return `<div style="background:${bg};border-left:4px solid ${c};padding:14px 16px;margin:24px 0;border-radius:0 4px 4px 0;font-size:14px;line-height:1.6;color:${TEXT};">${esc(message)}</div>`;
}

/**
 * Order items table with totals.
 *
 * Accepts amounts in smallest unit (cents) as Stripe returns them.
 * For pre-formatted prices, set item.priceFormatted and item.totalFormatted.
 *
 * @param {Object} options
 * @param {Array} options.items - Line items: { name, quantity?, price, priceFormatted?, totalFormatted? }
 * @param {string} [options.currency='usd'] - Currency code for formatting.
 * @param {number} [options.tax] - Tax in smallest unit.
 * @param {number} [options.discount] - Discount in smallest unit.
 * @param {number} [options.shipping] - Shipping in smallest unit.
 * @param {number} [options.total] - Override total (auto-calculated if omitted).
 * @param {string} [options.taxFormatted] - Pre-formatted tax string.
 * @param {string} [options.discountFormatted] - Pre-formatted discount string.
 * @param {string} [options.shippingFormatted] - Pre-formatted shipping string.
 * @param {string} [options.totalFormatted] - Pre-formatted total string.
 * @returns {string} HTML string.
 */
export function orderItems({ items = [], currency = 'usd', tax, discount, shipping, total, taxFormatted, discountFormatted, shippingFormatted, totalFormatted } = {}) {
  if (!items.length) return '';

  const fmt = (amount) => formatAmount(amount, currency);
  let subtotal = 0;

  // Auto-detect layout:
  // - Simple: all qty 1 → just "Item | Amount" (no qty, no separate price column)
  // - Full: any qty > 1 → "Item | Qty | Price | Total"
  const showQty = items.some((item) => (item.quantity || 1) > 1);
  const simple = !showQty;
  const cols = simple ? 2 : 4;
  const summaryCols = cols - 1;

  let html = `<table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;font-size:14px;border-collapse:collapse;">`;

  // Header
  html += `<tr style="border-bottom:2px solid ${BORDER};">
<td style="padding:10px 0;font-weight:600;color:${HEADING};">Item</td>`;
  if (!simple) {
    html += `<td style="padding:10px 0;text-align:center;font-weight:600;color:${HEADING};width:50px;">Qty</td>`;
    html += `<td style="padding:10px 0;text-align:right;font-weight:600;color:${HEADING};width:90px;">Price</td>`;
  }
  html += `<td style="padding:10px 0;text-align:right;font-weight:600;color:${HEADING};width:90px;">${simple ? 'Amount' : 'Total'}</td>
</tr>`;

  // Items
  for (const item of items) {
    const qty = item.quantity || 1;
    const lineTotal = qty * (item.price || 0);
    subtotal += lineTotal;

    const priceStr = item.priceFormatted || fmt(item.price || 0);
    const totalStr = item.totalFormatted || fmt(lineTotal);

    html += `<tr style="border-bottom:1px solid #f4f4f5;">
<td style="padding:12px 0;color:${TEXT};">${esc(item.name)}</td>`;
    if (!simple) {
      html += `<td style="padding:12px 0;text-align:center;color:${MUTED};">${qty}</td>`;
      html += `<td style="padding:12px 0;text-align:right;color:${MUTED};font-family:${MONO};font-size:13px;">${priceStr}</td>`;
    }
    html += `<td style="padding:12px 0;text-align:right;color:${HEADING};font-weight:500;font-family:${MONO};font-size:13px;">${totalStr}</td>
</tr>`;
  }

  // Summary rows
  const summaryRow = (label, value, style = '') =>
    `<tr><td colspan="${summaryCols}" style="padding:6px 0;text-align:right;color:${MUTED};font-size:13px;">${esc(label)}</td>
<td style="padding:6px 0;text-align:right;color:${TEXT};font-family:${MONO};font-size:13px;${style}">${value}</td></tr>`;

  html += summaryRow('Subtotal', fmt(subtotal));

  let runningTotal = subtotal;

  if (discount && discount > 0) {
    html += summaryRow('Discount', `−${discountFormatted || fmt(discount)}`, 'color:#10b981;');
    runningTotal -= discount;
  }
  if (shipping && shipping > 0) {
    html += summaryRow('Shipping', shippingFormatted || fmt(shipping));
    runningTotal += shipping;
  }
  if (tax && tax > 0) {
    html += summaryRow('Tax', taxFormatted || fmt(tax));
    runningTotal += tax;
  }

  const finalTotal = total !== undefined ? total : runningTotal;
  const finalTotalStr = totalFormatted || fmt(finalTotal);

  html += `<tr style="border-top:2px solid ${BORDER};">
<td colspan="${summaryCols}" style="padding:14px 0 8px;text-align:right;font-weight:700;color:${HEADING};font-size:15px;">Total</td>
<td style="padding:14px 0 8px;text-align:right;font-weight:700;color:${HEADING};font-family:${MONO};font-size:15px;">${finalTotalStr}</td>
</tr>`;

  html += '</table>';
  return html;
}

/**
 * Downloads list grouped by product, with optional license keys and notes.
 *
 * @param {Object} options
 * @param {Array} options.products - Products: { name, files: [{ name, url, size? }], licenseKey?, note? }
 * @param {string} [options.title] - Section title.
 * @returns {string} HTML string.
 *
 * Also supports flat file list for backwards compatibility:
 * @param {Array} options.files - Files: { name, url, size? }
 */
export function downloadsList({ products, files, title } = {}) {
  // Backwards compat: flat files array → single unnamed product
  if (!products && files && files.length) {
    products = [{ name: '', files }];
  }
  if (!products || !products.length) return '';

  // Filter out products with no files
  const validProducts = products.filter((p) => p.files && p.files.length > 0);
  if (!validProducts.length) return '';

  let html = '<div style="margin:24px 0;">';

  if (title) {
    html += `<div style="font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;color:${MUTED};margin-bottom:12px;">${esc(title)}</div>`;
  }

  validProducts.forEach((product, pi) => {
    const isLast = pi === validProducts.length - 1;
    const marginBottom = isLast ? '' : 'margin-bottom:10px;';

    html += `<div style="background:#fafafa;border:1px solid ${BORDER};border-radius:6px;overflow:hidden;${marginBottom}">`;

    // Product name header (skip if empty — flat file list)
    if (product.name) {
      html += `<div style="padding:12px 16px;border-bottom:1px solid ${BORDER};background:#f4f4f5;">
<span style="font-size:14px;font-weight:600;color:${HEADING};">${esc(product.name)}</span>
</div>`;
    }

    // Files
    product.files.forEach((file, fi) => {
      const hasMore = product.licenseKey || product.note || fi < product.files.length - 1;
      const borderBottom = hasMore ? `border-bottom:1px solid ${BORDER};` : '';
      const sizeStr = file.size ? `<span style="color:${MUTED};font-size:12px;font-family:${MONO};margin-left:8px;">${esc(file.size)}</span>` : '';

      html += `<div style="padding:10px 16px;${borderBottom}">
<a href="${esc(file.url)}" style="color:#2563eb;text-decoration:none;font-size:14px;font-weight:500;">${esc(file.name)}</a>${sizeStr}
</div>`;
    });

    // License key (inline, not centered)
    if (product.licenseKey) {
      const hasNote = !!product.note;
      const borderBottom = hasNote ? `border-bottom:1px solid ${BORDER};` : '';
      html += `<div style="padding:10px 16px;${borderBottom}">
<span style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;color:${MUTED};">License Key</span>
<div style="margin-top:4px;font-family:${MONO};font-size:13px;font-weight:600;letter-spacing:0.5px;color:${HEADING};">${esc(product.licenseKey)}</div>
</div>`;
    }

    // Note
    if (product.note) {
      html += `<div style="padding:10px 16px;background:#f9fafb;">
<span style="font-size:13px;color:${MUTED};line-height:1.5;">${esc(product.note)}</span>
</div>`;
    }

    html += '</div>';
  });

  html += '</div>';
  return html;
}

/**
 * License key display.
 *
 * @param {Object} options
 * @param {string} options.key - License key string.
 * @param {string} [options.label] - Label above the key.
 * @returns {string} HTML string.
 */
export function licenseKey({ key, label } = {}) {
  if (!key) return '';

  let html = '<div style="margin:24px 0;text-align:center;">';

  if (label) {
    html += `<div style="font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;color:${MUTED};margin-bottom:10px;">${esc(label)}</div>`;
  }

  html += `<div style="display:inline-block;background:#fafafa;border:2px dashed #d4d4d8;border-radius:6px;padding:14px 24px;font-family:${MONO};font-size:16px;font-weight:600;letter-spacing:1px;color:${HEADING};">${esc(key)}</div>`;
  html += '</div>';
  return html;
}

/**
 * Key-value pairs list.
 *
 * @param {Object} options
 * @param {Object} options.items - Object of label:value pairs.
 * @param {string} [options.title] - Section title.
 * @returns {string} HTML string.
 */
export function keyValue({ items = {}, title } = {}) {
  const entries = Object.entries(items);
  if (!entries.length) return '';

  let html = '<div style="margin:24px 0;">';

  if (title) {
    html += `<div style="font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;color:${MUTED};margin-bottom:12px;">${esc(title)}</div>`;
  }

  for (const [key, value] of entries) {
    html += `<div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #f4f4f5;">
<span style="color:${MUTED};font-size:14px;">${esc(key)}</span>
<span style="color:${HEADING};font-size:14px;font-weight:500;">${esc(String(value))}</span>
</div>`;
  }

  html += '</div>';
  return html;
}

/**
 * Horizontal divider.
 *
 * @returns {string} HTML string.
 */
export function divider() {
  return `<hr style="border:0;border-top:1px solid ${BORDER};margin:28px 0;">`;
}

/**
 * Vertical spacer.
 *
 * @param {Object} [options]
 * @param {number} [options.height=24] - Height in pixels.
 * @returns {string} HTML string.
 */
export function spacer({ height = 24 } = {}) {
  return `<div style="height:${height}px;font-size:0;line-height:0;">&nbsp;</div>`;
}
