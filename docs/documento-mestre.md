# Documento Mestre: Quaz di Graca

## Visao

Quaz di Graca e uma plataforma digital para transformar desperdicio em oportunidade. A proposta e conectar consumidores a restaurantes, padarias, mercados e comercios locais com excedentes, produtos de ultima hora ou itens proximos do vencimento por precos muito reduzidos.

Frase-guia da marca:

```txt
comida boa, preco quaz, desperdicio nao.
```

Em materiais finais com acentuacao:

```txt
comida boa, preço quáz, desperdício não.
```

## Proposta De Valor

Para consumidores:

- encontrar comida boa perto de casa ou do trabalho.
- pagar menos.
- descobrir estabelecimentos locais.
- participar de uma rotina com menos desperdicio.

Para parceiros:

- transformar excedente em receita.
- reduzir perdas.
- atrair novos clientes.
- melhorar indicadores de impacto.

Para a plataforma:

- intermediar descoberta, pedido, pagamento, suporte e confianca.
- gerar dados de demanda, impacto e operacao.
- criar uma marca popular, alegre e sustentavel.

## Produto

Nome da oferta padrao:

```txt
Achado Quaz
```

Fluxo principal:

```txt
Consumidor encontra achados proximos
-> compra no app/web app
-> recebe codigo de retirada
-> retira no estabelecimento ou recebe entrega futura
-> avalia
-> impacto pessoal e da loja e atualizado
```

## Plataformas

Estrutura inicial:

```txt
Site publico
Web app consumidor
Painel parceiro
Admin interno
Banco/auth/storage
Pagamentos
Suporte
IA operacional
```

Subdominios recomendados:

```txt
quazdegraca.com.br
app.quazdegraca.com.br
parceiro.quazdegraca.com.br
admin.quazdegraca.com.br
```

Se `quazedegraca.com.br` tambem estiver disponivel, comprar e redirecionar para o dominio principal.

## Estrategia De MVP

Comecar com web app responsivo, nao app nativo. Isso reduz custo, acelera validacao e permite testar mercado antes de publicar nas lojas.

Primeira entrega funcional:

- site institucional.
- cadastro/login de consumidor.
- cadastro/login de parceiro.
- lista de achados.
- detalhe de estabelecimento.
- detalhe de achado.
- pedido com pagamento ou pagamento simulado.
- painel parceiro para criar achados e confirmar retirada.
- admin simples para aprovar parceiros e acompanhar pedidos.

## Stack Recomendada

```txt
GitHub privado
Next.js
Vercel
Cloudflare
Supabase PostgreSQL
Supabase Auth
Supabase Storage
Mercado Pago
Resend ou Brevo
React Native + Expo no futuro
OpenAI API para IA pontual
```

## Principios

- validar rapido antes de escalar.
- manter custos baixos.
- usar marca propria, sem copiar concorrentes.
- priorizar experiencia mobile.
- deixar regras simples no MVP.
- preparar arquitetura para crescer sem microservicos prematuros.

