import curry from 'lodash/curry';
import getFileListSync from '../utils/getFileListSync';
import trimTrailingSlash from '../utils/trimTrailingSlash';

function moduleSubmodules(config, rootFolder, next) {
  const { submodules } = config;
  next(null, getFileListSync(rootFolder, submodules).map(trimTrailingSlash));
}

export default curry(moduleSubmodules);
