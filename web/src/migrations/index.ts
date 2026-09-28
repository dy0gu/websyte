import * as migration_20260928_150043_initial from './20260928_150043_initial';

export const migrations = [
  {
    up: migration_20260928_150043_initial.up,
    down: migration_20260928_150043_initial.down,
    name: '20260928_150043_initial'
  },
];
