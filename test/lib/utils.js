import fs from 'fs';
import path from 'path';
import { Command } from 'commander';
import moduleParseCLI from '../../lib/modules/cli';

export const tryer = (func, defval = false) => {
  try {
    return func();
  } catch (e) {
    return defval;
  }
};

export const runCLI = (...cmd) =>
  moduleParseCLI(['node', ...cmd], new Command());

export const fileExists = (fileName) =>
  tryer(() => fs.lstatSync(fileName).isFile());

export const paths = {
  inputFolder: path.resolve(__dirname, '..', './fixtures/input'),
  fractalFolder: path.resolve(__dirname, '..', './fixtures/fractal'),
  outputFolder: path.resolve(__dirname, '..', './fixtures/output'),
};

export const deleteFiles = (...deletePaths) => {
  deletePaths.forEach((filePath) => {
    if (fileExists(filePath)) {
      fs.unlinkSync(filePath);
    }
  });
};
