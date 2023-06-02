const ora = require('ora');
const yargs = require('yargs/yargs');
// const spinners = require('cli-spinners');
const {getWaiter} = require('./waiters');

const TYPES = ['duration', 'when', 'confirm', 'signal'];

// TODO: option between First of several or // all

// 🌈 Could introduce named styles: color + prompt style

const argsParser = yargs().options({
  spinner: {
    describe: 'Activate spinner animation',
    type: 'boolean',
    default: true
  },
  style: {
    describe: 'Spinner style',
    type: 'string'
    // choices: Object.keys(spinners)
    // need to hide values on help (too verbose othervise)
  },
  signal: {
    describe: 'Support signal receiving',
    type: 'boolean',
    default: false
  },
  color: {
    describe: 'Color style of UX',
    default: 'green'
  },
  // Command like options
  'send-signal': {
    describe: 'Command flag to send completion signal (expect PID)',
    alias: 'send',
    type: 'number'
  },
  'send-abort-signal': {
    describe: 'Command flag to send abort signal (expect PID)',
    alias: 'abort',
    type: 'number'
  }
});

const main = async process => {
  const args = argsParser.parse(process.argv.slice(2));

  // Handle of command like flags 🎌
  // ! FIXME: introduce a {flag, handle structure}
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
    spinner: args.style,
    color: args.color
  }).start();
  // TODO: introduce context ({spinner, rl, process, etc}). could be injected in waiter? (or handler combining context and waiter(s))
  waiter.start();

  // 🚧
  // !FIXME: try a list of Waiter, and a all(Promise.all) / any (Promise.race) combo logic
  /* note:
    - any should trigger cancel of remaining timer
    - might need to refine the Waiter model (id, state)
    - could have UI showing the list of pending events
    - maybe add a timeout logic?
  */
  await waiter.promise; // TODO: maybe startAndWait
  spinner.succeed(waiter.completionMessage);
  // 📢💡 could introduce a completion hook (command, signal, notif, etc)
};

module.exports = {main};
