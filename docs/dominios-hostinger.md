# Dominios Hostinger

Dominios atuais:

- `quazdigraca.com.br` como dominio principal.
- `quazdigraca.com` como dominio secundario, redirecionando para o `.com.br`.

## Quando Vincular

Vincular depois do primeiro deploy na Vercel. Assim validamos build, variaveis de ambiente e rotas antes de mexer no DNS publico.

## Configuracao Recomendada

1. Na Vercel, adicionar os quatro dominios ao projeto `quaz-web`:
   - `quazdigraca.com.br`
   - `www.quazdigraca.com.br`
   - `quazdigraca.com`
   - `www.quazdigraca.com`
2. Manter `quazdigraca.com.br` como dominio principal.
3. No Hostinger, abrir a zona DNS de cada dominio e seguir exatamente os registros que a Vercel solicitar.
4. Preferir:
   - `A` no dominio raiz apontando para o IP informado pela Vercel.
   - `CNAME` em `www` apontando para o destino informado pela Vercel.
5. Aguardar propagacao. Normalmente leva minutos, mas pode chegar a algumas horas.

## Regra No Codigo

O middleware do app redireciona automaticamente:

- `quazdigraca.com` para `quazdigraca.com.br`
- `www.quazdigraca.com` para `quazdigraca.com.br`
- `www.quazdigraca.com.br` para `quazdigraca.com.br`

Isso evita conteudo duplicado e concentra SEO no dominio principal.
