import fs from 'fs';
import path from 'path';
import { info } from '../utils/logger';

export default ({ outputFilename }) => ({ modulePath, value }) => {
  if (!modulePath || !value) return;
  const filename = path.resolve(modulePath, outputFilename);
  info(`${filename}`);
  fs.writeFileSync(filename, value);
};

