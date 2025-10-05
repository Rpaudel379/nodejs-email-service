# Base Stage: Install dependencies using Bun
FROM node:20-alpine AS base
WORKDIR /usr/src/app

# Install dependencies
COPY bun.lockb package.json ./
RUN npm i

# Copy application code
COPY . .

# Build Stage
FROM base AS build
RUN npm run build

# Final Production Stage
FROM node:20-alpine AS prod
WORKDIR /usr/src/app

# Copy only the build and dependencies
COPY --from=build /usr/src/app /usr/src/app
COPY --from=base /usr/src/app/node_modules /usr/src/app/node_modules

# Expose port
EXPOSE 8080

# Start the application
CMD ["npm", "run", "start"]

