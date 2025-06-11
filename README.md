# RM Traceability SaaS

O **RM Traceability SaaS** é uma solução para o gerenciamento de empresas com foco na rastreabilidade de produtos por meio de QR Code. O sistema permite que empresas cadastrem seus produtos, gerenciem seus recursos e acompanhem a trajetória de cada item, facilitando a identificação e o controle.

## Sumário

- [Recursos](#recursos)
- [Pré-requisitos](#pré-requisitos)
- [Configuração do Ambiente](#configuração-do-ambiente)
- [Instalação](#instalação)
- [Banco de Dados](#banco-de-dados)
  - [Migrações](#migrações)
  - [Semente](#semente)
- [Testes Unitários e E2E](#testes-unitários-e-e2e)
- [Swagger API](#swagger-api)
- [Docker](#docker)
- [Contato](#contato)

## Recursos

- **Gerenciamento de Empresas:** Cadastro e manutenção de empresas.
- **Rastreabilidade de Produtos:** Associação de produtos a empresas e geração de QR Codes para rastreamento.
- **Controle de Usuários:** Gestão de usuários com autenticação e autorização.
- **Gerenciamento de Recursos:** Cadastro, listagem, atualização e remoção de recursos associados a uma empresa.
- **API RESTful:** Construída com [NestJS](https://docs.nestjs.com/) e [TypeORM](https://typeorm.io/), com endpoints documentados via Swagger.
- **Banco de Dados PostgreSQL:** Integração robusta com suporte a migrações.
- **Seeds Automatizados:** Popula o banco de dados com dados iniciais (empresa, usuário admin, recursos, etc.).

## Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 14 ou superior)
- [Yarn](https://yarnpkg.com/)
- [PostgreSQL](https://www.postgresql.org/) (para execução local) ou [Docker](https://www.docker.com/)

## Configuração do Ambiente

Crie um arquivo `.env` a partir do `.env.example` na raiz do projeto com o seguinte conteúdo (ajuste conforme necessário):


## Instalação
Instale as dependências do projeto utilizando o Yarn

yarn install

## Banco de Dados
Migrações

# Executa as migrações pendentes
yarn run migration:run

# Reverte a última migração (caso necessário)
yarn run migration:undo

## Semente
O sistema inclui um script de seed que preenche o banco de dados com dados iniciais (por exemplo, cadastro da empresa "Smart Invisible" e um usuário admin).

yarn run seed

# Semente específica para Status sistemicos.

yarn run seed:status

## Testes Unitários
O projeto conta com testes unitários e ponta a ponta. Utilize os seguintes comandos:

yarn run test

# Testes de ponta a ponta (E2E)
yarn run test:e2e

# Cobertura de Testes
yarn run test:cov

# Swagger API

*A documentação da API é gerada automaticamente via Swagger*

Para acessar a documentação:

Certifique-se de que o backend esteja rodando na porta configurada (por padrão, 3001).
Acesse http://localhost:3001/api no navegador para visualizar a documentação interativa.

## Docker

### Criar a network

Run the following command to create the Docker network:

docker network create rm_traceability_network

Via Docker, utilize o arquivo docker-compose.yml

docker-compose up --build

## Contato
Suporte e Dúvidas: Entre em contato através do Discord ou abra um issue no repositório.
Autor: Rafael Magalhaes
