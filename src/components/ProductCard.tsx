import Link from 'next/link';

export type ProductCardProps = {
  image: string;
  caption: string;
  title: string;
  price: string;
  href?: string;
  badge?: 'new' | 'sold' | 'soon' | string;
  placeholder?: string;
};

const badgeStyles: Record<string, string> = {
  new: 'bg-ink-900 text-paper-100',
  sold: 'bg-ink-200 text-ink-700',
  soon: 'bg-paper-300 text-ink-700',
};

export function ProductCard({
  image,
  caption,
  title,
  price,
  href = '/producto',
  badge,
  placeholder,
}: ProductCardProps) {
  const badgeClass =
    badge && badgeStyles[badge]
      ? badgeStyles[badge]
      : 'bg-rust-500 text-paper-100';

  const badgeLabel =
    badge === 'new'
      ? 'Nuevo'
      : badge === 'sold'
      ? 'Agotado'
      : badge === 'soon'
      ? 'Próximamente'
      : badge;

  const isSoon = badge === 'soon';

  return (
    <Link
      href={href}
      className={`group flex flex-col no-underline text-inherit ${isSoon ? 'pointer-events-none' : ''}`}
      aria-disabled={isSoon}
    >
      <div
        className="relative bg-paper-200 bg-contain bg-no-repeat bg-center rounded-sm overflow-hidden mb-4 shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:scale-[1.02]"
        style={{
          aspectRatio: 'var(--aspect-product)',
          backgroundImage: image && !isSoon ? `url("${image}")` : undefined,
        }}
      >
        {badge && (
          <span
            className={`absolute top-3 left-3 px-2 py-1 rounded-[2px] text-caption ${badgeClass}`}
          >
            {badgeLabel}
          </span>
        )}
        {isSoon && placeholder && (
          <span className="absolute inset-0 flex items-center justify-center text-display-lg text-ink-300">
            {placeholder}
          </span>
        )}
      </div>
      <p className="text-caption text-ink-500 m-0 mb-1">{caption}</p>
      <h3 className="text-h4 m-0 mb-1 group-hover:text-rust-500 transition-colors">
        {title}
      </h3>
      <p className="text-body-sm text-ink-500 m-0">{price}</p>
    </Link>
  );
}
