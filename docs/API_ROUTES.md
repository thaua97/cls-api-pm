# API Routes - CLS Project Manager API

Base URL (dev): `http://localhost:3333`

## Auth

A API usa autenticação via **JWT**.

- Envie o token no header:
  - `Authorization: Bearer <token>`

Rotas protegidas retornam `401` quando o token está ausente ou inválido.

---

## Health

### `GET /health`

Verifica se a API está online.

- **Auth:** não
- **Response 200**

```json
{
  "status": "ok"
}
```

---

## Users

### `POST /users`

Cria um usuário.

- **Auth:** não
- **Body**

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "password123"
}
```

- **Responses**
  - `201`

```json
{
  "id": "<uuid>"
}
```

  - `409` (email já em uso)

```json
{
  "code": "EMAIL_ALREADY_IN_USE",
  "message": "Email already in use"
}
```

---

## Login

### `POST /auth/login`

Autentica usuário e retorna um JWT.

- **Auth:** não
- **Body**

```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

- **Response 200**

```json
{
  "token": "<jwt>"
}
```

- **Response 401** (credenciais inválidas)

```json
{
  "code": "UNAUTHORIZED",
  "message": "Invalid credentials"
}
```

---

## Projects (Protected)

Todas as rotas abaixo exigem `Authorization: Bearer <token>`.

### `GET /projects`

Lista projetos.

- **Auth:** sim
- **Query params (opcionais)**
  - `favorites`: `true | false`
  - `sort`: `name_asc | startDate_desc | endDate_asc` (default: `name_asc`)
  - `query`: string (mínimo 3 caracteres)

- **Response 200**

```json
{
  "total": 2,
  "projects": [
    {
      "id": "<uuid>",
      "name": "Project A",
      "description": "...",
      "startDate": "2025-01-01T00:00:00.000Z",
      "endDate": "2025-01-10T00:00:00.000Z",
      "isFavorite": false,
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

- **Response 400** (quando `query` < 3)

```json
{
  "code": "INVALID_QUERY",
  "message": "query must have at least 3 characters"
}
```

---

### `GET /projects/:id`

Busca um projeto por id.

- **Auth:** sim
- **Params**
  - `id`: UUID

- **Response 200**

```json
{
  "project": {
    "id": "<uuid>",
    "name": "Project A",
    "description": null,
    "startDate": "2025-01-01T00:00:00.000Z",
    "endDate": "2025-01-10T00:00:00.000Z",
    "isFavorite": false,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

- **Response 404**

```json
{
  "code": "NOT_FOUND",
  "message": "Project not found"
}
```

---

### `POST /projects`

Cria um projeto.

- **Auth:** sim
- **Body**

```json
{
  "name": "Project A",
  "description": "Optional",
  "startDate": "2025-01-01",
  "endDate": "2025-01-10"
}
```

Observação: `startDate`/`endDate` são parseados com `z.coerce.date()`.

- **Response 201**

```json
{
  "id": "<uuid>"
}
```

---

### `PUT /projects/:id`

Atualiza um projeto.

- **Auth:** sim
- **Params**
  - `id`: UUID

- **Body (todos opcionais)**

```json
{
  "name": "New name",
  "description": null,
  "startDate": "2025-02-01",
  "endDate": "2025-02-10",
  "isFavorite": true
}
```

- **Response 200**

```json
{
  "project": {
    "id": "<uuid>",
    "name": "New name",
    "description": null,
    "startDate": "2025-02-01T00:00:00.000Z",
    "endDate": "2025-02-10T00:00:00.000Z",
    "isFavorite": true,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-02T00:00:00.000Z"
  }
}
```

- **Response 404**

```json
{
  "code": "NOT_FOUND",
  "message": "Project not found"
}
```

---

### `DELETE /projects/:id`

Remove um projeto.

- **Auth:** sim
- **Params**
  - `id`: UUID

- **Response 204** (sem body)

---

### `POST /projects/:id/favorite`

Alterna o estado de favorito do projeto.

- **Auth:** sim
- **Params**
  - `id`: UUID

- **Response 200**

```json
{
  "project": {
    "id": "<uuid>",
    "name": "Project A",
    "description": null,
    "startDate": "2025-01-01T00:00:00.000Z",
    "endDate": "2025-01-10T00:00:00.000Z",
    "isFavorite": true,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

- **Response 404**

```json
{
  "code": "NOT_FOUND",
  "message": "Project not found"
}
```

---

## Padrão de erros

### Validação (Zod)

Quando um schema Zod falha, a API retorna `400` com:

```json
{
  "code": "VALIDATION_ERROR",
  "message": "Validation error",
  "details": {
    "_errors": []
  }
}
```

### Erros de domínio/aplicação

Erros lançados como `AppError` seguem:

```json
{
  "code": "<ERROR_CODE>",
  "message": "<message>",
  "details": null
}
```
