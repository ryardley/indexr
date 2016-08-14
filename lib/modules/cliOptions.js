import flatten from 'lodash/flatten';
import exts from './exts/cli';
import file from './file/cli';
import imports from './imports/cli';
import moduleFolders from './moduleFolders/cli';
import args from './args/cli';
import submodules from './submodules/cli';
import watch from './watch/cli';
// TODO: use indexr to generate this
export default flatten([
  exts,
  file,
  imports,
  moduleFolders,
  args,
  submodules,
  watch,
]);
