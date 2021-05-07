module.exports = (req, res, next) => {
  let paginate = require('../_lib/set/pagination');
  paginate(req)
    .then(() => next())
    .catch(() => console.log("error this?"))
    .done()
}