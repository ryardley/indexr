

import indexr from './index';
import parseCLI from './modules/cli';

export default function cli(argv) {
  const {
    inputFolder,
    outputFilename,
    options,
  } = parseCLI(argv);

  indexr(inputFolder, outputFilename, options);
}
