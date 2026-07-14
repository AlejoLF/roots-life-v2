'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Product = {
  slug: string;
  title: string;
  capsuleId: string;
  active: boolean;
  images: string[];
};

type UploadingItem = {
  id: string;
  name: string;
  status: 'processing' | 'done' | 'error';
  error?: string;
};

export default function ImagenesAdminPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [selected, setSelected] = useState<Product | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState<UploadingItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  // Auth + carga inicial
  useEffect(() => {
    const t = sessionStorage.getItem('roots-admin-token');
    if (!t) {
      router.replace('/admin');
      return;
    }
    setToken(t);
    fetch('/api/admin/products-list', {
      headers: { Authorization: `Bearer ${t}` },
    })
      .then(async (res) => {
        if (res.status === 401) {
          sessionStorage.removeItem('roots-admin-token');
          router.replace('/admin');
          return;
        }
        const data = await res.json();
        if (data.ok) setProducts(data.products);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  function selectProduct(p: Product) {
    if (dirty && !confirm('Tenés cambios sin guardar. ¿Descartarlos?')) return;
    setSelected(p);
    setImages(p.images);
    setUploading([]);
    setSaveMsg(null);
    setDirty(false);
  }

  const uploadFiles = useCallback(
    async (files: FileList | File[]) => {
      if (!selected || !token) return;
      const arr = Array.from(files).filter((f) => f.type.startsWith('image/') || /\.(heic|heif)$/i.test(f.name));
      if (arr.length === 0) return;

      for (const file of arr) {
        const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        setUploading((u) => [...u, { id, name: file.name, status: 'processing' }]);

        try {
          const form = new FormData();
          form.append('file', file);
          form.append('slug', selected.slug);
          form.append('mode', 'contain');

          const res = await fetch('/api/admin/upload-image', {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: form,
          });
          const data = await res.json();

          if (data.ok) {
            setImages((imgs) => [...imgs, data.url]);
            setDirty(true);
            setUploading((u) =>
              u.map((it) => (it.id === id ? { ...it, status: 'done' } : it)),
            );
            // limpiar el "done" después de un rato
            setTimeout(
              () => setUploading((u) => u.filter((it) => it.id !== id)),
              1500,
            );
          } else {
            setUploading((u) =>
              u.map((it) =>
                it.id === id ? { ...it, status: 'error', error: data.error } : it,
              ),
            );
          }
        } catch {
          setUploading((u) =>
            u.map((it) =>
              it.id === id
                ? { ...it, status: 'error', error: 'Error de conexión' }
                : it,
            ),
          );
        }
      }
    },
    [selected, token],
  );

  function moveImage(from: number, to: number) {
    if (to < 0 || to >= images.length) return;
    setImages((imgs) => {
      const next = [...imgs];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
    setDirty(true);
  }

  function makePrimary(i: number) {
    moveImage(i, 0);
  }

  function removeImage(i: number) {
    setImages((imgs) => imgs.filter((_, idx) => idx !== i));
    setDirty(true);
  }

  async function handleSave() {
    if (!selected || !token) return;
    setSaving(true);
    setSaveMsg(null);
    try {
      const res = await fetch('/api/admin/save-product-images', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug: selected.slug, imageUrls: images }),
      });
      const data = await res.json();
      if (data.ok) {
        setSaveMsg('✓ Guardado. Los cambios ya están en el sitio.');
        setDirty(false);
        // actualizar el producto en la lista local
        setProducts((ps) =>
          ps.map((p) => (p.slug === selected.slug ? { ...p, images } : p)),
        );
      } else {
        setSaveMsg('✗ ' + (data.error ?? 'No se pudo guardar'));
      }
    } catch {
      setSaveMsg('✗ Error de conexión');
    } finally {
      setSaving(false);
    }
  }

  const filtered = products.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-ink-900 text-paper-100 flex flex-col">
      {/* Barra superior */}
      <header className="bg-ink-900 border-b border-ink-700 px-4 py-3 flex items-center justify-between sticky top-0 z-20">
        <Link
          href="/admin"
          className="text-[11px] font-semibold uppercase tracking-widest text-white/75 hover:text-paper-100"
        >
          ← Volver al panel
        </Link>
        <div className="text-[10px] uppercase tracking-widest text-rust-200">
          Imágenes de productos
        </div>
      </header>

      <main className="flex-1 max-w-[70rem] w-full mx-auto px-4 py-6 md:py-10">
        <div className="mb-6">
          <h1 className="font-display font-bold uppercase text-2xl md:text-3xl m-0 mb-1">
            Subir imágenes
          </h1>
          <p className="text-white/70 text-sm">
            Elegí un producto, subí las fotos (cualquier formato) y ordenalas.
            Se encuadran solas al formato de la web.
          </p>
        </div>

        {loading ? (
          <p className="text-white/60 text-sm">Cargando productos…</p>
        ) : !selected ? (
          /* ─── Selector de producto ─── */
          <div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar producto por nombre…"
              className="w-full bg-ink-700 border border-ink-500 rounded-[2px] px-4 py-3 text-paper-100 text-sm mb-4 focus:outline-none focus:border-rust-200 placeholder:text-white/30"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {filtered.map((p) => (
                <button
                  key={p.slug}
                  onClick={() => selectProduct(p)}
                  className="flex items-center gap-3 bg-ink-700 border border-ink-500 rounded-[2px] p-3 text-left hover:border-rust-200 transition-colors"
                >
                  <div
                    className="w-12 h-14 bg-ink-900 bg-contain bg-no-repeat bg-center rounded-[2px] flex-shrink-0"
                    style={{
                      backgroundImage: p.images[0]
                        ? `url("${p.images[0]}")`
                        : undefined,
                    }}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-paper-100 truncate">
                      {p.title}
                    </p>
                    <p className="text-[11px] text-white/50">
                      {p.images.length}{' '}
                      {p.images.length === 1 ? 'imagen' : 'imágenes'}
                      {!p.active && ' · oculto'}
                    </p>
                  </div>
                </button>
              ))}
              {filtered.length === 0 && (
                <p className="text-white/50 text-sm col-span-full">
                  No se encontraron productos.
                </p>
              )}
            </div>
          </div>
        ) : (
          /* ─── Editor de imágenes del producto ─── */
          <div>
            <button
              onClick={() => selectProduct(selected)}
              className="hidden"
            />
            <div className="flex items-center justify-between mb-5">
              <div>
                <button
                  onClick={() => {
                    if (dirty && !confirm('Tenés cambios sin guardar. ¿Descartarlos?')) return;
                    setSelected(null);
                    setDirty(false);
                  }}
                  className="text-[11px] uppercase tracking-widest text-white/60 hover:text-white/90 mb-1"
                >
                  ← Cambiar producto
                </button>
                <h2 className="font-display font-bold text-xl uppercase m-0">
                  {selected.title}
                </h2>
              </div>
            </div>

            {/* Zona de subida */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                uploadFiles(e.dataTransfer.files);
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-[4px] p-8 text-center cursor-pointer transition-colors mb-5 ${
                dragOver
                  ? 'border-rust-200 bg-rust-200/5'
                  : 'border-ink-500 hover:border-white/40'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.heic,.heif"
                multiple
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) uploadFiles(e.target.files);
                  e.target.value = '';
                }}
              />
              <p className="text-paper-100 font-medium mb-1">
                Arrastrá las fotos acá o tocá para elegir
              </p>
              <p className="text-white/50 text-xs">
                JPG, PNG, HEIC (iPhone) y más. Se convierten y encuadran solas.
              </p>
            </div>

            {/* Progreso de subida */}
            {uploading.length > 0 && (
              <div className="mb-5 space-y-1">
                {uploading.map((it) => (
                  <div
                    key={it.id}
                    className="flex items-center gap-2 text-xs bg-ink-700 rounded-[2px] px-3 py-2"
                  >
                    <span className="text-white/80 truncate flex-1">
                      {it.name}
                    </span>
                    {it.status === 'processing' && (
                      <span className="text-rust-200">Procesando…</span>
                    )}
                    {it.status === 'done' && (
                      <span className="text-[#8FB87A]">✓ Listo</span>
                    )}
                    {it.status === 'error' && (
                      <span className="text-rust-200">✗ {it.error}</span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Grid de imágenes actuales */}
            {images.length === 0 ? (
              <p className="text-white/50 text-sm mb-5">
                Este producto todavía no tiene imágenes. Subí la primera arriba.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
                {images.map((url, i) => (
                  <div
                    key={url}
                    className="relative bg-ink-700 rounded-[2px] overflow-hidden border border-ink-500"
                  >
                    <div
                      className="w-full bg-[#FAFAFA] bg-contain bg-no-repeat bg-center"
                      style={{ aspectRatio: '4/5', backgroundImage: `url("${url}")` }}
                    />
                    {i === 0 && (
                      <span className="absolute top-1.5 left-1.5 bg-rust-500 text-paper-100 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-[2px]">
                        Principal
                      </span>
                    )}
                    {/* Controles */}
                    <div className="flex items-center justify-between gap-1 p-1.5 bg-ink-900">
                      <div className="flex gap-1">
                        <button
                          onClick={() => moveImage(i, i - 1)}
                          disabled={i === 0}
                          title="Mover antes"
                          className="w-7 h-7 flex items-center justify-center rounded-[2px] bg-ink-700 text-white/80 hover:bg-ink-500 disabled:opacity-30"
                        >
                          ←
                        </button>
                        <button
                          onClick={() => moveImage(i, i + 1)}
                          disabled={i === images.length - 1}
                          title="Mover después"
                          className="w-7 h-7 flex items-center justify-center rounded-[2px] bg-ink-700 text-white/80 hover:bg-ink-500 disabled:opacity-30"
                        >
                          →
                        </button>
                      </div>
                      <div className="flex gap-1">
                        {i !== 0 && (
                          <button
                            onClick={() => makePrimary(i)}
                            title="Hacer principal"
                            className="w-7 h-7 flex items-center justify-center rounded-[2px] bg-ink-700 text-rust-200 hover:bg-ink-500"
                          >
                            ★
                          </button>
                        )}
                        <button
                          onClick={() => removeImage(i)}
                          title="Quitar"
                          className="w-7 h-7 flex items-center justify-center rounded-[2px] bg-ink-700 text-rust-200 hover:bg-rust-500 hover:text-paper-100"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Guardar */}
            <div className="flex items-center gap-3 flex-wrap sticky bottom-0 bg-ink-900 py-4 border-t border-ink-700">
              <button
                onClick={handleSave}
                disabled={saving || !dirty}
                className="bg-rust-500 text-paper-100 px-6 py-3 text-sm font-semibold uppercase tracking-wider rounded-[2px] hover:bg-rust-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? 'Guardando…' : 'Guardar cambios →'}
              </button>
              {dirty && !saving && (
                <span className="text-white/50 text-xs">Cambios sin guardar</span>
              )}
              {saveMsg && (
                <span
                  className={`text-sm ${saveMsg.startsWith('✓') ? 'text-[#8FB87A]' : 'text-rust-200'}`}
                >
                  {saveMsg}
                </span>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
