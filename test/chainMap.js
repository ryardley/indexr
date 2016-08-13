import { assert } from 'chai';
import { chain, map } from '../lib/utils/chainMap';

describe('chain', () => {

  it('should waterfall stuff', (endTest) => {
    const input = 1;
    const expected = [1, 2, 3, 4];

    const fns = [
      (num1, next) => {
        next(null, num1, 2);
      },
      (num1, num2, next) => {
        next(null, num1, num2, 3);
      },
      (num1, num2, num3, next) => {
        next(null, num1, num2, num3, 4);
      },
      (num1, num2, num3, num4, next) => {
        next(null, [num1, num2, num3, num4]);
      },
    ];

    const cb = (err, actual) => {
      assert.deepEqual(actual, expected);
      endTest();
    };

    chain(...fns)(input, cb);

  });

  it('should map stuff', (endTest) => {
    const input = ['Rudi', 'Fred'];
    const expected = ['Mr Rudi Esquire', 'Mr Fred Esquire'];

    const fns = [
      (val, next) => next(null, `Mr ${val}`),
      (val, next) => next(null, `${val} Esquire`),
    ];

    const cb = (err, actual) => {
      assert.deepEqual(actual, expected);
      endTest();
    };

    map(...fns)(input, cb);
  });

  it('should nest stuff', (endTest) => {
    const expected = [5, 10, 15];

    chain(
      (val, next) => next(null, val + 1),
      (val, next) => next(null, [val, val + 1, val + 2]),
      map(
        (val, next) => next(null, val * 10),
        (val, next) => next(null, val / 2),
      ),
    )(
      0,
      (err, actual) => {
        assert.deepEqual(actual, expected);
        endTest();
      }
    );
  });

});
