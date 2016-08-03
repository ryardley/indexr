import fs from 'fs';
import path from 'path';
import walkSync from 'walk-sync';
import {
  ensureArray,
  trimTrailingSlash,
} from './utils';

import templateES6 from './templateES6';
import templateES5 from './templateES5';

const getFileListSync = (folder, globs) =>
  walkSync(folder, { globs: ensureArray(globs) });

const defaultFileWriter = (filename, str) => fs.writeFileSync(filename, str);

const defaultOptions = {
  fileWriter: defaultFileWriter,
  submodules: '*/',
  template: templateES6,
  directImport: false,
  exts: [],
};

function getTemplateOutput(templateFunction, fileList) {
  return templateFunction(fileList);
}

const stripSubmodules = (directImport) => (filePath) => {
  if (directImport) return filePath;
  const m = filePath.match(/^.[^/]*/);
  return m && m[0] || filePath;
};

const stripExts = (exts) => (filePath) => {
  const extsPlusDot = [...exts, ''];
  const extsPlusDotJoined = extsPlusDot.join('|');
  const regexExts = `\\.(${extsPlusDotJoined})$`;
  return filePath.replace(new RegExp(regexExts), '') || filePath;
};

const parseArgs = (rootFolder, ...rest) => {
  // Parse Arguments
  const secondArg = rest[0];
  const lastArg = rest.slice(-1)[0];
  const outputFilename = typeof secondArg === 'string' ? secondArg : undefined;
  const givenOptions = typeof lastArg === 'object' ? lastArg : {};
  const template = givenOptions.es5
    ? templateES5
    : givenOptions.template || defaultOptions.template;
  const options = Object.assign({}, defaultOptions, givenOptions);

  return Object.assign({}, options, { rootFolder, outputFilename, template });
};

// TODO: make asynchronous and optimise for performance
function runIndexrSync({ directImport, exts, fileWriter, submodules, rootFolder,
  outputFilename, template }) {
  // get folder list based on inputs

  const fileList = getFileListSync(rootFolder, submodules).map(trimTrailingSlash);

  // modify folder output
  const modifiedFileList = fileList.map(stripExts(exts)).map(stripSubmodules(directImport));

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

export default function indexr(...args) {
  const {
    modules,
    rootFolder,
    ...rest,
  } = parseArgs(...args);

  // if input glob exists then run the indexr over the output from the input glob
  if (modules) {
    return getFileListSync(rootFolder, modules)
      .map((folder) => runIndexrSync({
        rootFolder: path.resolve(rootFolder, folder),
        ...rest,
      }));
  }

  // run the indexr
  return runIndexrSync({ rootFolder, ...rest });
}
