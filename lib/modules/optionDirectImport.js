// Strip everything after the second / in a path. ie '/foo/bar' => '/foo'
export default ({ directImport }) => (filePath) => {
  if (directImport) return filePath;
  const m = filePath.match(/^.[^/]*/);
  return m && m[0] || filePath;
};
