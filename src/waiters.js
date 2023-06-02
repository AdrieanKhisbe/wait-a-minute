const readline = require('readline');
const pDefer = require('p-defer');
const c = require('chalk');

const {toMillis} = require('./utils');

class Waiter {
  constructor(context, args) {
    this.process = context.process;
    this.args = args;
    this.deferred = pDefer();
    this.promise = this.deferred.promise;
  }

  // start, status, concel
  pause() {
    throw new Error("Method 'pause()' must be implemented.");
  }
  // 💡 ? maybe add a help like command (for ? input)
}

class TimeWaiter extends Waiter {
  constructor(context, args) {
    super(context, args);
    this.type = 'timeout';
    this.duration = toMillis(String(args._[0])); // duration
  }
  get message() {
    return `⏳ Awaiting ${c.bold[this.args.color](`${this.duration / 1000}s timer`)}`;
    // TODO: proper format (humanize)
  }
  get completionMessage() {
    return `⌛ ${c.bold[this.args.color](`${this.duration / 1000}s timer completed`)} 🏁`;
  }

  start() {
    this.timer = setTimeout(this.deferred.resolve, this.duration.asMilliseconds());
    return this;
  }
  cancel() {
    clearTimeout(this.timer);
  }
}

class ConfirmationWaiter extends Waiter {
  constructor(context, args) {
    super(context, args);
    this.type = 'confirm';
  }
  get message() {
    return (
      `📭 Awaiting for ${c.bold[this.args.color]('confirmation')} ` +
      `(${c.dim('Ctrl-D')}) to release focus 👋`
    );
  }
  get completionMessage() {
    return `📬 Wait is now ${c.bold[this.args.color]('over!')} 🏁`;
  }

  start() {
    // TODO: record _start?
    const rl = (this.rl = readline.createInterface({
      input: this.process.stdin,
      output: this.process.stdout,
      terminal: false
    }));
    rl.on('line', line => null /* noop (so far) */);
    // TODO: validating word? (combine with once)

    rl.on('close', this.deferred.resolve);
    return this;
  }
  cancel() {
    // FIXME: check
    clearTimeout(this.timer);
  }
}

class SignalWaiter extends Waiter {
  constructor(context, args) {
    super(context, args);
    this.type = 'signal';
    this.signal = 'SIGUSR2'; // TODO: maybe make it configurable to other signal
  }
  get message() {
    return `☎️ Signal ${c.dim(this.signal)} to ${c.bold(this.process.pid)} to pursue`;
    // TODO: maybe output the kill -s SIGUSR2 command to run (or the wam helper)
  }
  get completionMessage() {
    return `📞 Signal ${c.dim(this.signal)} received! 🏁`;
  }

  start() {
    // TODO: pid could be write to file. (and eventual scope/alias be provided)
    this.listener = this.process.on(this.signal, this.deferred.resolve);
    // TODO: maybe also handle the SIGABRT for more gracely shut dowb
    return this;
  }
  cancel() {
    clearTimeout(this.process.removeListener(this.listener));
  }
}
// TODO HourWaiter  🚩
// TODO PointInTimeWaiter 🕰️ 🚩
// TODO ProcessWaiter 👀 🚩 (wait existing process (pid or name))

const getWaiter = args => {
  const context = {process};
  if (args.signal) return new SignalWaiter(context, args);
  return args._[0] ? new TimeWaiter(context, args) : new ConfirmationWaiter(context, args);
  // TODO: better logic
};

// Combiner?
module.exports = {TimeWaiter, ConfirmationWaiter, SignalWaiter, getWaiter};
