const v = {};

v.validate = data => {
    return data === true || data === false;
};

v.format = data => {
    return Boolean(data);
};

module.exports = v;