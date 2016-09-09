/* eslint-disable max-len */
import defaultOptions from '../../lib/modules/args/defaultOptions';
import fs from 'fs';
import path from 'path';
import indexr from '../../lib';
import { assert } from 'chai';
import { deleteFiles, paths } from '../lib/utils';
import { resetLog, logHistory } from '../../lib/utils/logger';

const {
  fractalFolder,
  inputFolder,
  outputFolder,
} = paths;

export default () => {
  it('should return an es6 file with correct exports', (endTest) => {
    resetLog();
    indexr(inputFolder, { modules: undefined }).then(() => {
      const outputPath = path.resolve(inputFolder, defaultOptions.outputFilename);
      const expected = fs.readFileSync(path.resolve(outputFolder, 'expected-es6.js'), 'utf-8');
      const actual = fs.readFileSync(outputPath, 'utf-8');
      assert.equal(actual, expected, 'Function did not return expected output.');
      assert(logHistory().length === 1);
      deleteFiles(outputPath);
      endTest();
    })
    .catch(endTest);
  });

  it('should return an es5 file with correct exports', (endTest) => {
    resetLog();
    indexr(inputFolder, { es5: true, modules: undefined }).then(() => {
      const outputPath = path.resolve(inputFolder, defaultOptions.outputFilename);
      const actual = fs.readFileSync(path.resolve(inputFolder, defaultOptions.outputFilename), 'utf-8');
      const expected = fs.readFileSync(path.resolve(outputFolder, 'expected-es5.js'), 'utf-8');
      assert.equal(actual, expected, 'Function did not return expected output.');
      assert(logHistory('info').length === 1);
      deleteFiles(outputPath);
      endTest();
    })
    .catch(endTest);
  });

  it('should write to a file if the output filename is provided', (endTest) => {
    // const warnFunc = sinon.spy();

    indexr(inputFolder, 'server.js', { modules: undefined }).then(() => {
      const outputPath = path.resolve(inputFolder, 'server.js');
      const expected = fs.readFileSync(path.resolve(outputFolder, 'expected-es6.js'), 'utf-8');
      const actual = fs.readFileSync(outputPath, 'utf-8');
      assert.equal(actual, expected, 'Function did not return expected output.');
      deleteFiles(outputPath);
      endTest();
    })
    .catch(endTest);
  });


  it('should accept outputFilename as an option', (endTest) => {
    indexr(inputFolder, { outputFilename: 'server.js', modules: undefined }).then(() => {
      const outputPath = path.resolve(inputFolder, 'server.js');
      const expected = fs.readFileSync(path.resolve(outputFolder, 'expected-es6.js'), 'utf-8');
      const actual = fs.readFileSync(outputPath, 'utf-8');
      assert.equal(actual, expected, 'Function did not return expected output.');
      deleteFiles(outputPath);
      endTest();
    })
    .catch(endTest);
  });

  it('should capture submodules filters', (endTest) => {
    indexr(inputFolder, { submodules: '*/server.js', modules: undefined }).then(() => {
      const outputPath = path.resolve(inputFolder, defaultOptions.outputFilename);
      const actual = fs.readFileSync(outputPath, 'utf-8');
      const expected = fs.readFileSync(path.resolve(outputFolder,
        'expected-es6-server.js'), 'utf-8');
      assert.equal(actual, expected, 'Function did not return expected output.');
      deleteFiles(outputPath);
      endTest();
    })
    .catch(endTest);
  });

  it('should capture submodules ignore', (endTest) => {
    indexr(inputFolder, { submodulesIgnore: 'module-1/', modules: undefined }).then(() => {
      const outputPath = path.resolve(inputFolder, defaultOptions.outputFilename);
      const actual = fs.readFileSync(outputPath, 'utf-8');
      const expected = fs.readFileSync(path.resolve(outputFolder,
        'expected-es6-submodules-ignore.js'), 'utf-8');
      assert.equal(actual, expected, 'Function did not return expected output.');
      deleteFiles(outputPath);
      endTest();
    })
    .catch(endTest);
  });

  it('should directImport the files if asked ', (endTest) => {
    indexr(inputFolder, { submodules: '*/server.js', directImport: true, modules: undefined })
    .then(() => {
      const outputPath = path.resolve(inputFolder, defaultOptions.outputFilename);
      const actual = fs.readFileSync(outputPath);
      const expected = fs.readFileSync(path.resolve(outputFolder, 'expected-es6-server-direct.js'), 'utf-8');
      assert.equal(actual, expected, 'Function did not return expected output.');
      deleteFiles(outputPath);
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
      const outputPath = path.resolve(inputFolder, defaultOptions.outputFilename);
      const actual = fs.readFileSync(outputPath);
      const expected = fs.readFileSync(path.resolve(outputFolder,
        'expected-es6-server-direct-exts.js'), 'utf-8');
      assert.equal(actual, expected, 'Function did not return expected output.');
      deleteFiles(outputPath);
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
      const outputPath = path.resolve(inputFolder, defaultOptions.outputFilename);
      const expected = fs.readFileSync(path.resolve(outputFolder, 'expected-es6-named-exports.js'), 'utf-8');
      const actual = fs.readFileSync(outputPath, 'utf-8');
      assert.equal(actual, expected, 'Function did not return expected output.');
      deleteFiles(outputPath);
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
      const outputPath = path.resolve(inputFolder, defaultOptions.outputFilename);
      const expected = fs.readFileSync(path.resolve(outputFolder, 'expected-es5-named-exports.js'), 'utf-8');
      const actual = fs.readFileSync(outputPath, 'utf-8');
      assert.equal(actual, expected, 'Function did not return expected output.');
      deleteFiles(outputPath);
      endTest();
    })
    .catch(endTest);
  });

  it('should accept globs as folders and run indexr on each returned result', (endTest) => {
    indexr(fractalFolder, 'foo.js', {
      modules: '**/modules/',
      submodules: '*/index.js',
    }).then(() => {

      const loadFileSync = (filename) => fs.readFileSync(filename, 'utf-8');

      const actualPaths = [
        path.resolve(fractalFolder, 'modules/foo.js'),
        path.resolve(fractalFolder, 'modules/module-1/modules/foo.js'),
        path.resolve(fractalFolder, 'modules/module-1/modules/nested-2/modules/foo.js'),
      ];

      const expectedPaths = [
        path.resolve(outputFolder, 'expected-module.js'),
        path.resolve(outputFolder, 'expected-nested.js'),
        path.resolve(outputFolder, 'expected-double-nested.js'),
      ];

      const expected = expectedPaths.map(loadFileSync);
      const actual = actualPaths.map(loadFileSync);

      assert.deepEqual(expected, actual, 'Function did not return expected output.');
      deleteFiles(...actualPaths);
      endTest();
    })
    .catch(endTest);
  });

  it('should accept multiple globs in arrays and run indexr on each returned result', (endTest) => {
    resetLog();
    indexr(fractalFolder, 'thing.js', {
      submodules: '*/index.js',
      modules: ['**/modules/', '**/things/'],
    })
    .then(() => {

      const loadFileSync = (filename) => fs.readFileSync(filename, 'utf-8');

      const expectedPaths = [
        path.resolve(outputFolder, 'expected-module.js'),
        path.resolve(outputFolder, 'expected-nested.js'),
        path.resolve(outputFolder, 'expected-double-nested.js'),
        path.resolve(outputFolder, 'expected-thing.js'),
      ];

      const actualPaths = [
        path.resolve(fractalFolder, 'modules', 'thing.js'),
        path.resolve(fractalFolder, 'modules', 'module-1', 'modules', 'thing.js'),
        path.resolve(fractalFolder, 'modules', 'module-1', 'modules', 'nested-2', 'modules', 'thing.js'),
        path.resolve(fractalFolder, 'modules', 'module-2', 'things', 'thing.js'),
      ];

      const expected = expectedPaths.map(loadFileSync);
      const actual = actualPaths.map(loadFileSync);

      assert.deepEqual(expected, actual, 'Function did not return expected output.');
      assert(logHistory().length === 5);
      deleteFiles(...actualPaths);
      endTest();
    })
    .catch(endTest);
  });

};
