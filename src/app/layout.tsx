import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s · ROOTS LIFE",
    default: "ROOTS LIFE · Indumentaria urbana desde la Patagonia",
  },
  description:
    "Remeras y buzos gráficos nacidos en Comodoro Rivadavia. Real Stories. Real clothes.",
  icons: { icon: "/logos/imagotipo.svg" },
  openGraph: {
    title: "ROOTS LIFE",
    description: "Indumentaria urbana desde la Patagonia",
    locale: "es_AR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-AR" className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
