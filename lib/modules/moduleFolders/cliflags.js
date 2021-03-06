import collect from '../cli/collect';

export default [
  {
    name: 'modules',
    coercion: collect,
    description: 'Glob string that determine which folders hold modules.',
    flags: '-m --modules <string>',
    long: 'A glob pathed to the rootFolder that will determine which folders are ' +
      'module holders. If this is ommitted defaults to "**/modules/".',
  },
  {
    name: 'modulesIgnore',
    coercion: collect,
    description: 'Glob string that determine which folders are ignored.',
    flags: '-i --modules-ignore <string>',
    long: 'A glob pathed to the rootFolder that will determine which folders are ' +
      'not module holders. If this is ommitted nothing is ignored.',
  },
];
