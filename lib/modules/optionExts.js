// Strip extensions from a given filepath. ie. 'foo/bar.js' => 'foo/bar'
export default ({ exts }) => (filePath) => {
  const extsPlusDot = [...exts, ''];
  const extsPlusDotJoined = extsPlusDot.join('|');
  const regexExts = `\\.(${extsPlusDotJoined})$`;
  return filePath.replace(new RegExp(regexExts), '') || filePath;
};
