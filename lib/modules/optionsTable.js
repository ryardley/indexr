import exts from './exts/cli';
import file from './file/cli';
import imports from './imports/cli';
import moduleFolders from './moduleFolders/cli';
import moduleParseArgs from './moduleParseArgs/cli';
import submodules from './submodules/cli';
import watch from './watch/cli';
// TODO: use indexr to generate this
export default [
  exts,
  file,
  imports,
  moduleFolders,
  moduleParseArgs,
  submodules,
  watch,
];
