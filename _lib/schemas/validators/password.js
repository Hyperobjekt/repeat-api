const v = {};

v.validate = data => {
    return true;
};

v.format = data => {
    return data.toString();
};

module.exports = v;