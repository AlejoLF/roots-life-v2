import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Guía de uso · Admin · ROOTS LIFE',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function GuiaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
