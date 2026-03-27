/**
 * @arraypress/email-templates — TypeScript definitions.
 */

// ── Render ──────────────────────────────────

export interface RenderOptions {
  /** Email title / heading. */
  title?: string;
  /** Subtitle below the heading. */
  subtitle?: string;
  /** Main email body HTML with {placeholders}. */
  content?: string;
  /** Footer content. */
  footer?: string;
  /** Logo HTML (e.g. an <img> tag). */
  logo?: string;
  /** Color overrides. */
  colors?: {
    /** Primary/accent color. Default: '#18181b' */
    primary?: string;
  };
  /** Key-value pairs for {placeholder} replacement in content. */
  replacements?: Record<string, string>;
}

/** Render an email template with content and replacements. */
export function render(template: 'clean' | 'branded' | 'minimal' | string, options?: RenderOptions): string;

/** Get available template names. */
export function getTemplateNames(): string[];

/** Register a custom template. */
export function registerTemplate(name: string, html: string): void;

// ── Components ──────────────────────────────

export interface ButtonOptions {
  /** Button label. */
  text: string;
  /** Button URL. */
  url: string;
  /** Background color. Default: '#18181b' */
  color?: string;
  /** Text color. Default: '#ffffff' */
  textColor?: string;
  /** Alignment: left, center, right. Default: 'left' */
  align?: 'left' | 'center' | 'right';
}

export interface AlertOptions {
  /** Alert message. */
  message: string;
  /** Alert type. Default: 'info' */
  type?: 'info' | 'success' | 'warning' | 'error';
}

export interface OrderItem {
  /** Item name. */
  name: string;
  /** Quantity. Default: 1 */
  quantity?: number;
  /** Price in smallest unit (cents). */
  price?: number;
  /** Pre-formatted price string (overrides price). */
  priceFormatted?: string;
  /** Pre-formatted line total string. */
  totalFormatted?: string;
}

export interface OrderItemsOptions {
  /** Line items. */
  items: OrderItem[];
  /** Currency code. Default: 'usd' */
  currency?: string;
  /** Tax in smallest unit. */
  tax?: number;
  /** Discount in smallest unit. */
  discount?: number;
  /** Shipping in smallest unit. */
  shipping?: number;
  /** Override total in smallest unit. */
  total?: number;
  /** Pre-formatted tax string. */
  taxFormatted?: string;
  /** Pre-formatted discount string. */
  discountFormatted?: string;
  /** Pre-formatted shipping string. */
  shippingFormatted?: string;
  /** Pre-formatted total string. */
  totalFormatted?: string;
}

export interface DownloadFile {
  /** File name. */
  name: string;
  /** Download URL. */
  url: string;
  /** File size display string. */
  size?: string;
}

export interface DownloadsListOptions {
  /** Files to display. */
  files: DownloadFile[];
  /** Section title. */
  title?: string;
}

export interface LicenseKeyOptions {
  /** License key string. */
  key: string;
  /** Label above the key. */
  label?: string;
}

export interface KeyValueOptions {
  /** Object of label:value pairs. */
  items: Record<string, string | number>;
  /** Section title. */
  title?: string;
}

export interface SpacerOptions {
  /** Height in pixels. Default: 24 */
  height?: number;
}

/** Call-to-action button. */
export function button(options: ButtonOptions): string;

/** Alert / notice box. */
export function alert(options: AlertOptions): string;

/** Order items table with totals. */
export function orderItems(options: OrderItemsOptions): string;

/** Downloads list with file links. */
export function downloadsList(options: DownloadsListOptions): string;

/** License key display. */
export function licenseKey(options: LicenseKeyOptions): string;

/** Key-value pairs list. */
export function keyValue(options: KeyValueOptions): string;

/** Horizontal divider. */
export function divider(): string;

/** Vertical spacer. */
export function spacer(options?: SpacerOptions): string;

/** All components as a namespace. */
export const components: {
  button: typeof button;
  alert: typeof alert;
  orderItems: typeof orderItems;
  downloadsList: typeof downloadsList;
  licenseKey: typeof licenseKey;
  keyValue: typeof keyValue;
  divider: typeof divider;
  spacer: typeof spacer;
};
