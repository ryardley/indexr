

import indexr from './index';
import moduleParseCLI from './modules/moduleParseCLI';

export default function cli(argv) {
  const {
    inputFolder,
    outputFilename,
    options,
  } = moduleParseCLI(argv);

  indexr(inputFolder, outputFilename, options);
}
