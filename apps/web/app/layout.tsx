import type { Metadata } from "next";
import { Baloo_2 } from "next/font/google";
import { brand } from "@quaz/config";
import { SiteFooter } from "./components/SiteFooter";
import "./styles.css";

const baloo = Baloo_2({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-baloo",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(brand.siteUrl),
  title: "Quáz di Graça",
  description: "Comida boa, preço quáz, desperdício não.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Quáz di Graça",
    description: "Comida boa, preço quáz, desperdício não.",
    url: brand.siteUrl,
    siteName: "Quáz di Graça",
    locale: "pt_BR",
    type: "website"
  },
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={baloo.variable}>
      <body>
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
