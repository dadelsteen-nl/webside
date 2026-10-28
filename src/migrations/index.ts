import * as migration_20261028_210054_initial from './20261028_210054_initial';

export const migrations = [
  {
    up: migration_20261028_210054_initial.up,
    down: migration_20261028_210054_initial.down,
    name: '20261028_210054_initial'
  },
];
