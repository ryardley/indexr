/* eslint-disable max-len */
import fs from 'fs';
import path from 'path';
import { Command } from 'commander';
import optionsTable from '../optionsTable';
import extendedHelpCommander from './extendedHelpCommander';
import camelcase from 'camelcase';
import flow from 'lodash/flow';

const importJSON = (jsonPath) => JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

const pkg = importJSON(path.resolve(__dirname, '../../../package.json'));

// extract a property map from table of the form
// {namePropertyOnTable:commanderLongName}
function extractPropMap(table) {
  const flags = (entry) => entry.flags;
  const extractLongTag = (value) => value.match(/--([a-zA-Z0-9-_]+)/)[0];
  const camel = (value) => camelcase(value);
  const extractFlagName = flow(flags, extractLongTag, camel);
  const extractName = (entry) => entry.name || extractFlagName(entry);
  return table.reduce((memo, entry) => ({
    ...memo,
    [extractName(entry)]: extractFlagName(entry),
  }), {});
}

// pick the keys from the object
// returning an object with mapped prop keys
function pickByMap(obj, map) {
  return Object.keys(map).reduce((memo, key) => {
    const val = obj[map[key]];
    return val ? {
      ...memo,
      [key]: val,
    } : memo;
  }, {});
}

export default function cli(argv) {

  const command = new Command();
  const program = extendedHelpCommander(
    command
      .version(`Indexr v${pkg.version}`)
      .usage('<rootFolder> [options]'),
    optionsTable
  );

  program.parse(argv);

  if (program.args.length === 0) return program.help();

  // prepare input for consumption
  const inputFolder = program.args[0];
  const map = extractPropMap(optionsTable);
  const options = pickByMap(program, map);

  return {
    inputFolder,
    options,
  };
}
