import throttle from 'lodash/throttle';
import chokidar from 'chokidar';
import path from 'path';

import { ensureArray } from './utils';

export default function watcher(func, parsedArgs) {

  const {
    watch: watchInput,
    outputFilename,
    modules,
  } = parsedArgs;

  // Run once if watching was not required
  if (!watchInput) return func();

  const watchGlob = typeof watchInput === 'string' ? watchInput : '**/*';
  const ignored = ensureArray(modules).map((module) => path.join((module || ''), outputFilename));
  const handleWatchChange = throttle(func, 1000);

  chokidar
    .watch(watchGlob, { ignored })
    // TODO: rebuild only sub folders from the returnPath
    .on('all', handleWatchChange);

  return true;
}
