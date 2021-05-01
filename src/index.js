const readline = require('readline');

const main = async process => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });

  rl.on('line', line => {
    // noop
  });

  rl.on('close', () => {
    console.log('Wait is now over');
  });
};

module.exports = {main};
