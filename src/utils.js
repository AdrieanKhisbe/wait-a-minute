const {duration} = require('moment');

const toMillis = timeString => duration(`PT${timeString.toUpperCase()}`);

module.exports = {toMillis};
