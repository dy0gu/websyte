import { createRequire } from 'node:module'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  // The TypeScript-only react path must not replace the runtime in tests.
  resolve: {
    alias: [{ find: /^react$/, replacement: createRequire(import.meta.url).resolve('react') }],
  },
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    server: { deps: { inline: ['next-intl'] } },
    setupFiles: ['./vitest.setup.ts'],
    include: ['tests/int/**/*.int.spec.ts'],
  },
})
