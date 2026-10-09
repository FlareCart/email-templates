import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { accentForeground, assertAccent, blockHtml, escapeHtml, renderEmail, safeUrl, styleOf } from '../src/index.js';

const BRANDING = { name: 'Wave Shop', accent: '#635bff', footer: 'You bought from Wave Shop.', address: '1 Example St, Bangkok' };

describe('escaping', () => {
	it('escapes text and attributes', () => {
		assert.equal(escapeHtml('Tom & "Jerry" <b>\'s</b>'), 'Tom &amp; &quot;Jerry&quot; &lt;b&gt;&#39;s&lt;/b&gt;');
		assert.equal(escapeHtml(undefined), '');
	});

	it('links only to http, https and mailto, and escapes what it keeps', () => {
		assert.equal(safeUrl('https://x.co/a?b=1&c="2"'), 'https://x.co/a?b=1&amp;c=&quot;2&quot;');
		assert.equal(safeUrl('mailto:help@x.co'), 'mailto:help@x.co');
		assert.equal(safeUrl('javascript:alert(1)'), '');
		assert.equal(safeUrl(' JAVASCRIPT:alert(1)'), '');
		assert.equal(safeUrl('data:text/html,<script>'), '');
		assert.equal(safeUrl('https://x.co/\nevil'), '');
		assert.equal(safeUrl('/relative'), '');
	});

	it('escapes every value where it lands: a name in text, a URL in an attribute', () => {
		const { html, text } = renderEmail({
			branding: { name: 'Shop <script>' },
			subject: 'Hi </title><script>',
			preheader: '"><img src=x onerror=alert(1)>',
			blocks: [
				{ type: 'paragraph', text: ['Hello ', { text: '<b>Jo</b>', url: 'https://x.co/?a=1&b=2' }] },
				{ type: 'links', title: 'Pack & "Stems"', items: [{ label: '<i>File</i>', url: 'javascript:steal()', note: '<1 MB>' }] },
				{ type: 'button', label: 'Go', url: 'javascript:steal()' },
			],
		});
		assert.ok(!html.includes('<script>'), 'no raw script tag');
		assert.ok(!html.includes('<img src=x'), 'no raw img tag');
		assert.ok(html.includes('Shop &lt;script&gt;'));
		assert.ok(html.includes('href="https://x.co/?a=1&amp;b=2"'));
		assert.ok(!html.includes('javascript:'), 'unsafe links dropped');
		assert.ok(html.includes('&lt;i&gt;File&lt;/i&gt;'), 'an unsafe link keeps its label, unlinked');
		// The text part is plain: nothing to escape, and the unsafe button is left out.
		assert.ok(text.includes('Hello <b>Jo</b> (https://x.co/?a=1&b=2)'));
		assert.ok(!text.includes('Go:'));
	});
});

describe('colours', () => {
	it('accepts only #rrggbb accents (they land in style attributes)', () => {
		assert.equal(assertAccent('#635BFF'), '#635bff');
		for (const bad of ['red', '#fff', '#635bff;background:url(x)', '635bff', '', undefined]) {
			assert.throws(() => assertAccent(/** @type {any} */ (bad)), TypeError, String(bad));
		}
		assert.throws(() => renderEmail({ branding: { name: 'x', accent: 'red;x:y' }, blocks: [] }), /six-digit hex/);
	});

	it('picks readable text on the accent', () => {
		assert.equal(accentForeground('#635bff'), '#ffffff');
		assert.equal(accentForeground('#ffe14d'), '#111111');
		assert.equal(accentForeground('#d1fe17'), '#111111');
	});

	it('uses the dark palette everywhere when asked', () => {
		const { html } = renderEmail({ branding: BRANDING, dark: true, blocks: [{ type: 'paragraph', text: 'x' }] });
		assert.ok(html.includes('background:#0f1218'));
		assert.ok(html.includes('color:#e6e9ef'));
		assert.ok(!html.includes('background:#f6f7f9'));
	});
});

describe('the document', () => {
	const email = renderEmail({
		branding: BRANDING,
		subject: 'Your downloads',
		preheader: 'Your files are ready',
		lang: 'en-GB',
		blocks: [
			{ type: 'heading', text: 'Thanks for your order' },
			{ type: 'paragraph', text: 'Here are your files.' },
			{ type: 'links', title: 'Night Shift', subtitle: 'Studio', items: [{ label: 'Night Shift.zip', url: 'https://x.co/1', note: '84 MB' }, { label: 'Stems.zip', url: 'https://x.co/2' }] },
			{ type: 'details', rows: [['Order', 'ord_1'], ['Total', '£29.00']] },
			{ type: 'codes', items: [{ label: 'Licence key', code: 'ABCD-1234' }] },
			{ type: 'divider' },
			{ type: 'button', label: 'See your orders', url: 'https://x.co/orders' },
			{ type: 'note', text: ['Lost this email? Ask again on ', { text: 'our site', url: 'https://x.co' }, '.'] },
		],
	});

	it('is a table-based document with a hidden preheader, the brand, the content and the footer', () => {
		const { html } = email;
		assert.match(html, /^<!doctype html>\n<html lang="en-GB">/);
		assert.match(html, /<title>Your downloads<\/title>/);
		assert.match(html, /<div style="display:none;[^"]*">Your files are ready<\/div>/);
		assert.ok(html.includes('role="presentation"'));
		assert.ok(html.includes('font-weight:600;color:#1a1f36">Wave Shop</span>'), 'the brand name at the top');
		assert.ok(html.includes('You bought from Wave Shop.<br>1 Example St, Bangkok'), 'footer and address');
		assert.ok(html.includes('<td style="background:#635bff;border-radius:6px"><a href="https://x.co/orders"'), 'the button is a table cell in the accent');
		assert.ok(html.includes('color:#ffffff;text-decoration:none">See your orders</a>'), 'readable text on the accent');
		assert.ok(html.indexOf('Thanks for your order') < html.indexOf('Night Shift.zip'), 'blocks in order');
		assert.ok(!/flex|grid/.test(html), 'nothing Outlook can’t render');
	});

	it('has a plain-text twin with every link’s target', () => {
		assert.equal(
			email.text,
			[
				'Thanks for your order',
				'Here are your files.',
				'Night Shift (Studio)\n  Night Shift.zip (84 MB): https://x.co/1\n  Stems.zip: https://x.co/2',
				'Order: ord_1\nTotal: £29.00',
				'Licence key: ABCD-1234',
				'———',
				'See your orders:\nhttps://x.co/orders',
				'Lost this email? Ask again on our site (https://x.co).',
				'You bought from Wave Shop.\n1 Example St, Bangkok',
			].join('\n\n'),
		);
	});

	it('shows a logo instead of the name when there’s a safe one', () => {
		const { html } = renderEmail({ branding: { ...BRANDING, logoUrl: 'https://cdn.x.co/logo.png' }, blocks: [] });
		assert.ok(html.includes('<img src="https://cdn.x.co/logo.png" alt="Wave Shop"'));
		const unsafe = renderEmail({ branding: { ...BRANDING, logoUrl: 'javascript:x' }, blocks: [] }).html;
		assert.ok(unsafe.includes('>Wave Shop</span>'));
	});

	it('frames the plain layout without a card', () => {
		const card = renderEmail({ branding: BRANDING, blocks: [] }).html;
		const plain = renderEmail({ branding: BRANDING, layout: 'plain', blocks: [] }).html;
		assert.ok(card.includes('border:1px solid #e3e8ee;border-radius:8px'));
		assert.ok(!plain.includes('border-radius:8px'));
	});

	it('says so when a list of links is empty, and refuses an unknown block', () => {
		const style = styleOf({ branding: BRANDING, blocks: [] });
		assert.ok(blockHtml({ type: 'links', title: 'Prism', items: [], empty: 'No files for this item.' }, style).includes('<li>No files for this item.</li>'));
		assert.throws(() => renderEmail({ branding: BRANDING, blocks: [/** @type {any} */ ({ type: 'video' })] }), /Unknown email block: video/);
	});

	it('takes theme overrides', () => {
		const { html } = renderEmail({ branding: BRANDING, theme: { width: 640, font: 'Georgia,serif' }, blocks: [] });
		assert.ok(html.includes('max-width:640px'));
		assert.ok(html.includes('font-family:Georgia,serif'));
	});
});
