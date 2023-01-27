const ora = require('ora');
const yargs = require('yargs/yargs');
const {getWaiter} = require('./waiters');

const TYPES = ['duration', 'when', 'confirm', 'signal'];

// TODO: option between First of several or // all

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

const main = async process => {
  const args = argsParser.parse(process.argv.slice(2));

  const waiter = getWaiter(args);
  const spinner = ora({
    text: waiter.message,
    isEnabled: args.spinner,
    color: args.color
  }).start();
  // TODO: spinner in context?
  waiter.start();

  // TODO: try race
  await waiter.promise; // TODO: maybe startAndWait
  spinner.succeed(waiter.completionMessage);
};

module.exports = {main};
