
// import walkSync from 'walk-sync';
import glob from 'wildglob';
import flatten from 'lodash.flatten';
import uniq from 'lodash.uniq';

export default (folder, globs) => new Promise((resolve, reject) => {

  if (globs) {
    const patterns = Array.isArray(globs) ? globs : [globs];
    Promise.all(patterns.map((pattern) => new Promise((res, rej) => {
      glob(pattern, { cwd: folder }, (err, result) => {
        if (err) {
          rej(err);
        } else {
          res(result.sort());// results of wildglob are not ordered.
        }
      });
    })))
    .then((results) => {
      resolve(uniq(flatten(results)));
    })
    .catch((e) => {
      reject(e);
    });

  } else {
    resolve([folder]);
  }
});
