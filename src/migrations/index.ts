import * as migration_20261028_210054_initial from './20261028_210054_initial';
import * as migration_20261029_003344_blob_storage from './20261029_003344_blob_storage';

export const migrations = [
  {
    up: migration_20261028_210054_initial.up,
    down: migration_20261028_210054_initial.down,
    name: '20261028_210054_initial',
  },
  {
    up: migration_20261029_003344_blob_storage.up,
    down: migration_20261029_003344_blob_storage.down,
    name: '20261029_003344_blob_storage'
  },
];
