import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { fillPlaceholders, fromTemplate, placeholdersIn, renderEmail } from '../src/index.js';

describe('fromTemplate', () => {
	it('makes paragraphs, headings, notes and dividers', () => {
		const blocks = fromTemplate('# Thanks, {name}\n\nYour order is ready.\nEnjoy it.\n\n---\n> Order {order}', { values: { name: 'Sam', order: 'ord_1' } });
		assert.deepEqual(blocks, [
			{ type: 'heading', text: 'Thanks, Sam' },
			{ type: 'paragraph', text: ['Your order is ready.', ' ', 'Enjoy it.'] },
			{ type: 'divider' },
			{ type: 'note', text: ['Order ord_1'] },
		]);
	});

	it('puts blocks where a line is only their placeholder', () => {
		const links = [{ type: 'links', items: [{ label: 'Pack.zip', url: 'https://x.co/d' }] }];
		const blocks = fromTemplate('Here you go:\n\n{download_links}\n\nThanks', { blocks: { download_links: links } });
		assert.deepEqual(blocks.map((b) => b.type), ['paragraph', 'links', 'paragraph']);
	});

	it('does bold and links inline, and leaves unknown placeholders as written', () => {
		const [p] = fromTemplate('**{shop}** says [see your orders]({account}) {typo}', { values: { shop: 'Wave', account: 'https://x.co/orders/' } });
		assert.deepEqual(p.text, [{ text: 'Wave', strong: true }, ' says ', { text: 'see your orders', url: 'https://x.co/orders/' }, ' {typo}']);
	});

	it('never lets a value become markup', () => {
		const { html } = renderEmail({ branding: { name: 'Shop' }, subject: 's', blocks: fromTemplate('Hi {name}', { values: { name: '<script>alert(1)</script>' } }) });
		assert.ok(!html.includes('<script>alert'));
		assert.ok(html.includes('&lt;script&gt;'));
	});

	it('lists and fills placeholders', () => {
		assert.deepEqual(placeholdersIn('{a} and {b}, {a} again {not a placeholder}'), ['a', 'b']);
		assert.equal(fillPlaceholders('Your {thing} from {shop}', { shop: 'Wave' }), 'Your {thing} from Wave');
	});
});
