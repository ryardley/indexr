import { warn } from '../../utils/logger';
import templateES6 from '../moduleTemplate/templateES6';

export default {
  outputFilename: 'index.r.js',
  dontWrite: false,
  warnFunc: warn,
  modules: ['**/modules/'],
  submodules: '*/',
  template: templateES6,
  directImport: false,
  exts: [],
};
