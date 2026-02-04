# ADR-0001 — Adotar Clean Architecture (Ports & Adapters) na API `api-cls-pm`

## Status

Aceita

## Contexto

O projeto **CLS Manager** possui:

- **API** em Node.js + TypeScript (`api-cls-pm`) com Fastify, Prisma (PostgreSQL), Zod e autenticação JWT.
- **Front-end** em Nuxt 4 (`cls-project-manager`) consumindo a API via HTTP.

A API implementa casos de uso como:

- `GET /health`
- Login JWT (`POST /auth/login`)
- CRUD de projetos + favoritos + busca/ordenação
- Upload de background (multipart) + serving de arquivos estáticos (`/uploads/*`)

Restrições e contexto técnico/organizacional:

- Projeto de desafio (time-to-market curto), mas com exigência explícita de **testes**, **validação**, e **qualidade**.
- Necessidade de **isolamento de regras de negócio** para facilitar evolução e testes sem dependência de HTTP/DB.
- Stack obrigatória descrita em `docs/REQUIREMENTS.md` (Fastify/Prisma/Zod/Vitest).
- Banco PostgreSQL (local via `docker-compose`), deploy em provider free (potencial hibernação).

Premissas (por ausência de detalhes formais no pedido):

- Apenas um desenvolvedor.
- Escopo inicial de monólito (API única) com possibilidade futura de modularização.

## Requisitos e Drivers

### Funcionais

- Expor endpoints HTTP conforme documentação (`docs/API_ROUTES.md`).
- Autenticação via JWT para rotas protegidas.
- Persistência em PostgreSQL via Prisma.
- Validação de entrada com Zod (body/query/params).
- Upload de arquivo (background) e acesso público via rota estática.

### Não funcionais

- **Testabilidade**: conseguir testar casos de uso sem subir servidor e sem DB real (quando possível).
- **Manutenibilidade**: separar responsabilidades para reduzir acoplamento.
- **Segurança**: não vazar detalhes internos; padronizar erros; JWT e validação.
- **Escalabilidade de código**: permitir adicionar features sem “explodir” handlers.
- **Observabilidade básica**: logging/erros tratáveis via handler central.
- **Custo/time-to-market**: manter simplicidade suficiente para o desafio.

## Opções Consideradas

### Opção A — Clean Architecture (Domain/Application/Infra/Presentation) + DI manual

**Descrição**  
Estruturar a API em camadas:

- `domain`: contratos e regras (ports, entidades/value objects quando aplicável)
- `application`: casos de uso (`execute()`), DTOs e orquestração
- `infra`: Prisma, repositórios concretos, adapters externos
- `presentation/http`: controllers/handlers Fastify + validações Zod + middlewares

**Prós**

- Alta **testabilidade** (use-cases isolados do Fastify/Prisma).
- Reduz acoplamento entre HTTP e persistência.
- Facilita evolução (novos adapters, troca de ORM, etc.).
- Mantém consistência com “POO + Clean Architecture” solicitado/esperado.

**Contras**

- Mais arquivos/boilerplate.
- Curva de entendimento maior para iniciantes.
- Pode ser “overengineering” para escopo pequeno.

**Riscos**

- Time gastar tempo excessivo com abstrações (sem ganho real) se não houver disciplina.
- Inconsistência se alguns fluxos “furarem” a arquitetura (ex.: handler chamando Prisma direto).

---

### Opção B — MVC/Layered (Controllers -> Services -> Repositories)

**Descrição**  
Organização tradicional com controllers HTTP, services com lógica e repositories para DB, mas com regras menos rígidas de dependência.

**Prós**

- Mais rápido de implementar.
- Menos “cerimônia” do que Clean Architecture.
- Bom equilíbrio para times pequenos.

**Contras**

- Dependências tendem a ficar “misturadas” ao longo do tempo.
- Testes podem ficar mais acoplados ao framework.
- Maior risco de lógica espalhada em controllers.

**Riscos**

- Crescimento desordenado; serviços viram “god classes”.
- Dificuldade em trocar persistência/adapters.

---

### Opção C — Fastify handlers chamando Prisma diretamente (mínima abstração)

**Descrição**  
Rotas/handlers HTTP contendo validação, lógica e chamadas diretas ao Prisma.

**Prós**

- Maior velocidade no curto prazo.
- Menos código e arquivos.

**Contras**

- Testabilidade baixa (testes viram integração end-to-end).
- Forte acoplamento com Prisma e Fastify.
- Regras duplicadas entre rotas; manutenção difícil.

**Riscos**

- Dívida técnica rápida e alto custo de mudanças.
- Erros de segurança/validação inconsistentes.

## Decisão

Escolhemos a **Opção A — Clean Architecture (Ports & Adapters)** para a API `api-cls-pm`.

Motivos principais:

- Atende diretamente os drivers de **testabilidade** e **manutenibilidade** exigidos no desafio.
- Permite manter regras de negócio e contratos estáveis, com detalhes de HTTP/DB na borda.
- O próprio código já segue esse direcionamento (ex.: `src/domain`, `src/application`, `src/infra`, `src/presentation/http`, error handler central em `src/app.ts`).

## Consequências

### Impactos positivos

- **Evolução segura**: adicionar novos endpoints e regras com menor risco de regressão.
- **Testes melhores**: use-cases testáveis sem servidor (e com mocks de repositório).
- **Troca de tecnologia** (ex.: Prisma/DB) menos traumática por existir port (`ProjectRepository`).
- **Padronização**: fluxo HTTP fino (controller valida -> chama use-case -> mapeia response).

### Impactos negativos

- Mais tempo inicial para estruturar e manter as camadas.
- Mais “saltos” entre arquivos para debugar.
- Overhead cognitivo para contribuições pequenas.

### Débitos técnicos assumidos

- DI/composição provavelmente manual (sem container), podendo gerar repetição.
- Nem todas as regras podem estar modeladas em entidades/VOs (pode ficar parcialmente “anêmico” no começo).
- Pode haver casos de uso simples onde a arquitetura pareça “grande demais”.

## Trade-offs e Justificativas Técnicas

- **Trade-off: velocidade vs. qualidade**  
  Aceitamos um pouco mais de boilerplate para garantir testabilidade e manutenção.
- **Trade-off: simplicidade vs. escalabilidade do código**  
  Para o desafio o escopo é pequeno, mas a estrutura reduz o custo quando features crescem (ex.: permissões, auditoria, caching).
- **Trade-off: arquitetura “ideal” vs. pragmatismo**  
  Mantemos Clean Architecture, porém com pragmatismo: abstrair apenas onde há benefício (principalmente repositórios e use-cases).

## Alternativas Futuras / Reavaliação

Revisitar esta decisão se:

- O escopo permanecer pequeno e a manutenção do boilerplate superar os benefícios (poderia migrar para MVC simplificado).
- Surgir necessidade forte de performance/caching onde a separação exija um módulo de application service específico.
- Houver necessidade de multi-tenant, fila/assíncrono ou dividir em serviços (poderia evoluir para módulos/bounded contexts).
- A equipe crescer e demandar padronização ainda mais rígida (ex.: container de DI, arquitetura hexagonal mais formal).

## Referências (opcional)

- Fastify: https://fastify.dev/docs/latest/
- Prisma: https://www.prisma.io/docs
- Zod: https://zod.dev/
- Vitest: https://vitest.dev/guide/
- Clean Architecture (conceito): Robert C. Martin — *Clean Architecture* (livro)
