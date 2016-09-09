/* eslint-disable max-len */
import checkErrorPath from './modules/checkErrorPath';
import cli from './modules/cli';
import extendHelp from './modules/extendHelp';
import getFileList from './modules/getFileList';
import handleDeprecation from './modules/handleDeprecation';
import ignoreNodeModulesByDefault from './modules/ignoreNodeModulesByDefault';
import logger from './modules/logger';
import nodeApi from './modules/nodeApi';
import watch from './modules/watch';
import { setLogLevel } from '../lib/utils/logger';
setLogLevel('none');
describe('indexr', () => {
  describe('checkErrorPath', checkErrorPath);
  describe('cli', cli);
  describe('extendHelp', extendHelp);
  describe('getFileList', getFileList);
  describe('handleDeprecation', handleDeprecation);
  describe('ignoreNodeModulesByDefault', ignoreNodeModulesByDefault);
  describe('logger', logger);
  describe('nodeApi', nodeApi);
  describe('watch', watch);
});
