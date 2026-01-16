# 1. Usa uma imagem base leve do Node.js
FROM node:18-alpine

# 2. Define o diretório de trabalho dentro do container
WORKDIR /app

# 3. Copia os arquivos de dependência primeiro (para aproveitar o cache do Docker)
COPY package.json ./

# 4. Instala as dependências dentro da imagem
RUN npm install

# 5. Copia o restante do código fonte (api-video.js)
COPY . .

# 6. Expõe a porta que a aplicação usa
EXPOSE 3000

# 7. Comando para iniciar a aplicação
CMD ["npm", "start"]
