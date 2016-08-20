import chalk from 'chalk';

let messageHistory = [];
let logLevel = 'all';

const shouldShowLog = (level) => {
  const levels = [
    'all',
    'info',
    'warn',
    'error',
    'none',
  ];
  const indexLogLevel = levels.indexOf(logLevel);
  const indexThisLevel = levels.indexOf(level);
  return indexThisLevel > indexLogLevel;
};

const getLogger = (level) => (message) => {

  if (shouldShowLog(level))
    console[level](message);

  messageHistory.push({ level, message });
};

const defaultColors = {
  info: 'green',
  warn: 'yellow',
  error: 'red',
};

const colourizer = (level, options = defaultColors) => (msg) => {
  const color = chalk[options[level]].bind(chalk);
  return color(msg);
};

const getFormatter = (level) => (msg) => {
  const promptColors = colourizer(level);
  const messageColors = colourizer(level, { ...defaultColors, info: 'white' });

  const pre = [
    promptColors('indexr'),
    ' ',
    chalk.yellow('>> '),
    level === 'error' ? promptColors('ERROR: ') : '',
  ].join('');

  return `${pre}${messageColors(msg)}`;
};

const log = (level) => (message) => {
  const logger = getLogger(level);
  const format = getFormatter(level);
  logger(format(message));
};

export const setLogLevel = (level) => {
  logLevel = level;
};

export const resetLog = () => {
  messageHistory = [];
};

export const logHistory = (level) =>
  level ? messageHistory.filter((m) => m.level === level) : messageHistory;

export const info = log('info');
export const warn = log('warn');
export const error = log('error');
