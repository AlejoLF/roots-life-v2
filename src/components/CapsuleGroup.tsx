import { ReactNode } from 'react';

type CapsuleGroupProps = {
  id?: string;
  capsuleId: string;
  caption: string;
  title: string;
  description?: string;
  children: ReactNode;
};

/**
 * Grupo de cápsula — contenedor editorial para productos dentro de una colección.
 * Header jerárquico: caption pequeño + título display + descripción body.
 */
export function CapsuleGroup({
  id,
  capsuleId,
  caption,
  title,
  description,
  children,
}: CapsuleGroupProps) {
  return (
    <div
      id={id || capsuleId}
      data-capsule={capsuleId}
      className="capsule-group"
    >
      <header className="mb-8 lg:mb-10 max-w-[56ch]">
        <p className="text-caption text-ink-500 mb-2">{caption}</p>
        <h2 className="text-display-lg mb-3">{title}</h2>
        {description && (
          <p className="text-body text-ink-500 max-w-[50ch]">{description}</p>
        )}
      </header>
      {children}
    </div>
  );
}

/**
 * Grid responsive para cápsulas — 2 cols mobile, 3 tablet, 4 desktop.
 */
export function CapsuleGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
      {children}
    </div>
  );
}
