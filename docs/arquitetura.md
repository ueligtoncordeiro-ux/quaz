# Arquitetura

## Decisao Principal

Usar um monorepo privado no GitHub, com apps separados e pacotes compartilhados. Hospedar apps Next.js na Vercel, usar Cloudflare para DNS/SSL/CDN e Supabase para banco, autenticacao e storage.

## Estrutura Do Repositorio

```txt
quaz-di-graca/
├── apps/
│   ├── web/
│   ├── app/
│   ├── partner/
│   └── admin/
├── packages/
│   ├── ui/
│   ├── config/
│   ├── database/
│   ├── auth/
│   └── types/
├── docs/
│   ├── documento-mestre.md
│   ├── arquitetura.md
│   ├── jornadas.md
│   ├── banco-de-dados.md
│   ├── roadmap.md
│   └── decisoes.md
└── README.md
```

## Apps

`apps/web`

Site institucional com home, como funciona, seja parceiro, onde estamos, central de ajuda, blog e paginas legais.

`apps/app`

Web app do consumidor para buscar achados, comprar, acompanhar pedidos, avaliar e abrir suporte.

`apps/partner`

Painel do parceiro para configurar loja, criar achados, acompanhar pedidos, confirmar retirada e ver financeiro.

`apps/admin`

Admin interno para aprovar parceiros, moderar ofertas, acompanhar pedidos, suporte, pagamentos, cupons e cidades.

## Infraestrutura

Cloudflare:

- DNS.
- SSL.
- CDN.
- redirecionamentos.
- protecao basica.

Vercel:

- deploy dos apps Next.js.
- previews por branch/pull request.
- integracao com GitHub.

Supabase:

- PostgreSQL.
- Auth.
- Storage.
- Row Level Security.
- funcoes/APIs simples quando necessario.

Mercado Pago:

- Pix.
- cartao de credito.
- webhooks de confirmacao.

## Ambientes

```txt
development
preview
production
```

Variaveis de ambiente devem ficar fora do Git e ser configuradas na Vercel/Supabase.

## IA

IA deve entrar primeiro em funcoes assistidas, nao em decisoes criticas automaticas:

- gerar descricao de Achado Quaz.
- sugerir preco.
- resumir avaliacoes.
- triagem de suporte.
- chatbot de ajuda.

No MVP, qualquer alteracao importante sugerida por IA deve exigir confirmacao humana.

