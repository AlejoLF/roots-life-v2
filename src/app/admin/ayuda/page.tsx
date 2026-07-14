'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const SHEET_URL =
  'https://docs.google.com/spreadsheets/d/1Km4Jmj_GFP5R6nfUtINyKO1PvYxRsh_fLBvLeRbHGHQ/edit';

export default function AyudaPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = sessionStorage.getItem('roots-admin-token');
    if (!t) {
      router.replace('/admin');
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) {
    return (
      <div className="min-h-screen bg-ink-900 flex items-center justify-center">
        <p className="text-white/50 text-sm">Cargando…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink-900 text-paper-100">
      {/* Barra superior */}
      <header className="bg-ink-900 border-b border-ink-700 px-4 py-3 flex items-center justify-between sticky top-0 z-20">
        <Link
          href="/admin"
          className="text-[11px] font-semibold uppercase tracking-widest text-white/75 hover:text-paper-100"
        >
          ← Volver al panel
        </Link>
        <div className="text-[10px] uppercase tracking-widest text-rust-200">
          Cómo usar el panel
        </div>
      </header>

      <main className="max-w-[48rem] mx-auto px-4 py-8 md:py-12">
        {/* Intro */}
        <div className="mb-10">
          <p className="text-caption text-rust-200 mb-2">Guía rápida</p>
          <h1 className="font-display font-bold uppercase text-3xl md:text-4xl m-0 mb-3 leading-tight">
            Manejá tu tienda
          </h1>
          <p className="text-white/75 text-sm leading-relaxed max-w-[32rem]">
            Todo lo que necesitás para el día a día: cargar productos nuevos,
            subir fotos, cambiar precios y ver los pedidos. Sin saber de
            programación.
          </p>
        </div>

        {/* Accesos rápidos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-12">
          <a
            href={SHEET_URL}
            target="_blank"
            rel="noopener"
            className="bg-ink-700 border border-ink-500 rounded-[3px] p-4 hover:border-rust-200 transition-colors no-underline"
          >
            <p className="text-[10px] uppercase tracking-widest text-rust-200 mb-1">
              Datos
            </p>
            <p className="text-paper-100 font-medium text-sm">
              Abrir la planilla →
            </p>
            <p className="text-white/50 text-xs mt-1">
              Precios, descripciones, talles, cápsulas
            </p>
          </a>
          <Link
            href="/admin/imagenes"
            className="bg-ink-700 border border-ink-500 rounded-[3px] p-4 hover:border-rust-200 transition-colors no-underline block"
          >
            <p className="text-[10px] uppercase tracking-widest text-rust-200 mb-1">
              Fotos
            </p>
            <p className="text-paper-100 font-medium text-sm">
              Subir imágenes →
            </p>
            <p className="text-white/50 text-xs mt-1">
              Cargar o cambiar las fotos de un producto
            </p>
          </Link>
        </div>

        {/* ═══ FLUJO A: PRODUCTO NUEVO ═══ */}
        <Section
          badge="Flujo 1"
          title="Cargar un producto nuevo"
          subtitle="Se hace en dos pasos: primero los datos en la planilla, después las fotos en el panel."
        >
          <Step n={1} title="Abrí la planilla → pestaña «productos»">
            Entrá a{' '}
            <a href={SHEET_URL} target="_blank" rel="noopener" className="link">
              la planilla
            </a>{' '}
            y andá a la pestaña <Code>productos</Code> (abajo a la izquierda).
          </Step>

          <Step n={2} title="Agregá una fila nueva al final">
            Bajá hasta la primera fila vacía y completá estas columnas:
            <div className="mt-3 bg-ink-900 border border-ink-700 rounded-[3px] overflow-hidden">
              <ColRow col="slug" desc="Nombre corto sin espacios ni acentos. Ej: pegasus-negra. Sirve para el link." req />
              <ColRow col="capsule_id" desc="La cápsula: numerologia, south-coast, postales, roots o buzos." req />
              <ColRow col="title" desc="El nombre que se ve. Ej: Pegasus 2222." req />
              <ColRow col="caption" desc="Texto chico bajo el título. Ej: Remera oversize." />
              <ColRow col="price" desc="Solo el número, sin puntos ni signos. Ej: 24000." req />
              <ColRow col="installments" desc="Cuotas, opcional. Ej: 3 cuotas sin interés." />
              <ColRow col="description" desc="Descripción larga del producto." />
              <ColRow col="XS a XXL" desc="Poné una x (o TRUE) en cada talle disponible." req />
              <ColRow col="colors" desc="Colores separados por coma. Ej: Negro, Crema." />
              <ColRow col="badge" desc="Etiqueta opcional: new (nuevo), sold (agotado), soon (próximamente)." />
              <ColRow col="features" desc="Detalles extra separados por coma. Ej: 100% algodón, Estampa serigrafía." />
              <ColRow col="active" desc="Poné TRUE para que aparezca en el sitio. FALSE lo oculta." req />
              <ColRow col="images" desc="DEJALA VACÍA. Se completa sola cuando subís fotos desde el panel." muted last />
            </div>
          </Step>

          <Step n={3} title="Subí las fotos del producto">
            Andá a{' '}
            <Link href="/admin/imagenes" className="link">
              Subir imágenes
            </Link>
            , buscá el producto que acabás de crear (aparece al instante) y
            cargá las fotos. El detalle completo está en el Flujo 2, abajo.
          </Step>

          <Step n={4} title="Listo" last>
            Al guardar las fotos, el producto ya aparece en el sitio. Si lo
            cargaste sin fotos y querés que aparezca igual, volvé al panel y
            tocá <Code>Actualizar ahora</Code>.
          </Step>
        </Section>

        {/* ═══ FLUJO B: IMÁGENES ═══ */}
        <Section
          badge="Flujo 2"
          title="Subir o cambiar imágenes"
          subtitle="Cualquier formato de foto. El sistema las encuadra y optimiza solas."
        >
          <Step n={1} title="Entrá a «Subir imágenes»">
            Desde el panel, tocá la tarjeta{' '}
            <Link href="/admin/imagenes" className="link">
              Subir imágenes
            </Link>
            .
          </Step>
          <Step n={2} title="Elegí el producto">
            Buscalo por nombre en la lista y tocalo.
          </Step>
          <Step n={3} title="Arrastrá o elegí las fotos">
            Arrastrá las imágenes al recuadro, o tocá para elegirlas desde tu
            compu o celular. Podés subir varias juntas. Aceptamos{' '}
            <Code>JPG</Code>, <Code>PNG</Code> y hasta las de iPhone (
            <Code>HEIC</Code>). No hace falta editarlas antes.
          </Step>
          <Step n={4} title="Ordenalas">
            La que tenga la etiqueta <Badge>Principal</Badge> es la primera que
            se ve. Usá los botones:
            <div className="mt-2 flex flex-col gap-1.5 text-[13px]">
              <BtnDesc btn="★" desc="Hacer principal (la manda al primer lugar)" />
              <BtnDesc btn="← →" desc="Mover un lugar" />
              <BtnDesc btn="✕" desc="Quitar la foto" />
            </div>
          </Step>
          <Step n={5} title="Guardá" last>
            Tocá <Code>Guardar cambios</Code>. Cuando dice{' '}
            <span className="text-[#8FB87A]">✓ Guardado</span>, las fotos ya
            están en el sitio.
          </Step>
        </Section>

        {/* ═══ MACHETE ═══ */}
        <Section
          badge="Tareas rápidas"
          title="Cosas que vas a hacer seguido"
          subtitle="Machete express para lo del día a día."
        >
          <QuickTask
            title="Cambiar un precio"
            steps="Planilla → pestaña productos → columna price → cambiá el número → volvé al panel → Actualizar ahora."
          />
          <QuickTask
            title="Ocultar un producto (sin borrarlo)"
            steps="Planilla → columna active → poné FALSE → Actualizar ahora. Para mostrarlo de nuevo, poné TRUE."
          />
          <QuickTask
            title="Marcar algo como agotado o nuevo"
            steps="Planilla → columna badge → escribí sold (agotado), new (nuevo) o soon (próximamente) → Actualizar ahora."
          />
          <QuickTask
            title="Ver los pedidos que entraron"
            steps="Planilla → pestaña pedidos. Ahí ves cada compra con los datos del cliente y qué pidió."
            last
          />
        </Section>

        {/* ═══ REGLAS DE ORO ═══ */}
        <section className="bg-ink-700 border border-rust-500/40 rounded-[4px] p-6 mb-10">
          <p className="text-caption text-rust-200 mb-3">Reglas de oro</p>
          <ul className="space-y-2.5 text-sm text-white/85 list-none p-0 m-0">
            <GoldRule>
              Después de tocar la planilla, siempre volvé al panel y tocá{' '}
              <Code>Actualizar ahora</Code> para que los cambios aparezcan en el
              sitio.
            </GoldRule>
            <GoldRule>
              La columna <Code>images</Code> de la planilla{' '}
              <strong>no se toca a mano</strong> — se completa sola desde{' '}
              <Link href="/admin/imagenes" className="link">
                Subir imágenes
              </Link>
              .
            </GoldRule>
            <GoldRule>
              El <Code>slug</Code> tiene que ser único y sin espacios ni
              acentos. Si dos productos tienen el mismo, se pisan.
            </GoldRule>
            <GoldRule>
              No borres las columnas ni cambies sus nombres. Si algo no te cierra,
              escribime antes de tocar.
            </GoldRule>
          </ul>
        </section>

        {/* Footer nav */}
        <div className="flex flex-wrap gap-3 pb-10">
          <Link
            href="/admin/imagenes"
            className="bg-rust-500 text-paper-100 px-5 py-3 text-xs font-semibold uppercase tracking-widest rounded-[2px] hover:bg-rust-700 transition-colors no-underline"
          >
            Ir a subir imágenes →
          </Link>
          <a
            href={SHEET_URL}
            target="_blank"
            rel="noopener"
            className="border border-white/30 text-paper-100 px-5 py-3 text-xs font-semibold uppercase tracking-widest rounded-[2px] hover:border-white/60 transition-colors no-underline"
          >
            Abrir la planilla →
          </a>
          <Link
            href="/admin/guia"
            className="border border-white/30 text-paper-100 px-5 py-3 text-xs font-semibold uppercase tracking-widest rounded-[2px] hover:border-white/60 transition-colors no-underline"
          >
            Manual completo
          </Link>
        </div>
      </main>

      <style>{`
        .link { color: #F2BCA5; text-decoration: underline; text-underline-offset: 2px; }
        .link:hover { color: #FAFAFA; }
      `}</style>
    </div>
  );
}

/* ─── Sub-componentes ─── */

function Section({
  badge,
  title,
  subtitle,
  children,
}: {
  badge: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-12">
      <p className="text-caption text-rust-200 mb-2">{badge}</p>
      <h2 className="font-display font-bold uppercase text-2xl m-0 mb-1">
        {title}
      </h2>
      <p className="text-white/60 text-sm mb-6">{subtitle}</p>
      <div>{children}</div>
    </section>
  );
}

function Step({
  n,
  title,
  children,
  last = false,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div className="flex gap-4">
      {/* Número + línea */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-rust-500 text-paper-100 text-sm font-bold flex items-center justify-center">
          {n}
        </div>
        {!last && <div className="w-px flex-1 bg-ink-700 my-1" />}
      </div>
      {/* Contenido */}
      <div className={`flex-1 ${last ? 'pb-0' : 'pb-6'}`}>
        <h3 className="text-paper-100 font-semibold text-[15px] mb-1.5 mt-1">
          {title}
        </h3>
        <div className="text-white/75 text-sm leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

function ColRow({
  col,
  desc,
  req = false,
  muted = false,
  last = false,
}: {
  col: string;
  desc: string;
  req?: boolean;
  muted?: boolean;
  last?: boolean;
}) {
  return (
    <div
      className={`flex items-start gap-3 px-3 py-2 ${!last ? 'border-b border-ink-700' : ''} ${muted ? 'bg-rust-500/5' : ''}`}
    >
      <code className="text-[11px] font-mono text-rust-200 bg-ink-700 px-1.5 py-0.5 rounded-[2px] flex-shrink-0 min-w-[72px] text-center">
        {col}
      </code>
      <span className="text-[12px] text-white/70 leading-snug">
        {desc}
        {req && <span className="text-rust-200 ml-1">· obligatorio</span>}
      </span>
    </div>
  );
}

function QuickTask({
  title,
  steps,
  last = false,
}: {
  title: string;
  steps: string;
  last?: boolean;
}) {
  return (
    <div className={`${!last ? 'border-b border-ink-700 pb-4 mb-4' : ''}`}>
      <p className="text-paper-100 font-semibold text-sm mb-1">{title}</p>
      <p className="text-white/65 text-[13px] leading-relaxed">{steps}</p>
    </div>
  );
}

function BtnDesc({ btn, desc }: { btn: string; desc: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="inline-flex items-center justify-center min-w-[28px] h-6 px-2 bg-ink-700 text-rust-200 rounded-[2px] text-xs font-bold">
        {btn}
      </span>
      <span className="text-white/70">{desc}</span>
    </div>
  );
}

function GoldRule({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2">
      <span className="text-rust-200 flex-shrink-0">→</span>
      <span>{children}</span>
    </li>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="text-[12px] font-mono text-rust-200 bg-ink-700 px-1.5 py-0.5 rounded-[2px]">
      {children}
    </code>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block bg-rust-500 text-paper-100 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-[2px] align-middle">
      {children}
    </span>
  );
}
