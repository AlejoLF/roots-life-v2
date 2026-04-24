'use client';

import { useState } from 'react';

export function TrackingActions({ token }: { token: string }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    if (loading) return;
    if (!confirm('¿Confirmás que ya recibiste el pedido? Este click activa la ventana de reclamos de 7 días.')) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/orders/${token}/confirm-delivery`, {
        method: 'POST',
      });
      const data = await res.json();
      if (!data.ok) {
        setError(data.error ?? 'No pudimos marcarlo como entregado.');
        setLoading(false);
        return;
      }
      setDone(true);
      // Recargar para mostrar el estado delivered
      setTimeout(() => window.location.reload(), 1000);
    } catch {
      setError('Error de conexión. Intentá de nuevo.');
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="bg-[#E8F3E0] border border-[#5A7E4A] rounded-[4px] p-5 text-center mb-6">
        <p className="text-[#3D5A2D] text-sm font-medium">
          ✓ Marcado como recibido. Actualizando...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[var(--color-border)] rounded-[4px] p-5 mb-6">
      <p className="text-caption text-ink-500 mb-2">¿Ya lo recibiste?</p>
      <p className="text-body-sm text-ink-700 mb-4 leading-relaxed">
        Si ya tenés el paquete en tus manos, confirmalo acá. Se activa la
        ventana de 7 días para cambios y reclamos.
      </p>
      <button
        type="button"
        onClick={handleConfirm}
        disabled={loading}
        className="w-full bg-ink-900 text-paper-100 border-[1.5px] border-ink-900 hover:bg-ink-700 hover:border-ink-700 px-6 py-3 text-sm font-body font-semibold uppercase tracking-wider transition-all disabled:opacity-60"
      >
        {loading ? 'Confirmando...' : 'Ya lo recibí ✓'}
      </button>
      {error && <p className="text-rust-500 text-xs mt-3">{error}</p>}
    </div>
  );
}
