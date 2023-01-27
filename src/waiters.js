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
    this.timer = setTimeout(this.deferred.resolve, this.duration);
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
    this.signal = 'SIGUSR2'; // TODO: configurable
  }
  get message() {
    return `☎️ Signal ${c.dim(this.signal)} to ${c.bold(this.process.pid)} to pursue`;
  }
  get completionMessage() {
    return `📞 Signal ${c.dim(this.signal)} received! 🏁`;
  }

  start() {
    // TODO: pid could be write to file. (and eventual scope/alias be provided)
    this.process.on(this.signal, this.deferred.resolve);
    return this;
  }
  cancel() {
    clearTimeout(this.timer);
  }
}
const getWaiter = args => {
  const context = {process};
  if (args.signal) return new SignalWaiter(context, args);
  return args._[0] ? new TimeWaiter(context, args) : new ConfirmationWaiter(context, args);
  // TODO: better logic
};

// hourWaiter

// Combiner?
module.exports = {TimeWaiter, ConfirmationWaiter, SignalWaiter, getWaiter};
