import path from 'path';
import ensureArray from './lib/ensureArray';
import throttle from 'lodash/throttle';
import chokidar from 'chokidar';
import flow from 'lodash/flow';

function watcher(func, watch, ignored) {

  // Run once if watching was not required
  if (!watch) return func();

  const watchGlob = typeof watch === 'string' ? watch : '**/*';
  const handleWatchChange = throttle(func, 1000);

  chokidar
    .watch(watchGlob, { ignored })
    // TODO: rebuild only sub folders from the returnPath
    .on('all', handleWatchChange);

  return true;
}

export default ({ outputFilename, modules, watchGlobs }) => (...funcs) => {
  const watchFunc = flow(...funcs);

  // Ignore the output files from the process to avoid infinite repeat
  const nullStringIfFalsy = (value) => value || '';
  const addOutputFilename = (value) => path.join(value, outputFilename);
  const ignoredGlobs = ensureArray(modules).map(nullStringIfFalsy).map(addOutputFilename);

  return watcher(watchFunc, watchGlobs, ignoredGlobs);
};
