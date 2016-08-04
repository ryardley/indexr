import path from 'path';
import assert from 'assert';
import indexr from '../lib';
import fs from 'fs';
import { handleDeprecation } from '../lib/parseArgs';
import sinon from 'sinon';
import parseCLIInput from '../lib/parseCLIInput';
import { Command } from 'commander';
import { setLogLevel } from '../lib/logger';
import defaultOptions from '../lib/defaultOptions';

// don't log stuff we dont care
setLogLevel('none');

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
    include: {
      sub: 'submodules',
      message: 'This is a message',
    },
  };

  const warnFunc = sinon.spy();

  it('should handle a deprecated object', () => {
    const actual = handleDeprecation(deprecated, {
      include: 'foo',
      warnFunc,
    });

    const expected = {
      submodules: 'foo',
    };

    assert(warnFunc.called);
    assert.deepEqual(actual, expected, 'handleDeprecation');
  });

  it('should not allow a deprecated prop through but instead copy its value to the new prop', () => {
    const actual = handleDeprecation(deprecated, {
      include: 'foo',
      other: 'prop',
      submodules: 'bar',
      warnFunc,
    });

    const expected = {
      other: 'prop',
      submodules: 'foo',
    };
    assert(warnFunc.called);
    assert.deepEqual(actual, expected, 'handleDeprecation');
  });

});

describe('indexr', () => {
  afterEach(() => {
    const deletePaths = [
      path.resolve(inputFolder, 'server.js'),
      path.resolve(inputFolder, defaultOptions.outputFilename),
      path.resolve(fractalFolder, 'modules', defaultOptions.outputFilename),
      path.resolve(fractalFolder, 'modules', 'foo.js'),
      path.resolve(fractalFolder, 'modules', 'module-1', 'modules', 'foo.js'),
      path.resolve(fractalFolder, 'modules', 'module-1', 'modules', 'nested-2',
        'modules', 'foo.js'),
    ];

    deletePaths.forEach((filePath) => {
      if (fileExists(filePath)) {
        fs.unlinkSync(filePath);
      }
    });
  });

  describe('node API', () => {
    it('should return an es6 file with correct exports', () => {
      indexr(inputFolder, { modules: undefined });
      const actual = fs.readFileSync(path.resolve(inputFolder, defaultOptions.outputFilename), 'utf-8');
      const expected = fs.readFileSync(path.resolve(outputFolder, 'expected-es6.js'), 'utf-8');
      assert.equal(expected, actual, 'Function did not return expected output.');
    });

    it('should return an es5 file with correct exports', () => {
      indexr(inputFolder, { es5: true, modules: undefined });
      const actual = fs.readFileSync(path.resolve(inputFolder, defaultOptions.outputFilename), 'utf-8');
      const expected = fs.readFileSync(path.resolve(outputFolder, 'expected-es5.js'), 'utf-8');
      assert.equal(expected, actual, 'Function did not return expected output.');
    });

    it('should write to a file if the output filename is provided', () => {
      const warnFunc = sinon.spy();

      indexr(inputFolder, 'server.js', { warnFunc, modules: undefined });
      const expected = fs.readFileSync(path.resolve(outputFolder, 'expected-es6.js'), 'utf-8');
      const actual = fs.readFileSync(path.resolve(inputFolder, 'server.js'), 'utf-8');

      assert.equal(expected, actual, 'Function did not return expected output.');
      assert(warnFunc.called);
    });


    it('should accept outputFilename as an option', () => {
      indexr(inputFolder, { outputFilename: 'server.js', modules: undefined });
      const expected = fs.readFileSync(path.resolve(outputFolder, 'expected-es6.js'), 'utf-8');
      const actual = fs.readFileSync(path.resolve(inputFolder, 'server.js'), 'utf-8');
      assert.equal(expected, actual, 'Function did not return expected output.');
    });

    it('should capture submodules filters', () => {
      indexr(inputFolder, { submodules: '*/server.js', modules: undefined });
      const actual = fs.readFileSync(path.resolve(inputFolder, defaultOptions.outputFilename));
      const expected = fs.readFileSync(path.resolve(outputFolder,
        'expected-es6-server.js'), 'utf-8');
      assert.equal(expected, actual, 'Function did not return expected output.');
    });

    it('should directImport the files if asked ', () => {
      indexr(inputFolder, { submodules: '*/server.js', directImport: true, modules: undefined });
      const actual = fs.readFileSync(path.resolve(inputFolder, defaultOptions.outputFilename));

      const expected = fs.readFileSync(path.resolve(outputFolder,
        'expected-es6-server-direct.js'), 'utf-8');
      assert.equal(expected, actual, 'Function did not return expected output.');
    });

    it('should remove exts provided ', () => {
      indexr(inputFolder, {
        submodules: '*/server.js',
        directImport: true,
        modules: undefined,
        exts: ['js'],
      });
      const actual = fs.readFileSync(path.resolve(inputFolder, defaultOptions.outputFilename));
      const expected = fs.readFileSync(path.resolve(outputFolder,
        'expected-es6-server-direct-exts.js'), 'utf-8');
      assert.equal(expected, actual, 'Function did not return expected output.');
    });

    it('should accept globs as folders and run indexr on each returned result', () => {
      const warnFunc = sinon.spy();
      indexr(fractalFolder, 'foo.js', {
        modules: '**/modules/',
        submodules: '*/index.js',
        warnFunc,
      });

      const expected = [
        fs.readFileSync(path.resolve(outputFolder, 'expected-module.js'), 'utf-8'),
        fs.readFileSync(path.resolve(outputFolder, 'expected-nested.js'), 'utf-8'),
        fs.readFileSync(path.resolve(outputFolder, 'expected-double-nested.js'), 'utf-8'),
      ];

      const actual = [
        fs.readFileSync(path.resolve(fractalFolder, 'modules', 'foo.js'), 'utf-8'),
        fs.readFileSync(path.resolve(fractalFolder, 'modules', 'module-1', 'modules',
          'foo.js'), 'utf-8'),
        fs.readFileSync(path.resolve(fractalFolder, 'modules', 'module-1', 'modules',
          'nested-2', 'modules', 'foo.js'), 'utf-8'),
      ];

      assert.deepEqual(expected, actual, 'Function did not return expected output.');
      assert(warnFunc.called);
    });
  });

  describe('CLI', () => {
    it('should return correct input to indexr function', () => {
      const actual = runCLI('indexr', '/thing', '--out', 'index.js', '--watch');
      const expected = {
        inputFolder: '/thing',
        options: {
          watch: true,
          outputFilename: 'index.js',
        },
      };
      assert.deepEqual(expected, actual, 'Function did not return expected output.');
    });
  });
});

