import {
  localModuleName,
  moduleArray,
  headerComment,
  footerComment,
} from './template';

const es5ImportStatement = (module) =>
  `var ${localModuleName(module)} = require('./${module}');`;

const es5ExportStatement = (modules) => {
  if (modules.length === 0) return '';
  return `module.exports = ${moduleArray(modules)};`;
};

const es5ImportStatements = (modules) =>
  modules.map(es5ImportStatement).join('\n');

export default (modules) => [
  headerComment(),
  es5ImportStatements(modules),
  es5ExportStatement(modules),
  footerComment(),
  '',
].join('\n');
