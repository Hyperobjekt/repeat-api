const moment = require('moment');
const v = {};

v.validate = data => {
    return moment(data, moment.ISO_8601, true).isValid() || moment(data).isValid()
};

v.format = data => {
    return !!data ? moment(data).toISOString() : moment().toISOString();
};

module.exports = v;