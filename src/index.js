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
  },
  // Command like options
  'send-signal': {
    alias: 'send',
    type: 'number'
  },
  'send-abort-signal': {
    alias: 'abort',
    type: 'number'
  }
});

const main = async process => {
  const args = argsParser.parse(process.argv.slice(2));

  // handle command like flags
  if (args.sendSignal) {
    // 💡 the value could be selected from existing (prompt picker proposed from that list)
    console.log(`🏁 Sending SIGUSR2 to sibling ${args.sendSignal}`);
    // todo: ensure this is wam
    return process.kill(args.sendSignal, 'SIGUSR2');
  } else if (args.sendAbortSignal) {
    console.log(`🚩 Sending SIGABRT to sibling ${args.sendAbortSignal}`);
    // todo: ensure this is wam too
    return process.kill(args.sendAbortSignal, 'SIGABRT');
  }

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
