/**
 * Manifesto strip — línea editorial con dots geométricos a los costados y al medio.
 * Display font tight, letter-spacing + max-size generoso.
 * Borders top/bottom dividen del resto del flujo.
 */
export function Manifesto({
  phrase1 = 'Real stories',
  phrase2 = 'Real clothes',
}: {
  phrase1?: string;
  phrase2?: string;
}) {
  return (
    <section
      aria-label={`${phrase1} · ${phrase2}`}
      className="border-y border-[var(--color-border)] py-5 lg:py-6 overflow-hidden"
    >
      <p className="flex items-center justify-between w-full px-5 lg:px-8 m-0 font-display font-normal uppercase whitespace-nowrap text-ink-400"
        style={{
          fontSize: 'clamp(1rem, 4.8vw, 5.5rem)',
          lineHeight: 1,
          letterSpacing: '0.01em',
          textShadow: '0 1px 2px rgba(14,14,14,0.06), 0 6px 18px rgba(14,14,14,0.08)',
        }}
      >
        <span
          aria-hidden="true"
          className="w-[0.16em] h-[0.16em] rounded-full bg-ink-400 flex-shrink-0 block"
        />
        <span className="flex-shrink-0">{phrase1}</span>
        <span
          aria-hidden="true"
          className="w-[0.16em] h-[0.16em] rounded-full bg-ink-400 flex-shrink-0 block"
        />
        <span className="flex-shrink-0">{phrase2}</span>
        <span
          aria-hidden="true"
          className="w-[0.16em] h-[0.16em] rounded-full bg-ink-400 flex-shrink-0 block"
        />
      </p>
    </section>
  );
}
