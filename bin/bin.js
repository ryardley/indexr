#!/usr/bin/env node

import program from 'commander';
import pkg from '../package.json';
import indexr from '../dist';

const collect = (item, memo) => {
  memo.push(item);
  return memo;
};

program
  .version(`Indexr v${pkg.version}`)
  .usage('<rootFolder> [options]')
  .option('-o, --out [filename]', 'The name of the output file. This file will be added to each module folder.')
  .option('-m, --modules [glob]',
    'A glob pathed to the rootFolder that will determine which folders are module folders. If this is ommitted only the root folder is a module folder.')
  .option('-s, --submodules [glob]',
    'A glob pathed to each module folder that will determine which submodules are imported to the index.', collect, [])
  .option('-5, --es5', 'Use ES5 template for index output.')
  .option('-d, --direct-import',
    'Include the searched files in the import statements.')
  .option('-i, --include [glob]', 'Deprecated in favour of --submodules');

program.on('--help', () => {
  console.log('  Examples:');
  console.log('');
  console.log('    $ indexr ./app --out server.js --modules **/modules/ --submodules */server.js');
  console.log('');
});

program.parse(process.argv);

if (program.args.length === 0) program.help();

const inputFolder = program.args[0];
const outputFilename = program.out;
const options = {};

if (program.submodules.length > 0)
  options.submodules = program.submodules;

if (program.es5 !== undefined)
  options.es5 = program.es5;

if (program.directImport !== undefined)
  options.directImport = program.directImport;

if (program.modules !== undefined)
  options.modules = program.modules;

const output = indexr(inputFolder, outputFilename, options);

if (!outputFilename) console.log(output);
