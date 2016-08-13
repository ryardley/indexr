import curry from 'lodash/curry';
import path from 'path';

// Assumes rootFolder is available on config should make dependency here.

export default curry((config, filePath, next) => {
  const { rootFolder } = config;
  const rootPath = path.resolve(rootFolder, filePath);
  next(null, rootPath);
});

