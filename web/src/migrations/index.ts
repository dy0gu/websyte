import * as initial from '~/migrations/20260928_150043_initial';

export const migrations = [
  {
    down: initial.down,
    name: '20260928_150043_initial',
    up: initial.up,
  },
];
