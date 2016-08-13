
// import walkSync from 'walk-sync';
import glob from 'wildglob';

export default (folder, globs) => new Promise((resolve, reject) => {

  if (globs) {
    glob(globs, { cwd: folder }, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result.sort());
      }
    });
  } else {
    resolve([folder]);
  }
});
