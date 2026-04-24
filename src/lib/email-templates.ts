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

type OrderItemForEmail = {
  title: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
  image?: string;
};

function money(n: number): string {
  return '$' + n.toLocaleString('es-AR');
}

export function orderConfirmationTemplate(opts: {
  name?: string;
  orderId: string;
  trackingToken: string;
  items: OrderItemForEmail[];
  subtotal: number;
  shippingCost: number;
  discount: number;
  discountCode?: string;
  total: number;
  shippingAddress?: {
    firstName?: string;
    lastName?: string;
    street?: string;
    streetNumber?: string;
    apartment?: string;
    city?: string;
    province?: string;
    zip?: string;
  };
}): { html: string; text: string; subject: string } {
  const name = opts.name?.trim() || '';
  const greeting = name ? `¡Gracias ${name}!` : '¡Gracias por tu compra!';
  const trackingUrl = `${SITE_URL}/seguir/${opts.trackingToken}`;

  const itemsRows = opts.items
    .map(
      (item) => `
<tr>
<td style="padding:12px 0;border-bottom:1px solid #EFEAE0;">
<p style="margin:0;font-size:14px;color:#0E0E0E;font-weight:500;">${item.title}</p>
${item.size || item.color ? `<p style="margin:2px 0 0 0;font-size:11px;color:#7A6F5E;">${[item.color, item.size].filter(Boolean).join(' · ')}</p>` : ''}
<p style="margin:2px 0 0 0;font-size:11px;color:#7A6F5E;">Cantidad: ${item.quantity}</p>
</td>
<td style="padding:12px 0;border-bottom:1px solid #EFEAE0;text-align:right;vertical-align:top;">
<p style="margin:0;font-size:14px;color:#0E0E0E;font-weight:500;">${money(item.price * item.quantity)}</p>
</td>
</tr>`,
    )
    .join('');

  const addressBlock = opts.shippingAddress
    ? `
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0;background:#F7F3EA;border-radius:4px;">
<tr><td style="padding:20px;">
<p style="margin:0 0 8px 0;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#7A6F5E;font-weight:600;">Enviamos a</p>
<p style="margin:0;font-size:14px;color:#0E0E0E;line-height:1.5;">
${[opts.shippingAddress.firstName, opts.shippingAddress.lastName].filter(Boolean).join(' ')}<br>
${opts.shippingAddress.street ?? ''} ${opts.shippingAddress.streetNumber ?? ''}${opts.shippingAddress.apartment ? `, ${opts.shippingAddress.apartment}` : ''}<br>
${opts.shippingAddress.city ?? ''}${opts.shippingAddress.province ? `, ${opts.shippingAddress.province}` : ''} ${opts.shippingAddress.zip ? `(${opts.shippingAddress.zip})` : ''}
</p>
</td></tr>
</table>`
    : '';

  const discountRow =
    opts.discount > 0
      ? `
<tr>
<td style="padding:6px 0;font-size:13px;color:#C2623D;">Descuento${opts.discountCode ? ` (${opts.discountCode})` : ''}</td>
<td style="padding:6px 0;font-size:13px;color:#C2623D;text-align:right;">−${money(opts.discount)}</td>
</tr>`
      : '';

  const bodyHtml = `
<h2 style="margin:0 0 12px 0;font-size:26px;font-weight:700;color:#0E0E0E;line-height:1.15;">${greeting}</h2>
<p style="margin:0 0 20px 0;font-size:15px;color:#4D443A;">
Tu pedido <strong>#${opts.orderId.slice(0, 8)}</strong> está confirmado. Te avisamos por email cuando esté despachado con el código de seguimiento.
</p>

<table cellpadding="0" cellspacing="0" border="0" style="margin:24px 0;">
<tr><td>
<a href="${trackingUrl}" style="display:inline-block;background:#C2623D;color:#F7F3EA;text-decoration:none;padding:14px 28px;font-size:12px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;border-radius:2px;">
Seguir mi pedido →
</a>
</td></tr>
</table>

<h3 style="margin:32px 0 12px 0;font-size:14px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:#7A6F5E;">Resumen</h3>
<table width="100%" cellpadding="0" cellspacing="0" border="0">
${itemsRows}
<tr>
<td colspan="2" style="padding-top:16px;">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td style="padding:4px 0;font-size:13px;color:#7A6F5E;">Subtotal</td>
<td style="padding:4px 0;font-size:13px;color:#0E0E0E;text-align:right;">${money(opts.subtotal)}</td>
</tr>
<tr>
<td style="padding:4px 0;font-size:13px;color:#7A6F5E;">Envío</td>
<td style="padding:4px 0;font-size:13px;color:#0E0E0E;text-align:right;">${opts.shippingCost === 0 ? 'Gratis' : money(opts.shippingCost)}</td>
</tr>
${discountRow}
<tr>
<td style="padding:10px 0 0 0;font-size:15px;color:#0E0E0E;font-weight:600;border-top:1px solid #EFEAE0;">Total</td>
<td style="padding:10px 0 0 0;font-size:17px;color:#0E0E0E;font-weight:700;text-align:right;border-top:1px solid #EFEAE0;">${money(opts.total)}</td>
</tr>
</table>
</td>
</tr>
</table>

${addressBlock}

<h3 style="margin:32px 0 12px 0;font-size:14px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:#7A6F5E;">Qué sigue</h3>
<p style="margin:0 0 10px 0;font-size:14px;color:#4D443A;line-height:1.55;">
Preparamos tu pedido en el taller (1-3 días hábiles). Cuando lo despachemos recibís otro email con el código de seguimiento de Mercado Envíos para seguirlo hasta tu casa.
</p>
<p style="margin:16px 0 0 0;font-size:13px;color:#7A6F5E;">
¿Alguna duda? Escribinos a <a href="mailto:emma.irusta@hotmail.com" style="color:#C2623D;">emma.irusta@hotmail.com</a>.
</p>`;

  const text = `${greeting}\n\nTu pedido #${opts.orderId.slice(0, 8)} está confirmado.\n\nSeguilo en: ${trackingUrl}\n\nResumen:\n${opts.items.map((i) => `  ${i.quantity}x ${i.title} - ${money(i.price * i.quantity)}`).join('\n')}\n\nSubtotal: ${money(opts.subtotal)}\nEnvío: ${opts.shippingCost === 0 ? 'Gratis' : money(opts.shippingCost)}${opts.discount > 0 ? `\nDescuento: -${money(opts.discount)}` : ''}\nTotal: ${money(opts.total)}\n\nGracias por elegir ROOTS LIFE.`;

  return {
    subject: `✓ Pedido confirmado #${opts.orderId.slice(0, 8)} · ROOTS LIFE`,
    html: baseTemplate({
      preheader: `Tu pedido está confirmado. Total: ${money(opts.total)}.`,
      bodyHtml,
    }),
    text,
  };
}

export function postDeliveryTemplate(opts: {
  name?: string;
  orderId: string;
  trackingToken: string;
  itemsCount: number;
}): { html: string; text: string; subject: string } {
  const name = opts.name?.trim() || '';
  const greeting = name ? `¡Hola ${name}!` : '¡Hola!';
  const trackingUrl = `${SITE_URL}/seguir/${opts.trackingToken}`;
  const reviewUrl = 'https://g.page/r/rootslife/review';
  const instagramUrl = 'https://instagram.com/rootslife.cr';

  const bodyHtml = `
<h2 style="margin:0 0 14px 0;font-size:26px;font-weight:700;color:#0E0E0E;line-height:1.15;">${greeting}</h2>
<p style="margin:0 0 20px 0;font-size:15px;color:#4D443A;">
Nos figura que tu pedido #${opts.orderId.slice(0, 8)} ya fue entregado. Queríamos asegurarnos de que todo llegó bien y que te encanta lo que elegiste.
</p>

<table cellpadding="0" cellspacing="0" border="0" style="margin:28px 0;background:#F7F3EA;border-radius:4px;">
<tr><td style="padding:24px;">
<p style="margin:0 0 8px 0;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#C2623D;font-weight:600;">¿Todo bien con tu pedido?</p>
<p style="margin:0 0 16px 0;font-size:15px;color:#0E0E0E;line-height:1.5;">
Si ya lo usaste y te gustó, una reseña rápida en Google nos hace volar. De verdad — cada review suma muchísimo.
</p>
<a href="${reviewUrl}" style="display:inline-block;background:#C2623D;color:#F7F3EA;text-decoration:none;padding:12px 22px;font-size:12px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;border-radius:2px;">
Dejar una reseña →
</a>
</td></tr>
</table>

<table cellpadding="0" cellspacing="0" border="0" style="margin:20px 0;background:#0E0E0E;border-radius:4px;">
<tr><td style="padding:24px;">
<p style="margin:0 0 8px 0;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#F2BCA5;font-weight:600;">Mostralo en IG</p>
<p style="margin:0 0 16px 0;font-size:15px;color:#F7F3EA;line-height:1.5;">
Si nos taggeás en una foto con tu ${opts.itemsCount > 1 ? 'nueva compra' : 'nueva prenda'}, lo compartimos en nuestras historias. Nos encanta ver cómo lo armás.
</p>
<a href="${instagramUrl}" style="display:inline-block;background:transparent;color:#F7F3EA;text-decoration:none;padding:12px 22px;font-size:12px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;border:2px solid #F7F3EA;border-radius:2px;">
Taggearnos @rootslife.cr →
</a>
</td></tr>
</table>

<h3 style="margin:32px 0 10px 0;font-size:13px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:#7A6F5E;">¿Algo no cuadra?</h3>
<p style="margin:0 0 12px 0;font-size:14px;color:#4D443A;line-height:1.55;">
Si hubo un problema con el pedido (talle, estado, color, envío) tenés <strong>15 días</strong> desde la entrega para cambios y devoluciones. Escribinos y lo resolvemos sin vueltas.
</p>
<p style="margin:0 0 20px 0;font-size:14px;">
<a href="https://wa.me/5492974737664" style="color:#C2623D;text-decoration:underline;">WhatsApp</a>
&nbsp;·&nbsp;
<a href="mailto:emma.irusta@hotmail.com" style="color:#C2623D;text-decoration:underline;">Email</a>
&nbsp;·&nbsp;
<a href="${trackingUrl}" style="color:#C2623D;text-decoration:underline;">Detalle del pedido</a>
</p>
<p style="margin:24px 0 0 0;font-size:12px;color:#7A6F5E;padding-top:20px;border-top:1px solid #EFEAE0;">
Gracias por elegirnos. Te leemos en cualquier canal.
</p>`;

  const text = `${greeting}\n\nTu pedido #${opts.orderId.slice(0, 8)} fue entregado. Esperamos que te encante.\n\nSi te gustó, nos ayudás mucho con una reseña:\n${reviewUrl}\n\nTaggearnos en Instagram: ${instagramUrl}\n\nSi hubo algún problema, tenés 15 días para cambios. Escribinos a emma.irusta@hotmail.com o por WhatsApp.\n\nDetalle del pedido: ${trackingUrl}`;

  return {
    subject: '¿Cómo te fue con tu pedido? · ROOTS LIFE',
    html: baseTemplate({
      preheader: 'Tu pedido ya llegó. Contanos qué te pareció.',
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
