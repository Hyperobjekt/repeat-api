const ObjectId = require('mongodb').ObjectId;
const v = {};

v.validate = data => {
    return data ? !!ObjectId(data) : false;
};

v.format = data => {
    return new ObjectId(data);
};

module.exports = v;