FROM node:24.21.0@sha256:64af3819f9275802414d7cdc38c27e9d82bd564dec4d4da87d008255d36c63b4 AS base

FROM base AS dependencies
WORKDIR /project/web

ENV DO_NOT_TRACK=1
ENV NEXT_TELEMETRY_DISABLED=1

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN corepack enable pnpm
RUN corepack install --global "$(node -p "require('./package.json').packageManager")"

ENV PNPM_HOME="/pnpm"

RUN pnpm install --frozen-lockfile --store-dir=/pnpm/store

FROM dependencies AS tools

RUN git config --global --add safe.directory '*'
RUN pnpm exec playwright install --with-deps
RUN npm install --global agent-browser@0.39.0

FROM dependencies AS build

COPY . .

RUN --mount=type=secret,id=build_env \
  if [ -f /run/secrets/build_env ]; then set -a; . /run/secrets/build_env; set +a; fi; \
  pnpm run build

# Production image, copy all the files and run next
FROM base AS runtime
WORKDIR /project/web

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=build /project/web/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN mkdir -p public/media && chown -R nextjs:nodejs .next public/media

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=build --chown=nextjs:nodejs /project/web/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /project/web/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["node", "server.js"]
