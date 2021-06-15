const readline = require('readline');
const ora = require('ora');
const c = require('chalk');
const yargs = require('yargs/yargs');
const {fakeSpinner} = require('./utils');

const argsParser = yargs().option('spinner', {
  type: 'boolean',
  default: true
});

const main = async process => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });
  const args = argsParser.parse(process.argv.slice(2));

  const spinner = args.spinner
    ? ora(
        `Awaiting for ${c.bold.green('confirmation')} (${c.dim('Ctrl-D')}) to release focus`
      ).start()
    : fakeSpinner;

  rl.on('line', line => {
    // noop
  });

  rl.on('close', () => {
    spinner.succeed(`Wait is now ${c.bold('over')}!`);
  });
};

module.exports = {main};
