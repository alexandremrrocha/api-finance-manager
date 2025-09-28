# API Finance Manager

API RESTful para gestão de finanças pessoais construída com Node.js, Express e Knex. A aplicação oferece autenticação JWT, cadastro de usuários, criação de contas bancárias e transferências entre contas. O projeto foi desenvolvido guiado por testes (TDD) desde o início, com cobertura automatizada utilizando Jest e Supertest.

## Visão Geral

- API organizada por módulos de serviços e rotas carregados via Consign.
- Persistência em banco relacional via Knex com suporte a migrações.
- Autenticação e autorização com Passport + JWT.
- Registro estruturado de logs com Winston (console e arquivo).
- Pipeline de testes com Jest e bibliotecas de apoio configurado para ambiente de integração contínua.

## Principais Funcionalidades

- Cadastro e autenticação de usuários com criptografia de senhas (bcrypt).
- Criação, consulta e manutenção de contas bancárias.
- Lançamento de transações e transferências entre contas.
- Tratamento centralizado de erros com identificação rastreável (`crypto.randomUUID`).
- Regras de validação garantindo consistência das operações financeiras.

## Stack e Ferramentas

- Node.js 18+, TypeScript, Express 5.
- Knex.js, PostgreSQL.
- Passport, passport-jwt, jwt-simple.
- Jest, Supertest, ts-jest, Husky (ganchos).
- Winston para observabilidade.

## Executando Localmente

```bash
git clone https://github.com/alexandremrrocha/api-finance-manager.git
cd api-finance-manager
npm install
cp knexfile-template.ts knexfile.ts
# Edite knexfile.ts com as credenciais do banco (dev e test)
npx knex migrate:latest --env development
npm run dev
```

- O servidor inicia em `http://localhost:3001` (ver `src/server.ts`).
- Garanta que o PostgreSQL esteja acessível e que as credenciais em `knexfile.ts` estejam corretas antes de rodar a aplicação.

## Executando os Testes

```bash
npx knex migrate:latest --env test
npm test
```

- A suíte utiliza Jest em modo `--runInBand` para manter o isolamento do banco de testes.
- Os testes cobrem fluxos de autenticação, regras de negócio de contas/transferências e o tratamento global de erros.

## Endpoints Principais

| Método | Caminho | Proteção | Descrição |
| --- | --- | --- | --- |
| POST | `/auth/signup` | Público | Cadastro de novos usuários com hash de senha. |
| POST | `/auth/signin` | Público | Autenticação de usuários e emissão de token JWT. |
| GET | `/v1/users` | Requer token | Lista usuários cadastrados (perfil administrativo). |
| POST | `/v1/users` | Requer token | Cria usuário autenticado (usado em cenários internos/tests). |
| GET | `/v1/accounts` | Requer token | Lista contas bancárias do usuário autenticado. |
| POST | `/v1/accounts` | Requer token | Cria nova conta associada ao usuário autenticado. |
| GET | `/v1/accounts/:id` | Requer token | Retorna detalhes de uma conta específica. |
| PUT | `/v1/accounts/:id` | Requer token | Atualiza dados de uma conta do usuário. |
| DELETE | `/v1/accounts/:id` | Requer token | Remove uma conta pertencente ao usuário. |
| GET | `/v1/transactions` | Requer token | Lista transações financeiras do usuário. |
| POST | `/v1/transactions` | Requer token | Registra nova transação (receitas/despesas). |
| GET | `/v1/transactions/:id` | Requer token | Recupera uma transação específica. |
| PATCH | `/v1/transactions/:id` | Requer token | Atualiza status ou dados da transação. |
| DELETE | `/v1/transactions/:id` | Requer token | Exclui uma transação do usuário. |
| GET | `/v1/transfers` | Requer token | Lista transferências realizadas entre contas. |
| POST | `/v1/transfers` | Requer token | Cadastra nova transferência entre contas do usuário. |
| GET | `/v1/transfers/:id` | Requer token | Exibe detalhes de uma transferência específica. |

## Decisões Técnicas

- **TDD como guia**: cada funcionalidade nasce a partir de um teste falhando, garantindo regressões mínimas.
- **Arquitetura modular**: Consign carrega configurações, serviços e rotas para manter baixo acoplamento.
- **Observabilidade**: logs estruturados contam com IDs únicos (`crypto.randomUUID`) para facilitar rastreamento.
- **Segurança**: senhas são armazenadas com bcrypt, tokens JWT possuem escopo e expiração definidos, e há validações para impedir operações inconsistentes.

## Próximos Passos (ideias)

- Automatizar pipeline CI (GitHub Actions) com execução de testes e lint.
- Documentar endpoints com Swagger/OpenAPI.
- Implementar regras adicionais de negócio (ex.: limites de transferência, categorias de transações).

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).
