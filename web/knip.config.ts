import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  entry: ['src/migrations/index.ts', 'src/seeds/run.ts', 'tests/**/*.{ts,tsx}'],

  project: ['./**/*.{ts,tsx}'],
};

export default config;
