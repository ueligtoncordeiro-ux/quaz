import type { Metadata } from "next";
import { SiteFooter } from "./components/SiteFooter";
import "./styles.css";

export const metadata: Metadata = {
  title: "Quáz di Graça",
  description: "Comida boa, preço quáz, desperdício não.",
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
