import * as initial from '~/migrations/20260928_150043_initial';
import * as s3MediaStorage from '~/migrations/20261009_002548_s3_media_storage';

export const migrations = [
  {
    down: initial.down,
    name: '20260928_150043_initial',
    up: initial.up,
  },
  {
    down: s3MediaStorage.down,
    name: '20261009_002548_s3_media_storage',
    up: s3MediaStorage.up,
  },
];
