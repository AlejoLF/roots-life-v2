import type { ProductCardProps } from '@/components/ProductCard';

export type Capsule = {
  id: string;
  caption: string;
  title: string;
  description: string;
  products: ProductCardProps[];
};

export const capsules: Capsule[] = [
  {
    id: 'numerologia',
    caption: 'Cápsula 01 · Drop actual',
    title: 'Numerología',
    description:
      'Tres códigos, tres historias. 22 22, 33 33 y 55 55 — símbolos urbanos convertidos en serigrafía.',
    products: [
      {
        image: '/images/remeras/Numerología/Numerología - Pegasus 2222 - negra.png',
        caption: 'Remera · Numerología 22 22',
        title: 'Pegasus 2222',
        price: '$24.000',
        href: '/producto/pegasus-2222',
        badge: 'new',
      },
      {
        image: '/images/remeras/Numerología/Numerología - Snake 3333.png',
        caption: 'Remera · Numerología 33 33',
        title: 'Snake 3333',
        price: '$26.000',
        href: '/producto/snake-3333',
      },
      {
        image: '/images/remeras/Numerología/Numerología - Butterfly 5555.png',
        caption: 'Remera · Numerología 55 55',
        title: 'Butterfly 5555',
        price: '$26.000',
        href: '/producto/butterfly-5555',
      },
    ],
  },
  {
    id: 'south-coast',
    caption: 'Cápsula 02 · Drop actual',
    title: 'South Coast Series',
    description:
      'Días sin apuro. Sol, viento y costa — la vida al ritmo del sur patagónico. Tres piezas nacidas en la costa.',
    products: [
      {
        image: '/images/remeras/South Coast/South Coast - No bad days.png',
        caption: 'Remera · South Coast Series',
        title: 'No Bad Days',
        price: '$24.000',
        href: '/producto/no-bad-days',
        badge: 'South Coast',
      },
      {
        image: '/images/remeras/South Coast/South Coast - Chill & Repeat.png',
        caption: 'Remera · South Coast Series',
        title: 'Chill & Repeat',
        price: '$24.000',
        href: '/producto/chill-and-repeat',
        badge: 'South Coast',
      },
      {
        image: '/images/remeras/South Coast/South Coast - Wind it.png',
        caption: 'Remera · South Coast Series',
        title: 'Wind It',
        price: '$24.000',
        href: '/producto/wind-it',
        badge: 'new',
      },
    ],
  },
  {
    id: 'postales',
    caption: 'Cápsula 03 · Drop actual',
    title: 'Postales',
    description:
      'Paisajes de Comodoro Rivadavia traducidos a serigrafía. Cerro la Flor, costanera y trenes de Rada Tilly.',
    products: [
      {
        image: '/images/remeras/Postales/Postales - Cerro la Flor.png',
        caption: 'Remera · Postales',
        title: 'Cerro la Flor',
        price: '$24.000',
        href: '/producto/cerro-la-flor',
        badge: 'Postales',
      },
      {
        image: '/images/remeras/Postales/Postales - Costanera comodoro.png',
        caption: 'Remera · Postales',
        title: 'Costanera Comodoro',
        price: '$24.000',
        href: '/producto/costanera-comodoro',
        badge: 'Postales',
      },
      {
        image: '/images/remeras/Postales/Postales - trenes de rada tilly.png',
        caption: 'Remera · Postales',
        title: 'Trenes de Rada Tilly',
        price: '$24.000',
        href: '/producto/trenes-rada-tilly',
        badge: 'Postales',
      },
    ],
  },
  {
    id: 'roots',
    caption: 'Cápsula 04 · Drop actual',
    title: 'ROOTS',
    description:
      'La esencia de la marca en tres palabras: Build, Dream, Explore. Piezas fundacionales.',
    products: [
      {
        image: '/images/remeras/ROOTS/ROOTS - Build.png',
        caption: 'Remera · ROOTS',
        title: 'Build',
        price: '$24.000',
        href: '/producto/build',
        badge: 'ROOTS',
      },
      {
        image: '/images/remeras/ROOTS/ROOTS - Dream.png',
        caption: 'Remera · ROOTS',
        title: 'Dream',
        price: '$24.000',
        href: '/producto/dream',
        badge: 'ROOTS',
      },
      {
        image: '/images/remeras/ROOTS/ROOTS - Explore - negra.png',
        caption: 'Remera · ROOTS',
        title: 'Explore',
        price: '$24.000',
        href: '/producto/explore',
        badge: 'ROOTS',
      },
    ],
  },
];

export const buzos: ProductCardProps[] = [
  {
    image: '/images/buzos/buzos roots-15.png',
    caption: 'Buzo · Tipográfico',
    title: 'Invisible Forces',
    price: '$52.000',
    href: '/producto/invisible-forces',
  },
  {
    image: '/images/buzos/buzos roots-19.png',
    caption: 'Buzo · Locals Line',
    title: 'South Club',
    price: '$52.000',
    href: '/producto/south-club',
    badge: 'new',
  },
  {
    image: '/images/buzos/buzos roots-29.png',
    caption: 'Buzo · Locals Line',
    title: 'Locals Rust',
    price: '$54.000',
    href: '/producto/locals-rust',
  },
  {
    image: '/images/buzos/buzos roots-40.png',
    caption: 'Buzo · Kobe Line',
    title: 'Kobe Sky',
    price: '$54.000',
    href: '/producto/kobe-sky',
  },
  {
    image: '/images/buzos/buzos roots-16.png',
    caption: 'Buzo · Tipográfico',
    title: 'Invisible Forces Coal',
    price: '$52.000',
    href: '/producto/invisible-forces-coal',
  },
  {
    image: '/images/buzos/buzos roots-37.png',
    caption: 'Buzo · Kobe Line',
    title: 'Kobe Natural',
    price: '$54.000',
    href: '/producto/kobe-natural',
    badge: 'sold',
  },
];

export const featuredProducts: ProductCardProps[] = [
  capsules[0].products[0], // Pegasus 2222
  capsules[1].products[0], // No Bad Days
  capsules[2].products[1], // Costanera Comodoro
  capsules[3].products[2], // Explore
];
