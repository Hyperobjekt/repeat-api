const ObjectId = require('mongodb').ObjectId;
const init = data => {
    const value = data.value;
    // console.log("array_of_ids:", value)
    return value && value.length ? value.map(e => ObjectId(e)) : [];
}

const v = {};

v.validate = data => {
    try {
        data.map(e => new ObjectId(e));
        return true
    }
    catch (e) {
        return false
    }
};

v.format = data => {
    return data.map(e => new ObjectId(e));
};

module.exports = v;