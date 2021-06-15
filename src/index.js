const readline = require('readline');
const ora = require('ora');
const c = require('chalk');

const main = async process => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });
  const spinner = ora(
    `Awaiting for ${c.bold.green('confirmation')} (${c.dim('Ctrl-D')}) to release focus`
  ).start();

  rl.on('line', line => {
    // noop
  });

  rl.on('close', () => {
    spinner.succeed(`Wait is now ${c.bold('over')}!`);
  });
};

module.exports = {main};
