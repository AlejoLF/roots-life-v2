/**
 * Catálogo detallado de productos — usado para páginas dinámicas /producto/[slug].
 * Cada producto incluye galería (1-3 imágenes), descripción editorial,
 * composición, cápsula a la que pertenece, y variantes.
 */

export type ProductDetail = {
  slug: string;
  capsuleId: string;
  capsuleName: string;
  title: string;
  caption: string;
  price: string;
  priceNumber: number;
  installments?: string;
  description: string;
  images: { src: string; label: string }[];
  colors: { name: string; value: string }[];
  sizes: string[];
  badge?: string;
  features?: { label: string; value: string }[];
};

export const products: ProductDetail[] = [
  // ─── NUMEROLOGÍA ─────────────────────────────────────
  {
    slug: 'pegasus-2222',
    capsuleId: 'numerologia',
    capsuleName: 'Numerología · 22 22',
    title: 'Pegasus 2222',
    caption: 'Edición limitada · 80 unidades numeradas',
    price: '$24.000',
    priceNumber: 24000,
    installments: 'o 3 cuotas sin interés de $8.000',
    description:
      'Halftone denso sobre algodón peinado negro. Pegaso recortado contra un grid global — símbolo de libertad sin perder el rumbo. Cápsula 22.22, 80 unidades numeradas.',
    images: [
      { src: '/images/remeras/Numerología/Numerología - Pegasus 2222 - negra.png', label: 'Frontal — negra' },
      { src: '/images/remeras/Numerología/Numerología - Pegasus 2222 - blanca.png', label: 'Frontal — blanca' },
      { src: '/images/remeras/Numerología/Numerología - Pegasus 2222 - Close up - negra.png', label: 'Close up — detalle estampado' },
    ],
    colors: [
      { name: 'Negro', value: '#0E0E0E' },
      { name: 'Blanco', value: '#FAFAFA' },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    badge: 'new',
    features: [
      { label: 'Material', value: 'Algodón peinado 30/1 · 180 g/m²' },
      { label: 'Estampa', value: 'Serigrafía halftone a 2 tintas' },
      { label: 'Edición', value: '80 unidades numeradas' },
    ],
  },
  {
    slug: 'snake-3333',
    capsuleId: 'numerologia',
    capsuleName: 'Numerología · 33 33',
    title: 'Snake 3333',
    caption: 'Edición limitada · 60 unidades numeradas',
    price: '$26.000',
    priceNumber: 26000,
    installments: 'o 3 cuotas sin interés de $8.666',
    description:
      'Serpiente estampada con halftone orgánico sobre fondo crudo. Código 33 33 — transformación constante, piel que se renueva. Serigrafía a tres tintas.',
    images: [
      { src: '/images/remeras/Numerología/Numerología - Snake 3333.png', label: 'Frontal' },
    ],
    colors: [{ name: 'Crudo', value: '#E3DBC8' }],
    sizes: ['S', 'M', 'L', 'XL'],
    features: [
      { label: 'Material', value: 'Algodón peinado 30/1 · 180 g/m²' },
      { label: 'Estampa', value: 'Serigrafía a 3 tintas' },
      { label: 'Edición', value: '60 unidades numeradas' },
    ],
  },
  {
    slug: 'butterfly-5555',
    capsuleId: 'numerologia',
    capsuleName: 'Numerología · 55 55',
    title: 'Butterfly 5555',
    caption: 'Edición limitada · 50 unidades numeradas',
    price: '$26.000',
    priceNumber: 26000,
    installments: 'o 3 cuotas sin interés de $8.666',
    description:
      'Mariposa fragmentada en pixel-halftone. El 55 55 simboliza ciclo completo — muerte y renacimiento. Estampa central con halftone denso.',
    images: [
      { src: '/images/remeras/Numerología/Numerología - Butterfly 5555.png', label: 'Frontal' },
    ],
    colors: [{ name: 'Crudo', value: '#E3DBC8' }],
    sizes: ['S', 'M', 'L', 'XL'],
    features: [
      { label: 'Material', value: 'Algodón peinado 30/1 · 180 g/m²' },
      { label: 'Estampa', value: 'Serigrafía halftone a 2 tintas' },
      { label: 'Edición', value: '50 unidades numeradas' },
    ],
  },

  // ─── SOUTH COAST ─────────────────────────────────────
  {
    slug: 'no-bad-days',
    capsuleId: 'south-coast',
    capsuleName: 'South Coast Series',
    title: 'No Bad Days',
    caption: 'South Coast Series · Drop actual',
    price: '$24.000',
    priceNumber: 24000,
    installments: 'o 3 cuotas sin interés de $8.000',
    description:
      'Serigrafía a tres tintas sobre algodón orgánico. Un llamado a la costa del sur — días sin apuro, sol y viento. Parte de la cápsula South Coast.',
    images: [
      { src: '/images/remeras/South Coast/South Coast - No bad days.png', label: 'Frontal' },
    ],
    colors: [{ name: 'Crema', value: '#FAFAFA' }],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    badge: 'South Coast',
    features: [
      { label: 'Material', value: 'Algodón orgánico · 160 g/m²' },
      { label: 'Estampa', value: 'Serigrafía a 3 tintas' },
    ],
  },
  {
    slug: 'chill-and-repeat',
    capsuleId: 'south-coast',
    capsuleName: 'South Coast Series',
    title: 'Chill & Repeat',
    caption: 'South Coast Series · Drop actual',
    price: '$24.000',
    priceNumber: 24000,
    installments: 'o 3 cuotas sin interés de $8.000',
    description:
      'Ritual costero: chill y repetir. Tipografía bold sobre algodón orgánico, con acentos en tintas suaves.',
    images: [
      { src: '/images/remeras/South Coast/South Coast - Chill & Repeat.png', label: 'Frontal' },
    ],
    colors: [{ name: 'Crema', value: '#FAFAFA' }],
    sizes: ['S', 'M', 'L', 'XL'],
    badge: 'South Coast',
    features: [
      { label: 'Material', value: 'Algodón orgánico · 160 g/m²' },
      { label: 'Estampa', value: 'Serigrafía a 2 tintas' },
    ],
  },
  {
    slug: 'wind-it',
    capsuleId: 'south-coast',
    capsuleName: 'South Coast Series',
    title: 'Wind It',
    caption: 'South Coast Series · Drop actual',
    price: '$24.000',
    priceNumber: 24000,
    installments: 'o 3 cuotas sin interés de $8.000',
    description:
      'El viento como protagonista. Estampa con movimiento, guiño a las tardes frescas de la costa patagónica.',
    images: [
      { src: '/images/remeras/South Coast/South Coast - Wind it.png', label: 'Frontal' },
    ],
    colors: [{ name: 'Crema', value: '#FAFAFA' }],
    sizes: ['S', 'M', 'L', 'XL'],
    badge: 'new',
    features: [
      { label: 'Material', value: 'Algodón orgánico · 160 g/m²' },
      { label: 'Estampa', value: 'Serigrafía a 3 tintas' },
    ],
  },

  // ─── POSTALES ───────────────────────────────────────
  {
    slug: 'cerro-la-flor',
    capsuleId: 'postales',
    capsuleName: 'Postales · Paisajes de Comodoro',
    title: 'Cerro la Flor',
    caption: 'Postales · Drop actual',
    price: '$24.000',
    priceNumber: 24000,
    installments: 'o 3 cuotas sin interés de $8.000',
    description:
      'El Cerro la Flor vestido en halftone. Una postal gráfica del sur — vista familiar convertida en símbolo.',
    images: [
      { src: '/images/remeras/Postales/Postales - Cerro la Flor.png', label: 'Frontal' },
    ],
    colors: [{ name: 'Crema', value: '#FAFAFA' }],
    sizes: ['S', 'M', 'L', 'XL'],
    badge: 'Postales',
    features: [
      { label: 'Material', value: 'Algodón peinado 30/1 · 180 g/m²' },
      { label: 'Estampa', value: 'Serigrafía halftone monotono' },
    ],
  },
  {
    slug: 'costanera-comodoro',
    capsuleId: 'postales',
    capsuleName: 'Postales · Paisajes de Comodoro',
    title: 'Costanera Comodoro',
    caption: 'Postales · Drop actual',
    price: '$24.000',
    priceNumber: 24000,
    installments: 'o 3 cuotas sin interés de $8.000',
    description:
      'La costanera que conoce cualquiera que vive en Comodoro — atardeceres largos, viento y mar abierto.',
    images: [
      { src: '/images/remeras/Postales/Postales - Costanera comodoro.png', label: 'Frontal — crema' },
      { src: '/images/remeras/Postales/Postales - Costanera comodoro - negra.png', label: 'Frontal — negra' },
    ],
    colors: [
      { name: 'Crema', value: '#FAFAFA' },
      { name: 'Negro', value: '#0E0E0E' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    badge: 'Postales',
    features: [
      { label: 'Material', value: 'Algodón peinado 30/1 · 180 g/m²' },
      { label: 'Estampa', value: 'Serigrafía halftone' },
    ],
  },
  {
    slug: 'trenes-rada-tilly',
    capsuleId: 'postales',
    capsuleName: 'Postales · Paisajes de Comodoro',
    title: 'Trenes de Rada Tilly',
    caption: 'Postales · Drop actual',
    price: '$24.000',
    priceNumber: 24000,
    installments: 'o 3 cuotas sin interés de $8.000',
    description:
      'Los trenes de Rada Tilly — nostalgia ferroviaria del sur, vistos con grafismo contemporáneo.',
    images: [
      { src: '/images/remeras/Postales/Postales - trenes de rada tilly.png', label: 'Frontal' },
    ],
    colors: [{ name: 'Crema', value: '#FAFAFA' }],
    sizes: ['S', 'M', 'L', 'XL'],
    badge: 'Postales',
    features: [
      { label: 'Material', value: 'Algodón peinado 30/1 · 180 g/m²' },
      { label: 'Estampa', value: 'Serigrafía a 2 tintas' },
    ],
  },

  // ─── ROOTS ──────────────────────────────────────────
  {
    slug: 'build',
    capsuleId: 'roots',
    capsuleName: 'ROOTS · Fundacional',
    title: 'Build',
    caption: 'ROOTS · Drop actual',
    price: '$24.000',
    priceNumber: 24000,
    installments: 'o 3 cuotas sin interés de $8.000',
    description:
      'Build — construir. Primera palabra de la trilogía fundacional ROOTS. Tipografía y símbolo compactos.',
    images: [
      { src: '/images/remeras/ROOTS/ROOTS - Build.png', label: 'Frontal' },
    ],
    colors: [{ name: 'Crema', value: '#FAFAFA' }],
    sizes: ['S', 'M', 'L', 'XL'],
    badge: 'ROOTS',
    features: [
      { label: 'Material', value: 'Algodón peinado 30/1 · 180 g/m²' },
      { label: 'Estampa', value: 'Serigrafía monocromo' },
    ],
  },
  {
    slug: 'dream',
    capsuleId: 'roots',
    capsuleName: 'ROOTS · Fundacional',
    title: 'Dream',
    caption: 'ROOTS · Drop actual',
    price: '$24.000',
    priceNumber: 24000,
    installments: 'o 3 cuotas sin interés de $8.000',
    description:
      'Dream — soñar. Segunda palabra de la trilogía fundacional ROOTS. Minimalismo tipográfico.',
    images: [
      { src: '/images/remeras/ROOTS/ROOTS - Dream.png', label: 'Frontal' },
    ],
    colors: [{ name: 'Crema', value: '#FAFAFA' }],
    sizes: ['S', 'M', 'L', 'XL'],
    badge: 'ROOTS',
    features: [
      { label: 'Material', value: 'Algodón peinado 30/1 · 180 g/m²' },
      { label: 'Estampa', value: 'Serigrafía monocromo' },
    ],
  },
  {
    slug: 'explore',
    capsuleId: 'roots',
    capsuleName: 'ROOTS · Fundacional',
    title: 'Explore',
    caption: 'ROOTS · Drop actual',
    price: '$24.000',
    priceNumber: 24000,
    installments: 'o 3 cuotas sin interés de $8.000',
    description:
      'Explore — explorar. Tercera palabra de la trilogía fundacional ROOTS. Disponible en dos colores.',
    images: [
      { src: '/images/remeras/ROOTS/ROOTS - Explore - negra.png', label: 'Frontal — negra' },
      { src: '/images/remeras/ROOTS/ROOTS - Explore - blanca.png', label: 'Frontal — blanca' },
    ],
    colors: [
      { name: 'Negro', value: '#0E0E0E' },
      { name: 'Blanco', value: '#FAFAFA' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    badge: 'ROOTS',
    features: [
      { label: 'Material', value: 'Algodón peinado 30/1 · 180 g/m²' },
      { label: 'Estampa', value: 'Serigrafía monocromo' },
    ],
  },
];

export function getProduct(slug: string): ProductDetail | undefined {
  return products.find((p) => p.slug === slug);
}

export function getRelated(slug: string, max = 4): ProductDetail[] {
  const current = getProduct(slug);
  if (!current) return products.slice(0, max);
  return products
    .filter((p) => p.slug !== slug)
    .sort((a, b) => (a.capsuleId === current.capsuleId ? -1 : 1))
    .slice(0, max);
}
