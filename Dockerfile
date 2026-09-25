FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
COPY prisma ./prisma

RUN \
  if [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  elif [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  else echo "Lockfile not found." && exit 1; \
  fi


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

# Generate Prisma Client
# RUN npx prisma generate

ENV NODE_OPTIONS="--max-old-space-size=4096"

# Set a dummy DATABASE_URL for build time analysis only (not used for actual connections)
# This prevents build errors when Next.js analyzes API routes that import prisma
# The actual DATABASE_URL will be provided at runtime via docker-compose env_file or environment variables
ENV DATABASE_URL="postgresql://postgres:password@localhost:5432/Pollen?schema=public"

# Build-time environment variables (public variables that get embedded in the build)
# These will be overridden by runtime env_file in docker-compose.yml
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_KNOCK_PUBLIC_API_KEY
ARG NEXT_PUBLIC_VAPI_ASSISTANT_ID
ARG NEXT_PUBLIC_VAPI_API_KEY
ARG NEXT_PUBLIC_CELO_NETWORK

ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
ENV NEXT_PUBLIC_KNOCK_PUBLIC_API_KEY=${NEXT_PUBLIC_KNOCK_PUBLIC_API_KEY}
ENV NEXT_PUBLIC_VAPI_ASSISTANT_ID=${NEXT_PUBLIC_VAPI_ASSISTANT_ID}
ENV NEXT_PUBLIC_VAPI_API_KEY=${NEXT_PUBLIC_VAPI_API_KEY}
ENV NEXT_PUBLIC_CELO_NETWORK=${NEXT_PUBLIC_CELO_NETWORK}

RUN \
  if [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  elif [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
# With standalone output, everything is already in .next/standalone/
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
# set hostname to localhost
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
