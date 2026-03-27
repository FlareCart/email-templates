/**
 * Preview Generator — generates HTML previews for all templates.
 *
 * Usage: node preview.js
 * Output: previews/*.html
 *
 * Generates:
 *   - Full component showcase for each template (clean, branded, minimal)
 *   - Real-world example emails (order, magic link, renewal, welcome, refund, payment failed)
 */

import { writeFileSync, mkdirSync } from 'fs';
import { render, components } from './src/index.js';

const { button, alert, orderItems, downloadsList, licenseKey, keyValue, divider, spacer } = components;

// ── Component Showcase Content ──────────────

function buildShowcase() {
  return `
<p>Hi David,</p>
<p>This preview showcases every component available in the email templates library. Use these components as replacement values in your email content.</p>

<h3 style="margin:28px 0 12px;font-size:14px;font-weight:600;color:#a1a1aa;text-transform:uppercase;letter-spacing:0.5px;">Alerts</h3>

${alert({ message: 'Your order has been confirmed and your downloads are ready.', type: 'success' })}
${alert({ message: 'Your subscription will renew in 3 days. Update your payment method if needed.', type: 'warning' })}
${alert({ message: 'Payment failed. Please update your billing information.', type: 'error' })}
${alert({ message: 'New features have been added to your account.', type: 'info' })}

${divider()}

<h3 style="margin:0 0 12px;font-size:14px;font-weight:600;color:#a1a1aa;text-transform:uppercase;letter-spacing:0.5px;">Order Items (Qty Hidden)</h3>

${orderItems({
  items: [
    { name: 'Melodic House Sample Pack', quantity: 1, price: 2900 },
    { name: 'Bass Tech Serum Presets', quantity: 1, price: 1900 },
    { name: 'Afro House Drum Kit', quantity: 1, price: 1400 },
  ],
  currency: 'usd',
  tax: 620,
  discount: 500,
})}

<h3 style="margin:0 0 12px;font-size:14px;font-weight:600;color:#a1a1aa;text-transform:uppercase;letter-spacing:0.5px;">Order Items (Qty Shown)</h3>

${orderItems({
  items: [
    { name: 'Custom Development (hours)', quantity: 10, price: 12500 },
    { name: 'Priority Support (months)', quantity: 2, price: 4900 },
  ],
  currency: 'usd',
  tax: 3280,
})}

${divider()}

<h3 style="margin:0 0 12px;font-size:14px;font-weight:600;color:#a1a1aa;text-transform:uppercase;letter-spacing:0.5px;">Key-Value Pairs</h3>

${keyValue({
  title: 'Order Details',
  items: {
    'Order Number': '#FC-2847',
    'Date': 'March 27, 2026',
    'Payment Method': 'Visa •••• 4242',
    'Status': 'Complete',
  },
})}

${divider()}

<h3 style="margin:0 0 12px;font-size:14px;font-weight:600;color:#a1a1aa;text-transform:uppercase;letter-spacing:0.5px;">Downloads (Product Grouped)</h3>

${downloadsList({
  title: 'Your Downloads',
  products: [
    {
      name: 'Melodic House Sample Pack',
      files: [{ name: 'Melodic-House-Pack-v2.1.zip', url: '#', size: '248 MB' }],
      licenseKey: 'FA15-328F-84FE-1974-D55D-A3E4',
      note: 'Compatible with all major DAWs. Drag WAV files into your sampler.',
    },
    {
      name: 'Bass Tech Serum Presets',
      files: [{ name: 'Bass-Tech-Serum-Presets.zip', url: '#', size: '12.4 MB' }],
      licenseKey: 'B7A2-91CF-E3D0-4856-AA12-7F33',
      note: 'Requires Serum 2.0 or later.',
    },
    {
      name: 'Afro House Drum Kit',
      files: [
        { name: 'Afro-House-Drums-WAV.zip', url: '#', size: '89 MB' },
        { name: 'Afro-House-Drums-Ableton.zip', url: '#', size: '102 MB' },
      ],
      note: 'Includes WAV and Ableton Live Rack versions.',
    },
  ],
})}

<h3 style="margin:0 0 12px;font-size:14px;font-weight:600;color:#a1a1aa;text-transform:uppercase;letter-spacing:0.5px;">Downloads (Flat File List)</h3>

${downloadsList({
  files: [
    { name: 'readme.txt', url: '#', size: '2 KB' },
    { name: 'changelog.md', url: '#', size: '8 KB' },
    { name: 'license.txt', url: '#', size: '1 KB' },
  ],
})}

${divider()}

<h3 style="margin:0 0 12px;font-size:14px;font-weight:600;color:#a1a1aa;text-transform:uppercase;letter-spacing:0.5px;">Standalone License Key</h3>

${licenseKey({ key: 'FA15-328F-84FE-1974-D55D-A3E4-5F66-35A3', label: 'Your License Key' })}

${divider()}

<h3 style="margin:0 0 12px;font-size:14px;font-weight:600;color:#a1a1aa;text-transform:uppercase;letter-spacing:0.5px;">Buttons</h3>

${button({ text: 'Primary Button (Left)', url: '#', color: '#18181b' })}
${button({ text: 'Accent Button (Center)', url: '#', color: '#06d6a0', align: 'center' })}
${button({ text: 'Custom Color (Right)', url: '#', color: '#6366f1', align: 'right' })}

${divider()}

<h3 style="margin:0 0 4px;font-size:14px;font-weight:600;color:#a1a1aa;text-transform:uppercase;letter-spacing:0.5px;">Spacer (8px)</h3>
${spacer({ height: 8 })}
<p style="color:#a1a1aa;font-size:13px;margin:0;">Content after 8px spacer.</p>

<h3 style="margin:20px 0 4px;font-size:14px;font-weight:600;color:#a1a1aa;text-transform:uppercase;letter-spacing:0.5px;">Spacer (40px)</h3>
${spacer({ height: 40 })}
<p style="color:#a1a1aa;font-size:13px;margin:0;">Content after 40px spacer.</p>

${divider()}

<p>That's every component. Mix and match to build any transactional email.</p>
<p>— The FlareCart Team</p>
`;
}

// ── Generate Showcases ──────────────────────

mkdirSync('previews', { recursive: true });
console.log('Generating previews...\n');

const showcase = buildShowcase();

const templateConfigs = [
  {
    name: 'clean',
    title: 'Component Showcase',
    subtitle: 'Every component in the Clean template',
    colors: { primary: '#06d6a0' },
    logo: '<img src="https://placehold.co/140x32/06d6a0/white?text=FlareCart" alt="FlareCart" style="height:32px;">',
    footer: '© 2026 FlareCart · <a href="#" style="color:#a1a1aa;">Unsubscribe</a>',
  },
  {
    name: 'branded',
    title: 'Component Showcase',
    subtitle: 'Every component in the Branded template',
    colors: { primary: '#6366f1' },
    logo: '<img src="https://placehold.co/140x32/ffffff/6366f1?text=FlareCart" alt="FlareCart" style="height:32px;margin-bottom:8px;">',
    footer: '© 2026 FlareCart · <a href="#" style="color:#a1a1aa;">Unsubscribe</a>',
  },
  {
    name: 'minimal',
    title: 'Component Showcase',
    subtitle: 'Every component in the Minimal template',
    colors: { primary: '#18181b' },
    logo: '',
    footer: 'FlareCart · <a href="#" style="color:#a1a1aa;">Unsubscribe</a>',
  },
];

for (const config of templateConfigs) {
  const html = render(config.name, {
    title: config.title,
    subtitle: config.subtitle,
    colors: config.colors,
    logo: config.logo,
    content: showcase,
    footer: config.footer,
  });
  writeFileSync(`previews/${config.name}.html`, html);
  console.log(`  ✓ previews/${config.name}.html`);
}

// ── Real-World Examples ─────────────────────

console.log('');

writeFileSync('previews/example-order-confirmation.html', render('clean', {
  title: 'Order Confirmed',
  subtitle: 'Order #FC-2847 · March 27, 2026',
  colors: { primary: '#06d6a0' },
  logo: '<img src="https://placehold.co/140x32/06d6a0/white?text=FlareCart" alt="FlareCart" style="height:32px;">',
  content: `
    <p>Hi {customer_name},</p>
    <p>Thank you for your purchase! Your files are ready to download.</p>
    {alert}
    {order_table}
    {details}
    ${divider()}
    {downloads}
    {cta}
    <p style="color:#a1a1aa;font-size:13px;">Questions? Just reply to this email.</p>
  `,
  footer: '© 2026 Freshly Squeezed Samples',
  replacements: {
    customer_name: 'David',
    alert: alert({ message: 'Your order has been confirmed and your downloads are ready.', type: 'success' }),
    order_table: orderItems({
      items: [
        { name: 'Melodic House Sample Pack', price: 2900 },
        { name: 'Bass Tech Serum Presets', price: 1900 },
      ],
      currency: 'usd',
      tax: 480,
    }),
    details: keyValue({ title: 'Order Details', items: { 'Order': '#FC-2847', 'Date': 'March 27, 2026', 'Payment': 'Visa •••• 4242' } }),
    downloads: downloadsList({
      title: 'Your Downloads',
      products: [
        { name: 'Melodic House Sample Pack', files: [{ name: 'melodic-house-v2.zip', url: '#', size: '248 MB' }], licenseKey: 'FA15-328F-84FE-1974', note: 'Compatible with all major DAWs.' },
        { name: 'Bass Tech Serum Presets', files: [{ name: 'bass-tech-serum.zip', url: '#', size: '12 MB' }], licenseKey: 'B7A2-91CF-E3D0-4856', note: 'Requires Serum 2.0+' },
      ],
    }),
    cta: button({ text: 'View Order', url: '#', color: '#06d6a0', align: 'center' }),
  },
}));
console.log('  ✓ previews/example-order-confirmation.html');

writeFileSync('previews/example-magic-link.html', render('minimal', {
  title: 'Sign In',
  subtitle: 'Freshly Squeezed Samples',
  content: `
    <p>Hi david@example.com,</p>
    <p>Click the button below to access your orders, downloads, and licenses. This link expires in 30 minutes.</p>
    ${button({ text: 'Sign In to Your Account', url: '#', color: '#18181b', align: 'center' })}
    <p style="color:#a1a1aa;font-size:13px;">If you didn't request this link, you can safely ignore this email.</p>
  `,
  footer: 'Freshly Squeezed Samples',
}));
console.log('  ✓ previews/example-magic-link.html');

writeFileSync('previews/example-subscription-renewed.html', render('clean', {
  title: 'Subscription Renewed',
  subtitle: 'Your Pro plan has been renewed',
  colors: { primary: '#06d6a0' },
  content: `
    <p>Hi Sarah,</p>
    ${alert({ message: 'Your Pro Monthly subscription has been renewed successfully.', type: 'success' })}
    ${keyValue({ title: 'Renewal Details', items: { 'Plan': 'Pro Monthly', 'Amount': 'US$9.99/mo', 'Next Renewal': 'April 27, 2026', 'Payment': 'Visa •••• 4242' } })}
    ${divider()}
    ${orderItems({ items: [{ name: 'Pro Monthly Subscription', price: 999 }], currency: 'usd' })}
    ${button({ text: 'Manage Subscription', url: '#', color: '#06d6a0', align: 'center' })}
    <p style="color:#a1a1aa;font-size:13px;">To cancel or change your plan, click the button above.</p>
  `,
  footer: '© 2026 My Store',
}));
console.log('  ✓ previews/example-subscription-renewed.html');

writeFileSync('previews/example-welcome.html', render('branded', {
  title: 'Welcome to FlareCart',
  subtitle: 'Your store is ready to go',
  colors: { primary: '#6366f1' },
  logo: '<img src="https://placehold.co/140x32/ffffff/6366f1?text=FlareCart" alt="FlareCart" style="height:32px;margin-bottom:8px;">',
  content: `
    <p>Hi David,</p>
    <p>Welcome! Your FlareCart store has been set up and is ready to start selling.</p>
    ${alert({ message: 'Your 14-day free trial has started. No credit card required.', type: 'info' })}
    ${keyValue({ title: 'Your Store', items: { 'Store URL': 'https://store.example.com', 'Admin': 'https://store.example.com/admin', 'Plan': 'Pro Trial (14 days)' } })}
    ${divider()}
    <p><strong>Getting started:</strong></p>
    <p>1. Add your first product in the admin dashboard<br>2. Connect your Stripe account<br>3. Customize your store settings</p>
    ${button({ text: 'Go to Dashboard', url: '#', color: '#6366f1', align: 'center' })}
    <p style="color:#a1a1aa;font-size:13px;">Need help? Check out our <a href="#" style="color:#6366f1;">documentation</a>.</p>
  `,
  footer: '© 2026 FlareCart. Built with ❤️ for indie creators.',
}));
console.log('  ✓ previews/example-welcome.html');

writeFileSync('previews/example-refund.html', render('minimal', {
  title: 'Refund Processed',
  subtitle: 'Order #FC-2847',
  content: `
    <p>Hi David,</p>
    <p>Your refund has been processed. The funds will appear in your account within 5-10 business days.</p>
    ${keyValue({ items: { 'Order': '#FC-2847', 'Refund Amount': 'US$29.00', 'Payment': 'Visa •••• 4242', 'Date': 'March 27, 2026' } })}
    <p style="color:#a1a1aa;font-size:13px;">Questions about this refund? Just reply to this email.</p>
  `,
  footer: 'Freshly Squeezed Samples',
}));
console.log('  ✓ previews/example-refund.html');

writeFileSync('previews/example-payment-failed.html', render('clean', {
  title: 'Payment Failed',
  subtitle: 'Action required for your subscription',
  colors: { primary: '#ef4444' },
  content: `
    <p>Hi Sarah,</p>
    ${alert({ message: 'We were unable to process your payment for the Pro Monthly subscription.', type: 'error' })}
    ${keyValue({ title: 'Details', items: { 'Plan': 'Pro Monthly', 'Amount Due': 'US$9.99', 'Payment': 'Visa •••• 4242', 'Next Retry': 'March 30, 2026' } })}
    <p>Please update your payment method to avoid interruption to your service.</p>
    ${button({ text: 'Update Payment Method', url: '#', color: '#ef4444', align: 'center' })}
    <p style="color:#a1a1aa;font-size:13px;">We'll retry the payment automatically in 3 days.</p>
  `,
  footer: '© 2026 My Store',
}));
console.log('  ✓ previews/example-payment-failed.html');

console.log('\nDone! Open any file in previews/ in your browser.');
