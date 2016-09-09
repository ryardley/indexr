import indexr from '../../lib';
import { assert } from 'chai';
import { resetLog, setLogLevel, logHistory } from '../../lib/utils/logger';
export default () => {
  it('should throw an error in a nice way', (endTest) => {
    resetLog();
    setLogLevel('none');
    indexr(/blow/)
    .catch(() => {
      const actual = logHistory()[0];
      const expected = {
        level: 'error',
        message: 'indexr >> ERROR: TypeError: Path must be a string. Received /blow/',
      };
      assert.deepEqual(expected, actual);
      endTest();
    });

  });
};
