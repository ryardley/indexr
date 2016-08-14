import chokidar from 'chokidar';
import ensureArray from '../../utils/ensureArray';
import path from 'path';
import throttle from 'lodash/throttle';
import { chain } from '../../utils/chainMap';

export const watchFiles = (config) => (...fns) => (next) => {
  // Destructure vars
  const {
    outputFilename,
    modules,
    watch: watchGlobs,
  } = config;

  // Ignore the output files from the process to avoid infinite repeat
  const nullStringIfFalsy = (value) => value || '';
  const addOutputFilename = (value) => path.join(value, outputFilename);
  const ignored = ensureArray(modules).map(nullStringIfFalsy).map(addOutputFilename);

  // Run once if watching was not required
  const watchFunc = chain(...fns);
  if (!watchGlobs) return watchFunc(next);

  // Watch glob might be true or a glob so provide a default
  const watchGlob = typeof watchGlobs === 'string' ? watchGlobs : '**/*';
  const handleWatchChange = throttle(watchFunc, 2000);

  // Run a watch
  chokidar
    .watch(watchGlob, { ignored })
    // TODO: performance rebuild only sub folders from the returnPath
    .on('all', () => handleWatchChange());
};

export default { watchFiles };
