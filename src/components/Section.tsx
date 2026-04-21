import { ReactNode } from 'react';
import Link from 'next/link';

type SectionProps = {
  children: ReactNode;
  className?: string;
  caption?: string;
  title?: string;
  linkText?: string;
  linkHref?: string;
  variant?: 'standard' | 'compact' | 'editorial';
  align?: 'left' | 'center';
  id?: string;
};

const variantPadding: Record<NonNullable<SectionProps['variant']>, string> = {
  standard: 'py-16 lg:py-24',      // 64/96 — section-rhythm
  compact: 'py-12 lg:py-16',       // 48/64 — section-rhythm-compact
  editorial: 'py-16 lg:py-32',     // 64/128 — section-rhythm-editorial
};

export function Section({
  children,
  className = '',
  caption,
  title,
  linkText,
  linkHref,
  variant = 'standard',
  align = 'left',
  id,
}: SectionProps) {
  const alignClasses = align === 'center' ? 'text-center items-center' : 'text-left';

  return (
    <section id={id} className={`${variantPadding[variant]} ${className}`}>
      <div className="w-full max-w-[75rem] mx-auto px-4 md:px-8 lg:px-12">
        {(title || caption) && (
          <div
            className={`flex ${align === 'center' ? 'flex-col items-center' : 'justify-between items-baseline'} flex-wrap gap-4 mb-10 lg:mb-12`}
          >
            <div className={`flex flex-col gap-1 ${alignClasses}`}>
              {caption && <p className="text-caption text-ink-500 m-0">{caption}</p>}
              {title && <h2 className="text-h2 m-0">{title}</h2>}
            </div>
            {linkText && linkHref && (
              <Link
                href={linkHref}
                className="text-button text-ink-900 no-underline hover:text-rust-500 transition-colors"
              >
                {linkText} →
              </Link>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
