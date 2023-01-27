const readline = require('readline');
const ora = require('ora');
const c = require('chalk');
const yargs = require('yargs/yargs');
// const {} = require('./utils');

const types = ['duration', 'when', 'confirm', 'signal'];

// First of // all

const setConfirm = cb => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });
  rl.on('line', line => null /* noop (so far) */);

  rl.on('close', () => cb());
};

const argsParser = yargs().options({
  spinner: {
    type: 'boolean',
    default: true
  }
});

const getSpinner = args => {
  return ora({
    text: `Awaiting for ${c.bold.green('confirmation')} (${c.dim('Ctrl-D')}) to release focus:`,
    isEnabled: args.spinner
  });
};

const main = async process => {
  const args = argsParser.parse(process.argv.slice(2));

  const spinner = getSpinner(args).start();
  setConfirm(() => spinner.succeed(`Wait is now ${c.bold('over')}!`));
};

module.exports = {main};
