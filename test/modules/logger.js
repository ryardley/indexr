import { assert } from 'chai';
import { resetLog, setLogLevel, logHistory, info } from '../../lib/utils/logger';

export default () => {
  it('should actually log stuff and print to console', () => {
    resetLog();
    setLogLevel('none');
    info('foo');
    const actual = logHistory('info')[0];
    const expected = { level: 'info', message: 'indexr >> foo' };
    assert.deepEqual(expected, actual);
    setLogLevel('none');
  });
};
