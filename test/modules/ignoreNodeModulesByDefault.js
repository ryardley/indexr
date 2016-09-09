import indexr from '../../lib';
import { fileExists, paths } from '../lib/utils';
import path from 'path';
import { assert } from 'chai';
const {
  inputFolder,
} = paths;

export default () => {
  it('should ignore node_modules', (endTest) => {
    indexr(inputFolder)
    .then(() => {
      const actual = fileExists(path.resolve(inputFolder, 'module-3/node_modules/modules/index.r.js'));
      const expected = false;
      assert.equal(expected, actual);
      endTest();
    })
    .catch(endTest);

  });
};
