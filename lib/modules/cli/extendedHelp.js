import linewrap from 'linewrap';
import capitalize from 'capitalize';

const repeat = (char, num) => num > 0 ? `${char}${repeat(char, num - 1)}` : char;

const getTitleFromFlags = (flags) => {
  const optionLong = flags.match(/--[a-z0-9-_]+/)[0];
  const optionLower = optionLong.replace('--', '').replace('-', ' ');
  return capitalize(optionLower);
};

const templateHelp = (title, flags, description) => `
  ${title}
  ${repeat('-', title.length)}
  ${flags}

  ${description}

`;

function applyOptionToCommander(comm, option) {
  const {
    flags,
    description,
    coercion,
    default: defaults,
  } = option;

  comm.option(flags, description, coercion, defaults);
  return comm;
}

function templateOption(opt) {
  const flags = opt.flags;
  const title = getTitleFromFlags(flags);
  const description = linewrap(80, { lineBreak: '\n  ' })(opt.long);
  return templateHelp(title, flags, description);
}

export const showExtendedHelp = (opts) => () => {
  console.log(opts.map(templateOption).join('\n'));
};

export default function extendedHelp(comm, opts) {
  return opts
    .reduce(applyOptionToCommander, comm)
    .on('--help', showExtendedHelp(opts));
}
