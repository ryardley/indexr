import {
  localModuleName,
  moduleArray,
  headerComment,
  footerComment,
} from './template';

const es5ImportStatement = (module) =>
  `var ${localModuleName(module)} = require('./${module}');`;

const es5NamedExportStatement = (module) =>
  `exports.${localModuleName(module)} = require('./${module}');`;

const es5ExportStatement = (modules) => {
  if (modules.length === 0) return '';
  return `module.exports = ${moduleArray(modules)};`;
};

const es5ImportStatements = (modules) =>
  modules.map(es5ImportStatement).join('\n');

const es5NamedExports = (modules) =>
  modules.map(es5NamedExportStatement).join('\n');

export default (modules, options) => {
  const { namedExports: useNamedExports } = options;

  const arrayExports = [
    headerComment(),
    es5ImportStatements(modules),
    es5ExportStatement(modules),
    footerComment(),
    '',
  ];

  const namedExports = [
    headerComment(),
    es5NamedExports(modules),
    footerComment(),
    '',
  ];

  const templateArray = useNamedExports ? namedExports : arrayExports;

  return templateArray.join('\n');
};
