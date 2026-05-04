import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { NewsletterPopup } from "@/components/NewsletterPopup";
import { Providers } from "@/components/Providers";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.rootslife.com.ar";
const OG_IMAGE = `${SITE_URL}/og.jpg`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
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
    url: SITE_URL,
    siteName: "ROOTS LIFE",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "ROOTS LIFE · Indumentaria urbana desde la Patagonia",
      },
    ],
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ROOTS LIFE",
    description: "Indumentaria urbana desde la Patagonia",
    images: [OG_IMAGE],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-AR" className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Providers>
          {children}
          <NewsletterPopup />
        </Providers>
      </body>
    </html>
  );
}
