import { assert } from 'chai';
import getFileList from '../../lib/utils/getFileList';
export default () => {
  it('should blow up if it is given a non string path', (endTest) => {
    getFileList(/1234/, ['one'])
      .then(() => {
        endTest('No error was thrown but it should have.');
      })
      .catch((e) => {
        assert(e);
        endTest();
      });
  });
};
