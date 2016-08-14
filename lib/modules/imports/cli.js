export default {
  name: 'directImport',
  description: 'Directly import files as opposed to folders.',
  flags: '-d --direct-import',
  long: 'This flag will ensure that the output returned by the --submodules ' +
    'glob will be imported to the index.',
};
