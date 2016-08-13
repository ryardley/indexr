/* eslint-disable max-len */
import fs from 'fs';
import path from 'path';
import linewrap from 'linewrap';
import capitalize from 'capitalize';
import { Command } from 'commander';


const importJSON = (jsonPath) => JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

const pkg = importJSON(path.resolve(__dirname, '../../package.json'));

const repeat = (char, num) => num > 0 ? `${char}${repeat(char, num - 1)}` : char;

const collect = (item, memo) => {
  memo.push(item);
  return memo;
};

const getTitleFromFlags = (flags) => {
  const optionLong = flags.match(/--[a-z0-9-_]+/)[0];
  const optionLower = optionLong.replace('--', '').replace('-', ' ');
  return capitalize(optionLower);
};

const extendedHelpCommander = (comm, opts) =>
  opts
    .reduce((prog, option) => {
      const {
        flags,
        description,
        coercion,
        default: defaults,
      } = option;

      prog.option(flags, description, coercion, defaults);

      return prog;

    }, comm)
    .on('--help', () => {

      const optToDesc = (opt) => {
        const flags = opt.flags;
        const title = getTitleFromFlags(flags);
        const description = linewrap(80, { lineBreak: '\n  ' })(opt.long);
        return `
  ${title}
  ${repeat('-', title.length)}
  ${flags}

  ${description}

  `;
      };
      console.log(opts.map(optToDesc).join('\n'));
    });

export default function cli(argv) {
  const command = new Command();

  const optionsTable = [
    {
      description: 'Use ES5 template for index output.',
      flags: '-5 --es5',
      long: 'Supply this flag to use the ES5 template to output your index files.',
    },

    {
      description: 'Directly import files as opposed to folders.',
      flags: '-d --direct-import',
      long: 'This flag will ensure that the output returned by the --submodules glob will be imported to the index.',
    },

    {
      coercion: collect,
      default: [],
      description: 'Remove this extension from imports.',
      flags: '-e --ext <string>',
      long: 'Remove this extension from the imported files. Useful if you would prefer to import "./foo/server" instead of "./foo/server.js"',
    },

    {
      coercion: collect,
      default: [],
      description: 'Glob string that determine which folders hold modules.',
      flags: '-m --modules <string>',
      long: 'A glob pathed to the rootFolder that will determine which folders are module holders. If this is ommitted defaults to "**/modules/".',
    },

    {
      description: 'The name of the output file.',
      flags: '-o --out <filename>',
      long: 'The name of the output file. This file will be added to each module folder. Default is "index.r.js"',
    },

    {
      coercion: collect,
      default: [],
      description: 'Glob string that determine which folders are modules.',
      flags: '-s --submodules <string>',
      long: 'A glob pathed to each module holder folder that will determine which submodules are imported to the index. Defaults to "*/index.js"',
    },

    {
      description: 'Files to watch as a glob string.',
      flags: '-w --watch [string]',
      long: 'Files to watch as a glob string pathed from the rootFolder. When used as a boolean flag default watch is "**/*"',
    },
  ];

  const program = extendedHelpCommander(
    command
      .version(`Indexr v${pkg.version}`)
      .usage('<rootFolder> [options]'),
    optionsTable
  );

  program.parse(argv);

  if (program.args.length === 0) program.help();

  // prepare input for consumption
  const inputFolder = program.args[0];
  const options = {};

  if (program.submodules.length > 0)
    options.submodules = program.submodules;

  if (program.ext.length > 0)
    options.exts = program.ext;

  if (program.es5 !== undefined)
    options.es5 = program.es5;

  if (program.directImport !== undefined)
    options.directImport = program.directImport;

  if (program.modules.length > 0)
    options.modules = program.modules;

  if (program.watch !== undefined)
    options.watch = program.watch;

  if (program.out !== undefined)
    options.outputFilename = program.out;

  return {
    inputFolder,
    options,
  };
}
