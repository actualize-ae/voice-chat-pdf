# Use the official Node.js 18 LTS image as the base image
FROM node:22-alpine AS base

# Set the working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install pnpm globally
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the application
RUN pnpm build

# Remove dev dependencies to reduce image size
RUN pnpm prune --prod

# Use a lightweight Node.js image for production
FROM node:22-alpine AS production

# Set the working directory
WORKDIR /app

# Copy necessary files from the build stage
COPY --from=base /app/public /app/public
COPY --from=base /app/.next /app/.next
COPY --from=base /app/node_modules /app/node_modules
COPY --from=base /app/package.json /app/package.json

# Secrets will be mounted at runtime
ENTRYPOINT ["/bin/sh", "-c", "export NEXT_PUBLIC_SUPABASE_URL=$(cat /run/secrets/next_public_supabase_url) && export NEXT_PUBLIC_SUPABASE_ANON_KEY=$(cat /run/secrets/next_public_supabase_anon_key) && npm start"]

# Expose the application port
EXPOSE 3000
