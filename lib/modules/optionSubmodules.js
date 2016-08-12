import getFileListSync from '../utils/getFileListSync';
import trimTrailingSlash from '../utils/trimTrailingSlash';

export default ({ submodules }) => (rootFolder) =>
  getFileListSync(rootFolder, submodules).map(trimTrailingSlash);

