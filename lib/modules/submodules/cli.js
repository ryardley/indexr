import collect from '../cli/collect';

export default [
  {
    name: 'submodules',
    coercion: collect,
    description: 'Glob string that determine which folders are modules.',
    flags: '-s --submodules <string>',
    long: 'A glob pathed to each module holder folder that will determine which ' +
      'submodules are imported to the index. Defaults to "*/index.js"',
  },
  {
    name: 'submodulesIgnore',
    coercion: collect,
    description: 'Glob string that determine which submodules are ignored.',
    flags: '-g --submodules-ignore <string>',
    long: 'A glob pathed to the rootFolder that will determine which folders are ' +
      'not considered submodules. If this is ommitted nothing is ignored.',
  },
];
