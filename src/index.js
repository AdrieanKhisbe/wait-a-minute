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

  rl.on('close', () => cb());
};

const setDuration = (spinner, duration, cb) => {
  const delay = toMillis(String(duration));
  setTimeout(cb, delay);
  // TODO maybe, pause?
  // TODO: maybe interval update
};

const argsParser = yargs().options({
  spinner: {
    type: 'boolean',
    default: true
  }
});

// TODO: NOW, get text, type, param parser
const getSpinner = args => {
  return ora({
    text: `Awaiting for ${c.bold.green('confirmation')} (${c.dim('Ctrl-D')}) to release focus:`,
    isEnabled: args.spinner
  });
};

const main = async process => {
  const args = argsParser.parse(process.argv.slice(2));

  const spinner = getSpinner(args).start();
  if (_.isEmpty(args._)) setConfirm(() => spinner.succeed(`Wait is now ${c.bold('over')}!`));
  else setDuration(spinner, args._[0], () => spinner.succeed(`Wait is now ${c.bold('over')}!`));
};

module.exports = {main};
