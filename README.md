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
- processos em andamento;
- processos concluídos;
- tarefas em atraso;
- itens não conformes.

### Processos
Permite:
- cadastrar processos;
- definir responsável;
- definir status;
- listar processos;
- remover processos.

### Tarefas
Permite:
- vincular tarefas a processos;
- definir prazo;
- acompanhar status;
- concluir tarefas.

### Conformidade
Permite:
- criar itens de checklist vinculados a processos;
- marcar um item como conforme;
- marcar um item como não conforme;
- registrar observações.

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

Você usará **3 terminais**: um para banco, um para backend e um para frontend.

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

# Validação e qualidade

O backend utiliza validações do Symfony, como:

```php
#[Assert\NotBlank]
#[Assert\Length(min: 3, max: 150)]
```

Respostas inválidas retornam HTTP `422`.

Há testes com PHPUnit no backend e Vitest/Testing Library no frontend.

---

# Desenvolvimento assistido por IA

Ferramentas de IA generativa podem ser usadas como apoio para:

- revisão de código;
- estudo de documentação;
- investigação de erros;
- criação e revisão de testes;
- sugestões de refatoração;
- documentação técnica.

A validação final do comportamento e das decisões técnicas permanece sob responsabilidade da pessoa desenvolvedora.

---

# Fluxo Git sugerido

Branches:

```text
main
feature/processos
feature/tarefas
feature/conformidades
feature/dashboard
```

Commits:

```text
feat: implement process management
feat: add compliance checklist
test: add process entity tests
fix: validate compliance status
docs: improve setup instructions
```

---

# Próximas evoluções

- autenticação com JWT;
- perfis de acesso;
- upload de evidências;
- histórico de auditoria;
- paginação;
- filtros e busca;
- cobertura maior de testes;
- GitHub Actions;
- Docker do backend e frontend;
- relatórios.

---

# Autor

Projeto desenvolvido para estudo e portfólio em desenvolvimento Full Stack com PHP e React.
