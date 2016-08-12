

import indexr from './index';
import parseCLIInput from './modules/parseCLI';

export default function cli(argv) {
  const {
    inputFolder,
    outputFilename,
    options,
  } = parseCLIInput(argv);

  indexr(inputFolder, outputFilename, options);
}
