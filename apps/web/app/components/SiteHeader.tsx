import Image from "next/image";
import Link from "next/link";

const navItems = [
  { href: "/como-funciona", label: "Como funciona" },
  { href: "/onde-estamos", label: "Onde estamos" },
  { href: "/seja-parceiro", label: "Parceiros" },
  { href: "/ajuda", label: "Ajuda" }
];

export function SiteHeader() {
  return (
    <header className="nav">
      <Link href="/" aria-label="Página inicial Quáz di Graça">
        <Image
          src="/logo-quaz.png"
          alt="Quáz di Graça"
          width={168}
          height={112}
          priority
          className="navLogo"
        />
      </Link>
      <nav aria-label="Navegação principal">
        {navItems.map((item) => (
          <Link href={item.href} key={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
