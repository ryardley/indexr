import path from 'path';
import assert from 'assert';
import indexr from '../lib';
import fs from 'fs';
import { handleDeprecation } from '../lib/parseArgs';
import sinon from 'sinon';
import parseCLIInput from '../lib/parseCLIInput';
import { Command } from 'commander';

const inputFolder = path.resolve(__dirname, './fixtures/input');
const fractalFolder = path.resolve(__dirname, './fixtures/fractal');
const outputFolder = path.resolve(__dirname, './fixtures/output');

const tryer = (func, defval = false) => {
  try {
    return func();
  } catch (e) {
    return defval;
  }
};

const runCLI = (...cmd) => parseCLIInput(['node', ...cmd], new Command());

const fileExists = (fileName) =>
  tryer(() => fs.lstatSync(fileName).isFile());

describe('handleDeprecation', () => {
  const deprecated = {
    include: 'submodules',
  };

  const warnFunc = sinon.spy(); // TODO: use a spy

  it('should handle a deprecated object', () => {
    const actual = handleDeprecation(deprecated, {
      include: 'foo',
      warnFunc,
    });
    assert(warnFunc.called);
    const expected = {
      submodules: 'foo',
      warnFunc,
    };

    assert.deepEqual(actual, expected, 'handleDeprecation');
  });

  it('should not allow a deprecated prop through', () => {
    const actual = handleDeprecation(deprecated, {
      include: 'foo',
      other: 'prop',
      submodules: 'bar',
      warnFunc,
    });
    assert(warnFunc.called);
    const expected = {
      other: 'prop',
      submodules: 'bar',
      warnFunc,
    };

    assert.deepEqual(actual, expected, 'handleDeprecation');
  });
});

describe('indexr', () => {
  afterEach(() => {
    const deletePaths = [
      path.resolve(inputFolder, 'server.js'),
      path.resolve(inputFolder, 'index.js'),
      path.resolve(fractalFolder, 'modules', 'index.js'),
      path.resolve(fractalFolder, 'modules', 'module-1', 'modules', 'index.js'),
      path.resolve(fractalFolder, 'modules', 'module-1', 'modules', 'nested-2',
        'modules', 'index.js'),
    ];

    deletePaths.forEach((filePath) => {
      if (fileExists(filePath)) {
        fs.unlinkSync(filePath);
      }
    });
  });

  describe('node API', () => {
    it('should return an es6 file with correct exports', () => {
      const actual = indexr(inputFolder);
      const expected = fs.readFileSync(path.resolve(outputFolder, 'expected-es6.js'), 'utf-8');
      assert.equal(expected, actual, 'Function did not return expected output.');
    });

    it('should return an es5 file with correct exports', () => {
      const actual = indexr(inputFolder, { es5: true });
      const expected = fs.readFileSync(path.resolve(outputFolder, 'expected-es5.js'), 'utf-8');
      assert.equal(expected, actual, 'Function did not return expected output.');
    });

    it('should write to a file if the output filename is provided', () => {
      indexr(inputFolder, 'server.js');
      const expected = fs.readFileSync(path.resolve(outputFolder, 'expected-es6.js'), 'utf-8');
      const actual = fs.readFileSync(path.resolve(inputFolder, 'server.js'), 'utf-8');
      assert.equal(expected, actual, 'Function did not return expected output.');
    });

    it('should capture import filters ', () => {
      const actual = indexr(inputFolder, { submodules: '*/server.js' });
      const expected = fs.readFileSync(path.resolve(outputFolder, 'expected-es6-server.js'), 'utf-8');
      assert.equal(expected, actual, 'Function did not return expected output.');
    });

    it('should directImport the files if asked ', () => {
      const actual = indexr(inputFolder, { submodules: '*/server.js', directImport: true });
      const expected = fs.readFileSync(path.resolve(outputFolder,
        'expected-es6-server-direct.js'), 'utf-8');
      assert.equal(expected, actual, 'Function did not return expected output.');
    });

    it('should remove exts provided ', () => {
      const actual = indexr(inputFolder, { submodules: '*/server.js',
        directImport: true, exts: ['js'] });
      const expected = fs.readFileSync(path.resolve(outputFolder,
        'expected-es6-server-direct-exts.js'), 'utf-8');
      assert.equal(expected, actual, 'Function did not return expected output.');
    });

    it('should accept globs as folders and run indexr on each returned result', () => {
      indexr(fractalFolder, 'index.js', {
        modules: '**/modules/',
        submodules: '*/index.js',
      });

      const expected = [
        fs.readFileSync(path.resolve(outputFolder, 'expected-module.js'), 'utf-8'),
        fs.readFileSync(path.resolve(outputFolder, 'expected-nested.js'), 'utf-8'),
        fs.readFileSync(path.resolve(outputFolder, 'expected-double-nested.js'), 'utf-8'),
      ];

      const actual = [
        fs.readFileSync(path.resolve(fractalFolder, 'modules', 'index.js'), 'utf-8'),
        fs.readFileSync(path.resolve(fractalFolder, 'modules', 'module-1', 'modules',
          'index.js'), 'utf-8'),
        fs.readFileSync(path.resolve(fractalFolder, 'modules', 'module-1', 'modules',
          'nested-2', 'modules', 'index.js'), 'utf-8'),
      ];

      assert.deepEqual(expected, actual, 'Function did not return expected output.');
    });
  });

  describe('CLI', () => {
    it('CLI should return an es6 file with correct exports', () => {
      const actual = runCLI('indexr', inputFolder, '--out', 'index.js');
      const expected = {
        inputFolder,
        options: {},
        outputFilename: 'index.js',
      };
      assert.deepEqual(expected, actual, 'Function did not return expected output.');
    });
  });
});

