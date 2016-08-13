import assert from 'assert';
import defaultOptions from '../lib/modules/moduleParseArgs/defaultOptions';
import fs from 'fs';
import handleDeprecation from '../lib/modules/moduleParseArgs/handleDeprecation';
import indexr from '../lib';
import moduleParseCLI from '../lib/modules/cli';
import path from 'path';
import sinon from 'sinon';
import { Command } from 'commander';
import { setLogLevel } from '../lib/utils/logger';

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

const runCLI = (...cmd) =>
  moduleParseCLI(['node', ...cmd], new Command());

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

    it('should return an es6 file with correct exports', (endTest) => {

      indexr(inputFolder, { modules: undefined }).then(() => {
        const expected = fs.readFileSync(path.resolve(outputFolder, 'expected-es6.js'), 'utf-8');
        const actual = fs.readFileSync(path.resolve(inputFolder, defaultOptions.outputFilename), 'utf-8');
        assert.equal(expected, actual, 'Function did not return expected output.');
        endTest();
      })
      .catch(endTest);
    });

    it('should return an es5 file with correct exports', (endTest) => {
      indexr(inputFolder, { es5: true, modules: undefined }).then(() => {
        const actual = fs.readFileSync(path.resolve(inputFolder, defaultOptions.outputFilename), 'utf-8');
        const expected = fs.readFileSync(path.resolve(outputFolder, 'expected-es5.js'), 'utf-8');
        assert.equal(expected, actual, 'Function did not return expected output.');
        endTest();
      })
      .catch(endTest);
    });

    it('should write to a file if the output filename is provided', (endTest) => {
      // const warnFunc = sinon.spy();

      indexr(inputFolder, 'server.js', { modules: undefined }).then(() => {
        const expected = fs.readFileSync(path.resolve(outputFolder, 'expected-es6.js'), 'utf-8');
        const actual = fs.readFileSync(path.resolve(inputFolder, 'server.js'), 'utf-8');
        assert.equal(expected, actual, 'Function did not return expected output.');
        endTest();
      })
      .catch(endTest);
    });


    it('should accept outputFilename as an option', (endTest) => {
      indexr(inputFolder, { outputFilename: 'server.js', modules: undefined }).then(() => {
        const expected = fs.readFileSync(path.resolve(outputFolder, 'expected-es6.js'), 'utf-8');
        const actual = fs.readFileSync(path.resolve(inputFolder, 'server.js'), 'utf-8');
        assert.equal(expected, actual, 'Function did not return expected output.');
        endTest();
      })
      .catch(endTest);
    });

    it('should capture submodules filters', (endTest) => {
      indexr(inputFolder, { submodules: '*/server.js', modules: undefined }).then(() => {
        const actual = fs.readFileSync(path.resolve(inputFolder, defaultOptions.outputFilename));
        const expected = fs.readFileSync(path.resolve(outputFolder,
          'expected-es6-server.js'), 'utf-8');
        assert.equal(expected, actual, 'Function did not return expected output.');
        endTest();
      })
      .catch(endTest);
    });

    it('should directImport the files if asked ', (endTest) => {
      indexr(inputFolder, { submodules: '*/server.js', directImport: true, modules: undefined })
      .then(() => {
        const actual = fs.readFileSync(path.resolve(inputFolder, defaultOptions.outputFilename));
        const expected = fs.readFileSync(path.resolve(outputFolder, 'expected-es6-server-direct.js'), 'utf-8');
        assert.equal(expected, actual, 'Function did not return expected output.');
        endTest();
      })
      .catch(endTest);
    });

    it('should remove exts provided ', (endTest) => {
      indexr(inputFolder, {
        submodules: '*/server.js',
        directImport: true,
        modules: undefined,
        exts: ['js'],
      }).then(() => {
        const actual = fs.readFileSync(path.resolve(inputFolder, defaultOptions.outputFilename));
        const expected = fs.readFileSync(path.resolve(outputFolder,
          'expected-es6-server-direct-exts.js'), 'utf-8');
        assert.equal(expected, actual, 'Function did not return expected output.');
        endTest();
      })
      .catch(endTest);
    });

    it('should accept globs as folders and run indexr on each returned result', (endTest) => {
      // const warnFunc = sinon.spy();
      indexr(fractalFolder, 'foo.js', {
        modules: '**/modules/',
        submodules: '*/index.js',
        // warnFunc,
      }).then(() => {
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
        endTest();
      })
      .catch(endTest);

      // assert(warnFunc.called);
    });
  });

  describe('CLI', () => {
    it('should support --out', () => {
      const actual = runCLI('indexr', '.', '--out', 'index.js');
      const expected = {
        inputFolder: '.',
        options: {
          outputFilename: 'index.js',
        },
      };
      assert.deepEqual(expected, actual, 'Function did not return expected output.');
    });

    it('should support --es5', () => {
      const actual = runCLI('indexr', '.', '--es5');
      const expected = {
        inputFolder: '.',
        options: {
          es5: true,
        },
      };
      assert.deepEqual(expected, actual, 'Function did not return expected output.');
    });

    it('should support --direct-import', () => {
      const actual = runCLI('indexr', '.', '--direct-import');
      const expected = {
        inputFolder: '.',
        options: {
          directImport: true,
        },
      };
      assert.deepEqual(expected, actual, 'Function did not return expected output.');
    });

    it('should support --direct-import', () => {
      const actual = runCLI('indexr', '.', '--direct-import');
      const expected = {
        inputFolder: '.',
        options: {
          directImport: true,
        },
      };
      assert.deepEqual(expected, actual, 'Function did not return expected output.');
    });

    it('should support --modules', () => {
      const actual = runCLI('indexr', '.', '--modules', '**/fooo/');
      const expected = {
        inputFolder: '.',
        options: {
          modules: ['**/fooo/'],
        },
      };
      assert.deepEqual(expected, actual, 'Function did not return expected output.');
    });

    it('should support --submodules', () => {
      const actual = runCLI('indexr', '.', '--submodules', '**/fooo/');
      const expected = {
        inputFolder: '.',
        options: {
          submodules: ['**/fooo/'],
        },
      };
      assert.deepEqual(expected, actual, 'Function did not return expected output.');
    });

    it('should support --watch', () => {
      const actual = runCLI('indexr', '.', '--watch', '**/fooo/');
      const expected = {
        inputFolder: '.',
        options: {
          watch: '**/fooo/',
        },
      };
      assert.deepEqual(expected, actual, 'Function did not return expected output.');
    });

    it('should return correct --exts', () => {
      const actual = runCLI('indexr', '.', '--ext', 'js', '--ext', 'jsx');
      const expected = {
        inputFolder: '.',
        options: {
          exts: ['js', 'jsx'],
        },
      };
      assert.deepEqual(expected, actual);
    });
  });
});

