import throttle from 'lodash/throttle';
import chokidar from 'chokidar';

export default function watcher(func, watch, ignored) {

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
