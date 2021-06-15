const path = require('path');
const childProcess = require('child_process');
const test = require('ava');

const WAM_CLI = path.join(path.dirname(__dirname), 'bin', 'wait-a-minute');

test('wait-a-minute cli stdin', t => {
  const stdout = childProcess.execSync(WAM_CLI, {encoding: 'utf-8'});
  t.is(stdout.trim(), "Ctrl-D when you're okay\nWait is now over");
  // TODO: test need to be adapted
  // notably to check the spinning string
});
