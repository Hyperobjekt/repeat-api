const moment = require('moment');
const NODE_ENV = process.env.NODE_ENV;

const s = {};

s.scenarios = require('./scenarios.schema');

// Demo
s.demos = require('./demos.schema');

Object.keys(s).forEach(e => {
    s[e].created = { type: 'date', default: moment().unix(), required: true };
});

module.exports = s;