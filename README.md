# RM Traceability SaaS

O **RM Traceability SaaS** é uma solução para o gerenciamento de empresas com foco na rastreabilidade de produtos por meio de QR Code. O sistema permite que empresas cadastrem seus produtos e acompanhem sua trajetória, facilitando a identificação e o controle de cada item.

## Sumário

- [Recursos](#recursos)
- [Pré-requisitos](#pré-requisitos)
- [Configuração do Ambiente](#configuração-do-ambiente)
- [Instalação](#instalação)
- [Banco de Dados](#banco-de-dados)
  - [Migrações](#migrações)
  - [Seed](#Semente)
- [Testes](#testes-unitários)
- [Docker](#Docker)
- [Contato](#contato)

## Recursos

- **Gerenciamento de Empresas:** Cadastro e manutenção de empresas.
- **Rastreabilidade de Produtos:** Associação de produtos a empresas e geração de QR Codes para rastreamento.
- **Controle de Usuários:** Gestão de usuários com autenticação e autorização.
- **API RESTful:** Construída com [NestJS](https://docs.nestjs.com/) e [TypeORM](https://typeorm.io/).
- **Banco de Dados PostgreSQL:** Integração robusta com suporte a migrações.
- **Seeds Automatizados:** Popula o banco de dados com dados iniciais (empresa e usuário admin).

## Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 14 ou superior)
- [Yarn](https://yarnpkg.com/)
- [PostgreSQL](https://www.postgresql.org/) (para execução local) ou [Docker](https://www.docker.com/)

## Configuração do Ambiente

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo (ajuste conforme necessário):

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


## Testes Unitários
O projeto conta com testes unitários e ponta a ponta. Utilize os seguintes comandos:

yarn run test


# Testes de ponta a ponta (E2E)
yarn run test:e2e

# Cobertura de Testes
yarn run test:cov

## Docker

### Criar a network

docker network create track-network

Via Docker, utilize o arquivo docker-compose.yml

docker-compose up

## Contato
Suporte e Dúvidas: Entre em contato através do Discord ou abra um issue no repositório.
Autor: Rafael Magalhaes
