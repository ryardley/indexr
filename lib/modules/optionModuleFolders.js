import getFileListSync from '../utils/getFileListSync';

export default ({ rootFolder, modules }) => () =>
  getFileListSync(rootFolder, modules);
