const v = {};
let re = new RegExp(/(((\w)|((\w)\.(\w))|((\w)\+(\w)))+@+(\w)+\.+\w{2,5})/g);

v.validate = data => {
    const result = re.test(data);
    re.lastIndex = 0;
    return result;
};

v.format = data => {
    return data.toLowerCase();
};


module.exports = v;