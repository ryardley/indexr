import exts from './exts/cli';
import file from './file/cli';
import watch from './watch/cli';
import imports from './imports/cli';
import moduleFolders from './moduleFolders/cli';
import submodules from './submodules/cli';
import moduleParseArgs from './moduleParseArgs/cli';

export default [
  moduleParseArgs,
  imports,
  exts,
  moduleFolders,
  submodules,
  file,
  watch,
];
