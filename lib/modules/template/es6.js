import {
  localModuleName,
  moduleArray,
  headerComment,
  footerComment,
} from './template';

const es6ImportStatement = (module) =>
  `import ${localModuleName(module)} from './${module}';`;

const es6NamedExportStatement = (module) =>
  `export { default as ${localModuleName(module)} } from './${module}';`;

const es6ExportStatement = (modules) => {
  if (modules.length === 0) return '';
  return `export default ${moduleArray(modules)};`;
};

const es6ImportStatements = (modules) =>
  modules.map(es6ImportStatement).join('\n');

const es6NamedExports = (modules) =>
  modules.map(es6NamedExportStatement).join('\n');

export default (modules, options) => {
  const { namedExports: useNamedExports } = options;

  const arrayExports = [
    headerComment(),
    es6ImportStatements(modules),
    es6ExportStatement(modules),
    footerComment(),
    '',
  ];

  const namedExports = [
    headerComment(),
    es6NamedExports(modules),
    footerComment(),
    '',
  ];

  const templateArray = useNamedExports ? namedExports : arrayExports;

  return templateArray.join('\n');
};
