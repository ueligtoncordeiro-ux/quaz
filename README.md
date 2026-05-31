# Quaz di Graca

Quaz di Graca e uma plataforma digital para conectar consumidores a restaurantes, padarias, mercados e comercios locais com excedentes, produtos de ultima hora ou itens proximos do vencimento por precos muito reduzidos.

Slogan:

```txt
comida boa, preco quaz, desperdicio nao.
```

## Estrutura

```txt
apps/
├── web/      # site institucional
├── app/      # web app do consumidor
├── partner/  # painel do parceiro
└── admin/    # admin interno

packages/
├── ui/        # componentes compartilhados
├── config/    # configuracoes compartilhadas
├── database/  # schema, migrations e clientes
├── auth/      # helpers de autenticacao
└── types/     # tipos compartilhados

docs/          # documentacao de produto, arquitetura e roadmap
```

## Stack Planejada

- Next.js
- Vercel
- Cloudflare
- Supabase PostgreSQL/Auth/Storage
- Mercado Pago
- React Native + Expo no futuro
- OpenAI API para recursos pontuais de IA

## Documentacao

Comece por:

- [Documento mestre](docs/documento-mestre.md)
- [Arquitetura](docs/arquitetura.md)
- [Jornadas](docs/jornadas.md)
- [Banco de dados](docs/banco-de-dados.md)
- [Roadmap](docs/roadmap.md)
- [Decisoes](docs/decisoes.md)
