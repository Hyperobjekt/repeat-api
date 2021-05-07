module.exports = (req, res, next) => {
  let query = require('../_lib/set/query');
  query(req)
    .then(() => next())
    .catch(() => console.log("error this?"))
    .done()
}