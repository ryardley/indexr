import curry from 'lodash/curry';
import path from 'path';

function moduleRootPath(config, filePath, next) {
  const { rootFolder } = config;
  const rootPath = path.resolve(rootFolder, filePath);
  next(null, rootPath);
}

export default curry(moduleRootPath);
