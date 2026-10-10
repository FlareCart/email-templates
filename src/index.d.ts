/** Inline content: text, a link, or bold text. */
export type Inline = string | { text: string; url?: string; strong?: boolean };

/** One link in a list. */
export interface LinkItem {
	label: string;
	url: string;
	/** A muted note after it: "84 MB". */
	note?: string;
}

/** A piece of an email, top to bottom. */
export type Block =
	| { type: 'heading'; text: string }
	| { type: 'paragraph'; text: Inline | Inline[] }
	/** Small, muted text: an order number, "didn't ask for this?". */
	| { type: 'note'; text: Inline | Inline[] }
	/** Left out (in both parts) when the URL isn't http, https or mailto. */
	| { type: 'button'; label: string; url: string }
	/** A titled list of links: an item's downloads. `empty` shows when there are none. */
	| { type: 'links'; title?: string; subtitle?: string; items: LinkItem[]; empty?: string }
	/** Label–value rows: an order's details. */
	| { type: 'details'; rows: [string, string][] }
	/** Monospaced codes in a panel: licence keys. */
	| { type: 'codes'; items: { label?: string; code: string }[] }
	| { type: 'divider' };

export interface Palette {
	text: string;
	muted: string;
	border: string;
	surface: string;
	card: string;
	background: string;
	accent: string;
	accentText: string;
}

export interface Theme {
	font: string;
	monoFont: string;
	width: number;
	fontSize: number;
	smallSize: number;
	lineHeight: string;
	padding: number;
	radius: number;
	buttonRadius: number;
}

export interface Style {
	palette: Palette;
	theme: Theme;
}

export interface Branding {
	/** Who it's from, shown at the top. */
	name: string;
	/** `#rrggbb`; buttons use it. Defaults to `#1a1f36`. */
	accent?: string;
	/** An https image shown instead of the name. */
	logoUrl?: string;
	/** A line at the bottom: why they got this. */
	footer?: string;
	/** A postal address, under the footer. */
	address?: string;
}

export interface EmailInput {
	branding: Branding;
	blocks: Block[];
	/** The document's title (some clients show it). */
	subject?: string;
	/** The preview line inboxes show after the subject. */
	preheader?: string;
	/** A bordered card on a tinted page (default), or no container. */
	layout?: 'card' | 'plain';
	/** The dark palette, for every reader. */
	dark?: boolean;
	theme?: Partial<Theme>;
	/** Defaults to `en`. */
	lang?: string;
}

/** Render an email: a complete HTML document and its plain-text twin. */
export function renderEmail(input: EmailInput): { html: string; text: string };
export function styleOf(input: EmailInput): Style;

export function blockHtml(block: Block, style: Style): string;
export function blockText(block: Block): string;
export const BLOCKS: Readonly<Record<Block['type'], { html: (block: never, style: Style) => string; text: (block: never) => string }>>;

/** Throws a `TypeError` for anything but `#rrggbb`; returns it lower case. */
export function assertAccent(accent: string): string;
/** `#ffffff` or `#111111`, whichever reads on the accent. */
export function accentForeground(accent: string): '#ffffff' | '#111111';
export function lightPalette(accent: string): Palette;
export function darkPalette(accent: string): Palette;
export const DEFAULT_THEME: Readonly<Theme>;

/** Text or an attribute value, safe to put in HTML. */
export function escapeHtml(value: unknown): string;
/** An http, https or mailto URL, escaped for an attribute; '' for anything else. */
export function safeUrl(url: unknown): string;

/** The placeholders a template uses, once each, in order. */
export function placeholdersIn(template: string): string[];

/** Text with its `{placeholders}` filled in; unknown ones are left as written. */
export function fillPlaceholders(text: string, values: Record<string, string>): string;

/**
 * A seller's plain-text template as blocks: paragraphs (blank-line separated),
 * `# heading`, `> note`, `---`, `**bold**`, `[link](url)`, `{placeholders}` from
 * `values`, and a line of only `{name}` replaced by `blocks[name]`.
 */
export function fromTemplate(template: string, fill?: { values?: Record<string, string>; blocks?: Record<string, Block[]> }): Block[];
