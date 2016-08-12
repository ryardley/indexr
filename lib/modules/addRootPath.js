import path from 'path';
export default ({ rootFolder }) => (folder) => path.resolve(rootFolder, folder);
