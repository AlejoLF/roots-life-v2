import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cómo usar el panel · Admin · ROOTS LIFE',
  robots: { index: false, follow: false, nocache: true },
};

export default function AyudaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
