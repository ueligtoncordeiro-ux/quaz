import type { Metadata } from "next";
import { SiteFooter } from "./components/SiteFooter";
import "./styles.css";

export const metadata: Metadata = {
  title: "Quaz di Graca",
  description: "Comida boa, preco quaz, desperdicio nao.",
  icons: {
    icon: "/logo-quaz.png"
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
