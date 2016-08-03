import {
  localModuleName,
  moduleArray,
  headerComment,
  footerComment,
} from './template';

const es6ImportStatement = (module) =>
  `import ${localModuleName(module)} from './${module}';`;

const es6ExportStatement = (modules) => {
  if (modules.length === 0) return '';
  return `export default ${moduleArray(modules)};`;
};

const es6ImportStatements = (modules) =>
  modules.map(es6ImportStatement).join('\n');

export default (modules) => [
  headerComment(),
  es6ImportStatements(modules),
  es6ExportStatement(modules),
  footerComment(),
  '',
].join('\n');
