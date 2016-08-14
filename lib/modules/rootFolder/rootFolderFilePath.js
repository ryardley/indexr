import curry from 'lodash/curry';
import path from 'path';

// Adds the root folder to a file name.
// To be used with a map proceedure to transform filenames.
export default curry((config, filePath, next) => {
  const { rootFolder } = config;
  next(null, path.resolve(rootFolder, filePath));
});

