
import path from 'path';
import { importJSON } from './utils';

const pkg = importJSON(path.resolve(__dirname, '../package.json'));

export default function parseCLIInput(argv, program) {
  const collect = (item, memo) => {
    memo.push(item);
    return memo;
  };

  program
    .version(`Indexr v${pkg.version}`)
    .usage('<rootFolder> [options]')
    .option('-o, --out [filename]',
      'The name of the output file. This file will be added to each module folder.')
    .option('-m, --modules [glob]',
      'A glob pathed to the rootFolder that will determine which folders are ' +
      'module folders. If this is ommitted only the root folder is a module folder.', collect, [])
    .option('-w, --watch [glob]',
      'A glob pathed to the rootFolder that will determine which files to watch ' +
      'when in watch mode.')
    .option('-s, --submodules [glob]',
      'A glob pathed to each module folder that will determine which submodules ' +
      'are imported to the index.', collect, [])
    .option('-5, --es5', 'Use ES5 template for index output.')
    .option('-d, --direct-import',
      'Include the searched files in the import statements.')
    .option('-i, --include [glob]', 'Deprecated in favour of --submodules');

  program.on('--help', () => {
    console.log(' Examples:');
    console.log('');
    console.log('  $ indexr . --out index.r.js --modules \'**/modules/\' --submodules \'*/index.js\'');
    console.log('  $ indexr . --watch --es5');
    console.log('');
  });

  program.parse(argv);

  if (program.args.length === 0) program.help();


  // prepare input for consumption
  const inputFolder = program.args[0];
  const options = {};

  if (program.submodules.length > 0)
    options.submodules = program.submodules;

  if (program.es5 !== undefined)
    options.es5 = program.es5;

  if (program.directImport !== undefined)
    options.directImport = program.directImport;

  if (program.modules.length > 0)
    options.modules = program.modules;

  if (program.watch !== undefined)
    options.watch = program.watch;

  if (program.out !== undefined)
    options.outputFilename = program.out;

  return {
    inputFolder,
    options,
  };
}
