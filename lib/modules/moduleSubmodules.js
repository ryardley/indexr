import curry from 'lodash/curry';
import getFileList from '../utils/getFileList';
import trimTrailingSlash from '../utils/trimTrailingSlash';

function moduleSubmodules(config, rootFolder, next) {
  const { submodules } = config;
  getFileList(rootFolder, submodules)
    .then((result) => {
      next(null, result.map(trimTrailingSlash));
    })
    .catch(next);
}

export default curry(moduleSubmodules);
