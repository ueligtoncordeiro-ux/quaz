import Link from "next/link";

const links = [
  { href: "/como-funciona", label: "Como funciona" },
  { href: "/onde-estamos", label: "Onde estamos" },
  { href: "/seja-parceiro", label: "Seja parceiro" },
  { href: "/ajuda", label: "Ajuda" },
  { href: "/termos", label: "Termos" },
  { href: "/privacidade", label: "Privacidade" }
];

export function SiteFooter() {
  return (
    <footer className="footer">
      <div>
        <strong>Quaz di Graca</strong>
        <p>comida boa, preco quaz, desperdicio nao.</p>
      </div>
      <nav aria-label="Links de rodape">
        {links.map((link) => (
          <Link href={link.href} key={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>
    </footer>
  );
}
