import curry from 'lodash/curry';
import fs from 'fs';
import path from 'path';
import { info } from '../utils/logger';

function fileWriter(config, value, next) {
  const { outputFilename } = config;
  const { modulePath, value: contents } = value;
  if (!modulePath) return next('No module path sent to fileWriter.');
  if (!contents) return next('No contents sent to fileWriter.');
  const filename = path.resolve(modulePath, outputFilename);
  info(`${filename}`);
  fs.writeFileSync(filename, contents);
  return next(null, 'File sucessfully written.');
}

export default curry(fileWriter);
