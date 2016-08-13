/* eslint-disable max-len */
import fs from 'fs';
import path from 'path';
import { Command } from 'commander';
import optionsTable from '../optionsTable';
import extendedHelpCommander from './extendedHelpCommander';


const importJSON = (jsonPath) => JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

const pkg = importJSON(path.resolve(__dirname, '../../../package.json'));


export default function cli(argv) {

  const command = new Command();
  const program = extendedHelpCommander(
    command
      .version(`Indexr v${pkg.version}`)
      .usage('<rootFolder> [options]'),
    optionsTable
  );

  program.parse(argv);

  if (program.args.length === 0) program.help();

  // prepare input for consumption
  const inputFolder = program.args[0];
  const options = {};

  if (program.submodules !== undefined)
    options.submodules = program.submodules;

  if (program.ext !== undefined)
    options.exts = program.ext;

  if (program.es5 !== undefined)
    options.es5 = program.es5;

  if (program.directImport !== undefined)
    options.directImport = program.directImport;

  if (program.modules !== undefined)
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




