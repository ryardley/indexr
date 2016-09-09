import { assert } from 'chai';
import { resetLog, setLogLevel, logHistory, info } from '../../lib/utils/logger';

export default () => {
  it('should actually log stuff and print to console', () => {
    resetLog();
    setLogLevel('info'); // We need to write to the screen for test coverage
    info('foo');
    const actual = logHistory('info')[0];
    const expected = { level: 'info', message: 'indexr >> foo' };
    assert.deepEqual(expected, actual);
    setLogLevel('none');
  });
};
