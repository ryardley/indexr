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
  .usage('<inputfolder> [options]')
  .option('-o, --out [filename]',
    'output filename for the file. ')
  .option('-i, --include [glob]',
    'a glob that will determine which folders are included as imports.', collect, [])
  .option('-5, --es5', 'Use ES5 template for index output.')
  .option('-d, --direct-import',
    'include the searched files in the import statements.')
  .parse(process.argv);

if (program.args.length === 0) program.help();

const inputFolder = program.args[0];
const outputFilename = program.out;
const options = {};

if (program.include.length > 0)
  options.include = program.include;

if (program.es5 !== undefined)
  options.es5 = program.es5;

if (program.directImport !== undefined)
  options.directImport = program.directImport;

const output = indexr(inputFolder, outputFilename, options);

if (!outputFilename) console.log(output);
