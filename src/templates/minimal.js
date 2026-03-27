/**
 * Minimal Template
 *
 * Clean and modern with a subtle accent bar. Text-focused but not boring.
 * Best for: magic links, system notifications, password resets, license keys.
 */
export const minimal = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title}</title>
<!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
<style>
body,table,td,a{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}
table,td{mso-table-lspace:0pt;mso-table-rspace:0pt}
@media only screen and (max-width:620px){
.outer{width:100%!important}
.inner{padding:32px 24px!important}
}
</style>
</head>
<body style="margin:0;padding:0;background:#fafafa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#fafafa;padding:48px 0;">
<tr><td align="center">

<table class="outer" width="480" cellpadding="0" cellspacing="0" style="margin:0 auto;">

<!-- Accent bar -->
<tr><td style="background:{color_primary};height:3px;border-radius:3px 3px 0 0;font-size:0;line-height:0;">&nbsp;</td></tr>

<!-- Card -->
<tr><td style="background:#ffffff;border:1px solid #e4e4e7;border-top:none;border-radius:0 0 6px 6px;">
<table width="100%" cellpadding="0" cellspacing="0">
<tr><td class="inner" style="padding:36px 40px;">

<!-- Header -->
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
<tr>
<td>
<h1 style="margin:0;font-size:18px;font-weight:600;color:#18181b;line-height:1.4;">{title}</h1>
<p style="margin:4px 0 0;font-size:13px;color:#a1a1aa;">{subtitle}</p>
</td>
</tr>
</table>

<!-- Content -->
<div style="font-size:15px;line-height:1.7;color:#3f3f46;">
{content}
</div>

</td></tr>
</table>
</td></tr>
</table>

<!-- Footer -->
<table class="outer" width="480" cellpadding="0" cellspacing="0" style="margin:0 auto;">
<tr><td style="padding:20px 40px;text-align:center;font-size:12px;color:#a1a1aa;line-height:1.5;">
{footer}
</td></tr>
</table>

</td></tr>
</table>
</body>
</html>`;
