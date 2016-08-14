
import omit from 'lodash/omit';

export default function handleDeprecation(deprecated, inputs) {
  const {
    warnFunc,
    ...givenInputs,
  } = inputs;

  return Object
    .keys(deprecated)
    .map((opt) => ({
      opt,
      sub: deprecated[opt].sub,
      message: deprecated[opt].message,
    }))
    .reduce((memo, { opt, sub, message }) => {
      if (memo[opt] !== undefined) {
        const depVal = memo[opt];
        const subVal = memo[sub];
        warnFunc(message);
        return {
          ...omit(memo, [opt]),
          // old deprecated values will override new values when both are provided
          [sub]: depVal !== undefined ? depVal : subVal,
        };
      }
      return memo;
    }, givenInputs);
}

