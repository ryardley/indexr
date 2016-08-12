import fileWriter from './modules/fileWriter';
import optionDirectImport from './modules/optionDirectImport';
import optionExts from './modules/optionExts';
import optionModuleFolders from './modules/optionModuleFolders';
import optionSubmodules from './modules/optionSubmodules';
import optionTemplate from './modules/optionTemplate';
import optionWatch from './modules/optionWatch';
import addRootPath from './modules/addRootPath';
import parseArgs from './modules/parseArgs';
import map from './utils/map';
import remember from './utils/remember';

export default function indexr(...args) {
  // get parsed input
  const parsed = parseArgs(...args);

  // Configure all our modules
  // Modules are all of the form (config) => (value) => { return newVal(value) }
  const watchFiles = optionWatch(parsed);
  const selectModules = optionModuleFolders(parsed);
  const applyRootPath = addRootPath(parsed);
  const selectSubmodules = optionSubmodules(parsed);
  const removeExtension = optionExts(parsed);
  const applyDirectImport = optionDirectImport(parsed);
  const renderTemplate = optionTemplate(parsed);
  const writeToFile = fileWriter(parsed);
  const rememberModulePath = remember('modulePath');
  const storeModulePath = rememberModulePath.store;
  const writeToFileWithModulePath = rememberModulePath.decorate(writeToFile);

  // setup the overall structure of our program
  return watchFiles(
    selectModules,
    map(
      applyRootPath,
      storeModulePath,
      selectSubmodules,
      map(
        removeExtension,
        applyDirectImport,
      ),
      renderTemplate,
      writeToFileWithModulePath,
    )
  );

}
