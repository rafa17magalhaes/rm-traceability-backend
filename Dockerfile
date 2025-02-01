# Etapa de Build
FROM node:20-alpine AS build

# Definir diretório de trabalho
WORKDIR /usr/src/app

# Copiar package.json e yarn.lock (ou package-lock.json se usar npm)
COPY package.json yarn.lock ./

# Instalar dependências
RUN yarn install --frozen-lockfile

# Copiar o restante do código
COPY . .

# Listar os arquivos para verificação
RUN ls -la src/companies/
RUN ls -la src/users/
RUN ls -la src/resources/
RUN ls -la src/events/
RUN ls -la src/auth/

# Construir o projeto
RUN yarn build

# Etapa de Produção
FROM node:20-alpine

# Definir diretório de trabalho
WORKDIR /usr/src/app

# Copiar apenas as dependências de produção
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production

# Copiar os arquivos construídos da etapa de build
COPY --from=build /usr/src/app/dist ./dist

# Definir variáveis de ambiente
ENV NODE_ENV=production

# Expor a porta que a aplicação irá rodar
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["node", "dist/main"]
