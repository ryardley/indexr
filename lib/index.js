import path from 'path';
import chokidar from 'chokidar';
import parseArgs from './parseArgs';
import throttle from 'lodash/throttle';
import walkSync from 'walk-sync';
import {
  ensureArray,
  trimTrailingSlash,
} from './utils';

const getFileListSync = (folder, globs) => globs ?
  walkSync(folder, { globs: ensureArray(globs) }) : [folder];


function getTemplateOutput(templateFunction, fileList) {
  return templateFunction(fileList);
}

// Strip everything after the second / in a path. ie '/foo/bar' => '/foo'
const stripSubfolders = (directImport) => (filePath) => {
  if (directImport) return filePath;
  const m = filePath.match(/^.[^/]*/);
  return m && m[0] || filePath;
};

// Strip extensions from a given filepath. ie. 'foo/bar.js' => 'foo/bar'
const stripExts = (exts) => (filePath) => {
  const extsPlusDot = [...exts, ''];
  const extsPlusDotJoined = extsPlusDot.join('|');
  const regexExts = `\\.(${extsPlusDotJoined})$`;
  return filePath.replace(new RegExp(regexExts), '') || filePath;
};


// TODO: make asynchronous and optimise for performance
function runIndexrOnFolder(rootFolder, { directImport, exts, fileWriter, submodules,
  outputFilename, template }) {
  // get folder list based on inputs

  const fileList = getFileListSync(rootFolder, submodules).map(trimTrailingSlash);

  // modify folder output
  const modifiedFileList = fileList.map(stripExts(exts)).map(stripSubfolders(directImport));

  if (modifiedFileList.length === 0) return '';

  // render template
  const renderedTemplate = getTemplateOutput(template, modifiedFileList);

  // write file
  if (outputFilename !== undefined) {
    fileWriter(path.resolve(rootFolder, outputFilename), renderedTemplate);
  }

  // return string
  return renderedTemplate;
}

function runIndexrSync(parsedArgs) {
  // console.log(args);


  const {
    modules,
    rootFolder,
    ...rest,
  } = parsedArgs;

  const moduleFolders = getFileListSync(rootFolder, modules);

  return moduleFolders.map(
    (folder) => runIndexrOnFolder(path.resolve(rootFolder, folder), rest)
  );
}

export default function indexr(...args) {
  const parsedArgs = parseArgs(...args);
  const {
    watch: watchInput,
    outputFilename,
    modules,
  } = parsedArgs;

  // TODO: pull this out from here
  if (watchInput) {
    const watchGlob = typeof watchInput === 'string' ? watchInput : '**/*';
    const ignored = path.join(modules, outputFilename);

    // TODO: rebuild only sub folders from the returnPath
    const handleWatchChange = throttle(() => {
      console.log('[indexr]: Rebuilding module indexes.');
      runIndexrSync(parsedArgs);
    }, 1000);

    chokidar
      .watch(watchGlob, { ignored })
      .on('all', handleWatchChange);

    return 'watching files to rebuild indexes.';
  }

  return runIndexrSync(parsedArgs);
}
