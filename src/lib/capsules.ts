import { unstable_cache } from 'next/cache';
import { getSheetRows } from './sheets';

export type Capsule = {
  id: string;
  name: string;
  caption: string;
  description: string;
  order: number;
  active: boolean;
};

const SHEET_RANGE = 'capsulas!A2:F';

function parseBool(raw: string | undefined): boolean {
  if (!raw) return false;
  const v = raw.toString().trim().toUpperCase();
  return v === 'TRUE' || v === 'VERDADERO' || v === '1';
}

function rowToCapsule(row: string[]): Capsule | null {
  const [id, name, caption, description, orderRaw, activeRaw] = row;
  if (!id || !name) return null;
  return {
    id: id.trim(),
    name: name.trim(),
    caption: (caption ?? '').trim(),
    description: (description ?? '').trim(),
    order: Number(orderRaw) || 99,
    active: parseBool(activeRaw),
  };
}

function useSheetSource(): boolean {
  return Boolean(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
      process.env.GOOGLE_PRIVATE_KEY &&
      process.env.PRODUCTS_SHEET_ID,
  );
}

const FALLBACK_CAPSULES: Capsule[] = [
  {
    id: 'numerologia',
    name: 'Numerología',
    caption: 'Cápsula 01 · Drop actual',
    description:
      'Tres códigos, tres historias. 22 22, 33 33 y 55 55 — símbolos urbanos convertidos en serigrafía.',
    order: 1,
    active: true,
  },
  {
    id: 'south-coast',
    name: 'South Coast Series',
    caption: 'Cápsula 02 · Drop actual',
    description:
      'Días sin apuro. Sol, viento y costa — la vida al ritmo del sur patagónico. Tres piezas nacidas en la costa.',
    order: 2,
    active: true,
  },
  {
    id: 'postales',
    name: 'Postales',
    caption: 'Cápsula 03 · Drop actual',
    description:
      'Paisajes de Comodoro Rivadavia traducidos a serigrafía. Cerro la Flor, costanera y trenes de Rada Tilly.',
    order: 3,
    active: true,
  },
  {
    id: 'roots',
    name: 'ROOTS',
    caption: 'Cápsula 04 · Drop actual',
    description:
      'La esencia de la marca en tres palabras: Build, Dream, Explore. Piezas fundacionales.',
    order: 4,
    active: true,
  },
];

async function fetchCapsulesFromSheet(): Promise<Capsule[]> {
  const sheetId = process.env.PRODUCTS_SHEET_ID!;
  const rows = await getSheetRows(sheetId, SHEET_RANGE);
  return rows
    .map(rowToCapsule)
    .filter((c): c is Capsule => c !== null);
}

export const getCapsules = unstable_cache(
  async (): Promise<Capsule[]> => {
    if (!useSheetSource()) return FALLBACK_CAPSULES;
    try {
      const fromSheet = await fetchCapsulesFromSheet();
      if (fromSheet.length === 0) {
        console.warn('[capsules] Sheet returned 0 rows, using fallback');
        return FALLBACK_CAPSULES;
      }
      return fromSheet;
    } catch (err) {
      console.error('[capsules] Failed to fetch from Sheet:', err);
      return FALLBACK_CAPSULES;
    }
  },
  ['capsules'],
  {
    tags: ['products'],
    revalidate: 86400,
  },
);

export async function getActiveCapsules(): Promise<Capsule[]> {
  const all = await getCapsules();
  return all.filter((c) => c.active).sort((a, b) => a.order - b.order);
}

export async function getCapsuleById(
  id: string,
): Promise<Capsule | undefined> {
  const all = await getCapsules();
  return all.find((c) => c.id === id);
}
