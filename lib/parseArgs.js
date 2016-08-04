
import templateES5 from './templateES5';
import omit from 'lodash/omit';
import defaultOptions from './defaultOptions';

export function handleDeprecation(deprecated, inputs) {

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

export default function parseArgs(rootFolder, ...rest) {
  // Parse Arguments
  const secondArg = rest[0];
  const lastArg = rest.slice(-1)[0];
  const outputFilenameAs2ndArg = typeof secondArg === 'string' ? secondArg : undefined;
  const givenOptions = typeof lastArg === 'object' ? lastArg : {};
  const template = givenOptions.es5
    ? templateES5
    : givenOptions.template || defaultOptions.template;
  const options = Object.assign({}, defaultOptions, givenOptions);

  const deprecated = {
    include: {
      message: '\'include\' options are deprecated.',
      sub: 'submodules',
    },
    outputFilenameAs2ndArg: {
      message: '\'outputFilename\' in second position is deprecated.',
      sub: 'outputFilename',
    },
  };

  const beforeDeprecation = {
    ...options,
    rootFolder,
    outputFilenameAs2ndArg,
    template,
  };

  const finalOptions = handleDeprecation(deprecated, beforeDeprecation);

  return finalOptions;
}
