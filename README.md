# 🏦 API de gerenciador de finanças

API RESTful para gerenciador de finanças, permitindo o cadastro de usuários, autenticação via JWT, criação de contas bancárias e realização de transferências entre contas. O projeto foi desenvolvido utilizando a metodologia TDD (Test Driven Development) desde o início.

## 📘 O que aprendi neste projeto

Durante o desenvolvimento desta API, aprofundei meus conhecimentos em:

- Testes automatizados com Jest e Supertest
- Autenticação com Passport e JWT
- Integração com banco de dados usando Knex.js
- Boas práticas com TDD
- Logs com Winston

## 👨‍💻 Rodando localmente

```bash
git clone https://github.com/alexandremrrocha/api-finance-manager.git
cd api-finance-manager
npm install
cp knexfile-template.ts knexfile.ts
npx knex migrate:latest --env test
npm run dev
```
- A aplicação estará disponível em http://localhost:4200
  - OBS: Não esqueça de preencher o "knexfile.ts" com as informações corretas

## 🧑‍🔬 Rodando os testes

```bash  
  npm test
```

## 📄 Licença

Este projeto está licenciado sob a [MIT License](LICENSE).
