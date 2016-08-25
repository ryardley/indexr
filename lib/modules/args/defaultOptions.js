import { warn } from '../../utils/logger';
import es6 from '../template/es6';

export default {
  outputFilename: 'index.r.js',
  dontWrite: false,
  warnFunc: warn,
  modules: ['**/modules/'],
  modulesIgnore: ['**/node_modules/**'],
  submodules: '*/',
  template: es6,
  directImport: false,
  exts: [],
};
