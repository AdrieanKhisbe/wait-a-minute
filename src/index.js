const readline = require('readline');
const ora = require('ora');
const c = require('chalk');
const _ = require('lodash/fp');
const yargs = require('yargs/yargs');
const {toMillis} = require('./utils');

const TYPES = ['duration', 'when', 'confirm', 'signal'];

// TODO: option between First of several or // all

const setConfirm = cb => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });
  rl.on('line', line => null /* noop (so far) */);
  // TODO: validate word? (combine with once)

  rl.on('close', () => cb('confirm'));
};

const setDuration = (spinner, duration, cb) => {
  const delay = toMillis(String(duration));
  setTimeout(cb, delay, 'timeout');
  // TODO maybe, pause?
  // TODO: maybe interval update
};

const setSignal = async (spinner, process, cb) => {
  spinner.info(`Signal ${c.dim('SIGUSR2')} to ${c.bold(process.pid)} to pursue`);
  // SIGCONT? // SIGUSR1 reserved for node debugger

  // TODO: pid could be write to file. (and eventual scope/alias be provided)
  const hanger = setInterval(_.noop, 2000); // this to ensure process is hanging in there
  process.on('SIGUSR2', () => {
    cb('signal received');
    clearInterval(hanger);
  });
};

const argsParser = yargs().options({
  spinner: {
    type: 'boolean',
    default: true
  },
  signal: {
    type: 'boolean',
    default: false
  },
  color: {
    default: 'green'
  }
});

// TODO: NOW, get text, type, param parser
const getSpinner = args => {
  return ora({
    text:
      `Awaiting for ${c.bold[args.color]('confirmation')} ` +
      `(${c.dim('Ctrl-D')}) to release focus:`,
    isEnabled: args.spinner,
    color: args.color
  });
};

const main = async process => {
  const args = argsParser.parse(process.argv.slice(2));

  const spinner = getSpinner(args).start();
  const complete = reason =>
    spinner.succeed(
      `Wait is now ${c.bold[args.color]('over!')} (reason ${c.dim[args.color](reason)})`
    );

  if (args.signal) {
    process.stdin.resume();
    return setSignal(spinner, process, complete);
  }

  if (_.isEmpty(args._)) setConfirm(complete);
  else setDuration(spinner, args._[0], complete);
};

module.exports = {main};
