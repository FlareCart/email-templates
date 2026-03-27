import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  render, getTemplateNames, registerTemplate,
  components, button, alert, orderItems, downloadsList,
  licenseKey, keyValue, divider, spacer,
} from '../src/index.js';

// ── render ──────────────────────────────────

describe('render', () => {
  it('renders clean template', () => {
    const html = render('clean', { title: 'Hello', content: '<p>World</p>' });
    assert.ok(html.includes('Hello'));
    assert.ok(html.includes('<p>World</p>'));
    assert.ok(html.includes('<!DOCTYPE html>'));
  });

  it('renders branded template', () => {
    const html = render('branded', { title: 'Welcome' });
    assert.ok(html.includes('Welcome'));
    assert.ok(html.includes('<!DOCTYPE html>'));
  });

  it('renders minimal template', () => {
    const html = render('minimal', { title: 'Notice' });
    assert.ok(html.includes('Notice'));
  });

  it('replaces title, subtitle, content, footer', () => {
    const html = render('clean', {
      title: 'My Title',
      subtitle: 'My Subtitle',
      content: 'My Content',
      footer: 'My Footer',
    });
    assert.ok(html.includes('My Title'));
    assert.ok(html.includes('My Subtitle'));
    assert.ok(html.includes('My Content'));
    assert.ok(html.includes('My Footer'));
  });

  it('replaces color_primary', () => {
    const html = render('clean', { colors: { primary: '#ff0000' } });
    assert.ok(html.includes('#ff0000'));
  });

  it('uses default color when not specified', () => {
    const html = render('clean', {});
    assert.ok(html.includes('#18181b'));
  });

  it('replaces custom placeholders in content', () => {
    const html = render('clean', {
      content: '<p>Hi {name}, order {order_id}</p>',
      replacements: {
        name: 'David',
        order_id: '#1234',
      },
    });
    assert.ok(html.includes('Hi David'));
    assert.ok(html.includes('order #1234'));
  });

  it('leaves unreplaced placeholders intact', () => {
    const html = render('clean', {
      content: '<p>{known} and {unknown}</p>',
      replacements: { known: 'replaced' },
    });
    assert.ok(html.includes('replaced'));
    assert.ok(html.includes('{unknown}'));
  });

  it('throws on unknown template', () => {
    assert.throws(() => render('nonexistent'), /Unknown template/);
  });

  it('handles empty options', () => {
    const html = render('clean');
    assert.ok(html.includes('<!DOCTYPE html>'));
  });

  it('inserts logo HTML', () => {
    const html = render('clean', { logo: '<img src="logo.png" alt="Logo">' });
    assert.ok(html.includes('logo.png'));
  });

  it('components work as replacements', () => {
    const html = render('clean', {
      content: '{my_button}',
      replacements: {
        my_button: button({ text: 'Click Me', url: 'https://example.com' }),
      },
    });
    assert.ok(html.includes('Click Me'));
    assert.ok(html.includes('https://example.com'));
  });
});

// ── getTemplateNames ────────────────────────

describe('getTemplateNames', () => {
  it('returns all template names', () => {
    const names = getTemplateNames();
    assert.ok(names.includes('clean'));
    assert.ok(names.includes('branded'));
    assert.ok(names.includes('minimal'));
  });
});

// ── registerTemplate ────────────────────────

describe('registerTemplate', () => {
  it('registers and renders a custom template', () => {
    registerTemplate('custom', '<html><body>{title}{content}</body></html>');
    const html = render('custom', { title: 'Test', content: 'Body' });
    assert.ok(html.includes('Test'));
    assert.ok(html.includes('Body'));
  });
});

// ── button ──────────────────────────────────

describe('button', () => {
  it('renders a button', () => {
    const html = button({ text: 'Click', url: 'https://example.com' });
    assert.ok(html.includes('Click'));
    assert.ok(html.includes('https://example.com'));
    assert.ok(html.includes('<a'));
  });

  it('supports custom colors', () => {
    const html = button({ text: 'Go', url: '#', color: '#ff0000', textColor: '#00ff00' });
    assert.ok(html.includes('#ff0000'));
    assert.ok(html.includes('#00ff00'));
  });

  it('supports alignment', () => {
    assert.ok(button({ text: 'Go', url: '#', align: 'center' }).includes('text-align:center'));
    assert.ok(button({ text: 'Go', url: '#', align: 'right' }).includes('text-align:right'));
    assert.ok(button({ text: 'Go', url: '#', align: 'left' }).includes('text-align:left'));
  });

  it('returns empty for missing text', () => {
    assert.equal(button({ url: '#' }), '');
  });

  it('returns empty for missing url', () => {
    assert.equal(button({ text: 'Click' }), '');
  });

  it('escapes HTML in text', () => {
    const html = button({ text: '<script>alert(1)</script>', url: '#' });
    assert.ok(!html.includes('<script>'));
    assert.ok(html.includes('&lt;script&gt;'));
  });
});

// ── alert ───────────────────────────────────

describe('alert', () => {
  it('renders info alert', () => {
    const html = alert({ message: 'Hello' });
    assert.ok(html.includes('Hello'));
    assert.ok(html.includes('#3b82f6')); // info blue
  });

  it('renders all types', () => {
    assert.ok(alert({ message: 'x', type: 'success' }).includes('#10b981'));
    assert.ok(alert({ message: 'x', type: 'warning' }).includes('#f59e0b'));
    assert.ok(alert({ message: 'x', type: 'error' }).includes('#ef4444'));
  });

  it('returns empty for missing message', () => {
    assert.equal(alert({}), '');
  });

  it('escapes HTML in message', () => {
    const html = alert({ message: '<b>bold</b>' });
    assert.ok(html.includes('&lt;b&gt;'));
  });
});

// ── orderItems ──────────────────────────────

describe('orderItems', () => {
  const items = [
    { name: 'Plugin', quantity: 1, price: 9900 },
    { name: 'Support', quantity: 2, price: 4900 },
  ];

  it('renders items table', () => {
    const html = orderItems({ items, currency: 'usd' });
    assert.ok(html.includes('Plugin'));
    assert.ok(html.includes('Support'));
    assert.ok(html.includes('<table'));
  });

  it('shows subtotal', () => {
    const html = orderItems({ items: [{ name: 'X', price: 1000 }], currency: 'usd' });
    assert.ok(html.includes('Subtotal'));
  });

  it('shows tax when provided', () => {
    const html = orderItems({ items, currency: 'usd', tax: 1500 });
    assert.ok(html.includes('Tax'));
  });

  it('shows discount when provided', () => {
    const html = orderItems({ items, currency: 'usd', discount: 500 });
    assert.ok(html.includes('Discount'));
  });

  it('shows shipping when provided', () => {
    const html = orderItems({ items, currency: 'usd', shipping: 1000 });
    assert.ok(html.includes('Shipping'));
  });

  it('shows total row', () => {
    const html = orderItems({ items, currency: 'usd' });
    assert.ok(html.includes('Total'));
  });

  it('returns empty for no items', () => {
    assert.equal(orderItems({ items: [] }), '');
  });

  it('supports pre-formatted prices', () => {
    const html = orderItems({
      items: [{ name: 'X', priceFormatted: '£99.00', totalFormatted: '£99.00' }],
    });
    assert.ok(html.includes('£99.00'));
  });

  it('hides qty and price columns when all items are quantity 1 (simple mode)', () => {
    const html = orderItems({ items: [{ name: 'X', price: 1000 }], currency: 'usd' });
    assert.ok(!html.includes('>Qty<'));
    assert.ok(!html.includes('>Price<'));
    assert.ok(html.includes('>Amount<'));
  });

  it('shows qty and price columns when any item has quantity > 1', () => {
    const html = orderItems({ items: [{ name: 'X', price: 1000, quantity: 3 }], currency: 'usd' });
    assert.ok(html.includes('>Qty<'));
    assert.ok(html.includes('>Price<'));
    assert.ok(html.includes('>Total<'));
    assert.ok(html.includes('>3<'));
  });

  it('escapes item names', () => {
    const html = orderItems({ items: [{ name: '<script>', price: 100 }] });
    assert.ok(html.includes('&lt;script&gt;'));
  });
});

// ── downloadsList ───────────────────────────

describe('downloadsList', () => {
  const files = [
    { name: 'plugin.zip', url: 'https://dl.example.com/plugin.zip', size: '4.7 MB' },
    { name: 'docs.pdf', url: 'https://dl.example.com/docs.pdf', size: '1.2 MB' },
  ];

  it('renders flat file list (backwards compat)', () => {
    const html = downloadsList({ files });
    assert.ok(html.includes('plugin.zip'));
    assert.ok(html.includes('docs.pdf'));
    assert.ok(html.includes('4.7 MB'));
  });

  it('includes download links', () => {
    const html = downloadsList({ files });
    assert.ok(html.includes('https://dl.example.com/plugin.zip'));
  });

  it('supports title', () => {
    const html = downloadsList({ files, title: 'Your Downloads' });
    assert.ok(html.includes('Your Downloads'));
  });

  it('returns empty for no files and no products', () => {
    assert.equal(downloadsList({ files: [] }), '');
    assert.equal(downloadsList({ products: [] }), '');
    assert.equal(downloadsList({}), '');
  });

  it('handles files without size', () => {
    const html = downloadsList({ files: [{ name: 'f.zip', url: '#' }] });
    assert.ok(html.includes('f.zip'));
  });

  it('renders product-grouped downloads', () => {
    const html = downloadsList({
      products: [
        { name: 'Plugin', files: [{ name: 'plugin.zip', url: '#', size: '4 MB' }] },
        { name: 'Theme', files: [{ name: 'theme.zip', url: '#', size: '2 MB' }] },
      ],
    });
    assert.ok(html.includes('Plugin'));
    assert.ok(html.includes('Theme'));
    assert.ok(html.includes('plugin.zip'));
    assert.ok(html.includes('theme.zip'));
  });

  it('shows license key per product', () => {
    const html = downloadsList({
      products: [
        { name: 'Plugin', files: [{ name: 'p.zip', url: '#' }], licenseKey: 'ABCD-1234' },
      ],
    });
    assert.ok(html.includes('ABCD-1234'));
    assert.ok(html.includes('License Key'));
  });

  it('shows note per product', () => {
    const html = downloadsList({
      products: [
        { name: 'Presets', files: [{ name: 'p.zip', url: '#' }], note: 'Requires Serum 2.0' },
      ],
    });
    assert.ok(html.includes('Requires Serum 2.0'));
  });

  it('shows license key and note together', () => {
    const html = downloadsList({
      products: [
        {
          name: 'Plugin',
          files: [{ name: 'p.zip', url: '#' }],
          licenseKey: 'XXXX-YYYY',
          note: 'Extract to plugins folder',
        },
      ],
    });
    assert.ok(html.includes('XXXX-YYYY'));
    assert.ok(html.includes('Extract to plugins folder'));
  });

  it('handles products without license key or note', () => {
    const html = downloadsList({
      products: [
        { name: 'Simple', files: [{ name: 'file.zip', url: '#' }] },
      ],
    });
    assert.ok(html.includes('Simple'));
    assert.ok(html.includes('file.zip'));
    assert.ok(!html.includes('License Key'));
  });

  it('skips products with no files', () => {
    const html = downloadsList({
      products: [
        { name: 'Empty', files: [] },
        { name: 'Real', files: [{ name: 'f.zip', url: '#' }] },
      ],
    });
    assert.ok(!html.includes('Empty'));
    assert.ok(html.includes('Real'));
  });
});

// ── licenseKey ──────────────────────────────

describe('licenseKey', () => {
  it('renders key', () => {
    const html = licenseKey({ key: 'ABCD-1234-EFGH-5678' });
    assert.ok(html.includes('ABCD-1234-EFGH-5678'));
  });

  it('uses monospace font', () => {
    const html = licenseKey({ key: 'XXX' });
    assert.ok(html.includes('monospace'));
  });

  it('supports label', () => {
    const html = licenseKey({ key: 'XXX', label: 'Your License' });
    assert.ok(html.includes('Your License'));
  });

  it('returns empty for no key', () => {
    assert.equal(licenseKey({}), '');
  });

  it('escapes HTML in key', () => {
    const html = licenseKey({ key: '<script>' });
    assert.ok(html.includes('&lt;script&gt;'));
  });
});

// ── keyValue ────────────────────────────────

describe('keyValue', () => {
  it('renders key-value pairs', () => {
    const html = keyValue({ items: { 'Order': '#1234', 'Status': 'Complete' } });
    assert.ok(html.includes('Order'));
    assert.ok(html.includes('#1234'));
    assert.ok(html.includes('Status'));
    assert.ok(html.includes('Complete'));
  });

  it('supports title', () => {
    const html = keyValue({ items: { a: 'b' }, title: 'Details' });
    assert.ok(html.includes('Details'));
  });

  it('returns empty for empty items', () => {
    assert.equal(keyValue({ items: {} }), '');
  });

  it('handles numeric values', () => {
    const html = keyValue({ items: { 'Count': 42 } });
    assert.ok(html.includes('42'));
  });
});

// ── divider ─────────────────────────────────

describe('divider', () => {
  it('renders hr', () => {
    const html = divider();
    assert.ok(html.includes('<hr'));
    assert.ok(html.includes('border-top'));
  });
});

// ── spacer ──────────────────────────────────

describe('spacer', () => {
  it('renders default height', () => {
    const html = spacer();
    assert.ok(html.includes('24px'));
  });

  it('supports custom height', () => {
    const html = spacer({ height: 40 });
    assert.ok(html.includes('40px'));
  });
});

// ── components namespace ────────────────────

describe('components namespace', () => {
  it('exports all components', () => {
    assert.ok(typeof components.button === 'function');
    assert.ok(typeof components.alert === 'function');
    assert.ok(typeof components.orderItems === 'function');
    assert.ok(typeof components.downloadsList === 'function');
    assert.ok(typeof components.licenseKey === 'function');
    assert.ok(typeof components.keyValue === 'function');
    assert.ok(typeof components.divider === 'function');
    assert.ok(typeof components.spacer === 'function');
  });
});

// ── Integration ─────────────────────────────

describe('integration', () => {
  it('renders a complete order confirmation email', () => {
    const html = render('clean', {
      title: 'Order Confirmed',
      subtitle: 'Order #FC-1234',
      colors: { primary: '#06d6a0' },
      content: `
        <p>Hi {customer_name},</p>
        <p>Thank you for your purchase!</p>
        {order_table}
        {downloads}
        {license}
        {view_order}
      `,
      footer: '© 2026 My Store. All rights reserved.',
      replacements: {
        customer_name: 'David',
        order_table: components.orderItems({
          items: [
            { name: 'Premium Plugin', quantity: 1, price: 9900 },
            { name: 'Support Plan', quantity: 1, price: 4900 },
          ],
          currency: 'usd',
          tax: 1480,
        }),
        downloads: components.downloadsList({
          title: 'Your Downloads',
          products: [
            {
              name: 'Premium Plugin',
              files: [{ name: 'premium-plugin-v3.2.zip', url: 'https://example.com/dl/1', size: '4.7 MB' }],
              licenseKey: 'FA15-328F-84FE-1974-D55D',
              note: 'Extract to wp-content/plugins/',
            },
          ],
        }),
        license: '',
        view_order: components.button({
          text: 'View Order',
          url: 'https://example.com/order/1234',
          color: '#06d6a0',
          align: 'center',
        }),
      },
    });

    assert.ok(html.includes('Order Confirmed'));
    assert.ok(html.includes('Hi David'));
    assert.ok(html.includes('Premium Plugin'));
    assert.ok(html.includes('premium-plugin-v3.2.zip'));
    assert.ok(html.includes('FA15-328F-84FE-1974-D55D'));
    assert.ok(html.includes('View Order'));
    assert.ok(html.includes('#06d6a0'));
    assert.ok(html.includes('© 2026 My Store'));
    assert.ok(html.includes('<!DOCTYPE html>'));
  });

  it('renders a magic link email', () => {
    const html = render('minimal', {
      title: 'Sign In',
      subtitle: 'My Store',
      content: `
        <p>Hi {email},</p>
        <p>Click the button below to sign in. This link expires in 15 minutes.</p>
        {magic_button}
        <p style="color:#a1a1aa;font-size:13px;">If you didn't request this, you can safely ignore this email.</p>
      `,
      replacements: {
        email: 'david@example.com',
        magic_button: components.button({
          text: 'Sign In to My Store',
          url: 'https://example.com/magic?token=abc123',
          align: 'center',
        }),
      },
    });

    assert.ok(html.includes('david@example.com'));
    assert.ok(html.includes('Sign In to My Store'));
    assert.ok(html.includes('token=abc123'));
  });

  it('renders a subscription renewal email', () => {
    const html = render('clean', {
      title: 'Subscription Renewed',
      subtitle: 'Your subscription has been renewed',
      content: `
        <p>Hi {customer_name},</p>
        {alert}
        {details}
        {manage_button}
      `,
      replacements: {
        customer_name: 'Sarah',
        alert: components.alert({ message: 'Your subscription has been renewed for another month.', type: 'success' }),
        details: components.keyValue({
          title: 'Renewal Details',
          items: {
            'Plan': 'Pro Monthly',
            'Amount': '$9.99/mo',
            'Next Renewal': 'April 27, 2026',
            'Payment Method': 'Visa •••• 4242',
          },
        }),
        manage_button: components.button({
          text: 'Manage Subscription',
          url: 'https://example.com/account',
          align: 'center',
        }),
      },
    });

    assert.ok(html.includes('Hi Sarah'));
    assert.ok(html.includes('renewed for another month'));
    assert.ok(html.includes('Pro Monthly'));
    assert.ok(html.includes('$9.99/mo'));
    assert.ok(html.includes('Manage Subscription'));
  });
});
