# Banco De Dados

## Banco

Usar Supabase PostgreSQL com Row Level Security desde o inicio.

## Papeis

```txt
consumer
partner
admin
```

## Tabelas Iniciais

```txt
lead_submissions
users
partners
stores
store_hours
addresses
cities
offer_categories
offers
orders
payments
payouts
reviews
support_tickets
coupons
notifications
impact_metrics
audit_logs
```

## lead_submissions

Tabela inicial para capturar interessados no site institucional antes do MVP transacional.

```txt
id
kind: consumer | partner
email
contact
business_name
source
status
user_agent
created_at
```

## users

```txt
id
name
email
phone
role
created_at
updated_at
```

## partners

```txt
id
user_id
business_name
document
status
created_at
updated_at
```

## stores

```txt
id
partner_id
name
description
document
address_id
latitude
longitude
phone
rating
status
created_at
updated_at
```

## offers

```txt
id
store_id
category_id
title
description
original_price
price
quantity_available
pickup_start
pickup_end
status
created_at
updated_at
```

## orders

```txt
id
user_id
store_id
offer_id
quantity
total_price
status
pickup_code
payment_id
delivery_type
created_at
updated_at
```

Status padrao:

```txt
pending
paid
confirmed
ready
picked_up
cancelled
refunded
expired
```

## payments

```txt
id
order_id
provider
method
amount
status
transaction_id
paid_at
created_at
updated_at
```

## reviews

```txt
id
user_id
store_id
order_id
rating
comment
created_at
```

## support_tickets

```txt
id
user_id
order_id
reason
description
status
created_at
updated_at
```

## Regras RLS

- consumidor le ofertas ativas e gerencia seus proprios pedidos.
- parceiro gerencia lojas, achados e pedidos vinculados ao seu cadastro.
- admin gerencia todos os dados operacionais.

## Observacao

O desenho final deve virar migration versionada antes do MVP transacional.
