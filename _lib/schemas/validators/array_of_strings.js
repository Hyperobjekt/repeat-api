const v = {};

v.validate = data => {
    return Array.isArray(data) && (data.length === data.filter(e => typeof e === 'string').length);
};

v.format = data => {
    return data.map(e => e.toString())
};

module.exports = v;