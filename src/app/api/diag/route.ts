import { NextRequest, NextResponse } from 'next/server';
import { getSheetRows } from '@/lib/sheets';

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization') ?? '';
  const token = auth.replace(/^Bearer\s+/i, '').trim();
  const expected = process.env.REVALIDATE_SECRET;

  if (!expected || !token || token !== expected) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const env = {
    hasEmail: Boolean(process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL),
    emailPreview:
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.substring(0, 30) ?? 'missing',
    hasKey: Boolean(process.env.GOOGLE_PRIVATE_KEY),
    keyLength: process.env.GOOGLE_PRIVATE_KEY?.length ?? 0,
    keyStartsCorrectly: Boolean(
      process.env.GOOGLE_PRIVATE_KEY?.includes('BEGIN PRIVATE KEY'),
    ),
    keyHasEscapedNewlines: Boolean(
      process.env.GOOGLE_PRIVATE_KEY?.includes('\\n'),
    ),
    keyHasRealNewlines: Boolean(
      process.env.GOOGLE_PRIVATE_KEY?.includes('\n'),
    ),
    hasSheetId: Boolean(process.env.PRODUCTS_SHEET_ID),
    sheetIdPreview:
      process.env.PRODUCTS_SHEET_ID?.substring(0, 20) ?? 'missing',
  };

  const allEnvSet = env.hasEmail && env.hasKey && env.hasSheetId;

  let capsulas: unknown = { tested: false };
  let productos: unknown = { tested: false };

  if (allEnvSet) {
    try {
      const rows = await getSheetRows(
        process.env.PRODUCTS_SHEET_ID!,
        'capsulas!A1:F5',
      );
      capsulas = {
        tested: true,
        ok: true,
        rowCount: rows.length,
        firstRow: rows[0] ?? null,
      };
    } catch (err) {
      capsulas = {
        tested: true,
        ok: false,
        error: err instanceof Error ? err.message : String(err),
      };
    }

    try {
      const rows = await getSheetRows(
        process.env.PRODUCTS_SHEET_ID!,
        'productos!A1:R5',
      );
      productos = {
        tested: true,
        ok: true,
        rowCount: rows.length,
        firstRow: rows[0] ?? null,
        secondRowSlug: rows[1]?.[0] ?? null,
      };
    } catch (err) {
      productos = {
        tested: true,
        ok: false,
        error: err instanceof Error ? err.message : String(err),
      };
    }
  }

  return NextResponse.json({
    ok: true,
    env,
    allEnvSet,
    capsulas,
    productos,
    timestamp: new Date().toISOString(),
  });
}
