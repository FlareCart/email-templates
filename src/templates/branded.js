/**
 * Branded Template
 *
 * Full-color header section with logo, title, subtitle.
 * Best for: welcome emails, announcements, marketing.
 */
export const branded = `<!DOCTYPE html>
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
.header-inner{padding:32px 20px!important}
h1{font-size:24px!important}
}
</style>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 0;">
<tr><td align="center">

<!-- Card -->
<table class="outer" width="560" cellpadding="0" cellspacing="0" style="margin:0 auto;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">

<!-- Header -->
<tr>
<td class="header-inner" style="background:{color_primary};padding:40px 48px;text-align:center;">
{logo}
<h1 style="margin:20px 0 8px;font-size:26px;font-weight:700;color:#ffffff;line-height:1.3;">{title}</h1>
<p style="margin:0;font-size:15px;color:rgba(255,255,255,0.9);line-height:1.5;">{subtitle}</p>
</td>
</tr>

<!-- Content -->
<tr>
<td class="inner" style="padding:40px 48px;">
<div style="font-size:15px;line-height:1.7;color:#3f3f46;">
{content}
</div>
</td>
</tr>

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
