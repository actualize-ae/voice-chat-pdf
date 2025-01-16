# Use the official Node.js 22 LTS image as the base image
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

ENTRYPOINT ["/bin/sh", "-c", "\
  export QDRANT_URL=$(cat /run/secrets/QDRANT_URL) && \
  export QDRANT_API_KEY=$(cat /run/secrets/QDRANT_API_KEY) && \
  export NEXT_PUBLIC_SUPABASE_URL=$(cat /run/secrets/next_public_supabase_url) && \
  export NEXT_PUBLIC_SUPABASE_ANON_KEY=$(cat /run/secrets/next_public_supabase_anon_key) && \
  export NEXT_PUBLIC_SUPABASE_BUCKET_NAME=$(cat /run/secrets/next_public_supabase_bucket_name) && \
  export NEXT_PUBLIC_SUPABASE_BUCKET_FILE_SIZE_LIMIT=$(cat /run/secrets/next_public_supabase_bucket_file_size_limit) && \
  export NEXT_PUBLIC_SUPABASE_BUCKET_ALLOWED_MIME_TYPES=$(cat /run/secrets/next_public_supabase_bucket_allowed_mime_types) && \
  export NEXT_PUBLIC_SUPABASE_USER_TABLE_NAME=$(cat /run/secrets/next_public_supabase_user_table_name) && \
  npm start"]


# Expose the application port
EXPOSE 3000
