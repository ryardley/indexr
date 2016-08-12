import getFileListSync from './lib/getFileListSync';
import trimTrailingSlash from './lib/trimTrailingSlash';

export default ({ submodules }) => (rootFolder) =>
  getFileListSync(rootFolder, submodules).map(trimTrailingSlash);

