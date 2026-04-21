import Link from 'next/link';
import { ReactNode } from 'react';

type Variant = 'primary' | 'accent' | 'ghost-inverse' | 'dark' | 'outline';
type Size = 'md' | 'sm' | 'lg';

type ButtonProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  size?: Size;
  className?: string;
  type?: 'button' | 'submit';
  'aria-label'?: string;
};

const variantStyles: Record<Variant, string> = {
  primary:
    'bg-paper-100 text-ink-900 border-[1.5px] border-paper-100 hover:bg-paper-200',
  accent:
    'bg-rust-500 text-paper-100 border-[1.5px] border-rust-500 hover:bg-rust-700 hover:border-rust-700',
  'ghost-inverse':
    'bg-transparent text-paper-100 border-2 border-paper-100 hover:bg-paper-100 hover:text-ink-900',
  dark:
    'bg-ink-900 text-paper-100 border-[1.5px] border-ink-900 hover:bg-ink-700 hover:border-ink-700',
  outline:
    'bg-transparent text-ink-900 border-[1.5px] border-ink-900 hover:bg-ink-900 hover:text-paper-100',
};

const sizeStyles: Record<Size, string> = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-sm',
};

export function Button({
  children,
  href,
  onClick,
  variant = 'dark',
  size = 'md',
  className = '',
  type = 'button',
  'aria-label': ariaLabel,
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 font-body font-semibold uppercase tracking-wider transition-all duration-200 active:translate-y-px no-underline whitespace-nowrap';
  const classes = `${base} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;

  if (href) {
    const isExternal = href.startsWith('http') || href.startsWith('mailto:');
    if (isExternal) {
      return (
        <a href={href} className={classes} aria-label={ariaLabel} target="_blank" rel="noopener">
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }
  return (
    <button onClick={onClick} type={type} className={classes} aria-label={ariaLabel}>
      {children}
    </button>
  );
}
