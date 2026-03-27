/**
 * Clean Template
 *
 * White background, thin top accent bar, no big header block.
 * Best for: receipts, order confirmations, transactional emails.
 * Inspired by Stripe, Paddle, and Gumroad receipts.
 */
export const clean = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title}</title>
<!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
<style>
body,table,td,a{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}
table,td{mso-table-lspace:0pt;mso-table-rspace:0pt}
img{-ms-interpolation-mode:bicubic;border:0;outline:none;text-decoration:none}
@media only screen and (max-width:620px){
.outer{width:100%!important}
.inner{padding:24px 20px!important}
}
</style>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 0;">
<tr><td align="center">

<!-- Accent bar -->
<table class="outer" width="560" cellpadding="0" cellspacing="0" style="margin:0 auto;">
<tr><td style="background:{color_primary};height:4px;border-radius:4px 4px 0 0;font-size:0;line-height:0;">&nbsp;</td></tr>
</table>

<!-- Card -->
<table class="outer" width="560" cellpadding="0" cellspacing="0" style="margin:0 auto;background:#ffffff;border-radius:0 0 4px 4px;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
<tr><td class="inner" style="padding:40px 48px;">

<!-- Logo -->
{logo}

<!-- Title -->
<h1 style="margin:24px 0 4px;font-size:22px;font-weight:600;color:#18181b;line-height:1.3;">{title}</h1>
<p style="margin:0 0 32px;font-size:14px;color:#71717a;line-height:1.5;">{subtitle}</p>

<!-- Content -->
<div style="font-size:15px;line-height:1.7;color:#3f3f46;">
{content}
</div>

</td></tr>
</table>

<!-- Footer -->
<table class="outer" width="560" cellpadding="0" cellspacing="0" style="margin:0 auto;">
<tr><td style="padding:24px 48px;text-align:center;font-size:12px;color:#a1a1aa;line-height:1.5;">
{footer}
</td></tr>
</table>

</td></tr>
</table>
</body>
</html>`;
