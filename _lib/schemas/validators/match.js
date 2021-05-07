const v = {};

v.validate = (data, matches) => {
    return matches.includes(data)
    // return Array.isArray(data) && (data.length === data.filter(e => typeof e === 'string').length);
};

v.format = data => {
};

module.exports = v;