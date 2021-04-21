const path = require('path');
const childProcess = require('child_process');
const test = require('ava');

const WAM_CLI = path.join(path.dirname(__dirname), 'bin', 'wait-a-minute');

test.cb('wait-a-minute cli stdin', t => {
  childProcess.exec(`${WAM_CLI} <<< ''`, {shell: true}, (err, stdout, stderr) => {
    t.is(err, null);
    t.is(stderr.trim(), '');
    t.is(stdout.trim(), "Ctrl-D when you're okay");
    t.end();
  });
});
