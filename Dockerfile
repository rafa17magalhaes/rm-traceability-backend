# Etapa de Build
FROM node:20-alpine AS build

WORKDIR /usr/src/app

# Copia o package.json e yarn.lock
COPY package.json yarn.lock ./

# Instala dependências
RUN yarn install --frozen-lockfile

# Copia o restante do código
COPY . .

# Compila o projeto (gera dist)
RUN yarn build

# Etapa de Produção
FROM node:20-alpine

WORKDIR /usr/src/app

# Copiar apenas as dependências de produção
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production

# Copia os arquivos compilados da etapa de build
COPY --from=build /usr/src/app/dist ./dist

# Define a variável de ambiente para produção
ENV NODE_ENV=production

# Expor a porta que a aplicação irá rodar
EXPOSE 3000

# Comando para iniciar a aplicação em produção
CMD ["node", "dist/main"]
