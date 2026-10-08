# Gestão de Processos e Conformidade

Projeto full stack de portfólio para **gestão de processos internos, tarefas e itens de conformidade**.

A aplicação foi criada para demonstrar conhecimentos comuns em vagas de Desenvolvimento Full Stack Júnior:

- PHP e programação orientada a objetos;
- Symfony e Doctrine ORM;
- API REST;
- React + TypeScript;
- HTML e CSS responsivo;
- PostgreSQL e relacionamentos;
- testes unitários com PHPUnit e Vitest;
- Git e organização de código.

> Projeto independente, criado para fins educacionais e de portfólio.

## Funcionalidades

### Dashboard
Exibe:
- Processos em andamento;
- Processos concluídos;
- Tarefas em atraso;
- Itens não conformes.

### Processos
Permite:
- Cadastrar processos;
- Definir responsável;
- Definir status;
- Listar processos;
- Remover processos.

### Tarefas
Permite:
- Vincular tarefas a processos;
- Definir prazo;
- Acompanhar status;
- Concluir tarefas.

### Conformidade
Permite:
- Criar itens de checklist vinculados a processos;
- Marcar um item como conforme;
- Marcar um item como não conforme;
- Registrar observações.

---

# Stack

## Backend
- PHP 8.3+
- Symfony 7
- Doctrine ORM
- Doctrine Migrations
- PostgreSQL
- PHPUnit

## Frontend
- React
- TypeScript
- Vite
- React Router
- Axios
- Vitest
- Testing Library

## Infraestrutura local
- Docker Compose para PostgreSQL

---

# Estrutura

```text
GestaoProcessosConformidade/
├── backend/
│   ├── config/
│   ├── migrations/
│   ├── public/
│   ├── src/
│   │   ├── Controller/
│   │   ├── Entity/
│   │   ├── Repository/
│   │   └── Service/
│   ├── tests/
│   └── composer.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   └── package.json
├── docker-compose.yml
└── README.md
```

# Pré-requisitos

Instale:

- PHP 8.3 ou superior;
- Composer;
- Node.js 20 ou superior;
- npm;
- Docker Desktop;
- Git.

Confira no terminal:

```bash
php --version
composer --version
node --version
npm --version
docker --version
git --version
```

---

# Como rodar o projeto

Você usará **3 terminais**: um para o banco de dados, um para backend e um para frontend.

## 1. Banco de dados

Na raiz do projeto:

```bash
docker compose up -d
```

O PostgreSQL ficará disponível em:

```text
host: localhost
porta: 5432
database: gestao_conformidade
usuário: app
senha: app
```

Confira:

```bash
docker compose ps
```

## 2. Backend

Entre na pasta:

```bash
cd backend
```

Instale as dependências:

```bash
composer install
```

Crie o banco, se necessário:

```bash
php bin/console doctrine:database:create --if-not-exists
```

Execute as migrations:

```bash
php bin/console doctrine:migrations:migrate --no-interaction
```

Inicie o servidor:

```bash
php -S localhost:8000 -t public
```

A API ficará em:

```text
http://localhost:8000
```

Teste no navegador ou no Postman:

```text
http://localhost:8000/api/processos
http://localhost:8000/api/dashboard
```

## 3. Frontend

Abra outro terminal:

```bash
cd frontend
```

Instale:

```bash
npm install
```

Execute:

```bash
npm run dev
```

Abra:

```text
http://localhost:5173
```

---

# Testes

## Backend

Dentro de `backend`:

```bash
vendor/bin/phpunit
```

## Frontend

Dentro de `frontend`:

```bash
npm test
```

Para validar o build:

```bash
npm run build
```

---

# Endpoints principais

## Dashboard

```http
GET /api/dashboard
```

## Processos

```http
GET    /api/processos
POST   /api/processos
PUT    /api/processos/{id}
DELETE /api/processos/{id}
```

Exemplo:

```json
{
  "titulo": "Auditoria interna",
  "descricao": "Revisão dos controles internos do setor financeiro.",
  "responsavel": "Maria Souza",
  "status": "EM_ANDAMENTO"
}
```

## Tarefas

```http
GET   /api/tarefas
POST  /api/tarefas
PATCH /api/tarefas/{id}/status
```

Exemplo:

```json
{
  "processoId": 1,
  "titulo": "Revisar documentação",
  "prazo": "2026-10-30"
}
```

## Conformidades

```http
GET   /api/conformidades
POST  /api/conformidades
PATCH /api/conformidades/{id}/status
```

---

# Banco de dados

Relacionamentos:

```text
Processo 1 ───── N Tarefas
Processo 1 ───── N Conformidades
```

Ao excluir um processo, seus registros dependentes também são removidos por `ON DELETE CASCADE`.

---

# Organização do backend

- **Entity:** representa tabelas e relacionamentos;
- **Repository:** consulta os dados;
- **Service:** concentra regras de negócio;
- **Controller:** expõe endpoints HTTP.

# Organização do frontend

- **pages:** telas;
- **components:** elementos reutilizáveis;
- **services:** comunicação com a API;
- **types:** contratos TypeScript.

---

# Autor

Projeto desenvolvido para estudo e portfólio em desenvolvimento Full-Stack com PHP e React.
