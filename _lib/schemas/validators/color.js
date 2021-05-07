const v = {};
const re = new RegExp(/(#[0-9A-F]{6})|[0-9A-F]{6}/i);

v.validate = data => {
    return re.test(data);
};

v.format = data => {
    if (re.test(data) && data.toString().length === 6) return '#' + data.toString().toUpperCase();
    if (re.test(data) && data.toString().length === 7) return data.toString().toUpperCase();
};

module.exports = v;