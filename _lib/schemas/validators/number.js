const v = {};

v.validate = data => {
    return !isNaN(data);
};

v.format = data => {
    return Number(data);
};

module.exports = v;