
import { Command } from 'commander';

import indexr from './index';
import parseCLIInput from './parseCLIInput';

export default function cli(argv) {
  const {
    inputFolder,
    outputFilename,
    options,
  } = parseCLIInput(argv, new Command());

  indexr(inputFolder, outputFilename, options);
}

