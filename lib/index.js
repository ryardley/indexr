import path from 'path';

import parseArgs from './parseArgs';

import walkSync from 'walk-sync';
import {
  ensureArray,
  trimTrailingSlash,
} from './utils';
import watcher from './watcher';

import { info } from './logger';

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

  return watcher(() => {
    const output = runIndexrSync(parsedArgs);
    info(`Created ${output.length} index file${output.length > 1 ? 's' : ''}.`);
    return output;
  }, parsedArgs);
}
