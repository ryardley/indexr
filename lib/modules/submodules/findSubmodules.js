import curry from 'lodash/curry';
import getFileList from '../../utils/getFileList';
import trimTrailingSlash from '../../utils/trimTrailingSlash';

// Take a submodules glob get the file list for a particular glob folder then
// trim the trailing slash if there is one
export default curry((config, folder, next) => {
  const { submodules: glob } = config;
  getFileList(folder, glob)
    .then((result) => {
      next(null, result.map(trimTrailingSlash));
    })
    .catch(next);
});

