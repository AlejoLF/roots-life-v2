import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Imágenes · Admin · ROOTS LIFE',
  robots: { index: false, follow: false, nocache: true },
};

export default function ImagenesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
