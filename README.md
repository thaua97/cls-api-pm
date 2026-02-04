# CLS Project Manager (API)

API HTTP em **Node.js + TypeScript** para o desafio **CLS Manager**.

API Em produção: [ https://rs-transaction-api.onrender.com/health](https://rs-transaction-api.onrender.com/health)

Base URL (dev): `http://localhost:3333`

> [!WARNING]
> Para rodar localmente, garanta que o **Postgres** esteja rodando e que as **migrations do Prisma** foram aplicadas.

## Documentação

- **Requisitos do sistema**: `docs/REQUIREMENTS.md`
- **Rotas/contratos da API**: `docs/API_ROUTES.md`
- **Collection do Insomnia**: `docs/insomnia.collection.json`

## ADRs (Architecture Decision Records)

- `docs/adr/0001-clean-architecture-api.md`

## Requisitos

- Node.js (recomendado LTS)
- Docker (opcional, para subir Postgres via `docker-compose`)

## Variáveis de ambiente

Arquivo exemplo: `.env.exemple`

- `NODE_ENV`: `dev | test | prod` (default: `dev`)
- `DATABASE_URL`: string (obrigatório)
- `JWT_SECRET`: string (default: `dev-secret`)
- `PORT`: number (default: `3333`)
- `API_BASE_URL`: string (default: `http://localhost:3333`)

## Rodando a API

Instale as dependências:

```bash
npm install
```

Suba o Postgres (opcional):

```bash
docker compose up -d
```

Gere o client do Prisma:

```bash
npm run prisma:generate
```

Aplique migrations (ambiente local/dev):

```bash
npm run prisma:migrate
```

Suba em modo desenvolvimento:

```bash
npm run dev
```

Build + produção:

```bash
npm run build
npm run prod
```

## Comandos úteis

- `npm run dev`: server em watch (tsx)
- `npm run build`: build com `tsup`
- `npm run prod`: roda `node build/server.js`
- `npm run lint` / `npm run lint:fix`: lint
- `npm run test` / `npm run test:watch`: testes (Vitest)
- `npm run prisma:generate`: gera Prisma Client
- `npm run prisma:migrate`: `prisma migrate dev`
- `npm run prisma:deploy`: `prisma migrate deploy`
- `npm run prisma:studio`: Prisma Studio

## Bibliotecas (docs)

- **Fastify**: https://fastify.dev/docs/latest/
- **Prisma**: https://www.prisma.io/docs
- **Zod**: https://zod.dev/
- **JWT (Fastify JWT)**: https://github.com/fastify/fastify-jwt
- **Multipart (Fastify Multipart)**: https://github.com/fastify/fastify-multipart
- **Static (Fastify Static)**: https://github.com/fastify/fastify-static
- **PostgreSQL (`pg`)**: https://node-postgres.com/
- **dotenv**: https://github.com/motdotla/dotenv
- **bcryptjs**: https://github.com/dcodeIO/bcrypt.js
- **Vitest**: https://vitest.dev/guide/
- **ESLint**: https://eslint.org/docs/latest/
- **TypeScript**: https://www.typescriptlang.org/docs/
- **tsx**: https://github.com/privatenumber/tsx
- **tsup**: https://tsup.egoist.dev/
