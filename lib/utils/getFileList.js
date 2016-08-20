import glob from 'glob';
import flatten from 'lodash.flatten';
import uniq from 'lodash.uniq';

export default (cwd, globs, ignore) => new Promise((resolve, reject) => {

  if (globs) {

    const patterns = Array.isArray(globs) ? globs : [globs];

    Promise.all(patterns.map((pattern) => new Promise((res) => {
      glob(pattern, { cwd, ignore }, (err, result) => {
        res(result.sort());// results of wildglob are not ordered.
      });
    })))
    .then((results) => {
      resolve(uniq(flatten(results)));
    })
    .catch((e) => {
      reject(e);
    });

  } else {
    resolve([cwd]);
  }
});
