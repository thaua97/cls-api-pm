# Requisitos do Sistema - API Gerenciador de Projetos (Node.js)

## 1. Objetivo

Construir uma API HTTP para um **Gerenciador de Projetos**, com foco em:

- CRUD de projetos
- Marcar/desmarcar favoritos
- Filtros, ordenação e busca
- Autenticação e autorização
- Validação e tipagem fortes
- Testes automatizados

Stack obrigatória:

- **Node.js + TypeScript**
- **Fastify** (servidor HTTP)
- **Prisma** (ORM + migrations)
- **Zod** (validação e schemas)
- **Vite** (dev/build tooling)
- **Vitest** (testes)

Pasta do projeto: `node-studies/api-cls-pm`

---

## 2. Casos de Uso (API)

### UC01 - Verificar Saúde da API
**Ator:** Consumidor da API (cliente web/mobile, testes, monitoramento)

**Descrição:** Verificar se a API está online e respondendo.

**Fluxo Principal:**
1. Cliente faz `GET /health`
2. API retorna `200` com payload simples e serializável

**Pós-condições:** Serviço validado como ativo.

---

### UC02 - Autenticar Usuário
**Ator:** Usuário (via cliente) / Consumidor da API

**Descrição:** Realizar login e obter token de acesso.

**Fluxo Principal:**
1. Cliente envia `POST /auth/login` com credenciais
2. API valida o payload (Zod)
3. API valida credenciais
4. API retorna token (ex: JWT) e dados mínimos do usuário

**Fluxo Alternativo:**
- Se credenciais inválidas, API retorna erro (ex: `401`)

**Pós-condições:** Cliente possui token para chamadas autenticadas.

---

### UC03 - Listar Projetos
**Ator:** Usuário autenticado

**Descrição:** Obter a listagem de projetos cadastrados.

**Pré-condições:** Token válido.

**Fluxo Principal:**
1. Cliente faz `GET /projects`
2. API aplica ordenação padrão (alfabética por nome)
3. API retorna lista e metadados (ex: `total`)

**Pós-condições:** Listagem retornada corretamente.

---

### UC04 - Filtrar Projetos Favoritos
**Ator:** Usuário autenticado

**Descrição:** Obter apenas projetos marcados como favoritos.

**Pré-condições:** Token válido.

**Fluxo Principal:**
1. Cliente faz `GET /projects?favorites=true`
2. API filtra e mantém ordenação atual (ou aplica a padrão)

**Fluxo Alternativo:**
- Se não houver favoritos, API retorna lista vazia com `200`

**Pós-condições:** Apenas favoritos retornados.

---

### UC05 - Ordenar Listagem de Projetos
**Ator:** Usuário autenticado

**Descrição:** Ordenar a listagem conforme critérios.

**Pré-condições:** Token válido.

**Fluxo Principal:**
1. Cliente faz `GET /projects?sort=...`
2. API ordena conforme critério:
   - `name_asc` (padrão)
   - `startDate_desc` (início mais recente primeiro)
   - `endDate_asc` (prazo mais próximo primeiro)

**Pós-condições:** Listagem retornada na ordenação solicitada.

---

### UC06 - Buscar Projetos
**Ator:** Usuário autenticado

**Descrição:** Buscar projetos por termo.

**Pré-condições:** Token válido.

**Fluxo Principal:**
1. Cliente faz `GET /projects?query=...`
2. API só aplica busca quando `query` tiver ao menos 3 caracteres
3. API busca em campos relevantes (ex: `name`, `description`)

**Fluxo Alternativo:**
- Se `query` < 3 caracteres, API retorna erro de validação (`400`) ou ignora o filtro (definir comportamento padrão)

**Pós-condições:** Resultados filtrados retornados.

---

### UC07 - Criar Projeto
**Ator:** Usuário autenticado

**Descrição:** Criar um novo projeto.

**Pré-condições:** Token válido.

**Fluxo Principal:**
1. Cliente faz `POST /projects` com payload
2. API valida payload (Zod)
3. API persiste no banco via Prisma
4. API retorna `201` com o projeto criado

**Fluxo Alternativo:**
- Se payload inválido, retorna `400` com detalhes por campo

**Pós-condições:** Projeto criado e disponível para listagem.

---

### UC08 - Editar Projeto
**Ator:** Usuário autenticado

**Descrição:** Atualizar dados de um projeto existente.

**Pré-condições:** Token válido; projeto existe.

**Fluxo Principal:**
1. Cliente faz `PUT /projects/:id` (ou `PATCH`) com payload
2. API valida payload (Zod)
3. API atualiza via Prisma
4. API retorna `200` com projeto atualizado

**Fluxo Alternativo:**
- Se `id` não existir, retorna `404`

**Pós-condições:** Projeto atualizado.

---

### UC09 - Remover Projeto
**Ator:** Usuário autenticado

**Descrição:** Remover um projeto.

**Pré-condições:** Token válido; projeto existe.

**Fluxo Principal:**
1. Cliente faz `DELETE /projects/:id`
2. API remove via Prisma
3. API retorna `204` (sem body)

**Fluxo Alternativo:**
- Se `id` não existir, retorna `404`

**Pós-condições:** Projeto removido.

---

### UC10 - Favoritar/Desfavoritar Projeto
**Ator:** Usuário autenticado

**Descrição:** Alternar estado de favorito de um projeto.

**Pré-condições:** Token válido; projeto existe.

**Fluxo Principal:**
1. Cliente faz `POST /projects/:id/favorite` (ou `PATCH /projects/:id` com `isFavorite`)
2. API alterna estado e persiste via Prisma
3. API retorna `200` com o projeto atualizado (ou estado do favorito)

**Pós-condições:** Estado do favorito atualizado.

---

## 3. Requisitos Funcionais (RF)

### RF01 - Health Check
**Prioridade:** Alta

A API deve expor endpoint de saúde:

- `GET /health` retorna `200`

---

### RF02 - Autenticação
**Prioridade:** Alta

A API deve:

- Disponibilizar login para obtenção de token
- Exigir autenticação para endpoints de projetos

---

### RF03 - CRUD de Projetos
**Prioridade:** Alta

A API deve permitir:

- Criar projeto
- Listar projetos
- Obter projeto por `id`
- Atualizar projeto
- Remover projeto

---

### RF04 - Filtro de Favoritos
**Prioridade:** Alta

A API deve permitir filtrar a listagem para favoritos:

- `GET /projects?favorites=true`

---

### RF05 - Ordenação
**Prioridade:** Alta

A API deve permitir ordenação por:

- Nome (A-Z) padrão
- Data de início (mais recente primeiro)
- Data de finalização (prazo mais próximo primeiro)

---

### RF06 - Busca
**Prioridade:** Alta

A API deve permitir busca de projetos:

- Termo com mínimo de 3 caracteres
- Campos relevantes (nome, descrição)

---

### RF07 - Favoritar/Desfavoritar
**Prioridade:** Média

A API deve permitir alternar favoritos com resposta rápida:

- Persistir o estado no banco
- Retornar estado atualizado

---

## 4. Requisitos Não-Funcionais (RNF)

### RNF01 - TypeScript Estrito
**Prioridade:** Alta

- O projeto deve ser em TypeScript
- Preferir `strict: true`

---

### RNF02 - Validação com Zod
**Prioridade:** Alta

- Todo payload de entrada (body, query, params) deve ser validado por schemas Zod
- Respostas de erro devem ser consistentes (ver seção de Erros)

---

### RNF03 - Persistência com Prisma
**Prioridade:** Alta

- Modelos e migrations devem ser feitos com Prisma
- Operações devem ser transacionais quando aplicável

---

### RNF04 - Testes com Vitest
**Prioridade:** Alta

- Deve existir suíte de testes unitários e/ou integração
- Testes de integração podem usar `fastify.inject()`

---

### RNF05 - Tooling com Vite
**Prioridade:** Média

- O projeto deve suportar modo de desenvolvimento e build utilizando Vite
- Deve existir comando para rodar servidor em dev e para buildar para produção

---

### RNF06 - Logs e Observabilidade
**Prioridade:** Média

- Usar logger do Fastify (ou plugin) com níveis (info/warn/error)
- Logar erros com contexto mínimo (rota, status, tempo)

---

### RNF07 - Segurança
**Prioridade:** Alta

- Não expor segredos no repositório
- Preferir configuração por variáveis de ambiente
- Proteger endpoints sensíveis com autenticação

---

## 5. Contratos de API (alto nível)

### 5.1. Convenções de Endpoints

- **Base:** `/`
- **Health:** `GET /health`
- **Auth:** `POST /auth/login`
- **Projects:**
  - `GET /projects`
  - `GET /projects/:id`
  - `POST /projects`
  - `PUT /projects/:id` (ou `PATCH`)
  - `DELETE /projects/:id`
  - `POST /projects/:id/favorite` (ou alternativa definida no projeto)

### 5.2. Payload mínimo do Projeto (sugestão)

Campos sugeridos (ajustar conforme necessidade):

- `id` (string/uuid)
- `name` (string)
- `description` (string opcional)
- `startDate` (string ISO)
- `endDate` (string ISO)
- `isFavorite` (boolean)
- `createdAt` (string ISO)
- `updatedAt` (string ISO)

### 5.3. Erros (padrão)

A API deve padronizar respostas de erro, por exemplo:

- `400` validação (Zod)
- `401` não autenticado
- `403` sem permissão
- `404` não encontrado
- `500` erro inesperado

Formato sugerido (serializável):

- `code` (string)
- `message` (string)
- `details` (opcional; lista/objeto com erros por campo)

---

## 6. Fora de Escopo (para este documento)

- UI/Frontend
- Notificações em tempo real
- Upload de arquivos
- Multi-tenant
