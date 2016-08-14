import collect from '../cli/collect';

export default {
  name: 'exts',
  coercion: collect,
  description: 'Remove this extension from imports.',
  flags: '-e --ext <string>',
  long: 'Remove this extension from the imported files. ' +
    'Useful if you would prefer to import "./foo/server" ' +
    'instead of "./foo/server.js"',
};
