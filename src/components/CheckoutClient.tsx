'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { useCart } from '@/hooks/useCart';
import { clearCart } from '@/lib/cart';

type InitialData = { email: string; firstName: string; lastName: string } | null;

type ShippingEstimate = { cost: number; label: string };

const PROVINCES = [
  'Buenos Aires', 'CABA', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba',
  'Corrientes', 'Entre Ríos', 'Formosa', 'Jujuy', 'La Pampa', 'La Rioja',
  'Mendoza', 'Misiones', 'Neuquén', 'Río Negro', 'Salta', 'San Juan',
  'San Luis', 'Santa Cruz', 'Santa Fe', 'Santiago del Estero',
  'Tierra del Fuego', 'Tucumán',
];

function formatARS(n: number) {
  return '$' + n.toLocaleString('es-AR');
}

function estimateShipping(province: string, subtotal: number): ShippingEstimate {
  if (subtotal >= 80000) return { cost: 0, label: 'Envío gratis · Mercado Envíos' };
  const low = ['Chubut', 'Santa Cruz', 'Río Negro'];
  const high = ['Tierra del Fuego', 'Misiones', 'Formosa', 'Jujuy', 'Salta'];
  if (low.includes(province)) return { cost: 3500, label: 'Mercado Envíos · 2-4 días' };
  if (high.includes(province)) return { cost: 7500, label: 'Mercado Envíos · 7-12 días' };
  return { cost: 5500, label: 'Mercado Envíos · 4-7 días' };
}

export function CheckoutClient({ initialData }: { initialData: InitialData }) {
  const router = useRouter();
  const { items, isReady } = useCart();

  const [firstName, setFirstName] = useState(initialData?.firstName ?? '');
  const [lastName, setLastName] = useState(initialData?.lastName ?? '');
  const [email, setEmail] = useState(initialData?.email ?? '');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [streetNumber, setStreetNumber] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('Chubut');
  const [zip, setZip] = useState('');
  const [notes, setNotes] = useState('');

  const [discountInput, setDiscountInput] = useState('');
  const [discountApplied, setDiscountApplied] = useState<{
    code: string;
    percentage: number;
  } | null>(null);
  const [discountError, setDiscountError] = useState<string | null>(null);
  const [validatingDiscount, setValidatingDiscount] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirigir si el carrito está vacío
  useEffect(() => {
    if (isReady && items.length === 0) {
      router.push('/catalogo');
    }
  }, [isReady, items.length, router]);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = estimateShipping(province, subtotal);
  const discountAmount = discountApplied
    ? Math.round(subtotal * (discountApplied.percentage / 100))
    : 0;
  const total = subtotal + shipping.cost - discountAmount;

  async function handleApplyDiscount() {
    setDiscountError(null);
    if (!discountInput.trim()) return;
    setValidatingDiscount(true);
    try {
      const res = await fetch('/api/discount/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: discountInput.trim() }),
      });
      const data = await res.json();
      if (!data.ok) {
        setDiscountError(data.error ?? 'Código inválido');
        return;
      }
      setDiscountApplied({ code: data.code, percentage: data.percentage });
      setDiscountError(null);
    } catch {
      setDiscountError('Error de conexión. Intentá de nuevo.');
    } finally {
      setValidatingDiscount(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading || items.length === 0) return;
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/checkout/preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({
            slug: i.slug,
            title: i.title,
            image: i.image,
            price: i.price,
            quantity: i.quantity,
            size: i.size,
            color: i.color,
          })),
          shipping: {
            firstName,
            lastName,
            email,
            phone,
            street,
            streetNumber,
            apartment,
            city,
            province,
            zip,
            notes,
          },
          shippingCost: shipping.cost,
          discountCode: discountApplied?.code,
        }),
      });

      const data = await res.json();
      if (!data.ok) {
        setError(data.error ?? 'No pudimos crear el pedido. Intentá de nuevo.');
        setLoading(false);
        return;
      }

      // Limpiar carrito local y redirigir a MP
      clearCart();
      window.location.href = data.checkoutUrl;
    } catch {
      setError('Error de conexión. Intentá de nuevo.');
      setLoading(false);
    }
  }

  if (!isReady) {
    return (
      <div className="max-w-[75rem] mx-auto px-4 py-16 text-center">
        <p className="text-ink-500">Cargando...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="max-w-[75rem] mx-auto px-4 md:px-8 lg:px-12 py-10 lg:py-16">
      <div className="mb-8">
        <p className="text-caption text-ink-500 mb-2">Paso 2 de 2</p>
        <h1 className="text-display-lg m-0">Finalizar compra</h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8 lg:gap-12"
      >
        {/* Form de envío */}
        <div className="flex flex-col gap-8">
          <section className="bg-white border border-[var(--color-border)] rounded-[4px] p-5 md:p-6">
            <h2 className="text-h3 mb-4">Datos de contacto</h2>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Nombre"
                required
                value={firstName}
                onChange={setFirstName}
                autoComplete="given-name"
              />
              <Input
                label="Apellido"
                required
                value={lastName}
                onChange={setLastName}
                autoComplete="family-name"
              />
              <Input
                label="Email"
                type="email"
                required
                value={email}
                onChange={setEmail}
                autoComplete="email"
                className="col-span-2"
              />
              <Input
                label="Teléfono"
                type="tel"
                required
                value={phone}
                onChange={setPhone}
                autoComplete="tel"
                placeholder="Cel con código de área"
                className="col-span-2"
              />
            </div>
          </section>

          <section className="bg-white border border-[var(--color-border)] rounded-[4px] p-5 md:p-6">
            <h2 className="text-h3 mb-4">Dirección de envío</h2>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <Input
                label="Calle"
                required
                value={street}
                onChange={setStreet}
                autoComplete="street-address"
                className="md:col-span-4"
              />
              <Input
                label="Número"
                required
                value={streetNumber}
                onChange={setStreetNumber}
                className="md:col-span-2"
              />
              <Input
                label="Depto / Piso"
                value={apartment}
                onChange={setApartment}
                placeholder="(opcional)"
                className="md:col-span-2"
              />
              <Input
                label="Ciudad"
                required
                value={city}
                onChange={setCity}
                autoComplete="address-level2"
                className="md:col-span-4"
              />
              <Select
                label="Provincia"
                required
                value={province}
                onChange={setProvince}
                options={PROVINCES}
                className="md:col-span-4"
              />
              <Input
                label="CP"
                required
                value={zip}
                onChange={setZip}
                autoComplete="postal-code"
                className="md:col-span-2"
              />
              <Input
                label="Instrucciones (opcional)"
                value={notes}
                onChange={setNotes}
                placeholder="Timbre, horario, referencias..."
                className="md:col-span-6"
              />
            </div>
          </section>

          <section className="bg-white border border-[var(--color-border)] rounded-[4px] p-5 md:p-6">
            <h2 className="text-h3 mb-4">Envío</h2>
            <div className="flex items-center justify-between p-4 bg-paper-100 rounded-[2px]">
              <div>
                <p className="text-sm font-medium text-ink-900">{shipping.label}</p>
                <p className="text-xs text-ink-500 mt-1">
                  El código de seguimiento se envía por email al despachar.
                </p>
              </div>
              <p className="text-sm font-semibold text-ink-900 flex-shrink-0">
                {shipping.cost === 0 ? 'GRATIS' : formatARS(shipping.cost)}
              </p>
            </div>
          </section>

          <section className="bg-white border border-[var(--color-border)] rounded-[4px] p-5 md:p-6">
            <h2 className="text-h3 mb-4">Pago</h2>
            <div className="flex items-center gap-4 p-4 bg-paper-100 rounded-[2px]">
              <div className="w-12 h-12 bg-[#009EE3] rounded-[2px] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                MP
              </div>
              <div>
                <p className="text-sm font-medium text-ink-900">Mercado Pago</p>
                <p className="text-xs text-ink-500">
                  Tarjeta · Débito · Efectivo · Transferencia · Saldo MP
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Resumen sticky */}
        <aside className="lg:sticky lg:top-[88px] lg:self-start flex flex-col gap-4">
          <div className="bg-ink-900 text-paper-100 rounded-[4px] p-5 md:p-6 flex flex-col gap-4">
            <h2 className="text-caption text-rust-200">Resumen del pedido</h2>

            <ul className="list-none p-0 m-0 divide-y divide-ink-700">
              {items.map((item) => (
                <li key={item.id} className="py-3 flex items-center gap-3 text-sm">
                  <div
                    className="w-12 h-14 bg-ink-700 bg-cover bg-center flex-shrink-0 rounded-[2px]"
                    style={{ backgroundImage: `url("${item.image}")` }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-paper-100 truncate">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-white/60">
                      {[item.color, item.size].filter(Boolean).join(' · ')} · ×{item.quantity}
                    </p>
                  </div>
                  <span className="text-paper-100 flex-shrink-0 text-sm">
                    {formatARS(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            {/* Discount */}
            <div className="pt-3 border-t border-ink-700">
              {discountApplied ? (
                <div className="flex items-center justify-between bg-[#1c2a1c] border border-[#5A7A4A] rounded-[2px] p-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-[#8FB87A] mb-1">
                      ✓ Aplicado
                    </p>
                    <p className="text-sm text-paper-100 font-mono">
                      {discountApplied.code}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDiscountApplied(null)}
                    className="text-xs text-white/60 underline hover:text-white/90"
                  >
                    Quitar
                  </button>
                </div>
              ) : (
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-white/60 block mb-2">
                    Código de descuento
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={discountInput}
                      onChange={(e) =>
                        setDiscountInput(e.target.value.toUpperCase())
                      }
                      placeholder="ROOTS10-XXXXXX"
                      className="flex-1 bg-ink-700 border border-ink-500 rounded-[2px] px-3 py-2 text-sm text-paper-100 font-mono placeholder:text-white/30 focus:outline-none focus:border-rust-200"
                    />
                    <button
                      type="button"
                      onClick={handleApplyDiscount}
                      disabled={!discountInput.trim() || validatingDiscount}
                      className="px-4 py-2 border border-paper-100 text-paper-100 text-[10px] font-semibold uppercase tracking-widest rounded-[2px] hover:bg-paper-100 hover:text-ink-900 transition-colors disabled:opacity-40"
                    >
                      {validatingDiscount ? '...' : 'OK'}
                    </button>
                  </div>
                  {discountError && (
                    <p className="text-rust-200 text-xs mt-2">{discountError}</p>
                  )}
                </div>
              )}
            </div>

            {/* Totals */}
            <div className="pt-4 border-t border-ink-700 flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/75">Subtotal</span>
                <span>{formatARS(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/75">Envío</span>
                <span>
                  {shipping.cost === 0 ? 'Gratis' : formatARS(shipping.cost)}
                </span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-rust-200">
                  <span>Descuento</span>
                  <span>−{formatARS(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between items-baseline border-t border-ink-700 pt-3 mt-1">
                <span className="text-base font-medium">Total</span>
                <span className="text-2xl font-bold">{formatARS(total)}</span>
              </div>
            </div>

            {error && (
              <p className="text-rust-200 text-sm" role="alert">
                {error}
              </p>
            )}

            <Button
              type="submit"
              variant="accent"
              size="lg"
              className="w-full"
            >
              {loading ? 'Procesando...' : 'Pagar con Mercado Pago →'}
            </Button>

            <p className="text-[11px] text-white/60 text-center leading-relaxed">
              Al finalizar tu compra aceptás nuestros{' '}
              <Link href="/terminos" target="_blank" className="underline hover:text-white/90">
                términos
              </Link>{' '}
              y{' '}
              <Link href="/privacidad" target="_blank" className="underline hover:text-white/90">
                política de privacidad
              </Link>
              .
            </p>
          </div>

          <Link
            href="/carrito"
            className="text-body-sm text-ink-500 underline hover:text-ink-900 text-center"
          >
            ← Volver al carrito
          </Link>
        </aside>
      </form>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = 'text',
  required = false,
  autoComplete,
  placeholder,
  className = '',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
  className?: string;
}) {
  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      <span className="text-[10px] font-medium uppercase tracking-widest text-ink-700">
        {label}
        {required && <span className="text-rust-500"> *</span>}
      </span>
      <input
        type={type}
        value={value}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="bg-white border border-[var(--color-border)] rounded-[2px] px-3 py-2.5 text-ink-900 text-sm focus:outline-none focus:border-ink-900"
      />
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
  required = false,
  className = '',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      <span className="text-[10px] font-medium uppercase tracking-widest text-ink-700">
        {label}
        {required && <span className="text-rust-500"> *</span>}
      </span>
      <select
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="bg-white border border-[var(--color-border)] rounded-[2px] px-3 py-2.5 text-ink-900 text-sm focus:outline-none focus:border-ink-900"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}
