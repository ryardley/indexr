/* eslint-disable max-len */
import assert from 'assert';
import defaultOptions from '../lib/modules/args/defaultOptions';
import fs from 'fs';
import handleDeprecation from '../lib/modules/args/handleDeprecation';
import indexr from '../lib';
import moduleParseCLI from '../lib/modules/cli';
import path from 'path';
import sinon from 'sinon';
import extendedHelp from '../lib/modules/cli/extendedHelp';
import getFileList from '../lib/utils/getFileList';
import { Command } from 'commander';
import chokidar from 'chokidar';
import { resetLog, setLogLevel, logHistory } from '../lib/utils/logger';
// TODO: Simplify some of these examples

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

let sandbox;
beforeEach(() => {
  sandbox = sinon.sandbox.create();
  setLogLevel('none');
  resetLog();
});

afterEach(() => {
  setLogLevel('all');
  sandbox.restore();
});


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
      path.resolve(fractalFolder, 'modules', 'thing.js'),
      path.resolve(fractalFolder, 'modules', 'module-1', 'modules', 'foo.js'),
      path.resolve(fractalFolder, 'modules', 'module-1', 'modules', 'thing.js'),
      path.resolve(fractalFolder, 'modules', 'module-1', 'modules', 'nested-2', 'modules', 'foo.js'),
      path.resolve(fractalFolder, 'modules', 'module-1', 'modules', 'nested-2', 'modules', 'thing.js'),
      path.resolve(fractalFolder, 'modules', 'module-1', 'modules', 'nested-2', 'modules', 'foo.js'),
      path.resolve(fractalFolder, 'modules', 'module-1', 'modules', 'nested-2', 'modules', 'thing.js'),
      path.resolve(fractalFolder, 'modules', 'module-2', 'things', 'thing.js'),
    ];

    deletePaths.forEach((filePath) => {
      if (fileExists(filePath)) {
        fs.unlinkSync(filePath);
      }
    });
  });

  describe('node API', () => {

    it('should return an es6 file with correct exports', (endTest) => {
      setLogLevel('all');
      indexr(inputFolder, { modules: undefined }).then(() => {

        const expected = fs.readFileSync(path.resolve(outputFolder, 'expected-es6.js'), 'utf-8');
        const actual = fs.readFileSync(path.resolve(inputFolder, defaultOptions.outputFilename), 'utf-8');
        assert.equal(actual, expected, 'Function did not return expected output.');
        assert(logHistory().length === 1);
        endTest();
      })
      .catch(endTest);
    });

    it('should return an es5 file with correct exports', (endTest) => {
      indexr(inputFolder, { es5: true, modules: undefined }).then(() => {
        const actual = fs.readFileSync(path.resolve(inputFolder, defaultOptions.outputFilename), 'utf-8');
        const expected = fs.readFileSync(path.resolve(outputFolder, 'expected-es5.js'), 'utf-8');
        assert.equal(actual, expected, 'Function did not return expected output.');
        assert(logHistory().length === 1);
        endTest();
      })
      .catch(endTest);
    });

    it('should write to a file if the output filename is provided', (endTest) => {
      // const warnFunc = sinon.spy();

      indexr(inputFolder, 'server.js', { modules: undefined }).then(() => {
        const expected = fs.readFileSync(path.resolve(outputFolder, 'expected-es6.js'), 'utf-8');
        const actual = fs.readFileSync(path.resolve(inputFolder, 'server.js'), 'utf-8');
        assert.equal(actual, expected, 'Function did not return expected output.');
        endTest();
      })
      .catch(endTest);
    });


    it('should accept outputFilename as an option', (endTest) => {
      indexr(inputFolder, { outputFilename: 'server.js', modules: undefined }).then(() => {
        const expected = fs.readFileSync(path.resolve(outputFolder, 'expected-es6.js'), 'utf-8');
        const actual = fs.readFileSync(path.resolve(inputFolder, 'server.js'), 'utf-8');
        assert.equal(actual, expected, 'Function did not return expected output.');
        endTest();
      })
      .catch(endTest);
    });

    it('should capture submodules filters', (endTest) => {
      indexr(inputFolder, { submodules: '*/server.js', modules: undefined }).then(() => {
        const actual = fs.readFileSync(path.resolve(inputFolder, defaultOptions.outputFilename));
        const expected = fs.readFileSync(path.resolve(outputFolder,
          'expected-es6-server.js'), 'utf-8');
        assert.equal(actual, expected, 'Function did not return expected output.');
        endTest();
      })
      .catch(endTest);
    });

    it('should directImport the files if asked ', (endTest) => {
      indexr(inputFolder, { submodules: '*/server.js', directImport: true, modules: undefined })
      .then(() => {
        const actual = fs.readFileSync(path.resolve(inputFolder, defaultOptions.outputFilename));
        const expected = fs.readFileSync(path.resolve(outputFolder, 'expected-es6-server-direct.js'), 'utf-8');
        assert.equal(actual, expected, 'Function did not return expected output.');
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
        assert.equal(actual, expected, 'Function did not return expected output.');
        endTest();
      })
      .catch(endTest);
    });

    it('should use named exports', (endTest) => {
      indexr(inputFolder, {
        modules: undefined,
        namedExports: true,
      })
      .then(() => {
        const expected = fs.readFileSync(path.resolve(outputFolder, 'expected-es6-named-exports.js'), 'utf-8');
        const actual = fs.readFileSync(path.resolve(inputFolder, defaultOptions.outputFilename), 'utf-8');
        assert.equal(actual, expected, 'Function did not return expected output.');
        endTest();
      })
      .catch(endTest);
    });

    it('should use named exports for es5', (endTest) => {
      indexr(inputFolder, {
        modules: undefined,
        es5: true,
        namedExports: true,
      })
      .then(() => {
        const expected = fs.readFileSync(path.resolve(outputFolder, 'expected-es5-named-exports.js'), 'utf-8');
        const actual = fs.readFileSync(path.resolve(inputFolder, defaultOptions.outputFilename), 'utf-8');
        assert.equal(actual, expected, 'Function did not return expected output.');
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
          fs.readFileSync(path.resolve(fractalFolder, 'modules', 'module-1', 'modules', 'foo.js'), 'utf-8'),
          fs.readFileSync(path.resolve(fractalFolder, 'modules', 'module-1', 'modules', 'nested-2', 'modules', 'foo.js'), 'utf-8'),
        ];

        assert.deepEqual(expected, actual, 'Function did not return expected output.');
        endTest();
      })
      .catch(endTest);
    });

    it('should accept multiple globs in arrays and run indexr on each returned result', (endTest) => {
      indexr(fractalFolder, 'thing.js', {
        submodules: '*/index.js',
        modules: ['**/modules/', '**/things/'],
      })
      .then(() => {
        const expected = [
          fs.readFileSync(path.resolve(outputFolder, 'expected-module.js'), 'utf-8'),
          fs.readFileSync(path.resolve(outputFolder, 'expected-nested.js'), 'utf-8'),
          fs.readFileSync(path.resolve(outputFolder, 'expected-double-nested.js'), 'utf-8'),
          fs.readFileSync(path.resolve(outputFolder, 'expected-thing.js'), 'utf-8'),
        ];

        const actual = [
          fs.readFileSync(path.resolve(fractalFolder, 'modules', 'thing.js'), 'utf-8'),
          fs.readFileSync(path.resolve(fractalFolder, 'modules', 'module-1', 'modules', 'thing.js'), 'utf-8'),
          fs.readFileSync(path.resolve(fractalFolder, 'modules', 'module-1', 'modules', 'nested-2', 'modules', 'thing.js'), 'utf-8'),
          fs.readFileSync(path.resolve(fractalFolder, 'modules', 'module-2', 'things', 'thing.js'), 'utf-8'),
        ];

        assert.deepEqual(expected, actual, 'Function did not return expected output.');
        assert(logHistory().length === 5);
        endTest();
      })
      .catch(endTest);
    });

    it('should run the file watcher', () => {
      const onEventSpy = sinon.spy((tag, func) => func());
      sinon.stub(chokidar, 'watch', () => ({ on: onEventSpy }));

      indexr(fractalFolder, 'thing.js', {
        watch: '**/foo/*',
      });

      assert(chokidar.watch.withArgs('**/foo/*', { ignored: ['**/modules/thing.js'] }).calledOnce, 'Chockidar was not called with the correct args.');
      assert(onEventSpy.withArgs('all').calledOnce);
      chokidar.watch.restore();
    });

    it('should run the file watcher on **/* with watch: true', () => {
      sinon.stub(chokidar, 'watch', () => ({ on: () => {} }));

      indexr(fractalFolder, 'thing.js', {
        watch: true,
      });

      assert(chokidar.watch.withArgs('**/*', { ignored: ['**/modules/thing.js'] }).calledOnce, 'Chockidar was not called with the correct args.');
      chokidar.watch.restore();
    });
  });

  describe('CLI', () => {
    it('should support --out', () => {
      const actual = runCLI('indexr', '.', '--out', 'index.js');
      const expected = {
        inputFolder: '.',
        options: {
          outputFileName: 'index.js',
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

    it('should support --named-exports', () => {
      const actual = runCLI('indexr', '.', '--named-exports');
      const expected = {
        inputFolder: '.',
        options: {
          namedExports: true,
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

    it('should show --help', () => {
      const flags = '-f, --some-flag';
      const description = 'Some flag';
      const long = 'Some long';
      const coercion = undefined;
      const defaults = undefined;
      const allmessages = [];

      sinon.stub(console, 'log', (msg) => allmessages.push(msg));

      // const option = sinon.spy();
      const option = () => {};
      const on = (tag, func) => func();

      extendedHelp({ option, on }, [{
        flags,
        description,
        coercion,
        defaults,
        long,
      }]);
      console.log.restore();

      assert.deepEqual(allmessages, ['\n  Some flag\n  ----------\n  -f, --some-flag\n\n  Some long\n\n']);

    });

    describe('getFileList', () => {
      it('should blow up if it is given a non string path', (endTest) => {
        getFileList(/1234/, ['one'])
          .then(() => {
            endTest('No error was thrown but it should have.');
          })
          .catch((e) => {
            assert(e);
            endTest();
          });
      });
    });


  });
});

