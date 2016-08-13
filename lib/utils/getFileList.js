
// import walkSync from 'walk-sync';
import glob from 'wildglob';

export default (folder, globs) => new Promise((resolve, reject) => {

  if (globs) {
    const patterns = Array.isArray(globs) && globs.length === 1 ? globs[0] : globs;
    glob(patterns, { cwd: folder }, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result.sort());// results of wildglob are not ordered.
      }
    });
  } else {
    resolve([folder]);
  }
});
