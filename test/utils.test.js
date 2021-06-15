const test = require('ava');
const {fakeSpinner} = require('../src/utils');

test('fakeSpinner cant stub a ora spinner', t => {
  t.notThrows(() => fakeSpinner.start('yohou'));
  t.notThrows(() => fakeSpinner.fail('oh no'));
  t.notThrows(() => fakeSpinner.succeed('oh yes'));
  t.notThrows(() => fakeSpinner.info('oh oh'));
});
