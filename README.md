# @arraypress/email-templates

Modern HTML email templates and components for transactional emails. Order receipts, download links, license keys, alerts, and more.

Pure functions that return HTML strings. Zero dependencies. Works in Node.js, Cloudflare Workers, Deno, Bun, and browsers.

## Install

```bash
npm install @arraypress/email-templates
```

## Quick Start

```js
import { render, components } from '@arraypress/email-templates';

const html = render('clean', {
  title: 'Order Confirmed',
  subtitle: 'Order #FC-1234',
  colors: { primary: '#06d6a0' },
  content: `
    <p>Hi {customer_name},</p>
    <p>Thank you for your purchase!</p>
    {order_items}
    {downloads}
    {view_order}
  `,
  footer: '© 2026 My Store',
  replacements: {
    customer_name: 'David',
    order_items: components.orderItems({
      items: [
        { name: 'Premium Plugin', quantity: 1, price: 9900 },
        { name: 'Support Plan', quantity: 1, price: 4900 },
      ],
      currency: 'usd',
      tax: 1480,
    }),
    downloads: components.downloadsList({
      title: 'Your Downloads',
      files: [{ name: 'plugin-v3.2.zip', url: 'https://example.com/dl/1', size: '4.7 MB' }],
    }),
    view_order: components.button({
      text: 'View Order',
      url: 'https://example.com/order/1234',
      color: '#06d6a0',
      align: 'center',
    }),
  },
});
```

## Templates

Three built-in templates:

| Template | Best For | Style |
|---|---|---|
| `clean` | Receipts, confirmations | Thin accent bar, white card, Stripe-like |
| `branded` | Welcome emails, announcements | Full-color header with logo |
| `minimal` | Magic links, system notices | Text-focused, no images |

All templates support: `{title}`, `{subtitle}`, `{content}`, `{footer}`, `{logo}`, `{color_primary}`.

### Custom Templates

```js
import { registerTemplate, render } from '@arraypress/email-templates';

registerTemplate('dark', '<html><body style="background:#111;color:#eee;">{title}{content}{footer}</body></html>');

const html = render('dark', { title: 'Hello', content: '<p>World</p>' });
```

## Components

All components are pure functions that return HTML strings. Use them as replacement values or compose them directly.

### `button({ text, url, color?, textColor?, align? })`

```js
import { button } from '@arraypress/email-templates';

button({ text: 'View Order', url: 'https://...', color: '#06d6a0', align: 'center' })
```

### `alert({ message, type? })`

Types: `info`, `success`, `warning`, `error`.

```js
import { alert } from '@arraypress/email-templates';

alert({ message: 'Your subscription has been renewed.', type: 'success' })
```

### `orderItems({ items, currency?, tax?, discount?, shipping?, total? })`

Amounts in smallest unit (cents) as Stripe returns them. Supports pre-formatted prices via `priceFormatted` and `totalFormatted` on items.

```js
import { orderItems } from '@arraypress/email-templates';

orderItems({
  items: [
    { name: 'Plugin', quantity: 1, price: 9900 },
    { name: 'Support', quantity: 1, price: 4900 },
  ],
  currency: 'usd',
  tax: 1480,
  discount: 500,
})
```

### `downloadsList({ files, title? })`

```js
import { downloadsList } from '@arraypress/email-templates';

downloadsList({
  title: 'Your Downloads',
  files: [
    { name: 'plugin.zip', url: 'https://...', size: '4.7 MB' },
    { name: 'docs.pdf', url: 'https://...', size: '1.2 MB' },
  ],
})
```

### `licenseKey({ key, label? })`

```js
import { licenseKey } from '@arraypress/email-templates';

licenseKey({ key: 'FA15-328F-84FE-1974-D55D', label: 'Your License Key' })
```

### `keyValue({ items, title? })`

```js
import { keyValue } from '@arraypress/email-templates';

keyValue({
  title: 'Order Details',
  items: {
    'Order Number': '#FC-1234',
    'Date': 'March 27, 2026',
    'Payment': 'Visa •••• 4242',
    'Status': 'Complete',
  },
})
```

### `divider()`

Horizontal rule.

### `spacer({ height? })`

Vertical gap. Default 24px.

## Usage with @arraypress/email

```js
import { render, components } from '@arraypress/email-templates';
import { send, resend } from '@arraypress/email';

const html = render('clean', {
  title: 'Order Confirmed',
  content: '<p>Hi {name}, thanks for your order!</p>{items}',
  replacements: {
    name: 'David',
    items: components.orderItems({ items: [...], currency: 'usd' }),
  },
});

await send(
  { to: 'customer@example.com', subject: 'Order Confirmed', html },
  resend({ apiKey: 'your-key', from: 'store@example.com' })
);
```

## Usage with @arraypress/stripe-currencies

For precise currency formatting, use `@arraypress/stripe-currencies` and pass pre-formatted strings:

```js
import { format } from '@arraypress/stripe-currencies';
import { orderItems } from '@arraypress/email-templates';

const html = orderItems({
  items: [
    { name: 'Plugin', priceFormatted: format(9900, 'gbp'), totalFormatted: format(9900, 'gbp') },
  ],
  taxFormatted: format(1980, 'gbp'),
  totalFormatted: format(11880, 'gbp'),
});
```

## Replacements

The `replacements` object is a simple string replace. Any `{key}` in your content gets replaced with the corresponding value. Components return HTML strings, so they work as replacement values.

Built-in template placeholders (`{title}`, `{subtitle}`, `{content}`, `{footer}`, `{logo}`, `{color_primary}`) are replaced first, then your custom replacements run on the result.

## License

MIT
