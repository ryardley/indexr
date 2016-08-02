import path from 'path';
import assert from 'assert';
import indexr from '../lib';
import fs from 'fs';

const inputFolder = path.resolve(__dirname, '../fixtures/input');
const outputFolder = path.resolve(__dirname, '../fixtures/output');

const tryer = (func, defval = false) => {
  try {
    return func();
  } catch (e) {
    return defval;
  }
};

const fileExists = (fileName) =>
  tryer(() => fs.lstatSync(fileName).isFile());

describe('indexr()', () => {
  afterEach(() => {
    const filePath = path.resolve(inputFolder, 'server.js');
    if (fileExists(filePath)) {
      fs.unlinkSync(filePath);
    }
  });

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
    const actual = indexr(inputFolder, { include: '*/server.js' });
    const expected = fs.readFileSync(path.resolve(outputFolder, 'expected-es6-server.js'), 'utf-8');
    assert.equal(expected, actual, 'Function did not return expected output.');
  });

  it('should directImport the files if asked ', () => {
    const actual = indexr(inputFolder, { include: '*/server.js', directImport: true });
    const expected = fs.readFileSync(path.resolve(outputFolder,
      'expected-es6-server-direct.js'), 'utf-8');
    assert.equal(expected, actual, 'Function did not return expected output.');
  });

  it('should remove exts provided ', () => {
    const actual = indexr(inputFolder, { include: '*/server.js',
      directImport: true, exts: ['js'] });
    const expected = fs.readFileSync(path.resolve(outputFolder,
      'expected-es6-server-direct-exts.js'), 'utf-8');
    assert.equal(expected, actual, 'Function did not return expected output.');
  });
});

