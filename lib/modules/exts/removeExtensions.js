import curry from 'lodash/curry';

// Strip extensions from a given filepath. ie. 'foo/bar.js' => 'foo/bar'
export default curry((config, filePath, next) => {
  const { exts } = config;
  const extsPlusDot = [...exts, ''];
  const extsPlusDotJoined = extsPlusDot.join('|');
  const regexExts = `\\.(${extsPlusDotJoined})$`;
  next(null, filePath.replace(new RegExp(regexExts), '') || filePath);
});
