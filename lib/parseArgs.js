import fs from 'fs';
import templateES6 from './templateES6';
import templateES5 from './templateES5';
import omit from 'lodash/omit';

const defaultFileWriter = (filename, str) => fs.writeFileSync(filename, str);

const defaultOptions = {
  fileWriter: defaultFileWriter,
  warnFunc: console.warn.bind(console),
  submodules: '*/',
  template: templateES6,
  directImport: false,
  exts: [],
};

export function handleDeprecation(deprecated, inputs) {
  const { warnFunc } = inputs;
  const warn = warnFunc || console.warn.bind(console);
  return Object
    .keys(deprecated)
    .map((opt) => ({ opt, sub: deprecated[opt] }))
    .reduce((memo, { opt, sub }) => {
      if (memo[opt] !== undefined) {
        const depVal = memo[opt];
        const subVal = memo[sub];
        warn(`[Indexr]: The '${opt}' option is deprecated. Use '${sub}' instead.`);
        return {
          ...omit(memo, [opt]),
          [sub]: subVal !== undefined ? subVal : depVal,
        };
      }
      return memo;
    }, inputs);
}

export default function parseArgs(rootFolder, ...rest) {
  // Parse Arguments
  const secondArg = rest[0];
  const lastArg = rest.slice(-1)[0];
  const outputFilename = typeof secondArg === 'string' ? secondArg : undefined;
  const givenOptions = typeof lastArg === 'object' ? lastArg : {};
  const template = givenOptions.es5
    ? templateES5
    : givenOptions.template || defaultOptions.template;
  const options = Object.assign({}, defaultOptions, givenOptions);

  const deprecated = {
    include: 'submodules',
  };

  return handleDeprecation(deprecated, { ...options, rootFolder, outputFilename, template });
}
