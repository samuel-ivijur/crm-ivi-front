FROM node:20-alpine AS builder
WORKDIR /app
COPY ../package.json ../package-lock.json ./
RUN npm ci
COPY . . 
RUN npm run build
RUN npm prune --production
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app . 
ENV PORT=5000
CMD ["npm", "run", "start"]
