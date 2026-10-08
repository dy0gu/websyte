import react from '@vitejs/plugin-react';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: 'jsdom',
    include: ['tests/int/**/*.int.spec.ts'],
    server: { deps: { inline: ['next-intl'] } },
    setupFiles: ['./vitest.setup.ts'],
  },
});
