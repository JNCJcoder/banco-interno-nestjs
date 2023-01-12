## Backend Banco interno em NestJS

Backend de um banco interno que permite apenas transações internas.

## 💻 Info:

Este Projeto e uma versão melhorada do [backend do processo seletivo da NG.CASH](https://github.com/JNCJcoder/projeto-ng-cash) usando o [NestJS](https://github.com/nestjs/nest) ao inves do Express.

| Rotas                 | HTTP   | Descrição                    |
| --------------------- | ------ | ---------------------------- |
| /transactions         | GET    | Retorna todas as transações  |
| /transactions         | POST   | Cria uma Transação           |
| /accounts/balance     | GET    | Retorna o valor na conta     |
| /auth/login           | GET    | Se Loga no Sistema           |
| /users                | POST   | Cria um Usuario              |
| /users                | GET    | Retorna um Usuario pelo ID   |



## 👨‍🏫 Testando

Baixe e instale o [NodeJS](https://nodejs.org/).

Rode o projeto usando:

```
npm
npm run start:dev
```