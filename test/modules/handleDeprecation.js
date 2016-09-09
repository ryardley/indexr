import handleDeprecation from '../../lib/modules/args/handleDeprecation';
import { assert } from 'chai';
import sinon from 'sinon';

export default () => {
  const deprecated = {
    include: {
      sub: 'submodules',
      message: 'This is a message',
    },
  };

  const warnFunc = sinon.spy();

  it('should handle a deprecated object', () => {
    const actual = handleDeprecation(deprecated, {
      include: 'foo',
      warnFunc,
    });

    const expected = {
      submodules: 'foo',
    };

    assert(warnFunc.called);
    assert.deepEqual(actual, expected, 'handleDeprecation');
  });

  it('should not allow a deprecated prop through but instead copy its value to the new prop', () => {
    const actual = handleDeprecation(deprecated, {
      include: 'foo',
      other: 'prop',
      submodules: 'bar',
      warnFunc,
    });

    const expected = {
      other: 'prop',
      submodules: 'foo',
    };
    assert(warnFunc.called);
    assert.deepEqual(actual, expected, 'handleDeprecation');
  });
};
