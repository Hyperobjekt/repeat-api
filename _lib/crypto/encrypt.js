const crypto = require('crypto');

module.exports = str => {

  if (typeof str !== "string") return Error('Only accepts strings as arguments')

  let salt = crypto.randomBytes(16).toString('base64');
  let hash = crypto.createHmac('sha512', salt).update(str).digest("base64");

  return salt + "$" + hash;
}