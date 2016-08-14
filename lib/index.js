import chalk from 'chalk';
import exts from './modules/exts';
import file from './modules/file';
import imports from './modules/imports';
import moduleFolders from './modules/moduleFolders';
import parseArgs from './modules/args';
import remember from './utils/remember';
import rootFolder from './modules/rootFolder';
import submodules from './modules/submodules';
import template from './modules/template';
import watch from './modules/watch';
import { map } from './utils/chainMap';

export default function indexr(...args) {
  // Get parsed input
  const parsed = parseArgs(...args);
  const mem = remember('modulePath');

  // Configure all our modules
  const findModuleFolders = moduleFolders.findModuleFolders(parsed);
  const findSubmodules = submodules.findSubmodules(parsed);
  const removeExtensions = exts.removeExtensions(parsed);
  const resolveDirectImports = imports.resolveDirectImports(parsed);
  const rootFolderFilePath = rootFolder.rootFolderFilePath(parsed);
  const storeOutput = mem.store;
  const toFile = mem.decorate(file.toFile(parsed));
  const toTemplate = template.toTemplate(parsed);
  const watchFiles = watch.watchFiles(parsed);

  return new Promise((resolve, reject) => {
    // Create the sequence of operations
    const watchSequence = watchFiles(
      findModuleFolders,
      map(
        rootFolderFilePath,
        storeOutput,
        findSubmodules,
        map(
          removeExtensions,
          resolveDirectImports,
        ),
        toTemplate,
        toFile,
      )
    );

    // Run the sequence of operations
    watchSequence((err, result) => {
      if (err) {
        console.log(`ERROR: ${chalk.red(err)}`);
        return reject(err);
      }
      return resolve(result);
    });
  });
}
