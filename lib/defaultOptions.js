import fs from 'fs';
import templateES6 from './templateES6';
import { warn, info } from './logger';

const defaultFileWriter = (filename, str) => {
  info(`${filename}`);
  fs.writeFileSync(filename, str);
};

export default {
  fileWriter: defaultFileWriter,
  outputFilename: 'index.r.js',
  dontWrite: false,
  warnFunc: warn,
  modules: ['**/modules/'],
  submodules: '*/',
  template: templateES6,
  directImport: false,
  exts: [],
};
