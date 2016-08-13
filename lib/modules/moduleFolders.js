import curry from 'lodash/curry';
import getFileList from '../utils/getFileList';

export const findModuleFolders = curry((config, next) => {
  const { rootFolder, modules } = config;
  getFileList(rootFolder, modules).then((result) => {
    next(null, result);
  })
  .catch(next);

});

export default { findModuleFolders };
