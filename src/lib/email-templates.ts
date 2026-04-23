/**
 * Plantillas HTML para emails transaccionales.
 * Inline CSS obligatorio para compatibilidad con Gmail / Outlook.
 */

const SITE_URL = 'https://www.rootslife.shop';

type BaseOpts = {
  preheader?: string;
  bodyHtml: string;
};

function baseTemplate({ preheader = '', bodyHtml }: BaseOpts): string {
  return `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F7F3EA;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#0E0E0E;line-height:1.55;-webkit-font-smoothing:antialiased;">
<div style="display:none;font-size:1px;color:#F7F3EA;max-height:0;max-width:0;opacity:0;overflow:hidden;">${preheader}</div>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F7F3EA;padding:32px 16px;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;">
<tr><td style="background:#0E0E0E;padding:32px 40px;border-radius:4px 4px 0 0;">
<p style="margin:0;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#F2BCA5;font-weight:600;">ROOTS LIFE</p>
</td></tr>
<tr><td style="background:#FFFFFF;padding:40px;border-left:1px solid #E5E0D4;border-right:1px solid #E5E0D4;">
${bodyHtml}
</td></tr>
<tr><td style="background:#0E0E0E;padding:24px 40px;text-align:center;border-radius:0 0 4px 4px;">
<p style="margin:0;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(247,243,234,0.6);">
ROOTS LIFE · Comodoro Rivadavia · Patagonia
</p>
<p style="margin:8px 0 0 0;font-size:10px;color:rgba(247,243,234,0.45);">
<a href="${SITE_URL}" style="color:rgba(247,243,234,0.6);text-decoration:underline;">rootslife.shop</a>
</p>
</td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

export function verifyEmailTemplate(opts: {
  name?: string;
  verifyUrl: string;
  discountCode?: string;
}): { html: string; text: string; subject: string } {
  const name = opts.name?.trim() || '';
  const greeting = name ? `¡Hola ${name}!` : '¡Hola!';
  const hasDiscount = Boolean(opts.discountCode);

  const discountBlock = hasDiscount
    ? `
<table cellpadding="0" cellspacing="0" border="0" style="margin:24px 0;background:#0E0E0E;border-radius:4px;">
<tr><td style="padding:24px;text-align:center;">
<p style="margin:0 0 8px 0;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#F2BCA5;font-weight:600;">Regalo de bienvenida</p>
<p style="margin:0 0 14px 0;font-size:22px;font-weight:700;color:#F7F3EA;line-height:1.2;text-transform:uppercase;">10% OFF en tu primera compra</p>
<div style="display:inline-block;border:1.5px dashed #F2BCA5;padding:10px 20px;border-radius:2px;">
<p style="margin:0;font-size:22px;font-weight:700;color:#F2BCA5;letter-spacing:4px;">${opts.discountCode}</p>
</div>
<p style="margin:14px 0 0 0;font-size:12px;color:rgba(247,243,234,0.75);">
Usalo al finalizar tu primera compra.
</p>
</td></tr>
</table>`
    : '';

  const bodyHtml = `
<h2 style="margin:0 0 16px 0;font-size:24px;font-weight:700;color:#0E0E0E;line-height:1.2;">${greeting}</h2>
<p style="margin:0 0 20px 0;font-size:15px;color:#4D443A;">
Gracias por registrarte en ROOTS LIFE. Para activar tu cuenta${hasDiscount ? ' y usar tu código de descuento' : ''}, confirmá tu email tocando el botón de abajo.
</p>
<table cellpadding="0" cellspacing="0" border="0" style="margin:28px 0;">
<tr><td>
<a href="${opts.verifyUrl}" style="display:inline-block;background:#C2623D;color:#F7F3EA;text-decoration:none;padding:14px 28px;font-size:12px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;border-radius:2px;">
Confirmar mi email →
</a>
</td></tr>
</table>
${discountBlock}
<p style="margin:0 0 12px 0;font-size:13px;color:#7A6F5E;">
O copiá este link y pegalo en tu navegador:
</p>
<p style="margin:0 0 24px 0;font-size:12px;color:#7A6F5E;word-break:break-all;">
<a href="${opts.verifyUrl}" style="color:#C2623D;">${opts.verifyUrl}</a>
</p>
<p style="margin:24px 0 0 0;font-size:12px;color:#7A6F5E;padding-top:24px;border-top:1px solid #EFEAE0;">
Este link expira en 24 horas. Si no fuiste vos, ignorá este email.
</p>`;

  const text = hasDiscount
    ? `${greeting}\n\nGracias por registrarte en ROOTS LIFE.\nTu código de bienvenida: ${opts.discountCode} (10% OFF en tu primera compra)\n\nConfirmá tu email con este link:\n${opts.verifyUrl}\n\nEl link expira en 24 hs. Si no fuiste vos, ignorá este email.`
    : `${greeting}\n\nGracias por registrarte en ROOTS LIFE.\nConfirmá tu email con este link:\n\n${opts.verifyUrl}\n\nEl link expira en 24 hs. Si no fuiste vos, ignorá este email.`;

  return {
    subject: hasDiscount
      ? '¡Bienvenido! Tu 10% OFF + confirmá tu email'
      : 'Confirmá tu email · ROOTS LIFE',
    html: baseTemplate({
      preheader: hasDiscount
        ? 'Tu código ROOTS10 adentro. Confirmá tu email para activar todo.'
        : 'Confirmá tu email para activar tu cuenta en ROOTS LIFE.',
      bodyHtml,
    }),
    text,
  };
}

export function passwordResetTemplate(opts: {
  name?: string;
  resetUrl: string;
}): { html: string; text: string; subject: string } {
  const name = opts.name?.trim() || '';
  const greeting = name ? `¡Hola ${name}!` : '¡Hola!';

  const bodyHtml = `
<h2 style="margin:0 0 16px 0;font-size:24px;font-weight:700;color:#0E0E0E;line-height:1.2;">${greeting}</h2>
<p style="margin:0 0 20px 0;font-size:15px;color:#4D443A;">
Recibimos una solicitud para recuperar tu contraseña. Si fuiste vos, tocá el botón de abajo para elegir una nueva.
</p>
<table cellpadding="0" cellspacing="0" border="0" style="margin:28px 0;">
<tr><td>
<a href="${opts.resetUrl}" style="display:inline-block;background:#C2623D;color:#F7F3EA;text-decoration:none;padding:14px 28px;font-size:12px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;border-radius:2px;">
Elegir nueva contraseña →
</a>
</td></tr>
</table>
<p style="margin:0 0 12px 0;font-size:13px;color:#7A6F5E;">
O copiá este link:
</p>
<p style="margin:0 0 24px 0;font-size:12px;color:#7A6F5E;word-break:break-all;">
<a href="${opts.resetUrl}" style="color:#C2623D;">${opts.resetUrl}</a>
</p>
<p style="margin:24px 0 0 0;font-size:12px;color:#7A6F5E;padding-top:24px;border-top:1px solid #EFEAE0;">
Este link expira en 1 hora. Si no pediste recuperar tu contraseña, ignorá este email — tu cuenta está segura.
</p>`;

  const text = `${greeting}\n\nRecibimos una solicitud para recuperar tu contraseña.\nSi fuiste vos, entrá a este link:\n\n${opts.resetUrl}\n\nEl link expira en 1 hora. Si no pediste esto, ignorá el email.`;

  return {
    subject: 'Recuperá tu contraseña · ROOTS LIFE',
    html: baseTemplate({
      preheader: 'Elegí una nueva contraseña para tu cuenta ROOTS LIFE.',
      bodyHtml,
    }),
    text,
  };
}
