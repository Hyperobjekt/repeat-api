const v = {};

v.validate = data => {
    return true;
};

v.format = data => {
    return data.split(' ').map(e => {
        return e.charAt(0).toUpperCase() + e.substring(1, e.length).toLowerCase()
    }).join(' ');
};

module.exports = v;