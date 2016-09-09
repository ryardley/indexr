import { runCLI } from '../lib/utils';
import { assert } from 'chai';
export default () => {
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

  it('should support --modules-ignore', () => {
    const actual = runCLI('indexr', '.', '--modules-ignore', '**/fooo/');
    const expected = {
      inputFolder: '.',
      options: {
        modulesIgnore: ['**/fooo/'],
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

  it('should support --submodules-ignore', () => {
    const actual = runCLI('indexr', '.', '--submodules-ignore', '**/fooo/');
    const expected = {
      inputFolder: '.',
      options: {
        submodulesIgnore: ['**/fooo/'],
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
};
