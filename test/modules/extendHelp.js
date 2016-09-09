import extendedHelp from '../../lib/modules/cli/extendedHelp';
import { assert } from 'chai';
import sinon from 'sinon';

export default () => {
  it('extendHelp', () => {
    const flags = '-f, --some-flag';
    const description = 'Some flag';
    const long = 'Some long';
    const coercion = undefined;
    const defaults = undefined;
    const allmessages = [];

    sinon.stub(console, 'log', (msg) => allmessages.push(msg));

    // const option = sinon.spy();
    const option = () => {};
    const on = (tag, func) => func();

    extendedHelp({ option, on }, [{
      flags,
      description,
      coercion,
      defaults,
      long,
    }]);
    console.log.restore();
    assert.deepEqual(
      allmessages,
      ['\n  Some flag\n  ----------\n  -f, --some-flag\n\n  Some long\n\n']
    );
  });
};
