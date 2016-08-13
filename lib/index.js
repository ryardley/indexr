import chalk from 'chalk';
import moduleFileWriter from './modules/moduleFileWriter';
import moduleModuleFolders from './modules/moduleModuleFolders';
import moduleRootPath from './modules/moduleRootPath';
import moduleWatch from './modules/moduleWatch';
import moduleDirectImport from './modules/moduleDirectImport';
import moduleExts from './modules/moduleExts';
import moduleSubmodules from './modules/moduleSubmodules';
import moduleTemplate from './modules/moduleTemplate';
import parseArgs from './modules/moduleParseArgs';
import remember from './utils/remember';
import { chain, map } from './utils/chainMap';

export default function indexr(...args) {
  // get parsed input
  const parsed = parseArgs(...args);

  // Configure all our modules
  // Modules are all of the form (config) => (value) => { return newVal(value) }
  const runtimeModuleFolders = moduleModuleFolders(parsed);
  const runtimeRootPath = moduleRootPath(parsed);
  const runtimeWatch = moduleWatch(parsed);
  const runtimeSelectSubmodules = moduleSubmodules(parsed);
  const runtimeRemoveExts = moduleExts(parsed);
  const runtimDirectImport = moduleDirectImport(parsed);
  const runtimeTemplate = moduleTemplate(parsed);
  const rememberModulePath = remember('modulePath');
  const runtimeFileWriter = rememberModulePath.decorate(moduleFileWriter(parsed));
  const storeModulePath = rememberModulePath.store; // TODO: decorate this

  const logError = (err) => err && console.log(`ERROR: ${chalk.red(err)}`);

  return runtimeWatch(
    chain(
      runtimeModuleFolders,
      map(
        runtimeRootPath,
        storeModulePath,
        runtimeSelectSubmodules,
        map(
          runtimeRemoveExts,
          runtimDirectImport,
        ),
        runtimeTemplate,
        runtimeFileWriter,
      ),
    )
  )(logError);
}
