FROM node:22-alpine AS frontend
WORKDIR /app
COPY ./frontend/package*.json ./
RUN npm ci
COPY ./frontend ./
RUN npm run build

FROM node:22-alpine
WORKDIR /app
COPY --from=frontend /app/dist ./dist
COPY ./backend/package*.json ./
RUN npm ci --omit=dev && \
    npm prune --omit=dev && \
    npm cache clean --force
COPY ./backend ./
CMD ["npm", "start"]