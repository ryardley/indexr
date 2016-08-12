import getFileListSync from './lib/getFileListSync';

export default ({ rootFolder, modules }) => () =>
  getFileListSync(rootFolder, modules);
