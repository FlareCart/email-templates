/**
 * Preview Generator — creates showcase HTML for every template.
 *
 * Usage: node generate-previews.js
 * Output: previews/ directory with one HTML file per template
 */

import { writeFileSync } from 'fs';
import { render, getTemplateNames, components } from './src/index.js';

// ── Component Showcase Content ──────────────

function buildShowcase() {
  const sections = [];

  // Intro
  sections.push(`<p>Hi David,</p>
<p>This is a preview showcasing every component available in the <code>@arraypress/email-templates</code> library. Each section below demonstrates a different component with realistic data.</p>`);

  // Alert — all 4 types
  sections.push(`<h2 style="margin:32px 0 8px;font-size:16px;font-weight:600;">Alerts</h2>
<p style="color:#71717a;font-size:14px;">Four contextual alert types for different situations.</p>`);
  sections.push(components.alert({ message: 'Your order has been confirmed and downloads are ready.', type: 'success' }));
  sections.push(components.alert({ message: 'Your subscription will renew in 3 days.', type: 'warning' }));
  sections.push(components.alert({ message: 'Payment failed. Please update your billing information.', type: 'error' }));
  sections.push(components.alert({ message: 'New features have been added to your account.', type: 'info' }));

  sections.push(components.divider());

  // Order Items — with qty hidden (all qty 1)
  sections.push(`<h2 style="margin:32px 0 8px;font-size:16px;font-weight:600;">Order Items (Single Quantity)</h2>
<p style="color:#71717a;font-size:14px;">Quantity column auto-hides when all items are qty 1.</p>`);
  sections.push(components.orderItems({
    items: [
      { name: 'Melodic House Sample Pack', price: 2900 },
      { name: 'Bass Tech Serum Presets', price: 1900 },
      { name: 'Afro House Drum Kit', price: 1400 },
    ],
    currency: 'usd',
    tax: 620,
    discount: 500,
  }));

  // Order Items — with qty shown
  sections.push(`<h2 style="margin:32px 0 8px;font-size:16px;font-weight:600;">Order Items (Multiple Quantities)</h2>
<p style="color:#71717a;font-size:14px;">Quantity column appears when any item has qty > 1.</p>`);
  sections.push(components.orderItems({
    items: [
      { name: 'Premium Plugin License', quantity: 3, price: 4900 },
      { name: 'Priority Support (1 year)', quantity: 1, price: 9900 },
    ],
    currency: 'usd',
    tax: 2370,
    shipping: 0,
  }));

  sections.push(components.divider());

  // Downloads — product-grouped with license keys and notes
  sections.push(`<h2 style="margin:32px 0 8px;font-size:16px;font-weight:600;">Downloads (Grouped by Product)</h2>
<p style="color:#71717a;font-size:14px;">Products with files, optional license keys, and notes.</p>`);
  sections.push(components.downloadsList({
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
  }));

  // Downloads — flat file list
  sections.push(`<h2 style="margin:32px 0 8px;font-size:16px;font-weight:600;">Downloads (Flat File List)</h2>
<p style="color:#71717a;font-size:14px;">Simple file list without product grouping.</p>`);
  sections.push(components.downloadsList({
    title: 'Attachments',
    files: [
      { name: 'invoice-FC-2847.pdf', url: '#', size: '142 KB' },
      { name: 'receipt-FC-2847.pdf', url: '#', size: '98 KB' },
    ],
  }));

  sections.push(components.divider());

  // License Key — standalone
  sections.push(`<h2 style="margin:32px 0 8px;font-size:16px;font-weight:600;">License Key (Standalone)</h2>
<p style="color:#71717a;font-size:14px;">Centered display for single license key delivery.</p>`);
  sections.push(components.licenseKey({
    key: 'FA15-328F-84FE-1974-D55D-A3E4-5F66-35A3',
    label: 'Your License Key',
  }));

  sections.push(components.divider());

  // Key-Value list
  sections.push(`<h2 style="margin:32px 0 8px;font-size:16px;font-weight:600;">Key-Value List</h2>
<p style="color:#71717a;font-size:14px;">Clean label-value pairs for order details, account info, etc.</p>`);
  sections.push(components.keyValue({
    title: 'Order Details',
    items: {
      'Order Number': '#FC-2847',
      'Date': 'March 27, 2026',
      'Payment Method': 'Visa •••• 4242',
      'Status': 'Complete',
      'Transaction ID': 'ch_3PqR7x2eZvKYlo2C1',
    },
  }));

  sections.push(components.divider());

  // Buttons — all alignments
  sections.push(`<h2 style="margin:32px 0 8px;font-size:16px;font-weight:600;">Buttons</h2>
<p style="color:#71717a;font-size:14px;">Call-to-action buttons with different colors and alignments.</p>`);
  sections.push(components.button({ text: 'View Order', url: '#', color: '#18181b', align: 'left' }));
  sections.push(components.button({ text: 'Download Files', url: '#', color: '#06d6a0', align: 'center' }));
  sections.push(components.button({ text: 'Manage Account', url: '#', color: '#6366f1', align: 'right' }));

  sections.push(components.divider());

  // Spacer demo
  sections.push(`<h2 style="margin:32px 0 8px;font-size:16px;font-weight:600;">Spacer</h2>
<p style="color:#71717a;font-size:14px;">Controlled vertical spacing (48px below).</p>`);
  sections.push(components.spacer({ height: 48 }));
  sections.push(`<p style="color:#71717a;font-size:14px;">Content after the spacer.</p>`);

  sections.push(components.divider());

  // Footer
  sections.push(`<p style="color:#a1a1aa;font-size:13px;">This is a preview email generated by <code>@arraypress/email-templates</code>. All links are placeholder URLs.</p>`);

  return sections.join('\n');
}

// ── Generate for each template ──────────────

const content = buildShowcase();
const templates = getTemplateNames();

const templateConfigs = {
  clean: {
    title: 'Component Showcase',
    subtitle: 'Every component in the Clean template',
    colors: { primary: '#06d6a0' },
    logo: '<img src="https://placehold.co/140x32/06d6a0/white?text=FlareCart" alt="FlareCart" style="height:32px;">',
    footer: '© 2026 FlareCart. All rights reserved. · Clean Template Preview',
  },
  branded: {
    title: 'Component Showcase',
    subtitle: 'Every component in the Branded template',
    colors: { primary: '#6366f1' },
    logo: '<img src="https://placehold.co/140x32/ffffff/6366f1?text=FlareCart" alt="FlareCart" style="height:32px;margin-bottom:8px;">',
    footer: '© 2026 FlareCart. All rights reserved. · Branded Template Preview',
  },
  minimal: {
    title: 'Component Showcase',
    subtitle: 'Every component in the Minimal template',
    colors: { primary: '#18181b' },
    footer: 'FlareCart · Minimal Template Preview',
  },
};

for (const name of templates) {
  const config = templateConfigs[name] || {
    title: `${name} — Component Showcase`,
    subtitle: `Every component in the ${name} template`,
    footer: `${name} template preview`,
  };

  const html = render(name, { ...config, content });
  writeFileSync(`previews/${name}.html`, html);
  console.log(`  ✓ previews/${name}.html`);
}

console.log(`\nGenerated ${templates.length} preview files in previews/`);
