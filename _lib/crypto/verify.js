const crypto = require('crypto');

module.exports = (unencrypted, encrypted) => {
  if (typeof unencrypted !== "string" || typeof encrypted !== "string") return Error('Only accepts strings as arguments');
  if (encrypted.split('$').length !== 2) return Error('Encrypted string must be salted')

  let encryptedArr = encrypted.split('$');
  let salt = encryptedArr[0];
  let hash = crypto.createHmac('sha512', salt).update(unencrypted).digest("base64");

  return hash === encryptedArr[1]
}