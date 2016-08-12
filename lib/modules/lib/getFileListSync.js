import walkSync from 'walk-sync';
import ensureArray from './ensureArray';

export default (folder, globs) => globs ?
  walkSync(folder, { globs: ensureArray(globs) }) : [folder];
