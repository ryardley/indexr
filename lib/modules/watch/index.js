import path from 'path';
import ensureArray from '../../utils/ensureArray';
import throttle from 'lodash/throttle';
import chokidar from 'chokidar';
import { chain } from '../../utils/chainMap';

export const watchFiles = (config) => (...fns) => (next) => {

  const { outputFilename, modules, watch: watchGlobs } = config;
  const watchFunc = chain(...fns);

  // Ignore the output files from the process to avoid infinite repeat
  const nullStringIfFalsy = (value) => value || '';
  const addOutputFilename = (value) => path.join(value, outputFilename);
  const ignored = ensureArray(modules).map(nullStringIfFalsy).map(addOutputFilename);

  // Run once if watching was not required
  if (!watchGlobs) return watchFunc(next);

  const watchGlob = typeof watchGlobs === 'string' ? watchGlobs : '**/*';
  const handleWatchChange = throttle(watchFunc, 2000);

  chokidar
    .watch(watchGlob, { ignored })
    // TODO: rebuild only sub folders from the returnPath
    .on('all', () => handleWatchChange());

  return undefined;
};

export default { watchFiles };
