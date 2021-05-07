const slug = require('slug');
const re = new RegExp(/^[a-z]+$/g);
const v = {};

v.validate = data => {
    const merged = slug(data).split('-').join('');
    const result = re.test(merged);
    re.lastIndex = 0;
    return result;

};

v.format = data => {
    return slug(data);
};

module.exports = v;