'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/Button';

const shippingOptions = [
  { id: 'standard', label: 'Correo estándar', days: '5-7 días hábiles', price: 4500 },
  { id: 'express', label: 'Andreani express', days: '2-3 días hábiles', price: 8900 },
  { id: 'pickup', label: 'Retiro en Comodoro', days: 'Coordinamos por WhatsApp', price: 0 },
];

const paymentOptions = [
  { id: 'mp', label: 'Mercado Pago', desc: 'Débito, crédito y 3 cuotas sin interés' },
  { id: 'transfer', label: 'Transferencia bancaria', desc: '10% off sobre total' },
];

function formatARS(n: number) {
  return '$' + n.toLocaleString('es-AR');
}

export default function CheckoutPage() {
  const router = useRouter();
  const [shipping, setShipping] = useState('standard');
  const [payment, setPayment] = useState('mp');

  const subtotal = 48000;
  const shippingPrice = shippingOptions.find((s) => s.id === shipping)?.price ?? 0;
  const discount = payment === 'transfer' ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal + shippingPrice - discount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/gracias');
  };

  return (
    <>
      <Header />
      <main className="relative z-10 pt-[58px] lg:pt-[72px] flex-1">
        {/* Page head + steps */}
        <section className="max-w-[75rem] mx-auto px-4 md:px-8 lg:px-12 py-10 lg:py-16">
          <p className="text-caption text-ink-500 mb-2">Tu compra · Paso 2 de 3</p>
          <h1 className="text-display-lg m-0 mb-6">Checkout</h1>

          {/* Progress steps */}
          <div className="flex items-center gap-2 flex-wrap text-[10px] font-medium uppercase tracking-widest text-ink-300">
            <span className="inline-flex items-center gap-2 text-ink-700">
              <span className="w-[22px] h-[22px] flex items-center justify-center rounded-full bg-ink-900 text-paper-100 border border-ink-900">1</span>
              Carrito
            </span>
            <span className="w-7 h-px bg-ink-200" />
            <span className="inline-flex items-center gap-2 text-rust-500">
              <span className="w-[22px] h-[22px] flex items-center justify-center rounded-full bg-rust-500 text-paper-100 border border-rust-500">2</span>
              Datos y pago
            </span>
            <span className="w-7 h-px bg-ink-200" />
            <span className="inline-flex items-center gap-2">
              <span className="w-[22px] h-[22px] flex items-center justify-center rounded-full border border-current">3</span>
              Confirmación
            </span>
          </div>
        </section>

        <section className="max-w-[75rem] mx-auto px-4 md:px-8 lg:px-12 pb-16 grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8 lg:gap-12">
          <form onSubmit={handleSubmit} className="flex flex-col gap-10">
            {/* Contacto */}
            <fieldset className="m-0 p-0 border-0">
              <legend className="text-caption text-ink-700 mb-3 pb-3 border-b border-[var(--color-border)] w-full flex items-center gap-3">
                <span className="text-ink-900 font-semibold">01</span>
                <span>Contacto</span>
              </legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Email" type="email" required autoComplete="email" />
                <Field label="Teléfono" type="tel" required autoComplete="tel" placeholder="+54 9 297" />
                <Field label="Nombre y apellido" required autoComplete="name" className="md:col-span-2" />
                <Field label="DNI" required autoComplete="off" />
              </div>
            </fieldset>

            {/* Dirección */}
            <fieldset className="m-0 p-0 border-0">
              <legend className="text-caption text-ink-700 mb-3 pb-3 border-b border-[var(--color-border)] w-full flex items-center gap-3">
                <span className="text-ink-900 font-semibold">02</span>
                <span>Dirección de envío</span>
              </legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Provincia" required className="md:col-span-2" />
                <Field label="Ciudad" required />
                <Field label="Código postal" required />
                <Field label="Calle y número" required className="md:col-span-2" />
                <Field label="Departamento / aclaración" className="md:col-span-2" />
              </div>
            </fieldset>

            {/* Envío */}
            <fieldset className="m-0 p-0 border-0">
              <legend className="text-caption text-ink-700 mb-3 pb-3 border-b border-[var(--color-border)] w-full flex items-center gap-3">
                <span className="text-ink-900 font-semibold">03</span>
                <span>Método de envío</span>
              </legend>
              <div className="flex flex-col gap-3">
                {shippingOptions.map((opt) => (
                  <label key={opt.id} className={`flex gap-3 p-3 md:p-4 border-[1.5px] rounded-[4px] cursor-pointer transition-colors ${shipping === opt.id ? 'border-ink-900 bg-paper-200' : 'border-[var(--color-border)] hover:border-ink-500'}`}>
                    <input
                      type="radio"
                      name="shipping"
                      value={opt.id}
                      checked={shipping === opt.id}
                      onChange={() => setShipping(opt.id)}
                      className="w-5 h-5 mt-0.5 accent-ink-900"
                    />
                    <div className="flex-1 flex justify-between gap-4 flex-wrap items-baseline">
                      <div>
                        <p className="text-body font-medium m-0">{opt.label}</p>
                        <p className="text-body-sm text-ink-500 m-0">{opt.days}</p>
                      </div>
                      <p className="text-body font-medium m-0">{opt.price === 0 ? 'Gratis' : formatARS(opt.price)}</p>
                    </div>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Pago */}
            <fieldset className="m-0 p-0 border-0">
              <legend className="text-caption text-ink-700 mb-3 pb-3 border-b border-[var(--color-border)] w-full flex items-center gap-3">
                <span className="text-ink-900 font-semibold">04</span>
                <span>Forma de pago</span>
              </legend>
              <div className="flex flex-col gap-3">
                {paymentOptions.map((opt) => (
                  <label key={opt.id} className={`flex gap-3 p-3 md:p-4 border-[1.5px] rounded-[4px] cursor-pointer transition-colors ${payment === opt.id ? 'border-ink-900 bg-paper-200' : 'border-[var(--color-border)] hover:border-ink-500'}`}>
                    <input
                      type="radio"
                      name="payment"
                      value={opt.id}
                      checked={payment === opt.id}
                      onChange={() => setPayment(opt.id)}
                      className="w-5 h-5 mt-0.5 accent-ink-900"
                    />
                    <div>
                      <p className="text-body font-medium m-0">{opt.label}</p>
                      <p className="text-body-sm text-ink-500 m-0">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Submit */}
            <div className="flex justify-between gap-3 flex-wrap pt-4 border-t border-[var(--color-border)]">
              <Link href="/carrito" className="text-button text-ink-700 no-underline hover:text-ink-900 inline-flex items-center">
                ← Volver al carrito
              </Link>
              <Button type="submit" variant="dark" size="lg" className="flex-1 min-w-[240px]">
                Confirmar pedido · {formatARS(total)} →
              </Button>
            </div>
          </form>

          {/* Summary sticky */}
          <aside className="bg-paper-100 border border-[var(--color-border)] rounded-[4px] shadow-sm p-5 md:p-6 flex flex-col gap-4 lg:sticky lg:top-[88px] lg:self-start">
            <h2 className="text-h2 m-0">Tu pedido</h2>

            <ul className="list-none m-0 p-0 flex flex-col gap-4">
              <li className="grid grid-cols-[56px_1fr_auto] gap-3 items-center">
                <div className="relative w-14 h-[70px] bg-cover bg-center rounded-[2px]" style={{ backgroundImage: 'url("/images/remeras/Numerología/Numerología - Pegasus 2222 - negra.webp")' }}>
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-ink-900 text-paper-100 text-[11px] font-medium flex items-center justify-center">1</span>
                </div>
                <div>
                  <p className="text-caption text-ink-500 m-0">Numerología 22 22</p>
                  <p className="text-body-sm font-medium m-0">Pegasus 2222</p>
                  <p className="text-body-sm text-ink-500 m-0">Negro · M</p>
                </div>
                <p className="text-body-sm font-medium m-0">{formatARS(24000)}</p>
              </li>
              <li className="grid grid-cols-[56px_1fr_auto] gap-3 items-center">
                <div className="relative w-14 h-[70px] bg-cover bg-center rounded-[2px]" style={{ backgroundImage: 'url("/images/remeras/South Coast/South Coast - No bad days.webp")' }}>
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-ink-900 text-paper-100 text-[11px] font-medium flex items-center justify-center">1</span>
                </div>
                <div>
                  <p className="text-caption text-ink-500 m-0">South Coast Series</p>
                  <p className="text-body-sm font-medium m-0">No Bad Days</p>
                  <p className="text-body-sm text-ink-500 m-0">Crema · L</p>
                </div>
                <p className="text-body-sm font-medium m-0">{formatARS(24000)}</p>
              </li>
            </ul>

            <div className="border-t border-[var(--color-border)] pt-4 flex flex-col gap-2 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatARS(subtotal)}</span></div>
              <div className="flex justify-between text-ink-500"><span>Envío</span><span>{shippingPrice === 0 ? 'Gratis' : formatARS(shippingPrice)}</span></div>
              {discount > 0 && (
                <div className="flex justify-between text-moss-500"><span>Descuento (transferencia)</span><span>−{formatARS(discount)}</span></div>
              )}
              <div className="flex justify-between items-baseline border-t border-[var(--color-border)] pt-3 mt-1">
                <span className="text-body font-medium">Total</span>
                <span className="text-h3 font-semibold">{formatARS(total)}</span>
              </div>
            </div>

            <p className="text-stamp text-ink-500 text-center mt-2 flex items-center justify-center gap-1.5">
              <span aria-hidden>🔒</span>
              Pago seguro · SSL 256 bits
            </p>
          </aside>
        </section>
      </main>
      <Footer />
    </>
  );
}

function Field({
  label,
  type = 'text',
  required,
  autoComplete,
  placeholder,
  className = '',
}: {
  label: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
  className?: string;
}) {
  return (
    <label className={`flex flex-col gap-2 ${className}`}>
      <span className="text-[11px] font-medium uppercase tracking-widest text-ink-700">
        {label} {required && <span className="text-rust-500">*</span>}
      </span>
      <input
        type={type}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="h-12 px-3 border-[1.5px] border-[var(--color-border)] rounded-[4px] text-base bg-paper-100 focus:border-ink-900 focus:outline-none transition-colors"
      />
    </label>
  );
}
