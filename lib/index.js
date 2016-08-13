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

  return new Promise((resolve, reject) => {
    runtimeWatch(
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
    )((err, result) => {
      console.log('returning result...');
      if (err) {
        console.log(`ERROR: ${chalk.red(err)}`);
        return reject(err);
      }
      return resolve(result);
    });
  });


}
