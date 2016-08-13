import curry from 'lodash/curry';
import path from 'path';

export const rootFolderFilePath = curry((config, filePath, next) => {
  const { rootFolder } = config;
  const rootPath = path.resolve(rootFolder, filePath);
  next(null, rootPath);
});

export default { rootFolderFilePath };
