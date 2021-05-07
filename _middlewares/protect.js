module.exports = (req, res, next) => {
    let protector = require('../_lib/crypto/protect');
    protector(req)
      .then(() => next())
      .catch(err => res.status(403).send({ error: err }))
  }