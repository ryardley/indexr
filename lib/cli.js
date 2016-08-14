

import indexr from './index';
import cli from './modules/cli';

export default (argv) => {
  const {
    inputFolder,
    outputFilename,
    options,
  } = cli(argv);

  indexr(inputFolder, outputFilename, options);
};
