import react from '@vitejs/plugin-react';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: 'jsdom',
    fileParallelism: false,
    include: ['tests/int/**/*.int.spec.ts'],
    isolate: true,
    pool: 'forks',
  },
});
