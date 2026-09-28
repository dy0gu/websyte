FROM node:24.21.0@sha256:64af3819f9275802414d7cdc38c27e9d82bd564dec4d4da87d008255d36c63b4 AS base

FROM base AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile

FROM deps AS tools
COPY . .

# Rebuild the source code only when needed
FROM tools AS builder

ENV NEXT_TELEMETRY_DISABLED=1

RUN --mount=type=secret,id=build_env \
  if [ -f /run/secrets/build_env ]; then set -a; . /run/secrets/build_env; set +a; fi; \
  pnpm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN mkdir -p public/media && chown -R nextjs:nodejs .next public/media

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["node", "server.js"]
