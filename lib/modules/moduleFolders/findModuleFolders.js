import curry from 'lodash/curry';
import getFileList from '../../utils/getFileList';

export default curry((config, next) => {
  const { rootFolder, modules, modulesIgnore } = config;
  getFileList(rootFolder, modules, modulesIgnore).then((result) => {
    next(null, result);
  })
  .catch(next);
});
