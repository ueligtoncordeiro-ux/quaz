import type { Metadata } from "next";
import { brand } from "@quaz/config";
import { SiteFooter } from "./components/SiteFooter";
import "./styles.css";

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
    <html lang="pt-BR">
      <body>
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
