
import curry from 'lodash/curry';
import es5 from '../template/es5';
import defaultOptions from './defaultOptions';
import handleDeprecation from './handleDeprecation';

function parseArgs(rootFolder, ...rest) {
  // Parse Arguments
  const secondArg = rest[0];
  const lastArg = rest.slice(-1)[0];
  const outputFilenameAs2ndArg = typeof secondArg === 'string' ? secondArg : undefined;
  const givenOptions = typeof lastArg === 'object' ? lastArg : {};
  const template = givenOptions.es5
    ? es5
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

export default curry(parseArgs);
