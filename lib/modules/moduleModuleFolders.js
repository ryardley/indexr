import curry from 'lodash/curry';

import getFileListSync from '../utils/getFileListSync';

const moduleFolders = (config, next) => {
  const { rootFolder, modules } = config;
  next(null, getFileListSync(rootFolder, modules));
};

export default curry(moduleFolders);
