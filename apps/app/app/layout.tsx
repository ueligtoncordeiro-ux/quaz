import type { Metadata } from "next";
import { brand } from "@quaz/config";
import "./styles.css";

export const metadata: Metadata = {
  title: `App | ${brand.displayName}`,
  description: "Encontre Achados Quáz perto de você.",
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
      <body>{children}</body>
    </html>
  );
}
